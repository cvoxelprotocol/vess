import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Meta } from '@/components/layouts/Meta'
import { ReceiveCredentialContainer } from '@/components/receive/ReceiveCredentialContainer'

export type CredReceiveProps = {
  id?: string
}
export const getServerSideProps: GetServerSideProps<CredReceiveProps, { id: string }> = async (
  ctx,
) => {
  const id = ctx.params?.id
  const locale = ctx.locale || 'ja'
  return {
    props: { id: id, ...(await serverSideTranslations(locale)) },
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
