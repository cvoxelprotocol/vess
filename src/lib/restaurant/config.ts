// 飲食店デモ（麺処 宇田川）の OID4VP 設定。サーバ側(APIルート)からのみ参照。

export type DemoKind = 'campaign' | 'birthday' | 'login'

const strip = (u: string) => u.replace(/\/$/, '')

const verifierBackend = (): string => {
  const url = process.env.PII_VERIFIER_BACKEND
  if (!url) throw new Error('PII_VERIFIER_BACKEND is not set')
  return strip(url)
}

// 会員証（UdagawaMemberCredential）を求める DCQL。値は秘密ではないので既定値を持つ
const QUERY_IDS: Record<DemoKind, string> = {
  campaign: process.env.PII_MEMBER_CAMPAIGN_QUERY_ID ?? 'MemberCampaignRequest',
  birthday: process.env.PII_MEMBER_BIRTHDAY_QUERY_ID ?? 'MemberBirthdayRequest',
  login: process.env.PII_MEMBER_LOGIN_QUERY_ID ?? 'MemberLoginRequest',
}

export const queryIdFor = (kind: DemoKind): string => QUERY_IDS[kind]

export const isDemoKind = (v: unknown): v is DemoKind =>
  v === 'campaign' || v === 'birthday' || v === 'login'

async function piiFetch(path: string, body: unknown, base = verifierBackend()): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = process.env.PII_API_KEY
  if (key) headers['X-API-Key'] = key
  const res = await fetch(`${base}${path}`, {
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

// 会員証の発行者（お店）
const MEMBER_CREDENTIAL_TYPE = 'UdagawaMemberCredential'
const memberIssuer = () => ({
  base: strip(process.env.PII_MEMBER_ISSUER_BACKEND ?? 'https://udagawa-ramen-issuer.dev.vess-api.com'),
  id: process.env.PII_MEMBER_ISSUER_ID ?? 'd3e6f9c0-d98b-49de-a7bd-b19f30edd8da',
})
// 入力値を発行用に ssi-api に置いておく期間。オファーの受け取りまでに使い切る想定
const SUBJECT_TTL_MS = 10 * 60 * 1000

/** 会員証の発行オファー URI (openid-credential-offer://...) を作る。失敗時は null */
export async function createMemberOffer(subject: Record<string, unknown>): Promise<string | null> {
  const { base, id } = memberIssuer()
  const attr = await piiFetch(
    '/subject-attributes',
    {
      credentialType: MEMBER_CREDENTIAL_TYPE,
      issuerId: id,
      source: 'user_input',
      isFixed: true,
      expiresAt: new Date(Date.now() + SUBJECT_TTL_MS).toISOString(),
      credentialSubject: subject,
    },
    base,
  )
  if (!attr.json?.id) {
    console.error('[restaurant register] subject-attributes failed', attr.status, attr.json?.message)
    return null
  }
  const offer = await piiFetch(
    '/credential_offers',
    {
      credentialType: [MEMBER_CREDENTIAL_TYPE],
      issuerId: id,
      flowType: 'pre-authorized',
      subjectAttributeId: attr.json.id,
      txCodeRequired: false,
    },
    base,
  )
  if (!offer.json?.uri) {
    console.error('[restaurant register] credential_offers failed', offer.status, offer.json?.message)
    return null
  }
  return offer.json.uri
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
