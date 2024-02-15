import { useVerifiableCredentials } from './useVerifiableCredentials'

export const useCertifications = (did?: string) => {
  const { certificates, isInitialLoading } = useVerifiableCredentials(did)

  return {
    heldCertificationSubjects: certificates,
    isInitialLoading,
  }
}
