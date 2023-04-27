import { FC, useEffect, useMemo } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { ConnectionListItem } from '@/components/molecure/Connection/ConnectionListItem'
import { GetAllConnectionsQuery, useGetAllConnectionsLazyQuery } from '@/graphql/generated'
import { parseISOStrToDate } from '@/utils/date'

type Props = {
  allConnections?: GetAllConnectionsQuery
}

export const ConnectionListContainer: FC<Props> = ({ allConnections }) => {
  // === Invitation ===
  const [getAllConnections, { data: newAllConnections }] = useGetAllConnectionsLazyQuery()

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
    if (newAllConnections) {
      let map = new Map(
        newAllConnections.connectionIndex?.edges?.map((o) => [o?.node?.invitationId, o]),
      )
      return Array.from(map.values()).sort((a, b) => {
        return parseISOStrToDate(a?.node?.connectAt || '') >
          parseISOStrToDate(b?.node?.connectAt || '')
          ? -1
          : 1
      })
    } else if (allConnections) {
      let map = new Map(
        allConnections.connectionIndex?.edges?.map((o) => [o?.node?.invitationId, o]),
      )
      return Array.from(map.values()).sort((a, b) => {
        return parseISOStrToDate(a?.node?.connectAt || '') >
          parseISOStrToDate(b?.node?.connectAt || '')
          ? -1
          : 1
      })
    }
    return []
  }, [allConnections, newAllConnections])

  return (
    <Flex flexDirection='column' height='100%' width='100%'>
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
    </Flex>
  )
}
