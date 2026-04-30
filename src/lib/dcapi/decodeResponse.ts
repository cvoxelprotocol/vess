import { decode } from 'cbor2'
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
  rawBase64Url: string
  decoded?: unknown
  error?: string
}

// OpenID4VP DC API レスポンスから vp_token を取り出して、
// 各 mso_mdoc credential を CBOR デコードする。
//
// data 形式 (response_mode: dc_api):
//   { vp_token: { <credId>: "<base64url CBOR DeviceResponse>" } }
// JWE 応答 (response_mode: dc_api.jwt) は本関数では復号しない。
export const decodeOpenId4VpResponse = (data: unknown): DecodedVpToken[] | null => {
  if (!data || typeof data !== 'object') return null
  const vpToken = (data as Record<string, unknown>).vp_token
  if (!vpToken || typeof vpToken !== 'object') return null

  const result: DecodedVpToken[] = []
  for (const [credentialId, value] of Object.entries(vpToken as Record<string, unknown>)) {
    if (typeof value !== 'string') {
      result.push({
        credentialId,
        rawBase64Url: '',
        error: '値が string ではない (JWE などの可能性)',
      })
      continue
    }
    try {
      const bytes = base64urlDecode(value)
      const decoded = decode(bytes)
      result.push({ credentialId, rawBase64Url: value, decoded })
    } catch (e) {
      result.push({
        credentialId,
        rawBase64Url: value,
        error: `CBOR デコード失敗: ${(e as Error).message}`,
      })
    }
  }
  return result
}
