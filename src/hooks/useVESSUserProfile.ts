import { useQuery } from '@tanstack/react-query'
import { VSUser } from '@/@types/credential'
import { getVESSUserByDid } from '@/lib/vessApi'

export const useVESSUserProfile = (did?: string) => {
  const { data: vsUser, isInitialLoading } = useQuery<VSUser | null>(
    ['vsUser', did],
    () => getVESSUserByDid(did || ''),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  return {
    vsUser,
    isInitialLoading,
  }
}
