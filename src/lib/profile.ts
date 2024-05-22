import { gql } from '@apollo/client'
import { initializeApollo } from './apollo'
import { DisplayProfile } from '@/@types'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

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
  const ccClient = initializeApollo()
  const { data: ccProfiles } = await ccClient.query({
    context: {
      api: 'cc',
    },
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
  const lensClient = initializeApollo()
  const { data: lensProfileData } = await lensClient.query({
    context: {
      api: 'lens',
    },
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
