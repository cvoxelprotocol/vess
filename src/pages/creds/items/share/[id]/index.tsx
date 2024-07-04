import { GetServerSideProps, NextPage } from 'next'
import { ShareCredItemContainer } from '@/components/credItem/ShareCredItemContainer'
import { Meta } from '@/components/layouts/Meta'

export type ShareCredentialProps = {
  id?: string
}
export const getServerSideProps: GetServerSideProps<ShareCredentialProps, { id: string }> = async (
  ctx,
) => {
  const id = ctx.params?.id
  return {
    props: { id: id },
  }
}
const ShareCredential: NextPage = ({ id }: ShareCredentialProps) => {
  return (
    <>
      <Meta pageTitle='Receive a Credential' />
      <ShareCredItemContainer id={id} />
    </>
  )
}

export default ShareCredential
