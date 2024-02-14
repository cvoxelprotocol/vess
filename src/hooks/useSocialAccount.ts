import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDID } from 'vess-kit-web'
import { useENS } from './useENS'
import { DisplayProfile } from '@/@types'
import { fetchProfile } from '@/lib/profile'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

export const useSocialAccount = (did?: string) => {
  const { ensProfile, isInitialLoading: ensLoading } = useENS(getAddressFromPkhForWagmi(did))

  const { data: onChainProfile, isInitialLoading } = useQuery<DisplayProfile | null>(
    ['onChainProfile', did],
    () => fetchProfile(did || ''),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 1000000,
    },
  )

  const placeHolderProfile = useMemo<DisplayProfile>(() => {
    return {
      avatarSrc: undefined,
      displayName: !!did ? formatDID(did, 12) : '',
      bio: '',
    }
  }, [did])

  const isloadingProfile = useMemo(() => {
    return isInitialLoading || ensLoading
  }, [isInitialLoading, ensLoading])

  const profile = useMemo<DisplayProfile>(() => {
    if (isloadingProfile) return placeHolderProfile
    return {
      avatarSrc: onChainProfile?.avatarSrc || ensProfile?.avatarSrc || undefined,
      displayName:
        onChainProfile?.displayName || ensProfile?.displayName || (!!did ? formatDID(did, 12) : ''),
      bio: onChainProfile?.bio || '',
    }
  }, [ensProfile, onChainProfile, isloadingProfile, placeHolderProfile, did])

  return {
    profile,
    ensProfile,
    isloadingProfile,
  }
}
