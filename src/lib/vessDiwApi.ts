import { CredentialOfferRequestWithBaseUrl, EndpointMetadataResult } from '@sphereon/oid4vci-common'
import { ICredentialBranding } from '@sphereon/ssi-sdk.data-store'
import { WrappedVerifiableCredential } from '@sphereon/ssi-types'
import { DIDJWK } from '@/@types/did'
import { AcquireCredentialDto, CredentialResponseDto } from '@/hooks/useOID4VCI'
import { isGoodResponse } from '@/utils/http'
import { getCurrentDomain } from '@/utils/url'

export type credentialOffer = {
  credentialOffer: CredentialOfferRequestWithBaseUrl | undefined
  issuer: string
  credentialEndpoint: string
  accessTokenEndpoint: string
  metadata: EndpointMetadataResult
}
export type CredentialEntity = {
  credential: WrappedVerifiableCredential
  brandings: ICredentialBranding[]
  id: string
}
export type CredentialResponse = {
  credentials: CredentialEntity
}

export type CredentialListResponse = {
  credentials: CredentialEntity[]
}
export type DeleteCredentailResponse = {
  success: boolean
  message: string
}

export const deleteCredential = async (id?: string): Promise<DeleteCredentailResponse> => {
  try {
    const endpoint = `/api/v1/credential/delete/${id}`
    const res = await baseDiwVessApi('POST', endpoint)
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as DeleteCredentailResponse
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const getCredential = async (id?: string): Promise<CredentialResponse | null> => {
  try {
    console.log({ id })
    if (!id) {
      return null
    }
    const endpoint = `/api/v1/credential/${id}`
    const res = await baseDiwVessApi('GET', endpoint)
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as CredentialResponse
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const getCredentials = async (didjwk?: string): Promise<CredentialListResponse> => {
  try {
    console.log({ didjwk })
    if (!didjwk) {
      return { credentials: [] }
    }
    const endpoint = `/api/v1/credential/list/${didjwk}`
    const res = await baseDiwVessApi('GET', endpoint)
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as CredentialListResponse
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const getCredentialOffer = async (offerUrl: string): Promise<credentialOffer> => {
  try {
    console.log({ offerUrl })
    const res = await baseDiwVessApi('POST', '/api/v1/credential/offer', { offerUrl: offerUrl })
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as credentialOffer
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const acquireCredential = async (
  body: AcquireCredentialDto,
): Promise<CredentialResponseDto> => {
  try {
    console.log({ body })
    const res = await baseDiwVessApi('POST', '/api/v1/credential/acquire', body)
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as CredentialResponseDto
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const createDIDJWK = async (): Promise<DIDJWK> => {
  try {
    const res = await baseDiwVessApi('POST', '/api/v1/did/create', { keyType: 'Secp256r1' })
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as DIDJWK
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to create DID JWK')
    }
  } catch (error) {
    throw error
  }
}

export const getDIDJWK = async (didjwk: string): Promise<DIDJWK> => {
  try {
    const res = await baseDiwVessApi('GET', `/api/v1/did/${didjwk}`)
    if (isGoodResponse(res.status)) {
      const resJson = (await res.json()) as DIDJWK
      return resJson
    } else {
      console.error('res', JSON.stringify(res))
      throw new Error('failed to get DID JWK')
    }
  } catch (error) {
    throw error
  }
}

const baseDiwVessApi = async (
  method: 'GET' | 'POST' | 'PUT' = 'POST',
  endpoint: string,
  body?: any,
  query?: string,
): Promise<Response> => {
  try {
    let baseUrl = getCurrentDomain() || process.env.NEXT_PUBLIC_VESS_URL
    let url = `${baseUrl}/api/vessDiwApi?endpoint=${endpoint}`

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
