import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { BusinessProfile, CustomResponse } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { useDIDAccount } from './useDIDAccount'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'

export const useBusinessProfile = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const { did: myDid } = useDIDAccount()

  const { mutateAsync: storeBusinessProfile, isLoading: isStoringBusinessProfile } = useMutation<
    CustomResponse<{ streamId: string | undefined }>,
    unknown,
    BusinessProfile
  >((param) => vess.createBusinessProfile(param), {
    onMutate() {
      showLoading()
    },
    onSuccess(data) {
      if (data.streamId) {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_SUCCEED)
      } else {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_FAILED)
        console.error(data.result)
      }
    },
    onError(error) {
      console.error('error', error)
      closeLoading()
      showToast(BUSINESS_PROFILE_SET_FAILED)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['businessProfile', did])
    },
  })

  const { data: businessProfile, isInitialLoading: isFetchingBusinessProfile } =
    useQuery<BusinessProfile | null>(['businessProfile', did], () => vess.getBusinessProfile(did), {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
      retry: false,
    })

  const isMe = useMemo(() => {
    if (!did) return false
    return did.toLowerCase() === myDid?.toLowerCase()
  }, [did, myDid])

  return {
    businessProfile,
    isFetchingBusinessProfile,
    storeBusinessProfile,
    isStoringBusinessProfile,
    isMe,
  }
}
