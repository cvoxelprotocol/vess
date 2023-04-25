import { useQuery } from '@tanstack/react-query'
import { fetchEnsName, fetchEnsAvatar } from '@wagmi/core'
import { DisplayProfile } from '@/@types'

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
    const ensName = fetchEnsName({
      address: address,
    })
    const avatarUrl = fetchEnsAvatar({
      address: address,
    })
    const res = await Promise.all([ensName, avatarUrl])
    return res[0]
      ? {
          displayName: res[0] || '',
          avatarSrc: res[1] || undefined,
          bio: '',
        }
      : null
  }

  return {
    ensProfile,
    isInitialLoading,
  }
}
