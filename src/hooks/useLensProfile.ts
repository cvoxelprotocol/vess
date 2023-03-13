import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { DisplayProfile } from '@/@types'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

const GET_PROFILE = gql`
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

export const useLensProfile = (did?: string) => {
  const { loading: lensLoading, data: lensProfileData } = useQuery(GET_PROFILE, {
    variables: { ethereumAddress: getAddressFromPkhForWagmi(did) },
    context: { clientName: 'lens' },
    pollInterval: 0,
  })

  const lensProfile = useMemo<DisplayProfile | null>(() => {
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
  }, [lensProfileData])

  return {
    lensProfile,
    lensLoading,
  }
}
