import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, useEffect, useMemo } from 'react'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { ConnectionCard } from '@/components/molecure/Connection/ConnectionCard'
import { useGetIssuedConnectionsLazyQuery } from '@/graphql/generated'

type ConnectionPros = {
  __typename?: 'Connection'
  id: string
  userId: string
  invitationId: any
  connectAt?: any | null
  invitaion?: {
    __typename?: 'ConnectionInvitation'
    id: string
    type?: string | null
    status?: string | null
    greeting: string
    location?: string | null
    eventId?: string | null
  } | null
}

type DisplayPros = {
  node?: ConnectionPros | null
  count: number
}

type Props = {
  did: string
}

export const ConnectionTabContent: FC<Props> = ({ did }) => {
  const [getIssuedConnections, { data: connections, loading }] = useGetIssuedConnectionsLazyQuery({
    variables: { id: did },
    nextFetchPolicy: 'network-only',
  })
  const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
  `
  const MembersContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    justify-content: start;
    text-align: center;
    @media (max-width: 1079px) {
      grid-template-columns: repeat(auto-fit, 216px);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(auto-fit, 1fr);
      grid-gap: 8px;
    }
  `
  const Content = styled(Link)`
    grid-template-columns: repeat(auto-fill, 1fr);
    text-decoration: none;
  `
  const LoadingContainer = styled.div`
    grid-column: 1/3;
    width: 100%;
    height: 100%;
  `

  const init = async () => {
    try {
      if (did) {
        await getIssuedConnections()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const formattedConnections = useMemo(() => {
    if (!connections) return []
    const tempList: DisplayPros[] | undefined =
      connections.node?.__typename === 'CeramicAccount'
        ? connections.node?.connectionList?.edges?.map((edge) => {
            return { node: edge?.node, count: 0 } as DisplayPros
          })
        : []
    if (!tempList || tempList.length === 0) return []
    const userList: string[] = []
    const formattedList = tempList.reduce((acc: DisplayPros[], obj: DisplayPros) => {
      obj.count = 1
      let key = obj.node?.userId
      if (!key) {
        acc.push(obj)
      } else {
        if (userList.includes(key)) {
          const index = acc.findIndex((v) => v.node?.userId === key)
          acc[index].count += 1
        } else {
          acc.push(obj)
          userList.push(key)
        }
      }

      return acc
    }, [])
    return formattedList
  }, [connections])

  return (
    <Wrapper>
      {loading ? (
        <LoadingContainer>
          {' '}
          <CommonSpinner />
        </LoadingContainer>
      ) : (
        <MembersContainer>
          {!formattedConnections || formattedConnections.length === 0 ? (
            <NoItem text={'No Item yet'} />
          ) : (
            <>
              {formattedConnections &&
                formattedConnections.map((connection) => {
                  return (
                    <Content key={connection?.node?.id} href={`/did/${connection?.node?.userId}`}>
                      <ConnectionCard
                        userId={connection?.node?.userId}
                        invitation={connection?.node?.invitaion}
                        connectAt={connection?.node?.connectAt}
                        count={connection.count}
                      />
                    </Content>
                  )
                })}
            </>
          )}
        </MembersContainer>
      )}
    </Wrapper>
  )
}
