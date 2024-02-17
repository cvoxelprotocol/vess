import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
import type { CustomResponse, TaskCredential, WithCeramicId } from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { isProd } from '@/constants/common'
import {
  SELF_CLAIMED_TASK_CREATION_FAILED,
  SELF_CLAIMED_TASK_CREATION_SUCCEED,
} from '@/constants/toastMessage'

export const useHeldTaskCredentials = (did?: string) => {
  const vess = getVESS(!isProd())
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()

  const { data: heldTaskCredentials, isInitialLoading: isFetchingHeldTaskCredentials } = useQuery<
    WithCeramicId<TaskCredential>[] | null
  >(['heldTaskCredentials', did], () => vess.getHeldTaskCredentials(did), {
    enabled: !!did && did !== '',
    staleTime: Infinity,
    cacheTime: 300000,
  })

  const { mutateAsync: createTask } = useMutation<
    CustomResponse<{ streamId: string | undefined }>,
    unknown,
    TaskCredential
  >((param) => vess.createTask(param), {
    onMutate() {
      showLoading()
    },
    onSuccess(data) {
      if (data.streamId) {
        closeLoading()
        showToast(SELF_CLAIMED_TASK_CREATION_SUCCEED)
      } else {
        closeLoading()
        showToast(SELF_CLAIMED_TASK_CREATION_FAILED)
        console.error(data.result)
      }
    },
    onError(error) {
      console.error('error', error)
      closeLoading()
      showToast(SELF_CLAIMED_TASK_CREATION_FAILED)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['heldTaskCredentials', did])
    },
  })

  return {
    heldTaskCredentials,
    createTask,
    isFetchingHeldTaskCredentials,
  }
}
