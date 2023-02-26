import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
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
                handle
                displayName
                bio
              }
              avatar
            }
          }
        }
      }
    }
  }
`

export const useCcProfile = (did?: string) => {
  const { loading, data: ccProfiles } = useQuery(GET_PROFILE, {
    variables: { address: getAddressFromPkhForWagmi(did) },
    context: { clientName: 'cyberconnect' },
  })

  const ccProfile = useMemo(() => {
    const edges = ccProfiles?.address?.wallet?.profiles?.edges
    if (!edges) return null
    if (edges?.length == 0) return null
    return edges[0]?.node
  }, [ccProfiles])

  return {
    ccProfile,
    loading,
  }
}
