import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { ReactElement } from 'react'
import { NextPageWithLayout } from '../../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ConnectionListContainer } from '@/components/templates/Connection/ConnectionListContainer'
import { GetAllConnectionsQuery } from '@/graphql/generated'
import { getConnectionForServerUse } from '@/lib/connection'

const queryClient = new QueryClient()

export type Props = {
  allConnections?: GetAllConnectionsQuery
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
        allConnections: undefined,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 10,
    }
  }
}

const ConnectionList: NextPageWithLayout<Props> = (props: Props) => {
  return <ConnectionListContainer {...props} />
}
ConnectionList.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionList
