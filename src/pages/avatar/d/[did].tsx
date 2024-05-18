import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { getPkhDIDFromAddress, isDIDstring, isEthereumAddress } from 'vess-kit-web'
import { DisplayProfile } from '@/@types'
import { AvatarContainer } from '@/components/avatar/AvatarContainer'
import { Meta } from '@/components/layouts/Meta'

export const maxDuration = 60

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
}

export type Props = {
  did: string
  DehydratedState?: DehydratedState
  profile: DisplayProfile | null
}

const queryClient = new QueryClient()

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, { did?: string }> = async ({ params }) => {
  const did = params?.did
  if (did == null) {
    return {
      props: { did: '', profile: null },
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
    props: { dehydratedState: dehydrate(queryClient), did: formatedDid, profile: null },
    revalidate: 300,
  }
}

const Profile: NextPage<Props> = (props: Props) => {
  return (
    <>
      <Meta
        pageTitle={props.profile?.displayName}
        pageDescription={
          props.profile?.bio || `This is ${props.profile?.displayName}'s profile page.`
        }
        pagePath={`https://app.vess.id/avatar/d/${props.did}`}
      />
      <AvatarContainer did={props.did} />
    </>
  )
}

export default Profile
