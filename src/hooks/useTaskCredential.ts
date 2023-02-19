import { useQuery } from '@tanstack/react-query'
import type { TaskCredential, WithCeramicId } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'

export const useTaskCredential = (streamId?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')

  const { data: taskDetail, isInitialLoading: isLoadingTaskDetail } =
    useQuery<WithCeramicId<TaskCredential> | null>(
      ['taskCredential', streamId],
      () => vess.getTaskCredential(streamId),
      {
        enabled: !!streamId,
        staleTime: Infinity,
        cacheTime: 300000,
      },
    )

  return {
    taskDetail,
    isLoadingTaskDetail,
  }
}
