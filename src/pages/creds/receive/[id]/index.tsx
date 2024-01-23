import { GetServerSideProps, NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ReceiveCredentialContainer } from '@/components/receive/ReceiveCredentialContainer'

export type CredReceiveProps = {
  id?: string
}
export const getServerSideProps: GetServerSideProps<CredReceiveProps, { id: string }> = async (
  ctx,
) => {
  const id = ctx.params?.id
  return {
    props: { id: id },
  }
}
const ReceiveCredential: NextPage = ({ id }: CredReceiveProps) => {
  return (
    <>
      <Meta pageTitle='Receive a Credential' />
      <ReceiveCredentialContainer id={id} />
    </>
  )
}

export default ReceiveCredential
