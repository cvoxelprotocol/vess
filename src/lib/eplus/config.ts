// eplus 不正転売対策デモの設定。
// バックエンド(vess-ssi-api)の発行/検証エンドポイントを叩くための値。
// 値は backend のセットアップ(issuer 登録・credential config・presentation definition)後に
// 環境変数で確定する。サーバ側(API ルート)からのみ参照する。

export const ssiBackend = (): string => {
  const url = process.env.NEXT_PUBLIC_VESS_BACKEND
  if (!url) throw new Error('NEXT_PUBLIC_VESS_BACKEND is not set')
  return url.replace(/\/$/, '')
}

// vess-ssi-api は SIMPLE_API_KEY_AUTH_ENABLED の場合 X-API-Key を要求する
export const ssiApiKey = (): string | undefined => process.env.EPLUS_API_KEY

export const eplusConfig = {
  issuerId: process.env.EPLUS_ISSUER_ID ?? '',
  // 会員VC / チケットVC の credentialType（vct）。backend の credential config と一致させる
  memberCredentialType: (process.env.EPLUS_MEMBER_CREDENTIAL_TYPE ?? '会員VC')
    .split(',')
    .map((s) => s.trim()),
  ticketCredentialType: (process.env.EPLUS_TICKET_CREDENTIAL_TYPE ?? 'チケットVC')
    .split(',')
    .map((s) => s.trim()),
  // 会員VP を要求する presentation definition の ID
  memberVpDefinitionId: process.env.EPLUS_MEMBER_VP_DEFINITION_ID ?? '',
}

// サーバ側: backend への共通 fetch。X-API-Key を付与する。
export async function ssiFetch(
  path: string,
  init: { method: string; body?: unknown },
): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // ngrok 無料版のブラウザ警告ページを回避（API が JSON を返すように）
    'ngrok-skip-browser-warning': 'true',
  }
  const key = ssiApiKey()
  if (key) headers['X-API-Key'] = key
  const res = await fetch(`${ssiBackend()}${path}`, {
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
