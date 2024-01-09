import { VSCredentialItemFromBuckup } from '@/@types/credential'
import { getCurrentDomain } from '@/utils/url'

export const getCredentials = async (did?: string): Promise<Response> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    return await baseVessApi('GET', `/v2/credential/holder`, did)
  } catch (error) {
    throw error
  }
}

export const getCredentialItem = async (
  id?: string,
  showHolders: boolean = false,
): Promise<VSCredentialItemFromBuckup> => {
  if (!id) {
    throw new Error('id is undefined')
  }
  try {
    const res = await baseVessApi(
      'GET',
      '/v2/collection/items',
      id,
      showHolders ? 'showHolders=true' : undefined,
    )
    const resjson = await res.json()
    return resjson as VSCredentialItemFromBuckup
  } catch (error) {
    throw error
  }
}

export const issueVerifiableCredentials = async (body: any): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/credential/issue', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

const baseVessApi = async (
  method: 'GET' | 'POST' | 'PUT' = 'POST',
  endpoint: string,
  slug?: string,
  query?: string,
  body?: any,
): Promise<Response> => {
  try {
    let url = `${
      getCurrentDomain() || `${process.env.NEXT_PUBLIC_VESS_URL}`
    }/api/vessApi?endpoint=${endpoint}&slug=${slug || ''}`
    if (query) {
      url = url + `&q=${encodeURIComponent(query)}`
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
