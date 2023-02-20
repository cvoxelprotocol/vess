import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticProps } from 'next'
import Router from 'next/router'
import { ReactElement } from 'react'
import { getPkhDIDFromAddress, isDIDstring, isEthereumAddress } from 'vess-sdk'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ProfileContainer } from '@/components/templates/Profile/ProfileContainer'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { CeramicProps, CeramicSupport } from '@/interfaces/ceramic'
import { getOrbisHelper, OrbisProfileDetail } from '@/lib/OrbisHelper'

const queryClient = new QueryClient()

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<CeramicProps, { did: string }> = async ({ params }) => {
  const did = params?.did
  let support: CeramicSupport = 'invalid'

  if (did == null) {
    return {
      redirect: { destination: '/', permanent: true },
    }
  }

  if (isDIDstring(did)) {
    support = 'supported'
    try {
      const orbisHelper = getOrbisHelper()
      const Profile = queryClient.prefetchQuery<OrbisProfileDetail | null>(
        ['fetchOrbisProfile', did],
        () => orbisHelper.fetchOrbisProfile(did),
        {
          staleTime: Infinity,
          cacheTime: 1000000,
        },
      )
      await Promise.all([Profile])
      return {
        props: { did: did.toLowerCase(), support, dehydratedState: dehydrate(queryClient) },
        revalidate: 60,
      }
    } catch (error) {
      console.error(error)
    }
  } else if (isEthereumAddress(did)) {
    // If an Ethereum address is provided, redirect to CAIP-10 URL
    return {
      redirect: { destination: `/${getPkhDIDFromAddress(did)}`, permanent: false },
    }
  }
  return {
    props: { did, support, dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  }
}

const Profile: NextPageWithLayout<CeramicProps> = (props: CeramicProps) => {
  const { did: myDID, account } = useDIDAccount()

  if (!props.did) {
    Router.push('/')
  }

  if (props.support === 'supported') {
    return (
      <>
        {(myDID && myDID === props.did) ||
        (account && `${getPkhDIDFromAddress(account)}` === props.did) ? (
          <ProfileContainer {...props} />
        ) : (
          <ProfileContainer {...props} />
        )}
      </>
    )
  }

  return <></>
}
Profile.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Profile
