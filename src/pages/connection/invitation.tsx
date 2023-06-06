import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ConnectionInvitationContainer } from '@/components/templates/Connection/ConnectionInvitationContainer'

const ConnectionInvitation: NextPage = () => {
  return (
    <>
      <Meta robots='noindex,follow' />
      <ConnectionInvitationContainer />
    </>
  )
}

export default ConnectionInvitation
