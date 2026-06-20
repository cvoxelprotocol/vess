import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VP 検証ステータスをポーリングする。verified なら開示 claim を返す。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const { correlationId } = req.body ?? {}
    if (!correlationId) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'correlationId required' })
      return
    }
    const def = eplusConfig.memberVpDefinitionId
    const r = await ssiFetch(`/oid4vp/definitions/${encodeURIComponent(def)}/auth-status`, {
      method: 'POST',
      body: { correlationId, includeVerifiedData: 'VERIFIED_DATA' },
    })
    res.status(200).json(r.json ?? { status: 'unknown' })
  } catch (e: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: String(e?.message ?? e) })
  }
}
