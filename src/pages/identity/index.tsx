import { GetServerSideProps, NextPage } from 'next'
import { IdentityContainer } from '@/components/identity/IdentityContainer'
import { Meta } from '@/components/layouts/Meta'
import { ReceiveCredentialContainer } from '@/components/receive/ReceiveCredentialContainer'

const Identity: NextPage = () => {
  return (
    <>
      <Meta pageTitle='アイデンティティ' />
      <IdentityContainer />
    </>
  )
}

export default Identity
