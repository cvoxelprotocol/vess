import { NextPage } from 'next'
import { CredItemListContainer } from '@/components/credItem/CredItemListContainer'
import { Meta } from '@/components/layouts/Meta'

const CreateCredItem: NextPage = () => {
  return (
    <>
      <Meta pageTitle='発行証明一覧' />
      <CredItemListContainer />
    </>
  )
}

export default CreateCredItem
