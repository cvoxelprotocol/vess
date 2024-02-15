import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { VSCredentialItemFromBuckup } from '@/@types/credential'
import { getCredentialItem } from '@/lib/vessApi'

export const useCredentialItem = (id?: string) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { showLoading, closeLoading } = useVESSLoading()

  const { data: credItem, isInitialLoading } = useQuery<VSCredentialItemFromBuckup | null>(
    ['credItem', id],
    () => fetchCredItem(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchCredItem = async (id?: string) => {
    if (!id) {
      return null
    }
    try {
      return await getCredentialItem(id)
    } catch (error) {
      throw error
    }
  }

  return {
    credItem,
    isInitialLoading,
  }
}
