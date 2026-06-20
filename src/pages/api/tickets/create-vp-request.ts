import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VP を要求する OID4VP authorization request を作成する。
// （デモ用：認証・レート制限・correlationId のセッション束縛は未実装＝意図的な簡略化）
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const def = eplusConfig.memberVpDefinitionId
    const r = await ssiFetch(`/oid4vp/definitions/${encodeURIComponent(def)}/auth-requests`, {
      method: 'POST',
      body: { responseURIType: 'response_uri' },
      base: 'verifier',
    })
    if (!r.json?.authRequestURI) {
      console.error('[eplus create-vp-request] auth-requests failed', r.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'vp request failed' })
      return
    }
    res.status(200).json({ correlationId: r.json.correlationId, authRequestURI: r.json.authRequestURI })
  } catch (e: any) {
    console.error('[eplus create-vp-request]', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
