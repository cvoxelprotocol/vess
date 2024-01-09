import { useQuery } from '@tanstack/react-query'
import type { Organization } from 'vess-kit-core'
import { removeCeramicPrefix } from 'vess-kit-web'
import { getVESS } from '@/lib/vess'

export type OrganizationWithBackendId = Organization & { orgId?: string }

export const useWorkspace = (orgCeramicId?: string) => {
  const vessKit = getVESS()

  const { data: workspace, isInitialLoading: isLoadingOrg } = useQuery<Organization | null>(
    ['workspace', orgCeramicId],
    () => getOrganization(orgCeramicId),
    {
      enabled: !!orgCeramicId && orgCeramicId !== '',
      staleTime: Infinity,
      cacheTime: 300000,
      retry: false,
    },
  )

  const getOrganization = async (orgCeramicId?: string) => {
    if (!orgCeramicId) return null
    try {
      return await vessKit.getOrganization(removeCeramicPrefix(orgCeramicId))
    } catch (error) {
      throw error
    }
  }

  return {
    isLoadingOrg,
    workspace,
  }
}
