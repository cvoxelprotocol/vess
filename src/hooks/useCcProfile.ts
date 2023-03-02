import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
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

export const useCcProfile = (did?: string) => {
  const { loading: ccLoading, data: ccProfiles } = useQuery(GET_PROFILE, {
    variables: { address: getAddressFromPkhForWagmi(did) },
    context: { clientName: 'cyberconnect' },
  })

  const ccProfile = useMemo<DisplayProfile | null>(() => {
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
  }, [ccProfiles])

  return {
    ccProfile,
    ccLoading,
  }
}
