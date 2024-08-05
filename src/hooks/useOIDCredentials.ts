import { useQuery } from '@tanstack/react-query'
import { CredentialListResponse, getCredentials } from '@/lib/vessDiwApi'

export const useOIDCredentials = (didjwk?: string) => {
  const { data: oidCredentials, isInitialLoading } = useQuery<CredentialListResponse>(
    ['oidCredentials', didjwk],
    () => getCredentials(didjwk),
    {
      enabled: !!didjwk && didjwk !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  return {
    oidCredentials,
    isInitialLoading,
  }
}
