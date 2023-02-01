import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDID } from 'vess-sdk'
import { DisplayProfile } from '@/@types'
import { getOrbisHelper, OrbisProfileDetail } from '@/lib/OrbisHelper'

export const useSocialAccount = (did?: string) => {
  const orbisHelper = getOrbisHelper()
  const { data: orbisProfile, isInitialLoading: isFetchingSocialAccount } =
    useQuery<OrbisProfileDetail | null>(
      ['fetchOrbisProfile', did],
      () => orbisHelper.fetchOrbisProfile(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 1000000,
      },
    )

  const profile = useMemo<DisplayProfile>(() => {
    return {
      avatarSrc: orbisProfile?.pfp,
      displayName: orbisProfile?.username || (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description ?? '',
    }
  }, [orbisProfile, did])

  return {
    profile,
    isFetchingSocialAccount,
  }
}
