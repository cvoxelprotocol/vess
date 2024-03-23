import { VSCredentialItemFromBuckup, VSUser } from '@/@types/credential'
import {
  CreateUserInfo,
  CreateUserWithGoogleInfo,
  UpdateUserInfo,
  UserAuthInfo,
} from '@/@types/user'
import { getCurrentDomain } from '@/utils/url'

export const isAuthApi = (endpoint: string) => {
  return (
    endpoint === '/users/auth' ||
    endpoint === '/users/did' ||
    endpoint === '/users/email' ||
    endpoint === '/users/google' ||
    endpoint === '/users/discord'
  )
}

export const isAuthProtectedApi = (endpoint: string) => {
  return endpoint === '/users/info'
}

export const isLogout = (endpoint: string) => {
  return endpoint === '/auth/logout'
}

export const getCredential = async (id?: string): Promise<Response> => {
  if (!id) {
    throw new Error('credenital id is undefined')
  }
  try {
    return await baseVessApi('GET', `/v2/credential/item`, id)
  } catch (error) {
    throw error
  }
}

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

export const getVESSUserByEmail = async (email?: string): Promise<VSUser> => {
  if (!email) {
    throw new Error('email is undefined')
  }
  try {
    const res = await baseVessApi('GET', '/users/email', email)
    const resjson = await res.json()
    return resjson as VSUser
  } catch (error) {
    throw error
  }
}

export const getVESSUserByDid = async (did?: string): Promise<VSUser> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    const res = await baseVessApi('GET', '/users/did', did)
    const resjson = await res.json()
    return resjson as VSUser
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

export const createUserWithGoogle = async (body: CreateUserWithGoogleInfo): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/users/google', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const createUserWithDiscord = async (body: CreateUserWithGoogleInfo): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/users/discord', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const createUserWithEmail = async (body: CreateUserInfo): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/users/email', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const createUserOnlyWithDid = async (body: CreateUserInfo): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/users/did', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const updateUserProfile = async (body: UpdateUserInfo): Promise<Response> => {
  try {
    return await baseVessApi('PUT', '/users/info', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const userAuth = async (body: UserAuthInfo): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/users/auth', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const vessLogout = async (): Promise<Response> => {
  try {
    return await baseVessApi('GET', '/auth/logout')
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
    let baseUrl = getCurrentDomain() || process.env.NEXT_PUBLIC_VESS_URL
    let url =
      isAuthApi(endpoint) && method === 'POST'
        ? `${baseUrl}/api/auth/login?endpoint=${endpoint}&slug=${slug || ''}`
        : isAuthProtectedApi(endpoint)
        ? `${baseUrl}/api/auth/profile?endpoint=${endpoint}&slug=${slug || ''}`
        : isLogout(endpoint)
        ? `${baseUrl}/api/auth/logout`
        : `${baseUrl}/api/vessApi?endpoint=${endpoint}&slug=${slug || ''}`

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
