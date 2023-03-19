import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { NfcWriteContainer } from '@/components/templates/NFC/NfcWriteContainer'
import { CeramicProps } from '@/interfaces/ceramic'

const NfcWrite: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <NfcWriteContainer />
}
NfcWrite.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default NfcWrite
