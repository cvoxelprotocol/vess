import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ConnectionListContainer } from '@/components/templates/Connection/ConnectionListContainer'
import { GetAllConnectionsQuery } from '@/graphql/generated'
import { getConnectionForServerUse } from '@/lib/connection'

const queryClient = new QueryClient()

export type Props = {
  allConnections: GetAllConnectionsQuery | null
  DehydratedState?: DehydratedState
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const allConnections = await getConnectionForServerUse()
    return {
      props: {
        allConnections,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        allConnections: null,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 10,
    }
  }
}

const ConnectionList: NextPage<Props> = (props: Props) => {
  return (
    <>
      <Meta
        pageTitle={`Timeline on VESS`}
        pageDescription={`Let's find new connections!`}
        pagePath={`https://app.vess.id/ceconnection/list/`}
      />
      <ConnectionListContainer {...props} />
    </>
  )
}

export default ConnectionList
