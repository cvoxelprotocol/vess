import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useVESSAuthUser } from './useVESSAuthUser'
import { useVESSLoading } from './useVESSLoading'
import { CredentialResponse, SetVisibleRequest } from '@/@types/credential'
import { getCredential, setVisibleVerifiableCredential } from '@/lib/vessApi'

export const useVerifiableCredential = (id?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()
  const { did } = useVESSAuthUser()

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
    console.log('🍅', vc)
    if (verifiableCredential.data?.credentialType?.name === 'attendance') {
      title = vc.credentialSubject.eventName
      image = vc.credentialSubject.eventIcon
    } else if (verifiableCredential.data?.credentialType?.name === 'membership') {
      title = vc.credentialSubject.membershipName
      image = vc.credentialSubject.membershipIcon
    } else if (verifiableCredential.data?.credentialType?.name === 'certificate') {
      title = vc.credentialSubject.certificationName
      image = vc.credentialSubject.image
    } else if (verifiableCredential.data?.credentialType?.name === 'openbadge') {
      title = vc.name || vc.credentialSubject.title
      image = vc.credentialSubject.image || vc.credentialSubject.icon
    } else {
      title = vc.credentialSubject.name || vc.credentialSubject.title
      image = vc.credentialSubject.image || vc.credentialSubject.icon
    }
    return {
      ...verifiableCredential.data,
      vc: vc,
      title,
      image,
    }
  }, [verifiableCredential])

  const holder = useMemo(() => {
    if (!verifiableCredential) return null
    return verifiableCredential.data.holder
  }, [verifiableCredential])

  const { mutateAsync: setVisible, isLoading: isLoadingSetVisible } = useMutation<
    Response,
    unknown,
    SetVisibleRequest
  >((param) => setVisibleVerifiableCredential(param), {
    onMutate: async (v) => {
      if (verifiableCredential?.data) {
        await queryClient.cancelQueries(['verifiableCredential', v.credentialId])
        const optimistic: CredentialResponse = {
          data: {
            ...verifiableCredential.data,
            hideFromPublic: v.hideFromPublic,
          },
        }
        queryClient.setQueryData(['verifiableCredential', v.credentialId], () => optimistic)
      }

      showLoading()
    },
    onSuccess(d, v, _) {
      queryClient.invalidateQueries(['verifiableCredential', v.credentialId])
      queryClient.invalidateQueries(['CredentialsByHolder', did])
      closeLoading()
    },
    onError(error) {
      console.error('error', error)
      closeLoading()
    },
  })

  return {
    credential,
    holder,
    isInitialLoading,
    setVisible,
    isLoadingSetVisible,
  }
}
