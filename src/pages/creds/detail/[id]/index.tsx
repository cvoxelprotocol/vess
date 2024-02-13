import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { CredentialDetailContainer } from '@/components/credentialDetail/CredentialDetailContainer'
import { Meta } from '@/components/layouts/Meta'

const CredentialDetail: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Credential Detail' />
      <CredentialDetailContainer id={id} />
    </>
  )
}

export default CredentialDetail
