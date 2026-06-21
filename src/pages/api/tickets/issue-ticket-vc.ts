import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { ticketConfig, ssiFetch } from '@/lib/tickets/config'
import { HttpStatus } from '@/utils/error'

// 会員VP の検証済み correlationId を消費し、その会員に束ねた チケットVC を発行する。
// クライアント供給の member_id は信用せず、サーバ側で auth-status を検証して取り出す。
// ※ 発行結果はプロセス内メモリにcorrelationId単位でキャッシュし冪等化する
// （提示後のredirectで購入ページが再マウントされ再度叩かれても、同じチケットを返す）。
// デモ用途。サーバレスでは厳密でないため本番は永続ストアへ。
const issued = new Map<string, { uri: string; ticketId: string }>()

// verifiedData の構造はモードにより変わるため、member_id を再帰的に探す
function findClaim(obj: any, key: string): string | undefined {
  if (obj == null || typeof obj !== 'object') return undefined
  if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== 'object') {
    return String(obj[key])
  }
  for (const v of Object.values(obj)) {
    const found = findClaim(v, key)
    if (found !== undefined) return found
  }
  return undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const { correlationId } = req.body ?? {}
    if (!correlationId || typeof correlationId !== 'string') {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'correlationId required' })
      return
    }
    const cached = issued.get(correlationId)
    if (cached) {
      // 既に発行済み（redirect再マウント等）。同じチケットを冪等に返す。
      res.status(200).json(cached)
      return
    }

    // 1) サーバ側で会員VPの検証結果を確認し member_id を取り出す
    const def = ticketConfig.memberVpDefinitionId
    const statusRes = await ssiFetch(
      `/oid4vp/definitions/${encodeURIComponent(def)}/auth-status`,
      { method: 'POST', body: { correlationId, includeVerifiedData: 'credential_claims_deserialized' }, base: 'verifier' },
    )
    if (statusRes.json?.status !== 'authorization_response_verified') {
      res.status(HttpStatus.FORBIDDEN).json({ error: 'member presentation not verified' })
      return
    }
    const memberId = findClaim(statusRes.json, 'member_id')
    if (!memberId) {
      res.status(HttpStatus.FORBIDDEN).json({ error: 'member_id not present in verified data' })
      return
    }
    const ticketId = `TK-${crypto.randomUUID()}`
    // イベント情報はクライアントから受けず、サーバ側の固定カタログを使う（デモは単一公演）
    const eventNameSafe = 'DEMO LIVE 2026'
    const seatSafe = 'A-1'

    // 2) チケットVC の subject 登録 → offer 作成
    const subj = await ssiFetch('/subject-attributes', {
      method: 'POST',
      body: {
        credentialType: ticketConfig.ticketCredentialType.at(-1),
        issuerId: ticketConfig.issuerId,
        credentialSubject: { ticket_id: ticketId, member_id: memberId, event_name: eventNameSafe, seat: seatSafe },
        source: 'fixed',
        isFixed: true,
      },
    })
    const subjectAttributeId = subj.json?.id ?? subj.json?.subjectAttributeId
    if (!subjectAttributeId) {
      console.error('[tickets issue-ticket-vc] subject-attributes failed', subj.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'ticket issuance failed' })
      return
    }
    const offer = await ssiFetch('/credential_offers', {
      method: 'POST',
      body: {
        credentialType: ticketConfig.ticketCredentialType,
        issuerId: ticketConfig.issuerId,
        flowType: 'pre-authorized',
        subjectAttributeId,
        txCodeRequired: false,
      },
    })
    if (!offer.json?.uri) {
      console.error('[tickets issue-ticket-vc] credential_offers failed', offer.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'ticket issuance failed' })
      return
    }
    const result = { uri: offer.json.uri as string, ticketId }
    issued.set(correlationId, result)
    res.status(200).json(result)
  } catch (e: any) {
    console.error('[tickets issue-ticket-vc]', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
