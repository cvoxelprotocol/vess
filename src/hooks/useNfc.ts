import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { NfcDidRecord } from '@/pages/api/nfc'
import { getCurrentDomain } from '@/utils/url'

export type RegisterParam = {
  id: string
  did: string
}

export const useNfc = (id?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const getDidFromNFC = async (id?: string): Promise<NfcDidRecord | undefined> => {
    try {
      if (!id) return undefined
      let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}`
      const res = await fetch(url)
      const resJson = await res.json()
      return resJson?.data as NfcDidRecord
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const registerDid = async (param: RegisterParam): Promise<string> => {
    try {
      const { id, did } = param
      let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}&did=${did}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resJson = await res.json()
      return resJson?.did
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const { data, isInitialLoading } = useQuery<NfcDidRecord | undefined>(
    ['getDidFromNFC', id],
    () => getDidFromNFC(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
      retry: 2,
      retryDelay: 3000,
    },
  )

  const { mutateAsync: register } = useMutation<string, unknown, RegisterParam>(
    (param) => registerDid(param),
    {
      onMutate() {
        showLoading()
      },
      onSuccess() {
        closeLoading()
        showToast('Setup successfully!')
        queryClient.invalidateQueries(['getDidFromNFC', id])
      },
      onError(error) {
        console.error('error', error)
        closeLoading()
        showToast('failed')
      },
      onSettled: () => {
        queryClient.invalidateQueries(['getDidFromNFC', id])
      },
    },
  )
  return {
    data,
    isLoading: isInitialLoading,
    register,
  }
}
