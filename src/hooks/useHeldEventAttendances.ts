import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getVESS } from 'vess-sdk'
import { useVerifiableCredentials } from './useVerifiableCredentials'
import { CERAMIC_NETWORK } from '@/constants/common'
import { isExpired } from '@/utils/date'

export const useHeldEventAttendances = (did?: string) => {
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { attendances, isInitialLoading } = useVerifiableCredentials(did)

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

  const displayHeldEventAttendancesFromDB = useMemo(() => {
    if (!attendances || attendances.length === 0) return []
    const onlyValids = attendances.filter((a) => !isExpired(a.expirationDate))
    const uniques = [
      ...new Map<string, typeof onlyValids[number]>(onlyValids.map((a) => [a.id, a])).values(),
    ]
    return uniques
  }, [attendances])

  return {
    displayHeldEventAttendances: displayHeldEventAttendancesFromDB,
    isFetchingHeldEventAttendances: isInitialLoading,
    setHeldEventAttendancesSilently,
  }
}
