import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { NfcCreatedContainer } from '@/components/templates/NFC/NfcCreatedContainer'
import { NfcWriteContainer } from '@/components/templates/NFC/NfcWriteContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const NfcWrite: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <NfcCreatedContainer />
}
NfcWrite.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default NfcWrite
