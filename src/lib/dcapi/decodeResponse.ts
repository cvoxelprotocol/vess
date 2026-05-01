import { decode, Tag } from 'cbor2'
import { base64urlDecode, base64urlEncode } from './base64url'

// JSON 化用に Uint8Array / Map を扱える形へ変換する。
const replacer = (_key: string, value: unknown): unknown => {
  if (value instanceof ArrayBuffer) {
    return { __bstr_b64u: base64urlEncode(new Uint8Array(value)) }
  }
  if (value instanceof Uint8Array) {
    return { __bstr_b64u: base64urlEncode(value) }
  }
  return value
}

const mapToObject = (input: unknown): unknown => {
  if (input instanceof Map) {
    const obj: Record<string, unknown> = {}
    for (const [k, v] of input.entries()) obj[String(k)] = mapToObject(v)
    return obj
  }
  if (Array.isArray(input)) return input.map(mapToObject)
  if (input && typeof input === 'object' && !(input instanceof Uint8Array)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = mapToObject(v)
    }
    return out
  }
  return input
}

export const stringifySafe = (value: unknown): string => {
  try {
    return JSON.stringify(mapToObject(value), replacer, 2)
  } catch (e) {
    return `// 直列化に失敗: ${(e as Error).message}\n${String(value)}`
  }
}

// DigitalCredential 本体のプロパティはほぼ getter で enumerable=false なので、
// 直接 JSON.stringify しても {} になる。明示的に取り出す。
export const extractCredentialFields = (
  credential: unknown
): { protocol?: string; data?: unknown; raw: Record<string, unknown> } => {
  if (!credential || typeof credential !== 'object') return { raw: {} }
  const c = credential as Record<string, unknown>
  return {
    protocol: typeof c.protocol === 'string' ? c.protocol : undefined,
    data: c.data,
    raw: {
      type: c.type,
      protocol: c.protocol,
      data: c.data,
    },
  }
}

export interface DecodedVpToken {
  credentialId: string
  index?: number
  rawBase64Url: string
  decoded?: unknown
  error?: string
}

// OpenID4VP DC API レスポンスから vp_token を取り出して、
// 各 mso_mdoc credential を CBOR デコードする。
//
// data 形式 (response_mode: dc_api):
//   { vp_token: { <credId>: "<base64url CBOR DeviceResponse>" } }
//   { vp_token: { <credId>: ["<base64url CBOR>", ...] } }   // OpenID4VP 1.0 で許容
// JWE 応答 (response_mode: dc_api.jwt) は本関数では復号しない。
export const decodeOpenId4VpResponse = (data: unknown): DecodedVpToken[] | null => {
  if (!data || typeof data !== 'object') return null
  const vpToken = (data as Record<string, unknown>).vp_token
  if (!vpToken || typeof vpToken !== 'object') return null

  const result: DecodedVpToken[] = []
  for (const [credentialId, value] of Object.entries(vpToken as Record<string, unknown>)) {
    const tokens: string[] = Array.isArray(value)
      ? (value.filter((v) => typeof v === 'string') as string[])
      : typeof value === 'string'
      ? [value]
      : []

    if (tokens.length === 0) {
      result.push({
        credentialId,
        rawBase64Url: '',
        error: `vp_token の値が string でも string[] でもない: ${typeof value}`,
      })
      continue
    }

    const isArray = Array.isArray(value)
    tokens.forEach((token, i) => {
      try {
        const bytes = base64urlDecode(token)
        const decoded = decode(bytes)
        result.push({
          credentialId,
          index: isArray ? i : undefined,
          rawBase64Url: token,
          decoded,
        })
      } catch (e) {
        result.push({
          credentialId,
          index: isArray ? i : undefined,
          rawBase64Url: token,
          error: `CBOR デコード失敗: ${(e as Error).message}`,
        })
      }
    })
  }
  return result
}

// mso_mdoc DeviceResponse から (docType, namespace, elementIdentifier, elementValue) を取り出す。
// IssuerSignedItem は CBOR Tag 24 ( 内部 CBOR バイト列 ) なので二重デコードが必要。
export interface MdocClaim {
  elementIdentifier: string
  elementValue: unknown
  digestID?: number
}

export interface ExtractedMdocDocument {
  docType: string
  namespaces: Record<string, MdocClaim[]>
}

const getField = (input: unknown, key: string): unknown => {
  if (input instanceof Map) return input.get(key)
  if (input && typeof input === 'object') return (input as Record<string, unknown>)[key]
  return undefined
}

const decodeIssuerSignedItem = (item: unknown): MdocClaim | null => {
  let inner: unknown = item
  if (item instanceof Tag && item.tag === 24 && item.contents instanceof Uint8Array) {
    try {
      inner = decode(item.contents)
    } catch {
      return null
    }
  } else if (item instanceof Uint8Array) {
    try {
      inner = decode(item)
    } catch {
      return null
    }
  }
  const elementIdentifier = getField(inner, 'elementIdentifier')
  const elementValue = getField(inner, 'elementValue')
  const digestID = getField(inner, 'digestID')
  if (typeof elementIdentifier !== 'string') return null
  return {
    elementIdentifier,
    elementValue,
    digestID: typeof digestID === 'number' ? digestID : undefined,
  }
}

export const extractMdocDocuments = (decoded: unknown): ExtractedMdocDocument[] => {
  if (!decoded) return []
  const documents = getField(decoded, 'documents')
  if (!Array.isArray(documents)) return []

  const result: ExtractedMdocDocument[] = []
  for (const doc of documents) {
    const docType = getField(doc, 'docType')
    const issuerSigned = getField(doc, 'issuerSigned')
    const nameSpaces = getField(issuerSigned, 'nameSpaces')
    if (typeof docType !== 'string' || !nameSpaces) continue

    const nsEntries: [unknown, unknown][] =
      nameSpaces instanceof Map
        ? Array.from(nameSpaces.entries())
        : Object.entries(nameSpaces as Record<string, unknown>)

    const namespaces: ExtractedMdocDocument['namespaces'] = {}
    for (const [ns, items] of nsEntries) {
      if (!Array.isArray(items)) continue
      const claims = items
        .map(decodeIssuerSignedItem)
        .filter((c): c is MdocClaim => c !== null)
      if (claims.length > 0) namespaces[String(ns)] = claims
    }
    if (Object.keys(namespaces).length > 0) {
      result.push({ docType, namespaces })
    }
  }
  return result
}

// elementValue を画面表示用の文字列にする。
// bytes は base64url 短縮表示、 Date / Tag / Map / object は再帰的に整形。
export const formatElementValue = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Uint8Array) {
    const b64u = base64urlEncode(value)
    const head = b64u.length > 32 ? `${b64u.slice(0, 32)}…` : b64u
    return `<bytes ${value.byteLength}B / b64u: ${head}>`
  }
  if (value instanceof Date) return value.toISOString()
  if (value instanceof Tag) {
    return `Tag(${value.tag}: ${formatElementValue(value.contents)})`
  }
  return stringifySafe(value)
}
