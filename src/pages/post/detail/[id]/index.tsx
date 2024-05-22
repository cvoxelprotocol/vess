import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import { NextPage } from 'next'
import { Post } from '@/@types/user'
import { Meta } from '@/components/layouts/Meta'
import { PostDetailContainer } from '@/components/post/PostDetailContainer'
import { getPostById } from '@/lib/vessApi'

export const maxDuration = 60

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
}

export type Props = {
  id: string
  DehydratedState?: DehydratedState
  post: Post | null
}

const queryClient = new QueryClient()

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, { id?: string }> = async ({ params }) => {
  const id = params?.id
  if (id == null) {
    return {
      props: { id: '', post: null },
      revalidate: 5,
    }
  }

  await queryClient.prefetchQuery(['fetchPost', id], () => getPostById(id))

  const dehydratedState = dehydrate(queryClient)

  const post = dehydratedState?.queries?.some((query) => {
    const queryKey = query.queryKey as [string, string]
    return queryKey[0] === 'fetchPost' && queryKey[1] === id
  })
    ? (dehydratedState?.queries?.find((query) => {
        const queryKey = query.queryKey as [string, string]
        return queryKey[0] === 'fetchPost' && queryKey[1] === id
      })?.state?.data as Post)
    : null

  await queryClient.prefetchQuery(['fetchPost', id], () => {
    return post
  })

  return {
    props: { dehydratedState: dehydrate(queryClient), id, post },
    revalidate: 300,
  }
}

const Profile: NextPage<Props> = (props: Props) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_VESS_URL}/api/og/post?image=${
    props.post?.image || `${process.env.NEXT_PUBLIC_VESS_URL}/og/test2.png`
  }`

  return (
    <>
      <Meta
        pageTitle={`Post on VESS`}
        pageDescription={`This is an awesome post on VESS`}
        pagePath={`https://app.vess.id/post/detail/${props.id}`}
        pageImg={imageUrl}
      />
      <PostDetailContainer id={props.id} />
    </>
  )
}

export default Profile
