import { useQuery } from '@tanstack/react-query'
import { CredentialResponse, getCredential } from '@/lib/vessDiwApi'

export const useOIDCredential = (id?: string) => {
  const { data: oidCredential, isInitialLoading } = useQuery<CredentialResponse | null>(
    ['oidCredential', id],
    () => getCredential(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  return {
    oidCredential,
    isInitialLoading,
  }
}
