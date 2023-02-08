import { ReactElement } from 'react'
import { NextPageWithLayout } from './_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ClaimContainer } from '@/components/templates/Claim/ClaimContainer'

const Home: NextPageWithLayout = () => {
  return <ClaimContainer />
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Home
