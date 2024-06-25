import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Meta } from '@/components/layouts/Meta'
import { AddPostContainer } from '@/components/post/AddPostContainer'

const AddPostPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Add Post' />
      <AddPostContainer />
    </>
  )
}

export default AddPostPage
