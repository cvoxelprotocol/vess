// import { initializeApp, getApps, cert } from 'firebase-admin/app'
// import { getFirestore } from 'firebase-admin/firestore'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getAllNFC, getDidFromNFC, registNFC } from '@/lib/firestore'

// export type NfcDidRecord = {
//   id?: string
//   did?: string
//   initialized?: boolean
//   createdAt?: string
//   updatedAt?: string
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const COLLECTION_NAME = 'nfc'

//   const apps = getApps()
//   if (!apps.length) {
//     initializeApp({
//       credential: cert({
//         projectId: process.env.FSA_PROJECT_ID,
//         privateKey: process.env.FSA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//         clientEmail: process.env.FSA_CLIENT_EMAIL,
//       }),
//     })
//   }
//   const db = getFirestore()

//   if (req.method === 'POST') {
//     const id = req.query.id as string
//     const did = req.query.did as string
//     if (!did || !id) {
//       res.status(500).json({ error: 'must set id and did' })
//       return
//     }
//     try {
//       await registNFC({ id, did })
//       res.status(200).json({ did, initialized: true })
//     } catch (error) {
//       res.status(500).json({ error: error })
//     }
//   } else {
//     try {
//       const id = req.query.id as string
//       if (!id) {
//         const data = await getAllNFC()
//         res.status(200).json({ data })
//       } else {
//         const data = await getDidFromNFC(id)
//         res.status(200).json({ data })
//       }
//     } catch (error) {
//       res.status(500).json({ error: error })
//     }
//   }
//   res.status(200)
// }
