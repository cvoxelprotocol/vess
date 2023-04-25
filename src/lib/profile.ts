import { gql } from '@apollo/client'
import { formatDID } from 'vess-sdk'
import { fetchOrbisProfile } from './OrbisHelper'
import { getCyberApolloClient, getlensApolloClient } from './apollo'
import { DisplayProfile } from '@/@types'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

export const fetchProfile = async (did: string): Promise<DisplayProfile> => {
  try {
    //orbis
    const orbis = fetchOrbisProfile(did)
    const cyber = getCCProfile(did)
    const lens = getLensProfile(did)

    const res = await Promise.all([orbis, cyber, lens])
    const orbisProfile = res[0]
    const ccProfile = res[1]
    const lensProfile = res[2]
    return {
      avatarSrc:
        orbisProfile?.pfp && orbisProfile?.pfp !== ''
          ? orbisProfile?.pfp
          : ccProfile?.avatarSrc || lensProfile?.avatarSrc || undefined,
      displayName:
        orbisProfile?.username ||
        ccProfile?.displayName ||
        lensProfile?.displayName ||
        (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description || ccProfile?.bio || lensProfile?.bio || '',
    }
  } catch (error) {
    throw error
  }
}

const GET_PROFILE = gql`
  query getAddress($address: AddressEVM!) {
    address(address: $address) {
      address
      wallet {
        profiles {
          edges {
            node {
              id
              handle
              metadata
              metadataInfo {
                displayName
                bio
                avatar
              }
            }
          }
        }
      }
    }
  }
`
const LENS_PROFILE = gql`
  query DefaultProfile($ethereumAddress: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $ethereumAddress }) {
      id
      bio
      handle
      picture {
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
    }
  }
`

export const getCCProfile = async (did: string): Promise<DisplayProfile | null> => {
  const ccClient = getCyberApolloClient()
  const { data: ccProfiles } = await ccClient.query({
    query: GET_PROFILE,
    variables: { address: getAddressFromPkhForWagmi(did) },
  })
  const edges = ccProfiles?.address?.wallet?.profiles?.edges
  if (!edges) return null
  if (edges?.length == 0) return null
  const profile = edges[0]?.node
  const avatarUrl = profile?.metadataInfo?.avatar as string | undefined
  const avatar =
    avatarUrl && avatarUrl?.startsWith('ipfs://')
      ? avatarUrl?.replace('ipfs://', 'https://ipfs.cyberconnect.dev/ipfs/')
      : avatarUrl
  return {
    displayName: profile?.handle || '',
    bio: profile?.metadataInfo?.bio || '',
    avatarSrc: avatar || undefined,
  }
}

export const getLensProfile = async (did: string): Promise<DisplayProfile | null> => {
  const lensClient = getlensApolloClient()
  const { data: lensProfileData } = await lensClient.query({
    query: LENS_PROFILE,
    variables: { ethereumAddress: getAddressFromPkhForWagmi(did) },
  })
  const profile = lensProfileData?.defaultProfile
  if (!profile) return null
  const avatarUrl = profile?.picture?.original?.url as string | undefined
  const avatar =
    avatarUrl && avatarUrl?.startsWith('ipfs://')
      ? avatarUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : null
  return {
    displayName: profile?.handle || '',
    bio: profile?.bio || '',
    avatarSrc: avatar || undefined,
  }
}
