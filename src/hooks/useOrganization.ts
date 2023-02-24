import { useQuery } from '@tanstack/react-query'
import type { OrganizationWIthId } from 'vess-sdk'
import { getVESS } from 'vess-sdk'

export const useOrganization = (orgId?: string) => {
  const vess = getVESS()

  const { data: organization } = useQuery<OrganizationWIthId | undefined>(
    ['organization', orgId],
    () => vess.getOrganization(orgId),
    {
      enabled: !!orgId,
      staleTime: Infinity,
      cacheTime: 300000,
      onError: (err) => {
        console.error(err)
      },
    },
  )

  return {
    organization,
  }
}
