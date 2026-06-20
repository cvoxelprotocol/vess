import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VC offer を発行する（デモ用：認証・レート制限は未実装＝意図的な簡略化）。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const rawName = (req.body?.name ?? '').toString().trim()
    const rawEmail = (req.body?.email ?? '').toString().trim()
    if (rawName.length < 1 || rawName.length > 50) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'name must be 1-50 chars' })
      return
    }
    if (rawEmail.length > 100) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'email too long' })
      return
    }
    const memberId = `TP-${crypto.randomUUID()}`

    const subj = await ssiFetch('/subject-attributes', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.memberCredentialType.at(-1),
        issuerId: eplusConfig.issuerId,
        credentialSubject: { member_id: memberId, name: rawName, email: rawEmail },
        source: 'fixed',
        isFixed: true,
      },
    })
    const subjectAttributeId = subj.json?.id ?? subj.json?.subjectAttributeId
    if (!subjectAttributeId) {
      console.error('[eplus issue-member-vc] subject-attributes failed', subj.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'member VC issuance failed' })
      return
    }

    const offer = await ssiFetch('/credential_offers', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.memberCredentialType,
        issuerId: eplusConfig.issuerId,
        flowType: 'pre-authorized',
        subjectAttributeId,
        txCodeRequired: false,
      },
    })
    if (!offer.json?.uri) {
      console.error('[eplus issue-member-vc] credential_offers failed', offer.json)
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'member VC issuance failed' })
      return
    }
    res.status(200).json({ uri: offer.json.uri, memberId })
  } catch (e: any) {
    console.error('[eplus issue-member-vc]', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
