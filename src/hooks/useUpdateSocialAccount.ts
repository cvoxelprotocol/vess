import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDID } from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'
import { OrbisBaseResponse, UpdateOrbisProfileParam } from '@/lib/OrbisHelper'
import { updateOrbisProfile } from '@/lib/OrbisUpdateHelper'

export const useUpdateSocialAccount = (did?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { mutateAsync: update } = useMutation<OrbisBaseResponse, unknown, UpdateOrbisProfileParam>(
    (param) => updateOrbisProfile(param),
    {
      onMutate: async (variables) => {
        showLoading()
        // ootimistic mutation
        await queryClient.cancelQueries(['onChainProfile', did])
        const optimistic = {
          avatarSrc: variables.content?.pfp,
          displayName: variables.content.username || (!!did ? formatDID(did, 12) : ''),
          bio: variables.content.description || '',
        }
        queryClient.setQueryData(['onChainProfile', did], () => optimistic)
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
        const optimistic = {
          avatarSrc: v.content?.pfp,
          displayName: v.content.username || (!!did ? formatDID(did, 12) : ''),
          bio: v.content.description || '',
        }
        queryClient.setQueryData(['onChainProfile', did], () => optimistic)
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['onChainProfile', did])
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_FAILED)
      },
    },
  )

  return {
    update,
  }
}
