import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getVESS, removeCeramicPrefix } from 'vess-sdk'
import { useHighlightedCredentials } from './useHighlightedCredentials'
import { useSelfClaimedMembership } from './useSelfClaimedMembership'
import { useVerifiableCredentials } from './useVerifiableCredentials'
import { BaseCredential, WithCeramicId } from '@/@types/credential'
import { CERAMIC_NETWORK } from '@/constants/common'

export const useHeldMembershipSubject = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { highlightedCredentials, isFetchingHighlightedCredentials } =
    useHighlightedCredentials(did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(did)
  const { memberships, isInitialLoading } = useVerifiableCredentials(did)

  const displayHeldMembership = useMemo(() => {
    if (!memberships || memberships.length === 0) return []
    let temp: { [key: string]: WithCeramicId<BaseCredential> } = {}
    memberships.forEach((m) => {
      if (!Object.keys(temp).includes(m.credentialSubject.organizationId!)) {
        temp[m.credentialSubject.organizationId!] = {
          ...m,
          roles: [m.credentialSubject.membershipName],
        }
      } else {
        if (
          !temp[m.credentialSubject.organizationId!].roles.includes(
            m.credentialSubject.membershipName,
          )
        ) {
          temp[m.credentialSubject.organizationId!].roles.push(m.credentialSubject.membershipName)
        }
      }
    })
    return Object.values(temp)
  }, [memberships])

  const { mutateAsync: setHeldMembershipSubjects, isLoading } = useMutation<
    void,
    unknown,
    string[]
  >((param) => vess.setHeldMembershipSubjects(param), {
    onSuccess() {
      console.log('MembershipSubjects migration succeeded')
    },
    onError(error) {
      console.error('error', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['HeldMembershipSubjects', did])
    },
  })

  const deleteRole = async (streamId: string) => {
    try {
      await vess.deleteHeldMembershipSubjectsFromIDX(streamId)
      queryClient.invalidateQueries(['HeldMembershipSubjects', did])
    } catch (error) {
      console.log(error)
    }
  }

  const highlightedMembership = useMemo(() => {
    if (!displayHeldMembership) return undefined
    if (
      highlightedCredentials &&
      highlightedCredentials.memberships &&
      highlightedCredentials.memberships.length > 0
    ) {
      const target = highlightedCredentials.memberships[0]
      const targetItem = displayHeldMembership?.find(
        (m) => removeCeramicPrefix(m.ceramicId) === removeCeramicPrefix(target),
      )
      const targetOrgId = targetItem?.credentialSubject.organizationId
      return displayHeldMembership?.find(
        (m) =>
          removeCeramicPrefix(m.credentialSubject.organizationId) ===
          removeCeramicPrefix(targetOrgId),
      )
    }
    return displayHeldMembership[0] || undefined
  }, [highlightedCredentials, displayHeldMembership])

  const highlightedSelfClaimedMembership = useMemo(() => {
    if (!selfClaimedMemberships) return undefined
    if (
      highlightedCredentials &&
      highlightedCredentials.memberships &&
      highlightedCredentials.memberships.length > 0
    ) {
      const target = highlightedCredentials.memberships[0]
      return selfClaimedMemberships?.find(
        (m) => removeCeramicPrefix(m.ceramicId) === removeCeramicPrefix(target),
      )
    }
    return selfClaimedMemberships[0] || undefined
  }, [selfClaimedMemberships, highlightedCredentials])

  return {
    isFetchingHeldMembershipSubjects: isInitialLoading,
    highlightedMembership,
    highlightedSelfClaimedMembership,
    displayHeldMembership,
    deleteRole,
    isLoading: isFetchingHighlightedCredentials,
  }
}
