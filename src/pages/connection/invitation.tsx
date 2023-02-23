import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ConnectionInvitationContainer } from '@/components/templates/Connection/ConnectionInvitationContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const ConnectionInvitation: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <ConnectionInvitationContainer />
}
ConnectionInvitation.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default ConnectionInvitation
