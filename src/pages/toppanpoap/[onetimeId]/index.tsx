import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import type { EventWithId } from 'vess-sdk'
import { Meta } from '@/components/layouts/Meta'
import { OnetimeContainer } from '@/components/templates/toppanpoap/Onetime'
import { getOnetimeTokenForServerUseOnly, getOnetimeTokensForServerUseOnly } from '@/lib/kms'

export interface MintEventAttendanceResponse {
  contractAddress: string
  tx: any
}
export interface DataFormat {
  address: string
  [k: string]: string
}

export interface IssueAndMintToEventAttendanceWithSBTRequest {
  content: EventWithId
  orgId: string
  data: DataFormat[]
  expirationDate?: Date
  onetimeId?: string
}

export interface EventWithSBT {
  id: string
  ceramicId: string | null
  contractAddress: string | null
  organizationId: string
  chainId: string
  createdAt: Date
  updatedAt: Date | null
}
export interface KmsOrganization {
  address: string
  ceramicId: string
  name: string
}
export interface OnetimeTokenResponse {
  id: string
  contractAddress: string
  organizationId: string
  used: boolean
  createdAt: Date | null
  updatedAt: Date | null
  Event: EventWithSBT
  organization: KmsOrganization
}
export interface OnetimeTokenWithContract extends OnetimeTokenResponse {
  contract: any
}
export type OnetimeProps = {
  onetimeToken: OnetimeTokenResponse | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tokens = await getOnetimeTokensForServerUseOnly()
  const paths = tokens.map((t) => ({
    params: {
      onetimeId: t,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const onetimeId = params?.onetimeId as string
  try {
    const onetimeToken = await getOnetimeTokenForServerUseOnly(onetimeId)
    return {
      props: {
        onetimeToken: onetimeToken,
      },
      revalidate: 180,
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        onetimeToken: null,
      },
      revalidate: 10,
    }
  }
}

const OnetimePage: NextPage<OnetimeProps> = (props: OnetimeProps) => {
  return (
    <>
      <Meta robots='noindex, follow' />
      <OnetimeContainer {...props} />
    </>
  )
}

export default OnetimePage
