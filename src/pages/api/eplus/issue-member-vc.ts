import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VC offer を発行する。
// 1) subject attribute（会員の claim）を登録 → 2) credential offer を作成。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const { name, email } = req.body ?? {}
    const memberId = `EP-${Date.now().toString(36).toUpperCase()}`

    const subj = await ssiFetch('/subject-attributes', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.memberCredentialType.at(-1),
        issuerId: eplusConfig.issuerId,
        credentialSubject: { member_id: memberId, name: name ?? '会員', email: email ?? '' },
        source: 'fixed',
        isFixed: true,
      },
    })
    const subjectAttributeId = subj.json?.id ?? subj.json?.subjectAttributeId
    if (!subjectAttributeId) {
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'subject-attributes failed', detail: subj.json })
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
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'credential_offers failed', detail: offer.json })
      return
    }
    res.status(200).json({ uri: offer.json.uri, memberId })
  } catch (e: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: String(e?.message ?? e) })
  }
}
