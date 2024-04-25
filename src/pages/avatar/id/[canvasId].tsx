import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { GetStaticProps, NextPage } from 'next'
import { AvatarDetailContainer } from '@/components/avatar/AvatarDetailContainer'

export const maxDuration = 60

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
}

export type Props = {
  canvasId: string
  DehydratedState?: DehydratedState
}

const queryClient = new QueryClient()

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, { canvasId?: string }> = async ({ params }) => {
  const canvasId = params?.canvasId
  if (canvasId == null) {
    return {
      props: { canvasId: '' },
      revalidate: 5,
    }
  }

  return {
    props: { dehydratedState: dehydrate(queryClient), canvasId: canvasId },
    revalidate: 300,
  }
}

const Avatar: NextPage<Props> = (props: Props) => {
  return (
    <>
      <AvatarDetailContainer canvasId={props.canvasId} />
    </>
  )
}

export default Avatar
