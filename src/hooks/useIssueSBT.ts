import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
import { useDIDAccount } from './useDIDAccount'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'
import { mintSBT } from '@/lib/kms'
import {
  IssueAndMintToEventAttendanceWithSBTRequest,
  MintEventAttendanceResponse,
} from '@/pages/toppanpoap/[onetimeId]'

export const useIssueSBT = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const { did: myDid } = useDIDAccount()

  const { mutateAsync: mint, isLoading } = useMutation<
    MintEventAttendanceResponse | null,
    unknown,
    IssueAndMintToEventAttendanceWithSBTRequest
  >((param) => mintSBT(param), {
    onMutate() {
      showLoading()
    },
    onSuccess(data) {
      if (data?.tx) {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_SUCCEED)
      } else {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_FAILED)
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

  return {
    mint,
    isLoading,
  }
}
