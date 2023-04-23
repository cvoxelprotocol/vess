import type { GetStaticProps } from 'next'
import { ReactElement } from 'react'
import { getPkhDIDFromAddress, isDIDstring, isEthereumAddress } from 'vess-sdk'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ProfileContainer } from '@/components/templates/Profile/ProfileContainer'
import { CeramicProps } from '@/interfaces/ceramic'

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<CeramicProps, { did?: string }> = async ({
  params,
}) => {
  const did = params?.did
  if (did == null) {
    return {
      props: { did: '' },
      revalidate: 5,
    }
  }
  const formatedDid = isDIDstring(did)
    ? did.toLowerCase()
    : isEthereumAddress(did)
    ? getPkhDIDFromAddress(did)
    : ''

  if (!formatedDid || formatedDid === '') {
    return {
      redirect: { destination: `/`, permanent: false },
    }
  }

  return {
    props: { did: formatedDid },
    revalidate: 60,
  }
}

const Profile: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  return <ProfileContainer {...props} />
}
Profile.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Profile
