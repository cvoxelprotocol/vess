import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
import type { CustomResponse, HighlightedCredentials } from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'

export const useHighlightedCredentials = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()

  const { data: highlightedCredentials, isInitialLoading: isFetchingHighlightedCredentials } =
    useQuery<HighlightedCredentials | null>(
      ['highlightedCredentials', did],
      () => vess.getHighlightedCredentials(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 300000,
      },
    )

  const { mutateAsync: storeHighlightedCredentials } = useMutation<
    CustomResponse<{ streamId: string | undefined }>,
    unknown,
    HighlightedCredentials
  >((param) => vess.storeHighlightedCredentials(param), {
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
      queryClient.invalidateQueries(['highlightedCredentials', did])
    },
  })

  return {
    highlightedCredentials,
    storeHighlightedCredentials,
    isFetchingHighlightedCredentials,
  }
}
