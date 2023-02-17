import { useQuery } from '@tanstack/react-query'
import type { EventWithId } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'

export const useEventAttendance = (eventId?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')

  const { data: eventDetail, isInitialLoading: isLoadingEventDetail } = useQuery<
    EventWithId | undefined
  >(['eventDetail', eventId], () => vess.getEvent(eventId), {
    enabled: !!eventId,
    staleTime: Infinity,
    cacheTime: 300000,
  })

  return {
    eventDetail,
    isLoadingEventDetail,
  }
}
