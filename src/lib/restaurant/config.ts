// 飲食店デモ（そば処 デモ亭）の OID4VP 設定。サーバ側(APIルート)からのみ参照。

export type DemoKind = 'campaign' | 'birthday'

const strip = (u: string) => u.replace(/\/$/, '')

const verifierBackend = (): string => {
  const url = process.env.PII_VERIFIER_BACKEND
  if (!url) throw new Error('PII_VERIFIER_BACKEND is not set')
  return strip(url)
}

export const queryIdFor = (kind: DemoKind): string => {
  const id =
    kind === 'campaign' ? process.env.PII_CAMPAIGN_QUERY_ID : process.env.PII_BIRTHDAY_QUERY_ID
  if (!id) throw new Error(`query id for ${kind} is not set`)
  return id
}

export const isDemoKind = (v: unknown): v is DemoKind => v === 'campaign' || v === 'birthday'

async function piiFetch(path: string, body: unknown): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = process.env.PII_API_KEY
  if (key) headers['X-API-Key'] = key
  const res = await fetch(`${verifierBackend()}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  let json: any = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  return { status: res.status, json }
}

export function createAuthRequest(kind: DemoKind, redirectUri?: string) {
  return piiFetch(`/oid4vp/definitions/${encodeURIComponent(queryIdFor(kind))}/auth-requests`, {
    responseURIType: 'response_uri',
    ...(redirectUri ? { redirectUri } : {}),
  })
}

export function fetchAuthStatus(
  kind: DemoKind,
  correlationId: string,
  opts: { withClaims?: boolean; responseCode?: string } = {},
) {
  return piiFetch(`/oid4vp/definitions/${encodeURIComponent(queryIdFor(kind))}/auth-status`, {
    correlationId,
    ...(opts.withClaims ? { includeVerifiedData: 'credential_claims_deserialized' } : {}),
    ...(opts.responseCode ? { response_code: opts.responseCode } : {}),
  })
}

export const VERIFIED = 'authorization_response_verified'

// verifiedData の構造はモードにより変わるため、プリミティブ値を再帰的に探す
export function findClaim(obj: any, key: string): string | number | boolean | undefined {
  if (obj == null || typeof obj !== 'object') return undefined
  if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== 'object') {
    return obj[key]
  }
  for (const v of Object.values(obj)) {
    const found = findClaim(v, key)
    if (found !== undefined) return found
  }
  return undefined
}

// 東京時間の現在月（1-12）
export const currentMonthTokyo = (): number =>
  Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', month: 'numeric' }).format(new Date()))
