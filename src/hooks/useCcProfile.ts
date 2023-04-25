import { useQuery } from '@tanstack/react-query'
import { DisplayProfile } from '@/@types'
import { getCCProfile } from '@/lib/profile'

export const useCcProfile = (did?: string) => {
  const { data: ccProfile, isInitialLoading: ccLoading } = useQuery<DisplayProfile | null>(
    ['getCCProfile', did],
    () => getCCProfile(did || ''),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  return {
    ccProfile,
    ccLoading,
  }
}
