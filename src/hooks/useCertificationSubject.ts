import { useQuery } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
import type { WithCeramicId, CertVCWithParent } from 'vess-sdk'
import { isProd } from '@/constants/common'

export const useCertificationSubject = (id?: string) => {
  const vess = getVESS(!isProd())
  // fetch from SBT
  const { data: certification, isInitialLoading } = useQuery<
    WithCeramicId<CertVCWithParent> | undefined
  >(['fetchCertifications', id], () => vess.getCertificationSubject(id), {
    enabled: !!id && id !== '',
    staleTime: Infinity,
    cacheTime: 300000,
  })

  return {
    certification,
    isInitialLoading,
  }
}
