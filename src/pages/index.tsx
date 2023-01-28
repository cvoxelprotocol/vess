import { ReactElement } from 'react'
import { NextPageWithLayout } from './_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { ProfileContainer } from '@/components/templates/Profile/ProfileContainer'
const Home: NextPageWithLayout = () => {
  return <div>this is home </div>
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default Home
