import { ReactElement } from 'react'
import { NextPageWithLayout } from '../../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ConnectionIssuedContainer } from '@/components/templates/Connection/ConnectionIssuedContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const ConnectionIssued: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <ConnectionIssuedContainer />
}
ConnectionIssued.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionIssued
