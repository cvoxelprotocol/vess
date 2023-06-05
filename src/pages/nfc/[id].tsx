import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { NfcWriteContainer } from '@/components/templates/NFC/NfcWriteContainer'

const NfcWrite: NextPage = () => {
  return (
    <>
      <Meta robots='noindex, follow' />
      <NfcWriteContainer />
    </>
  )
}

export default NfcWrite
