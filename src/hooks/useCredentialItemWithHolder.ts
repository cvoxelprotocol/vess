import { useQuery } from '@tanstack/react-query'
import { VSCredentialItemFromBuckup } from '@/@types/credential'
import { getCredentialItem } from '@/lib/vessApi'

export const useCredentialItemWithHolder = (id?: string) => {
  const { data: credItemWithHolder, isInitialLoading } =
    useQuery<VSCredentialItemFromBuckup | null>(
      ['credItemWithHolder', id],
      () => fetchCredItem(id, true),
      {
        enabled: !!id && id !== '',
        staleTime: Infinity,
        cacheTime: 300000,
      },
    )

  const fetchCredItem = async (id?: string, showHolder = false) => {
    if (!id) {
      return null
    }
    try {
      return await getCredentialItem(id, showHolder)
    } catch (error) {
      throw error
    }
  }

  return {
    isInitialLoading,
    credItemWithHolder,
  }
}
