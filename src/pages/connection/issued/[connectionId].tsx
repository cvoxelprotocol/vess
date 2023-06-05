import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ConnectionIssuedContainer } from '@/components/templates/Connection/ConnectionIssuedContainer'

const ConnectionIssued: NextPage = () => {
  return (
    <>
      <Meta robots='noindex,follow' />
      <ConnectionIssuedContainer />
    </>
  )
}

export default ConnectionIssued
