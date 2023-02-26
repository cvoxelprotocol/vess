import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDID } from 'vess-sdk'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { useCcProfile } from './useCcProfile'
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
  const { data: ensAvatar } = useEnsAvatar({ address: getAddressFromPkhForWagmi(did) })
  const { data: ensName } = useEnsName({ address: getAddressFromPkhForWagmi(did) })
  const { ccProfile } = useCcProfile(did)

  const { data: orbisProfile, isInitialLoading: isFetchingSocialAccount } =
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

  const profile = useMemo<DisplayProfile>(() => {
    return {
      avatarSrc: orbisProfile?.pfp || ensAvatar || ccProfile?.avatar || undefined,
      displayName:
        orbisProfile?.username || ensName || ccProfile?.handle || (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description || ccProfile?.metadataInfo?.bio || '',
    }
  }, [orbisProfile, did, ensAvatar, ensName, ccProfile])

  return {
    profile,
    isFetchingSocialAccount,
    updateOrbisProfile,
    orbisProfile,
  }
}
