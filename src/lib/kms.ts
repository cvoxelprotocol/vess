import {
  IssueAndMintToEventAttendanceWithSBTRequest,
  MintEventAttendanceResponse,
  OnetimeTokenResponse,
} from '@/pages/toppanpoap/[onetimeId]'
import { getEnv } from '@/utils/envUtil'
import { isGoodResponse } from '@/utils/http'

export const mintSBT = async (
  body: IssueAndMintToEventAttendanceWithSBTRequest,
): Promise<MintEventAttendanceResponse | null> => {
  try {
    const res = await baseVessApi('/events/mint/to', 'POST', body)
    if (isGoodResponse(res.status)) {
      const j = await res.json()
      return j as MintEventAttendanceResponse
    }
    return null
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getOnetimeTokensForServerUseOnly = async (): Promise<string[]> => {
  try {
    const res = await baseVessApi('/events/onetimeall', 'GET')
    if (isGoodResponse(res.status)) {
      const j = await res.json()
      const tokens = j.tokens as string[]
      return JSON.parse(JSON.stringify(tokens))
    }
    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getOnetimeTokenForServerUseOnly = async (
  id: string,
): Promise<OnetimeTokenResponse | null> => {
  try {
    const res = await baseVessApi('/events/onetime', 'GET', undefined, id)
    if (isGoodResponse(res.status)) {
      const j = (await res.json()) as OnetimeTokenResponse
      return JSON.parse(JSON.stringify(j))
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

const baseVessApi = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'POST',
  body?: any,
  slug?: string,
): Promise<Response> => {
  try {
    const baseUrl = getEnv('NEXT_PUBLIC_VESS_BACKEND') || process.env.NEXT_PUBLIC_VESS_BACKEND
    let url = `${baseUrl}${endpoint}`
    if (slug) {
      url = `${url}/${slug}`
    }
    console.log({ url })
    if (method === 'GET') {
      return await fetch(url)
    } else if (method === 'PUT') {
      return await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body }),
      })
    } else {
      return await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body }),
      })
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
