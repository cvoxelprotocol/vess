import { NextApiRequest, NextApiResponse } from 'next'
import { eplusConfig, ssiFetch } from '@/lib/eplus/config'
import { HttpStatus } from '@/utils/error'

// 会員VP 検証成功後、買った会員に束ねた チケットVC offer を発行する。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    const { memberId, eventName, seat } = req.body ?? {}
    const ticketId = `TK-${Date.now().toString(36).toUpperCase()}`

    const subj = await ssiFetch('/subject-attributes', {
      method: 'POST',
      body: {
        credentialType: eplusConfig.ticketCredentialType.at(-1),
        issuerId: eplusConfig.issuerId,
        credentialSubject: {
          ticket_id: ticketId,
          member_id: memberId ?? '',
          event_name: eventName ?? 'DEMO LIVE 2026',
          seat: seat ?? 'A-1',
        },
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
        credentialType: eplusConfig.ticketCredentialType,
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
    res.status(200).json({ uri: offer.json.uri, ticketId })
  } catch (e: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: String(e?.message ?? e) })
  }
}
