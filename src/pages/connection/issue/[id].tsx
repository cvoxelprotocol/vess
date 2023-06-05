import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { IssueConnectionContainer } from '@/components/templates/Connection/IssueConnectionContainer'

const ConnectionIssue: NextPage = () => {
  return (
    <>
      <Meta robots='noindex,follow' />
      <IssueConnectionContainer />
    </>
  )
}

export default ConnectionIssue
