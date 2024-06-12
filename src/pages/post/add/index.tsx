import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { AddPostContainer } from '@/components/post/AddPostContainer'

const AddPostItem: NextPage = () => {
  return (
    <>
      <Meta pageTitle='Add Post' />
      <AddPostContainer />
    </>
  )
}

export default AddPostItem
