import { useQuery } from '@tanstack/react-query'
import type { EventAttendanceWithId, EventWithId } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'
import { useDIDAccount } from '@/hooks/useDIDAccount'

export const useEventAttendance = (eventId?: string) => {
  const { did } = useDIDAccount()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')

  const {
    data: HeldEventAttendanceVerifiableCredentials,
    isInitialLoading: isFetchingHeldEventAttendanceVerifiableCredentials,
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

  return {
    HeldEventAttendanceVerifiableCredentials,
    isFetchingHeldEventAttendanceVerifiableCredentials,
    eventDetail,
    isLoadingEventDetail,
  }
}
