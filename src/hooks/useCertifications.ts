import { useCredentials } from './useCredentials'

export const useCertifications = (did?: string) => {
  const { certificates, isInitialLoading } = useCredentials(did)

  return {
    heldCertificationSubjects: certificates,
    isInitialLoading,
  }
}
