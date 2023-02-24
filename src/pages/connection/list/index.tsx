import { ReactElement } from 'react'
import { NextPageWithLayout } from '../../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ConnectionListContainer } from '@/components/templates/Connection/ConnectionListContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const ConnectionList: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <ConnectionListContainer />
}
ConnectionList.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionList
