import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Meta } from '@/components/layouts/Meta'
import { PostFeedContainer } from '@/components/post/PostFeedContainer'

const AddPostPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Post Feed' />
      <PostFeedContainer id={id} />
    </>
  )
}

export default AddPostPage
