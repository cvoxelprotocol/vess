import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getVESS } from 'vess-sdk'
import type { WithCeramicId, CertificationVerifiableCredential } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'
// import { CertVCWithSBT } from '@/interfaces/sbt'
// import { fetchCertifications } from '@/lib/sbt'

// TODO: remove this
const TEMP_ISSUER_DID = 'did:pkh:eip155:1:0xbe2896057d7abfe53da4bbc3fce3e0f2f715232b'
// const TEMP_ISSUER_DID = 'did:pkh:eip155:1:0xf21a23948a0f84edf0589bb5535f4d0b4f71a089'

export const useCertificationSBT = (did?: string) => {
  // fetch from SBT
  // const { data: heldCertificationSubjects, isInitialLoading } = useQuery<CertVCWithSBT[] | null>(
  //   ['fetchCertifications', did],
  //   () => fetchCertifications(did),
  //   {
  //     enabled: !!did && did !== '',
  //     staleTime: Infinity,
  //     cacheTime: 300000,
  //   },
  // )

  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')

  const { data: issuedCertificationSubjects, isInitialLoading } = useQuery<
    WithCeramicId<CertificationVerifiableCredential>[] | null
  >(
    ['issuedCertificationSubjects', TEMP_ISSUER_DID],
    () => vess.getIssuedCertificationSubjects(TEMP_ISSUER_DID),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const heldCertificationSubjects: WithCeramicId<CertificationVerifiableCredential>[] =
    useMemo(() => {
      if (!issuedCertificationSubjects) return []
      return (
        issuedCertificationSubjects.filter((cert) => {
          const { credentialSubject, ...rest } = cert
          const { id } = credentialSubject
          return id.toLowerCase() === did?.toLowerCase()
        }) || []
      )
    }, [issuedCertificationSubjects, did])

  return {
    heldCertificationSubjects,
    isInitialLoading,
  }
}
