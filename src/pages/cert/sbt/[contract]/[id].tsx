// eslint-disable-next-line import/named
import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { ReactElement } from 'react'
import { NextPageWithLayout } from '../../../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { CertContainer } from '@/components/templates/Certification/CertContainer'
import { CertVCWithSBT, fetchCertification } from '@/lib/sbt'

const queryClient = new QueryClient()

export type Props = {
  cert: CertVCWithSBT | null
  DehydratedState?: DehydratedState
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const contract = params?.contract as string
  const id = params?.id as string
  if (!contract || !id) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cert: null,
      },
      revalidate: 60,
    }
  }
  const cert = await fetchCertification(contract, id)

  return {
    props: { dehydratedState: dehydrate(queryClient), cert },
    revalidate: 300,
  }
}

const Cert: NextPageWithLayout<Props> = (props: Props) => {
  return <CertContainer {...props} />
}
Cert.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Cert
