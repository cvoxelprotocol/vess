import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { RegisterParam } from '@/hooks/useNfc'
import { NfcDidRecord } from '@/pages/api/nfc'

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

export const getDidFromNFCForOnlyServer = async (
  id?: string,
): Promise<NfcDidRecord | undefined> => {
  const data = await getDidFromNFC(id)
  if (!data) return
  return JSON.parse(JSON.stringify(data))
}

export const getDidFromNFC = async (id?: string): Promise<NfcDidRecord | undefined> => {
  if (!id) return
  const doc = await db.collection(COLLECTION_NAME).doc(id).get()
  return doc.data() as NfcDidRecord
}

export const getAllNFC = async (): Promise<NfcDidRecord[] | undefined> => {
  const doc = await db.collection(COLLECTION_NAME).get()
  return doc.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
    } as NfcDidRecord
  })
}

export const registNFC = async (param: RegisterParam): Promise<void> => {
  const { did, id } = param
  if (!did || !id) {
    throw new Error('must set id and did')
  }
  try {
    const docRef = db.collection(COLLECTION_NAME).doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      throw new Error('No data found')
    }
    const docData = doc.data()
    if (docData?.initialized || (docData?.did && docData.did !== '')) {
      throw new Error('Already initialized')
    }
    const now = new Date()
    await docRef.set({ did, initialized: true, updatedAt: now.toISOString() }, { merge: true })
  } catch (error) {
    throw error
  }
}
