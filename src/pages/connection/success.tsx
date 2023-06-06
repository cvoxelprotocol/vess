import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { NfcCreatedContainer } from '@/components/templates/NFC/NfcCreatedContainer'

const NfcWrite: NextPage = () => {
  return (
    <>
      <Meta robots='noindex,follow' />
      <NfcCreatedContainer />
    </>
  )
}

export default NfcWrite
