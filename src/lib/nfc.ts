import { NfcDidRecord } from '@/pages/api/nfc'
import { getCurrentDomain } from '@/utils/url'

export const getDidFromNFC = async (id?: string): Promise<NfcDidRecord | undefined> => {
  try {
    if (!id) return undefined
    let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}`
    const res = await fetch(url)
    const resJson = await res.json()
    return resJson?.data as NfcDidRecord
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getDidFromNFCForServer = async (id?: string): Promise<NfcDidRecord | undefined> => {
  try {
    if (!id) return undefined
    let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}`
    const res = await fetch(url)
    const resJson = await res.json()
    const j = resJson?.data as NfcDidRecord
    return JSON.parse(JSON.stringify(j))
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllNFCs = async (): Promise<NfcDidRecord[] | undefined> => {
  try {
    let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc`
    const res = await fetch(url)
    const resJson = await res.json()
    const j = resJson?.data as NfcDidRecord[]
    return JSON.parse(JSON.stringify(j))
  } catch (error) {
    console.error(error)
    throw error
  }
}
