import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { HomeContainer } from '@/components/templates/Home/HomeContainer'
const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <HomeContainer />
    </>
  )
}

export default Home
