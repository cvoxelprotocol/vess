import { ReactElement } from 'react'
import { NextPageWithLayout } from '../../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { IssueConnectionContainer } from '@/components/templates/Connection/IssueConnectionContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const ConnectionIssue: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <IssueConnectionContainer />
}
ConnectionIssue.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionIssue
