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
    let title = ''
    let image = ''
    if (verifiableCredential.data?.credentialType?.name === 'attendance') {
      title = vc.credentialSubject.eventName
      image = vc.credentialSubject.eventIcon
    } else if (verifiableCredential.data?.credentialType?.name === 'membership') {
      title = vc.credentialSubject.membershipName
      image = vc.credentialSubject.membershipIcon
    } else if (verifiableCredential.data?.credentialType?.name === 'certificate') {
      title = vc.credentialSubject.certificationName
      image = vc.credentialSubject.image
    } else {
      title = vc.credentialSubject.name || vc.credentialSubject.title
      image = vc.credentialSubject.image || vc.credentialSubject.icon
    }
    return {
      ...verifiableCredential.data,
      title,
      image,
      vc: vc,
    }
  }, [verifiableCredential])

  return {
    credential,
    isInitialLoading,
  }
}
