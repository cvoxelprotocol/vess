import { GetServerSideProps, NextPage } from 'next'
import { CredentialDetailContainer } from '@/components/credentialDetail/CredentialDetailContainer'
import { Meta } from '@/components/layouts/Meta'

export type CredDetailProps = {
  id?: string
}
export const getServerSideProps: GetServerSideProps<CredDetailProps, { id: string }> = async (
  ctx,
) => {
  const id = ctx.params?.id
  return {
    props: { id: id },
  }
}
const CredentialDetail: NextPage = ({ id }: CredDetailProps) => {
  return (
    <>
      <Meta pageTitle='Credential Detail' />
      <CredentialDetailContainer id={id} />
    </>
  )
}

export default CredentialDetail
