import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { addCeramicPrefix, getVESS, removeCeramicPrefix } from 'vess-sdk'
import type { EventAttendanceWithId } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'
import { isExpired } from '@/utils/date'

export const useHeldEventAttendances = (did?: string) => {
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()

  const { mutateAsync: setHeldEventAttendancesSilently, isLoading } = useMutation<
    void,
    unknown,
    string[]
  >((param) => vess.setHeldEventAttendanceVerifiableCredentials(param), {
    onSuccess() {
      console.log('heldEvent migration succeeded')
    },
    onError(error) {
      console.error('error', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['HeldEventAttendances'])
    },
  })

  // const { data: HeldEventAttendances, isInitialLoading: isFetchingHeldEventAttendances } = useQuery<
  //   EventAttendanceWithId[] | null
  // >(['HeldEventAttendances', did], () => vess.getHeldEventAttendanceVerifiableCredentials(did), {
  //   enabled: !!did && did !== '',
  //   staleTime: Infinity,
  //   cacheTime: 300000,
  // })

  // const displayHeldEventAttendances = useMemo(() => {
  //   if (!HeldEventAttendances || HeldEventAttendances.length === 0) return []
  //   const onlyValids = HeldEventAttendances.filter((a) => !isExpired(a.expirationDate))
  //   const uniques = [
  //     ...new Map<string, typeof onlyValids[number]>(onlyValids.map((a) => [a.id, a])).values(),
  //   ]
  //   return uniques
  // }, [HeldEventAttendances])

  const {
    data: HeldEventAttendancesFromDB,
    isInitialLoading: isFetchingHeldEventAttendancesFromDB,
  } = useQuery<EventAttendanceWithId[] | null>(
    ['HeldEventAttendances', did],
    () => vess.getHeldEventAttendanceVerifiableCredentialsFromBackup(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const displayHeldEventAttendancesFromDB = useMemo(() => {
    if (!HeldEventAttendancesFromDB || HeldEventAttendancesFromDB.length === 0) return []
    const onlyValids = HeldEventAttendancesFromDB.filter((a) => !isExpired(a.expirationDate))
    const uniques = [
      ...new Map<string, typeof onlyValids[number]>(onlyValids.map((a) => [a.id, a])).values(),
    ]
    return uniques
  }, [HeldEventAttendancesFromDB])

  const issueHeldEventFromBackup = async (did: string): Promise<void> => {
    console.log('event issuing from DB: check')
    const heldEvent = await vess.getHeldEventAttendanceVerifiableCredentials(did)
    const eventFromDB = await vess.getHeldEventAttendanceVerifiableCredentialsFromBackup(did)

    if (eventFromDB.length === 0) return
    const existedSubjects = heldEvent?.map((s) => removeCeramicPrefix(s.ceramicId))
    const targetIds = eventFromDB
      ?.map((m) => removeCeramicPrefix(m.ceramicId))
      .filter((id) => !existedSubjects?.includes(id))
    if (targetIds && targetIds.length > 0) {
      if (isLoading) return
      console.log('event issuing from DB: execute', targetIds)
      await setHeldEventAttendancesSilently(targetIds.map((id) => addCeramicPrefix(id)))
    }
  }

  return {
    displayHeldEventAttendances: displayHeldEventAttendancesFromDB,
    isFetchingHeldEventAttendances: isFetchingHeldEventAttendancesFromDB,
    setHeldEventAttendancesSilently,
    issueHeldEventFromBackup,
  }
}
