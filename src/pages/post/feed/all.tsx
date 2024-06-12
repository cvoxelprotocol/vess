import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { PostAllFeedContainer } from '@/components/post/PostAllFeedContainer'

const PostFeedPage: NextPage = () => {
  return (
    <>
      <Meta pageTitle='Post Feed' />
      <PostAllFeedContainer />
    </>
  )
}

export default PostFeedPage
