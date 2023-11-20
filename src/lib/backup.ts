import { getCurrentDomain } from '@/utils/url'

export const getCredentials = async (did?: string): Promise<Response> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    return await baseVessApi(`/v2/credential/holder`, 'GET', did)
  } catch (error) {
    throw error
  }
}

const baseVessApi = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'POST',
  slug?: string,
  body?: any,
): Promise<Response> => {
  try {
    const url = `${
      getCurrentDomain() || `${process.env.NEXT_PUBLIC_VESS_URL}`
    }/api/vessApi?endpoint=${endpoint}&slug=${slug || ''}`
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
