import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { addCeramicPrefix, getVESS, removeCeramicPrefix } from 'vess-sdk'
import type { MembershipSubjectWithOrg } from 'vess-sdk'
import { useHighlightedCredentials } from './useHighlightedCredentials'
import { useSelfClaimedMembership } from './useSelfClaimedMembership'
import { CERAMIC_NETWORK } from '@/constants/common'

export const useHeldMembershipSubject = (did?: string) => {
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { highlightedCredentials } = useHighlightedCredentials(did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(did)

  const { data: HeldMembershipSubjects, isInitialLoading: isFetchingHeldMembershipSubjects } =
    useQuery<MembershipSubjectWithOrg[] | null>(
      ['HeldMembershipSubjects', did],
      () => vess.getHeldMembershipSubjects(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 300000,
      },
    )

  const { mutateAsync: setHeldMembershipSubjects } = useMutation<void, unknown, string[]>(
    (param) => vess.setHeldMembershipSubjects(param),
    {
      onSuccess() {
        console.log('MembershipSubjects migration succeeded')
      },
      onError(error) {
        console.error('error', error)
      },
      onSettled: () => {
        queryClient.invalidateQueries(['HeldMembershipSubjects', did])
      },
    },
  )

  const highlightedMembership = useMemo(() => {
    if (!HeldMembershipSubjects) return undefined
    if (
      highlightedCredentials &&
      highlightedCredentials.memberships &&
      highlightedCredentials.memberships.length > 0
    ) {
      const target = highlightedCredentials.memberships[0]
      return HeldMembershipSubjects?.find(
        (m) => removeCeramicPrefix(m.ceramicId) === removeCeramicPrefix(target),
      )
    }
    return HeldMembershipSubjects[0] || undefined
  }, [HeldMembershipSubjects, highlightedCredentials, highlightedCredentials?.memberships])

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
  }, [selfClaimedMemberships, highlightedCredentials, highlightedCredentials?.memberships])

  // set held data from DB
  const issueHeldMembershipFromBackup = async (targetDid: string): Promise<void> => {
    console.log('membership issuing from DB: check')
    const heldMembership = await vess.getHeldMembershipSubjects(targetDid)
    const membershipFromDB = await vess.getHeldMembershipSubjectsFromBackup(targetDid)

    if (membershipFromDB.length === 0) return
    const existedSubjects = heldMembership?.map((s) => removeCeramicPrefix(s.ceramicId))
    const targetIds = membershipFromDB
      ?.map((m) => removeCeramicPrefix(m.ceramicId))
      .filter((id) => !existedSubjects?.includes(id))
    if (targetIds && targetIds.length > 0) {
      console.log('membership issuing from DB: execute', targetIds)
      await setHeldMembershipSubjects(targetIds.map((id) => addCeramicPrefix(id)))
    }
  }

  return {
    HeldMembershipSubjects,
    isFetchingHeldMembershipSubjects,
    issueHeldMembershipFromBackup,
    highlightedMembership,
    highlightedSelfClaimedMembership,
  }
}
