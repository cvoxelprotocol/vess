import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VP の検証済み correlationId を消費し、その会員に束ねた チケットVC を発行する。
// クライアント供給の member_id は信用せず、サーバ側で auth-status を検証して取り出す。
// ※ 使い捨て管理はプロセス内メモリ（デモ用途。サーバレスでは厳密でないため本番は永続ストアへ）。
const consumed = new Set<string>()

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
    if (consumed.has(correlationId)) {
      res.status(HttpStatus.CONFLICT).json({ error: 'already issued for this verification' })
      return
    }

    // 1) サーバ側で会員VPの検証結果を確認し member_id を取り出す
    const def = eplusConfig.memberVpDefinitionId
    const statusRes = await ssiFetch(
      `/oid4vp/definitions/${encodeURIComponent(def)}/auth-status`,
      { method: 'POST', body: { correlationId, includeVerifiedData: 'VERIFIED_DATA' } },
    )
    if (statusRes.json?.status !== 'authorization_response_verified') {
      res.status(HttpStatus.FORBIDDEN).json({ error: 'member presentation not verified' })
      return
    }
    const claims = statusRes.json?.verifiedData?.credential_claims?.[0]?.claims ?? {}
    const memberId = claims.member_id
    if (!memberId) {
      res.status(HttpStatus.FORBIDDEN).json({ error: 'member_id not present in verified data' })
      return
    }
    consumed.add(correlationId)

    const ticketId = `TK-${crypto.randomUUID()}`
    // イベント情報はクライアントから受けず、サーバ側の固定カタログを使う（デモは単一公演）
    const eventNameSafe = 'DEMO LIVE 2026'
    const seatSafe = 'A-1'

    // 2) チケットVC の subject 登録 → offer 作成
    const subj = await ssiFetch('/subject-attributes', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.ticketCredentialType.at(-1),
        issuerId: eplusConfig.issuerId,
        credentialSubject: { ticket_id: ticketId, member_id: memberId, event_name: eventNameSafe, seat: seatSafe },
        source: 'fixed',
        isFixed: true,
      },
    })
    const subjectAttributeId = subj.json?.id ?? subj.json?.subjectAttributeId
    if (!subjectAttributeId) {
      console.error('[eplus issue-ticket-vc] subject-attributes failed', subj.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'ticket issuance failed' })
      return
    }
    const offer = await ssiFetch('/credential_offers', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.ticketCredentialType,
        issuerId: eplusConfig.issuerId,
        flowType: 'pre-authorized',
        subjectAttributeId,
        txCodeRequired: false,
      },
    })
    if (!offer.json?.uri) {
      console.error('[eplus issue-ticket-vc] credential_offers failed', offer.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'ticket issuance failed' })
      return
    }
    res.status(200).json({ uri: offer.json.uri, ticketId })
  } catch (e: any) {
    console.error('[eplus issue-ticket-vc]', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
