import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { CredentialResponse } from '@/@types/credential'
import { getCredential } from '@/lib/vessApi'

export const useVerifiableCredential = (id?: string) => {
  const { data: verifiableCredential, isInitialLoading } = useQuery<CredentialResponse | null>(
    ['verifiableCredential', id],
    () => fetchCredential(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchCredential = async (id?: string): Promise<CredentialResponse | null> => {
    if (!id) return null
    const res = await getCredential(id)
    return (await res.json()) as CredentialResponse
  }

  const credential = useMemo(() => {
    if (!verifiableCredential) return null
    const vc = JSON.parse(verifiableCredential.data.plainCredential)
    return {
      ...verifiableCredential.data,
      vc: vc,
    }
  }, [verifiableCredential])

  return {
    credential,
    isInitialLoading,
  }
}
