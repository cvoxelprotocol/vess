import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { CredentialContentContainer } from '@/components/credentialDetail/CredentialContentContainer'
import { Meta } from '@/components/layouts/Meta'

const CredentialContent: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <>
      <Meta pageTitle='Credential Detail' />
      <CredentialContentContainer id={id} />
    </>
  )
}

export default CredentialContent
