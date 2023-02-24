import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { ConnectionListItem } from '@/components/molecure/Connection/ConnectionListItem'
import { useGetAllConnectionsLazyQuery } from '@/graphql/generated'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { parseISOStrToDate } from '@/utils/date'

export const ConnectionListContainer: FC = () => {
  const { currentTheme } = useVESSTheme()
  const router = useRouter()

  // === Invitation ===
  const [getAllConnections, { data: allConnections }] = useGetAllConnectionsLazyQuery()

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: ${currentTheme.surface3};
    height: 100%;
  `

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
    <Container>
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
    </Container>
  )
}
