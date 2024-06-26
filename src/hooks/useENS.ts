import { useQuery } from '@tanstack/react-query'
import { getEnsAvatar, getEnsName } from '@wagmi/core'

import { DisplayProfile } from '@/@types'
import { config } from '@/lib/wagmi'

export const useENS = (address?: `0x${string}` | undefined) => {
  const { data: ensProfile, isInitialLoading } = useQuery(
    ['ensProfile', address],
    () => fetchENS(address),
    {
      enabled: !!address,
      staleTime: Infinity,
      cacheTime: 300000,
      retry: false,
    },
  )

  const fetchENS = async (address?: `0x${string}` | undefined): Promise<DisplayProfile | null> => {
    if (!address) return null
    try {
      const ensName = await getEnsName(config, {
        address: address,
      })
      const avatarUrl = getEnsAvatar(config, {
        name: ensName ? ensName : '',
      })
      const res = await Promise.all([ensName, avatarUrl])
      return res[0]
        ? {
            displayName: res[0] || '',
            avatarSrc: res[1] || undefined,
            bio: '',
          }
        : null
    } catch (error) {
      // console.error(error)
      return null
    }
  }

  return {
    ensProfile,
    isInitialLoading,
  }
}
