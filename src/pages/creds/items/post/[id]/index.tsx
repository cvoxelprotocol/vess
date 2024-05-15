import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Meta } from '@/components/layouts/Meta'
import { AddCredItemPostContainer } from '@/components/post/AddPostContainer'

const AddPostPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Add Post' />
      <AddCredItemPostContainer id={id} />
    </>
  )
}

export default AddPostPage
