import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useVESSLoading } from './useVESSLoading'
import {
  CredentialResponse,
  DeleteCredentailResponse,
  deleteCredential,
  getCredential,
} from '@/lib/vessDiwApi'

export const useOIDCredential = (id?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()

  const { data: oidCredential, isInitialLoading } = useQuery<CredentialResponse | null>(
    ['oidCredential', id],
    () => getCredential(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { mutateAsync: deleteItem } = useMutation<DeleteCredentailResponse, unknown, string>(
    (id) => deleteCredential(id),
    {
      onMutate: async () => {
        showLoading()
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(['oidCredential', id])
        queryClient.invalidateQueries(['oidCredentials'])
        closeLoading()
      },
      onError(error, v) {
        console.error('error', error)
        closeLoading()
      },
    },
  )

  return {
    oidCredential,
    isInitialLoading,
    deleteItem,
  }
}
