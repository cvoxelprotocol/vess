import { useQuery } from '@tanstack/react-query'
import { DisplayProfile } from '@/@types'
import { getLensProfile } from '@/lib/profile'

export const useLensProfile = (did?: string) => {
  const { data: lensProfile, isInitialLoading: lensLoading } = useQuery<DisplayProfile | null>(
    ['getLensProfile', did],
    () => getLensProfile(did || ''),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  return {
    lensProfile,
    lensLoading,
  }
}
