import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { BusinessProfile, CustomResponse } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'

export const useBusinessProfile = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()

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

  return {
    businessProfile,
    isFetchingBusinessProfile,
    storeBusinessProfile,
    isStoringBusinessProfile,
  }
}
