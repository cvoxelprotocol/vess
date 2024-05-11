import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { VSUser } from '@/@types/credential'
import { Meta } from '@/components/layouts/Meta'
import { ProfileContainer } from '@/components/profile/ProfileContainer'
import { getVESSUserByVessIdForServerUseOnly } from '@/lib/vessApi'

export const maxDuration = 60

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
}

export type Props = {
  vessid: string
  DehydratedState?: DehydratedState
  user: VSUser | null
}

const queryClient = new QueryClient()

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, { vessid?: string }> = async ({ params }) => {
  const vessid = params?.vessid
  if (vessid == null) {
    return {
      props: { vessid: '', user: null },
      revalidate: 5,
    }
  }

  const userResponse = await getVESSUserByVessIdForServerUseOnly(vessid, true)

  return {
    props: { dehydratedState: dehydrate(queryClient), vessid, user: userResponse?.user || null },
    revalidate: 300,
  }
}

const Profile: NextPage<Props> = (props: Props) => {
  return (
    <>
      <Meta
        pageTitle={props.user?.vessId || props.user?.name || 'Profile'}
        pageDescription={
          props.user?.description ||
          `This is ${props.user?.vessId || props.user?.name || 'awesome user'}'s profile page.`
        }
        pagePath={`https://app.vess.id/${props.vessid}`}
      />
      <ProfileContainer />
    </>
  )
}

export default Profile
