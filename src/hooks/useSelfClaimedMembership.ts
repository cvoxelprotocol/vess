import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
import type { CustomResponse, WithCeramicId, SelfClaimedMembershipSubject } from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { isProd } from '@/constants/common'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'

export const useSelfClaimedMembership = (did?: string) => {
  const vess = getVESS(!isProd())
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()

  const { data: selfClaimedMemberships, isInitialLoading: isFetchingSelfClaimedMembership } =
    useQuery<WithCeramicId<SelfClaimedMembershipSubject>[]>(
      ['selfClaimedMembershipSubject', did],
      () => vess.getHeldSelfClaimedMembershipSubjects(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 300000,
      },
    )

  const { mutateAsync: storeSelfClaimedMembership } = useMutation<
    CustomResponse<{ streamId: string | undefined }>,
    unknown,
    SelfClaimedMembershipSubject
  >((param) => vess.createSelfClaimedMembershipSubject(param), {
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
      queryClient.invalidateQueries(['selfClaimedMembershipSubject', did])
    },
  })

  return {
    storeSelfClaimedMembership,
    selfClaimedMemberships,
    isFetchingSelfClaimedMembership,
  }
}
