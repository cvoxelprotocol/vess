import { useQuery } from '@tanstack/react-query'
import { CertVCWithSBT } from '@/interfaces/sbt'
import { fetchCertifications } from '@/lib/sbt'

export const useCertificationSBT = (did?: string) => {
  // fetch from SBT
  const { data: heldCertificationSubjects, isInitialLoading } = useQuery<CertVCWithSBT[] | null>(
    ['fetchCertifications', did],
    () => fetchCertifications(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  return {
    heldCertificationSubjects,
    isInitialLoading,
  }
}
