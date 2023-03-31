import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDID } from 'vess-sdk'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { useCcProfile } from './useCcProfile'
import { useLensProfile } from './useLensProfile'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { DisplayProfile } from '@/@types'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'
import {
  getOrbisHelper,
  OrbisBaseResponse,
  OrbisProfileDetail,
  UpdateOrbisProfileParam,
} from '@/lib/OrbisHelper'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

export const useSocialAccount = (did?: string) => {
  const orbisHelper = getOrbisHelper()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { data: ensAvatar } = useEnsAvatar({
    address: getAddressFromPkhForWagmi(did),
  })
  const { data: ensName, isLoading: ensLoading } = useEnsName({
    address: getAddressFromPkhForWagmi(did),
  })
  const { ccProfile, ccLoading } = useCcProfile(did)
  const { lensProfile, lensLoading } = useLensProfile(did)

  const { data: orbisProfile, isInitialLoading: isOrbisLoading } =
    useQuery<OrbisProfileDetail | null>(
      ['orbisProfile', did],
      () => orbisHelper.fetchOrbisProfile(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 1000000,
      },
    )

  const { mutateAsync: updateOrbisProfile } = useMutation<
    OrbisBaseResponse,
    unknown,
    UpdateOrbisProfileParam
  >((param) => orbisHelper.updateOrbisProfile(param), {
    onMutate: async (variables) => {
      showLoading()
      // ootimistic mutation
      await queryClient.cancelQueries(['orbisProfile', did])
      const optimistic = { ...variables.content }
      queryClient.setQueryData(['orbisProfile', did], () => optimistic)
      return { optimistic }
    },
    onSuccess(data, v, _) {
      if (data.status === 200) {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_SUCCEED)
      } else {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_FAILED)
        console.error(data.result)
      }
      queryClient.setQueryData(['orbisProfile', did], () => v.content)
    },
    onError(error) {
      console.error('error', error)
      queryClient.invalidateQueries(['orbisProfile', did])
      closeLoading()
      showToast(BUSINESS_PROFILE_SET_FAILED)
    },
  })

  const ensProfile = useMemo<DisplayProfile | null>(() => {
    if (!ensName) return null
    return {
      avatarSrc: ensAvatar || undefined,
      displayName: ensName || (!!did ? formatDID(did, 12) : ''),
      bio: '',
    }
  }, [ensName, ensAvatar])

  const placeHolderProfile = useMemo<DisplayProfile>(() => {
    return {
      avatarSrc: undefined,
      displayName: !!did ? formatDID(did, 12) : '',
      bio: '',
    }
  }, [did])

  const isloadingProfile = useMemo(() => {
    return ccLoading || lensLoading || isOrbisLoading || ensLoading
  }, [ccLoading, lensLoading, isOrbisLoading, ensLoading])

  const profile = useMemo<DisplayProfile>(() => {
    if (isloadingProfile) return placeHolderProfile
    return {
      avatarSrc:
        orbisProfile?.pfp && orbisProfile?.pfp !== ''
          ? orbisProfile?.pfp
          : ccProfile?.avatarSrc || lensProfile?.avatarSrc || ensAvatar || undefined,
      displayName:
        orbisProfile?.username ||
        ccProfile?.displayName ||
        lensProfile?.displayName ||
        ensName ||
        (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description || ccProfile?.bio || lensProfile?.bio || '',
    }
  }, [
    orbisProfile,
    ensAvatar,
    ensName,
    ccProfile,
    lensProfile,
    isloadingProfile,
    placeHolderProfile,
    did,
  ])

  return {
    profile,
    updateOrbisProfile,
    orbisProfile,
    ccProfile,
    lensProfile,
    ensProfile,
    isloadingProfile,
  }
}
