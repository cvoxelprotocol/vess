import { useQuery } from '@tanstack/react-query'
import { VSUser } from '@/@types/credential'
import { getVESSUserByDid, getVESSUserById } from '@/lib/vessApi'

export const useVESSUserProfile = (did?: string, userId?: string) => {
  const { data: vsUser, isInitialLoading } = useQuery<VSUser | null>(
    ['vsUser', did],
    () => getVESSUserByDid(did || ''),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  const { data: vsUserById, isInitialLoading: isLoadingUserById } = useQuery<VSUser | null>(
    ['vsUser', userId],
    () => getVESSUserById(userId || ''),
    {
      enabled: !!userId && userId !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  return {
    vsUser,
    vsUserById,
    isInitialLoading,
    isLoadingUserById,
  }
}
