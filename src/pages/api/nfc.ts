import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'

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
      const result = await db.collection(COLLECTION_NAME).doc(id).set({ did }, { merge: true })
      console.log({ result })
      res.status(200).json({ message: 'set did successfully' })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  } else {
    const id = req.query.id as string
    const doc = await db.collection(COLLECTION_NAME).doc(id).get()
    const data = doc.data()
    res.status(200).json({ data })
  }
  res.status(200)
}
