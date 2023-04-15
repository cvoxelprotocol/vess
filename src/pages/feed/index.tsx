import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { FeedContainer } from '@/components/templates/Feed/FeedContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const ConnectionList: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <FeedContainer />
}
ConnectionList.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionList
