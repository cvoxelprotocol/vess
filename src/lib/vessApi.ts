import {
  ICreateHolderContentsRequest,
  IIssueCredentialItemByUserRequest,
  OBCredentialItemFromBackup,
  SetVisibleRequest,
  VSCredentialItemFromBuckup,
  VSUser,
} from '@/@types/credential'
import {
  AddAvatarRequest,
  AddPostRequest,
  Avatar,
  CreateUserInfo,
  CreateUserWithGoogleInfo,
  Post,
  PostFeed,
  PostWithUser,
  UpdateAvatarRequest,
  UpdateUserInfo,
  UserAuthInfo,
  VSUserResponse,
} from '@/@types/user'
import { isGoodResponse } from '@/utils/http'
import { getCurrentDomain } from '@/utils/url'

export const isLogout = (endpoint: string) => {
  return endpoint === '/auth/logout'
}

// return error if it is not authorized
export const isAuthRequiredApi = (endpoint: string) => {
  return (
    endpoint === '/users/info' ||
    endpoint === '/avatar/add' ||
    endpoint === '/avatar/update' ||
    endpoint === '/avatar/delete' ||
    endpoint === '/v2/credential/visible'
  )
}

export const getPostByCredItem = async (credItemId?: string): Promise<Post[] | null> => {
  if (!credItemId) {
    throw new Error('credItemId is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/v2/post/cred`, credItemId)
    const resjson = await res.json()
    return resjson?.data as Post[] | null
  } catch (error) {
    throw error
  }
}

export const getPostFeedByDID = async (did?: string): Promise<PostFeed[] | null> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/v2/post/feed/did`, did)
    const resjson = await res.json()
    return resjson?.data as PostFeed[] | null
  } catch (error) {
    throw error
  }
}

export const getPostByUser = async (userId?: string): Promise<Post[] | null> => {
  if (!userId) {
    throw new Error('userId is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/v2/post/user`, userId)
    const resjson = await res.json()
    return resjson?.data as Post[] | null
  } catch (error) {
    throw error
  }
}

export const getPostById = async (id?: string): Promise<PostWithUser | null> => {
  if (!id) {
    throw new Error('id is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/v2/post/item`, id)
    const resjson = await res.json()
    return resjson?.data as PostWithUser | null
  } catch (error) {
    throw error
  }
}

export const addPost = async (body: AddPostRequest): Promise<Response> => {
  try {
    console.log({ body })
    return await baseVessApi('POST', '/v2/post/add', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const deletePost = async (postId: string, userId: string): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/post/delete', postId, undefined, { userId })
  } catch (error) {
    throw error
  }
}

export const getAvatarList = async (did?: string): Promise<Avatar[]> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/avatar/did`, did)
    const resjson = await res.json()
    return resjson as Avatar[]
  } catch (error) {
    throw error
  }
}

export const getAvatar = async (canvasId?: string): Promise<Avatar | null> => {
  if (!canvasId) {
    throw new Error('canvasId is undefined')
  }
  try {
    const res = await baseVessApi('GET', `/avatar/canvas`, canvasId)
    const resjson = await res.json()
    return resjson as Avatar | null
  } catch (error) {
    throw error
  }
}

export const addAvatar = async (body: AddAvatarRequest): Promise<Response> => {
  try {
    console.log({ body })
    return await baseVessApi('POST', '/avatar/add', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const updateAvatar = async (body: UpdateAvatarRequest): Promise<Response> => {
  try {
    return await baseVessApi('PUT', '/avatar/update', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const deleteAvatar = async (canvasId: string): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/avatar/delete', undefined, undefined, { canvasId })
  } catch (error) {
    throw error
  }
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
  userId?: string,
): Promise<VSCredentialItemFromBuckup> => {
  if (!id) {
    throw new Error('id is undefined')
  }
  try {
    let q = userId ? `userId=${userId}&` : ''
    q = showHolders ? `${q}showHolders=true` : q
    const res = await baseVessApi('GET', '/v2/creditems/item', id, q)
    const resjson = await res.json()
    return resjson as VSCredentialItemFromBuckup
  } catch (error) {
    throw error
  }
}

export const getOBCredentialItem = async (
  id?: string,
  showHolders: boolean = false,
  userId?: string,
): Promise<OBCredentialItemFromBackup> => {
  if (!id) {
    throw new Error('id is undefined')
  }
  try {
    let q = userId ? `userId=${userId}&` : ''
    q = showHolders ? `${q}showHolders=true` : q
    const res = await baseVessApi('GET', '/v2/creditems/ob-item', id, q)
    const resjson = await res.json()
    return resjson as OBCredentialItemFromBackup
  } catch (error) {
    throw error
  }
}

export const getUserCredentialItem = async (
  userId?: string,
  showHolders: boolean = false,
): Promise<VSCredentialItemFromBuckup[]> => {
  if (!userId) {
    throw new Error('userId is undefined')
  }
  try {
    let q = userId ? `userId=${userId}` : ''
    q = showHolders ? `${q}&showHolders=true` : q
    const res = await baseVessApi('GET', '/v2/creditems/user/items', userId, q)
    const resjson = await res.json()
    return resjson as VSCredentialItemFromBuckup[]
  } catch (error) {
    throw error
  }
}

export const createCredentialItem = async (
  body: IIssueCredentialItemByUserRequest,
): Promise<Response> => {
  console.log({ body })
  try {
    return await baseVessApi('POST', '/v2/creditems/user/items', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const deleteCredentialItem = async (itemId: string): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/creditems/user/items/delete', itemId)
  } catch (error) {
    throw error
  }
}

export const addHolderContent = async (body: ICreateHolderContentsRequest): Promise<Response> => {
  const { itemId, ...rest } = body
  try {
    return await baseVessApi('POST', '/v2/creditems/user/items/content', itemId, undefined, rest)
  } catch (error) {
    throw error
  }
}

export const deleteHolderContent = async (contentId: string): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/creditems/user/items/content/delete', contentId)
  } catch (error) {
    throw error
  }
}

export const getVESSUserByEmail = async (email?: string): Promise<VSUser | null> => {
  if (!email) {
    throw new Error('email is undefined')
  }
  try {
    const res = await baseVessApi('GET', '/users/email', email)
    const resjson = (await res.json()) as VSUserResponse
    return resjson.user
  } catch (error) {
    throw error
  }
}

export const getVESSUserByDid = async (did?: string): Promise<VSUser | null> => {
  if (!did) {
    throw new Error('did is undefined')
  }
  try {
    const res = await baseVessApi('GET', '/users/did', did)
    try {
      const resjson = await res.json()
      return resjson as VSUser
    } catch (error) {
      console.error(error)
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const checkVESSId = async (vessId?: string): Promise<boolean> => {
  if (!vessId) {
    throw new Error('vessId is undefined')
  }
  try {
    const res = await getVESSUserByVessId(vessId)
    console.log('getVESSUserByVessId: ', res)
    return !!res.user
  } catch (error) {
    throw error
  }
}

export const getVESSUserById = async (userId?: string): Promise<VSUser | null> => {
  if (!userId) {
    throw new Error('userId is undefined')
  }
  try {
    const res = await baseVessApi('GET', '/users/id', userId)
    const resjson = (await res.json()) as VSUserResponse
    return resjson.user
  } catch (error) {
    throw error
  }
}

export const getVESSUserByVessId = async (
  vessId?: string,
  includeDetials: boolean = false,
): Promise<VSUserResponse> => {
  if (!vessId) {
    throw new Error('vessId is undefined')
  }
  try {
    let q = includeDetials ? `includeDetials=${includeDetials}` : undefined
    const res = await baseVessApi('GET', '/users/vess', vessId, q)
    const resjson = await res.json()
    return resjson as VSUserResponse
  } catch (error) {
    throw error
  }
}

export const getVESSUserByVessIdForServerUseOnly = async (
  vessId?: string,
  includeDetials: boolean = false,
): Promise<VSUserResponse | null> => {
  try {
    let q = includeDetials ? `includeDetials=${includeDetials}` : undefined
    const res = await baseVessApi('GET', '/users/vess', vessId, q)
    if (isGoodResponse(res.status)) {
      const j = (await res.json()) as VSUserResponse
      return JSON.parse(JSON.stringify(j))
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const issueVerifiableCredentials = async (body: any): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/credential/issue', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const setVisibleVerifiableCredential = async (
  body: SetVisibleRequest,
): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/credential/visible', undefined, undefined, body)
  } catch (error) {
    throw error
  }
}

export const issueSocialVerifiableCredentials = async (body: any): Promise<Response> => {
  try {
    return await baseVessApi('POST', '/v2/credential/social/issue', undefined, undefined, body)
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
    let url = isLogout(endpoint)
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
