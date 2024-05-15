import { NextPage } from 'next'
import { CredItemCreateContainer } from '@/components/credItem/CredItemCreateContainer'
import { Meta } from '@/components/layouts/Meta'

const AddPostItem: NextPage = () => {
  return (
    <>
      <Meta pageTitle='新規発行' />
      <CredItemCreateContainer />
    </>
  )
}

export default AddPostItem
