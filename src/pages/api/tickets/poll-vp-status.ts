import { NextApiRequest, NextApiResponse } from 'next'
import { ticketConfig, ssiFetch } from '@/lib/tickets/config'
import { HttpStatus } from '@/utils/error'

// 会員VP 検証ステータスのみを返す（開示claim/PIIはここでは返さない）。
// 検証済み claim の取り出しは issue-ticket-vc がサーバ側で行う。
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
    const def = ticketConfig.memberVpDefinitionId
    const r = await ssiFetch(`/oid4vp/definitions/${encodeURIComponent(def)}/auth-status`, {
      method: 'POST',
      body: { correlationId, includeVerifiedData: 'NONE' },
      base: 'verifier',
    })
    // status 文字列だけをクライアントへ返す
    res.status(200).json({ status: r.json?.status ?? 'unknown' })
  } catch (e: any) {
    console.error('[tickets poll-vp-status]', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
