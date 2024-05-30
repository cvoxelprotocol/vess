import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { DisplayProfile } from '@/@types'
import { VSUser } from '@/@types/credential'
import { Meta } from '@/components/layouts/Meta'
import { ProfileContainer } from '@/components/profile/ProfileContainer'
import { getVESSUserByDid } from '@/lib/vessApi'
import {
  getAddressFromPkh,
  getPkhDIDFromAddress,
  isDIDstring,
  isEthereumAddress,
} from '@/utils/did'

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
  user: VSUser | null
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
      props: { did: '', profile: null, user: null },
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
  const userResponse = await getVESSUserByDid(formatedDid)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      did: formatedDid,
      profile: null,
      user: userResponse,
    },
    revalidate: 3000,
  }
}

const Profile: NextPage<Props> = (props: Props) => {
  const title =
    props.user?.name || props.user?.vessId
      ? `@${props.user?.vessId}`
      : getAddressFromPkh(props.user?.did || '').slice(0, 10) || 'プロフィール'
  const avatar = props.user?.avatar || `${process.env.NEXT_PUBLIC_VESS_URL}/default_profile.jpg`
  const imageUrl = `${process.env.NEXT_PUBLIC_VESS_URL}/api/og/avatar?title=${
    props.user?.vessId
      ? `@${props.user?.vessId}`
      : props.user?.name
      ? props.user?.name
      : getAddressFromPkh(props.user?.did || '').slice(0, 10) || 'VESS'
  }&avatar=${avatar}`

  return (
    <>
      <Meta
        pageTitle={title}
        pageDescription={
          props.profile?.bio || `This is ${props.profile?.displayName}'s profile page.`
        }
        pagePath={`https://app.vess.id/did/${props.did}`}
        pageImg={imageUrl}
      />
      <ProfileContainer did={props.did} />
    </>
  )
}

export default Profile
