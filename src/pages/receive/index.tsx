import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ReceiveCredentialContainer } from '@/components/receive/ReceiveCredentialContainer'

const ReceiveCredential: NextPage = () => {
  return (
    <>
      <Meta pageTitle='Receive a Credential' />
      <ReceiveCredentialContainer />
    </>
  )
}

export default ReceiveCredential
