import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import { NfcDidRecord } from '../api/nfc'
import { Meta } from '@/components/layouts/Meta'
import { NfcWriteContainer } from '@/components/templates/NFC/NfcWriteContainer'
import { getAllNFC, getDidFromNFCForOnlyServer } from '@/lib/firestore'

export type NfcProps = {
  nfc?: NfcDidRecord | null
  id?: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const nfcs = await getAllNFC()
  if (!nfcs) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
  const paths = nfcs.map((t) => ({
    params: {
      id: t.id,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps<NfcProps> = async ({
  params,
}: GetStaticPropsContext) => {
  const id = params?.id as string
  try {
    const nfc = await getDidFromNFCForOnlyServer(id)
    return {
      props: {
        id: id,
        nfc: nfc,
      },
      revalidate: 180,
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        id: id,
        nfc: null,
      },
      revalidate: 10,
    }
  }
}

const NfcWrite: NextPage<NfcProps> = (props: NfcProps) => {
  return (
    <>
      <Meta robots='noindex, follow' />
      <NfcWriteContainer {...props} />
    </>
  )
}

export default NfcWrite
