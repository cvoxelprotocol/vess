import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryClient } from 'wagmi'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { getCurrentDomain } from '@/utils/url'

export type RegisterParam = {
  id: string
  did: string
}

export const useNfc = (id?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const getDidFromNFC = async (id?: string): Promise<any> => {
    try {
      let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}`
      const res = await fetch(url)
      console.log({ res })
      const resJson = await res.json()
      return resJson?.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const registerDid = async (param: RegisterParam): Promise<void> => {
    try {
      const { id, did } = param
      let url = `${getCurrentDomain() || 'http://localhost:3000'}/api/nfc?id=${id}&did=${did}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log({ url })
      console.log({ res })
      return await res.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const { data, isLoading } = useQuery<any>(['getDidFromNFC', id], () => getDidFromNFC(id), {
    enabled: !!id && id !== '',
    staleTime: Infinity,
    cacheTime: 300000,
  })
  const { mutateAsync: register } = useMutation<void, unknown, RegisterParam>(
    (param) => registerDid(param),
    {
      onMutate() {
        showLoading()
      },
      onSuccess() {
        closeLoading()
        showToast('Created')
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
    isLoading,
    register,
  }
}
