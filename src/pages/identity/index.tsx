import { NextPage } from 'next'
import { IdentityContainer } from '@/components/identity/IdentityContainer'
import { Meta } from '@/components/layouts/Meta'

const Identity: NextPage = () => {
  return (
    <>
      <Meta pageTitle='アイデンティティ' />
      <IdentityContainer />
    </>
  )
}

export default Identity
