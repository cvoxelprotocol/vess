// eplus 不正転売対策デモの設定。
// 発行(OID4VCI)は issuer サブドメイン、検証(OID4VP)は verifier サブドメインと
// ホストが分かれるため、2つの backend URL を持つ。サーバ側(APIルート)からのみ参照。

const strip = (u: string) => u.replace(/\/$/, '')

// 発行(credential_offers / subject-attributes)用 = issuer サブドメイン
export const issuerBackend = (): string => {
  const url = process.env.NEXT_PUBLIC_VESS_BACKEND
  if (!url) throw new Error('NEXT_PUBLIC_VESS_BACKEND is not set')
  return strip(url)
}

// 検証(oid4vp auth-requests / auth-status)用 = verifier サブドメイン
export const verifierBackend = (): string => {
  const url = process.env.EPLUS_VERIFIER_BACKEND || process.env.NEXT_PUBLIC_VESS_BACKEND
  if (!url) throw new Error('EPLUS_VERIFIER_BACKEND is not set')
  return strip(url)
}

export const ssiApiKey = (): string | undefined => process.env.EPLUS_API_KEY || undefined

export const eplusConfig = {
  issuerId: process.env.EPLUS_ISSUER_ID ?? '',
  memberCredentialType: (process.env.EPLUS_MEMBER_CREDENTIAL_TYPE ?? 'EplusMemberVC')
    .split(',')
    .map((s) => s.trim()),
  ticketCredentialType: (process.env.EPLUS_TICKET_CREDENTIAL_TYPE ?? 'EplusTicketVC')
    .split(',')
    .map((s) => s.trim()),
  memberVpDefinitionId: process.env.EPLUS_MEMBER_VP_DEFINITION_ID ?? '',
}

// サーバ側: backend への共通 fetch。base で issuer/verifier ホストを選ぶ。
export async function ssiFetch(
  path: string,
  init: { method: string; body?: unknown; base?: 'issuer' | 'verifier' },
): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // ngrok等のブラウザ警告ページ回避（実害なし）
    'ngrok-skip-browser-warning': 'true',
  }
  const key = ssiApiKey()
  if (key) headers['X-API-Key'] = key
  const base = init.base === 'verifier' ? verifierBackend() : issuerBackend()
  const res = await fetch(`${base}${path}`, {
    method: init.method,
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
  })
  let json: any = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  return { status: res.status, json }
}
