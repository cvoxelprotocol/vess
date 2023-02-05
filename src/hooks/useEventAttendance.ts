import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { EventAttendanceWithId, EventWithId } from 'vess-sdk'
import { removeCeramicPrefix, getVESS } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'
import { useDIDAccount } from '@/hooks/useDIDAccount'

export const useEventAttendance = (eventId?: string) => {
  const { did } = useDIDAccount()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')

  const { data: IssuedEventAttendanceVerifiableCredentials, isInitialLoading } = useQuery<
    EventAttendanceWithId[] | null
  >(
    ['IssuedEventAttendanceVerifiableCredentials', did],
    () => vess.getIssuedEventAttendanceVerifiableCredentials(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const {
    data: HeldEventAttendanceVerifiableCredentials,
    isInitialLoading: isFetchingHeldMembershipSubjects,
  } = useQuery<EventAttendanceWithId[] | null>(
    ['HeldEventAttendanceVerifiableCredentials', did],
    () => vess.getHeldEventAttendanceVerifiableCredentials(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { data: eventDetail, isInitialLoading: isLoadingEventDetail } = useQuery<
    EventWithId | undefined
  >(['eventDetail', eventId], () => vess.getEvent(eventId), {
    enabled: !!eventId,
    staleTime: Infinity,
    cacheTime: 300000,
  })

  const IssuedEventAttendanceVCbyEvent = useMemo(() => {
    if (!IssuedEventAttendanceVerifiableCredentials) return []
    const id = removeCeramicPrefix(eventId)
    return IssuedEventAttendanceVerifiableCredentials.filter(
      (vc) => vc.credentialSubject.eventId === id,
    )
  }, [eventId, IssuedEventAttendanceVerifiableCredentials])

  return {
    IssuedEventAttendanceVerifiableCredentials,
    HeldEventAttendanceVerifiableCredentials,
    isFetchingHeldMembershipSubjects,
    eventDetail,
    isLoadingEventDetail,
    isInitialLoading,
    IssuedEventAttendanceVCbyEvent,
  }
}
