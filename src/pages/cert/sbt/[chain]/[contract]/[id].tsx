import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { CertContainer } from '@/components/templates/Certification/CertContainer'
import { CertVCWithSBT } from '@/interfaces/sbt'
import { fetchCertification } from '@/lib/sbt'

const queryClient = new QueryClient()

export type Props = {
  cert: CertVCWithSBT | null
  DehydratedState?: DehydratedState
  id?: string
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chain = params?.chain as string
  const contract = params?.contract as string
  const id = params?.id as string
  if (!contract || !id) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cert: null,
      },
      revalidate: 60,
      id: id,
    }
  }
  const cert = await fetchCertification(chain || 'polygon', contract, id)

  return {
    props: { dehydratedState: dehydrate(queryClient), cert },
    revalidate: 300,
  }
}

const Cert: NextPage<Props> = (props: Props) => {
  return (
    <>
      <Meta
        pageTitle={`${props.cert?.nft.metadata.name || 'Certification page'}`}
        pageDescription={props.cert?.nft.metadata.description || 'Certification page on VESS'}
        pagePath={`https://app.vess.id/cert/sbt/polygon/${props.cert?.contractAddress}/${props.id}`}
      />
      <CertContainer {...props} />
    </>
  )
}

export default Cert
