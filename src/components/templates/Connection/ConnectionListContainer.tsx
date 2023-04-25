import { FC, useEffect, useMemo } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { ConnectionListItem } from '@/components/molecure/Connection/ConnectionListItem'
import { useGetAllConnectionsLazyQuery } from '@/graphql/generated'
import { parseISOStrToDate } from '@/utils/date'

export const ConnectionListContainer: FC = () => {
  // === Invitation ===
  const [getAllConnections, { data: allConnections, loading }] = useGetAllConnectionsLazyQuery()

  const init = async () => {
    try {
      await getAllConnections()
    } catch (error) {
      console.error({ error })
    }
  }

  useEffect(() => {
    init()
  }, [])

  const formattedList = useMemo(() => {
    if (!allConnections) return
    let map = new Map(allConnections.connectionIndex?.edges?.map((o) => [o?.node?.invitationId, o]))
    return Array.from(map.values()).sort((a, b) => {
      return parseISOStrToDate(a?.node?.connectAt || '') >
        parseISOStrToDate(b?.node?.connectAt || '')
        ? -1
        : 1
    })
  }, [allConnections])

  return (
    <Flex flexDirection='column' height='100%' width='100%'>
      {loading ? (
        <CommonSpinner />
      ) : (
        <>
          {' '}
          {formattedList &&
            formattedList.map((item) => {
              return (
                <ConnectionListItem
                  key={item?.node?.id}
                  userId={item?.node?.did.id}
                  partnerUserId={item?.node?.userId}
                  connectAt={item?.node?.connectAt}
                />
              )
            })}
        </>
      )}
    </Flex>
  )
}
