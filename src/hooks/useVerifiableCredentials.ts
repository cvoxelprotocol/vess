import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { BaseCredential, CredentialsResponse, WithCredentialType } from '@/@types/credential'
import { getCredentials } from '@/lib/vessApi'
import { isExpired } from '@/utils/date'

export const useVerifiableCredentials = (did?: string) => {
  const { data: CredentialsByHolder, isInitialLoading } = useQuery<CredentialsResponse | null>(
    ['CredentialsByHolder', did],
    () => fetchCredential(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchCredential = async (did?: string): Promise<CredentialsResponse | null> => {
    if (!did) return null
    const res = await getCredentials(did)
    return (await res.json()) as CredentialsResponse
  }

  const formatedCredentials = useMemo<WithCredentialType<BaseCredential>[]>(() => {
    if (!CredentialsByHolder || CredentialsByHolder.data.length === 0) return []
    return CredentialsByHolder.data
      .map((item) => {
        const plainCredential = JSON.parse(item.plainCredential)
        return {
          ...plainCredential,
          credentialType: item.credentialType,
          credId: item.credentialItem?.id,
          hideFromPublic: item.hideFromPublic,
        }
      })
      .map((item) => {
        let title = ''
        let image = ''
        if (item.credentialType?.name === 'attendance') {
          title = item.credentialSubject.eventName
          image = item.credentialSubject.eventIcon
        } else if (item.credentialType?.name === 'membership') {
          title = item.credentialSubject.membershipName
          image = item.credentialSubject.membershipIcon
        } else if (item.credentialType?.name === 'certificate') {
          title = item.credentialSubject.certificationName
          image = item.credentialSubject.image
        } else if (item.credentialType?.name === 'openbadge') {
          title = item.credentialSubject.name || item.credentialSubject.title
          image = item.credentialSubject.image || item.credentialSubject.icon
        } else {
          title = item.name
          image = item.credentialSubject.image
        }
        return {
          ...item,
          title,
          image,
          sticker: (item.credentialSubject?.sticker as string[]) || [],
        }
      })
      .filter((item) => !item.expirationDate || !isExpired(item.expirationDate))
  }, [CredentialsByHolder])

  const publicCredentials = useMemo(() => {
    return formatedCredentials.filter((item) => !item.hideFromPublic)
  }, [formatedCredentials])

  const privateCredentials = useMemo(() => {
    return formatedCredentials.filter((item) => item.hideFromPublic)
  }, [formatedCredentials])

  return {
    isInitialLoading,
    formatedCredentials,
    publicCredentials,
    privateCredentials,
  }
}
