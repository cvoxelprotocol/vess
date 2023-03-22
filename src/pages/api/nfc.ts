import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'

export type NfcDidRecord = {
  did?: string
  initialized?: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const COLLECTION_NAME = 'nfc'

  const apps = getApps()
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FSA_PROJECT_ID,
        privateKey: process.env.FSA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FSA_CLIENT_EMAIL,
      }),
    })
  }
  const db = getFirestore()

  if (req.method === 'POST') {
    const id = req.query.id as string
    const did = req.query.did as string
    if (!did || !id) {
      res.status(500).json({ error: 'must set id and did' })
      return
    }
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id)
      const doc = await docRef.get()
      if (!doc.exists) {
        res.status(500).json({ error: 'No data found' })
        return
      }
      const docData = doc.data()
      if (docData?.initialized) {
        res.status(500).json({ error: 'Already initialized' })
        return
      }
      const result = await docRef.set({ did, initialized: true }, { merge: true })
      console.log({ result })
      res.status(200).json({ did, initialized: true })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  } else {
    try {
      const id = req.query.id as string
      const doc = await db.collection(COLLECTION_NAME).doc(id).get()
      const data = doc.data() as NfcDidRecord
      res.status(200).json({ data })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
  res.status(200)
}
