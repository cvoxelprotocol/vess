import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { OID4VCIReceiveCredentialContainer } from '@/components/receive/OID4VCIReceiveCredentialContainer'

const OID4VCIReceiveCredential: NextPage = () => {
  return (
    <>
      <Meta pageTitle='Receive a Credential' />
      <OID4VCIReceiveCredentialContainer />
    </>
  )
}

export default OID4VCIReceiveCredential
