import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import { type EventWithId, getVESS, addCeramicPrefix } from 'vess-sdk'
import { Meta } from '@/components/layouts/Meta'
import { IssueCertContainer } from '@/components/templates/Certification/IssueCertContainer'
import { CERAMIC_NETWORK } from '@/constants/common'

export type IssueCredProps = {
  id: string
  event: EventWithId | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps<IssueCredProps> = async ({
  params,
}: GetStaticPropsContext) => {
  const ceramicId = params?.id as string
  try {
    const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
    const event = await vess.getEvent(addCeramicPrefix(ceramicId))
    console.log({ event })
    return {
      props: {
        id: ceramicId,
        event: event || null,
      },
      revalidate: 180,
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        id: ceramicId,
        event: null,
      },
      revalidate: 10,
    }
  }
}

const IssueSbtPage: NextPage<IssueCredProps> = (props: IssueCredProps) => {
  return (
    <>
      <Meta robots='noindex, follow' />
      <IssueCertContainer {...props} />
    </>
  )
}

export default IssueSbtPage
