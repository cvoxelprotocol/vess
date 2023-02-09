import { ReactElement } from 'react'
import { NextPageWithLayout } from './_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { HomeContainer } from '@/components/templates/Home/HomeContainer'
const Home: NextPageWithLayout = () => {
  return <HomeContainer />
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Home
