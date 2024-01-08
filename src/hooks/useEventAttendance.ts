import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { EventWithId } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { useDIDAccount } from './useDIDAccount'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import {
  EVENT_ATTENDANCE_CREATION_SUCCEED,
  EVENT_ATTENDANCE_CREATION_FAILED,
} from '@/constants/toastMessage'
import { issueAttendancesV2 } from '@/lib/backup'

export const useEventAttendance = (eventId?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const { showLoading, closeLoading } = useVESSLoading()
  const { did } = useDIDAccount()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data: eventDetail, isInitialLoading: isLoadingEventDetail } = useQuery<
    EventWithId | undefined
  >(['eventDetail', eventId], () => vess.getEvent(eventId), {
    enabled: !!eventId,
    staleTime: Infinity,
    cacheTime: 300000,
  })

  const issueAttendance = async (event: EventWithId, expirationDate?: Date): Promise<boolean> => {
    if (!did || !event.organizationId) {
      return false
    }
    const issuerAddress = ''
    showLoading()
    try {
      const dids = [did]
      const res = await issueAttendancesV2({
        holders: [did],
        content: {
          eventId: event.ceramicId,
          eventName: event.name,
          eventIcon: event.icon,
        },
        issuerAddress: issuerAddress,
        expirationDate: expirationDate ? expirationDate?.toISOString() : undefined,
      })
      console.log({ res })
      const resJson = await res.json()
      const vcs = resJson.data as any[]
      console.log({ vcs })
      queryClient.invalidateQueries(['CredentialsByHolder'])
      if (vcs && vcs.length > 0) {
        closeLoading()
        showToast(EVENT_ATTENDANCE_CREATION_SUCCEED)
        return true
      }
      closeLoading()
      showToast(EVENT_ATTENDANCE_CREATION_FAILED)
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      showToast(EVENT_ATTENDANCE_CREATION_FAILED)
      return false
    }
  }

  return {
    eventDetail,
    isLoadingEventDetail,
    issueAttendance,
  }
}
