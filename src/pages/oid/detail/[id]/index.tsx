import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { OIDCredentialDetailContainer } from '@/components/credentialDetail/OIDCredentialDetailContainer'
import { Meta } from '@/components/layouts/Meta'

const CredentialDetail: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Credential Detail' />
      <OIDCredentialDetailContainer id={id} />
    </>
  )
}

export default CredentialDetail
