import { NextPage } from 'next'
import { HomeContainer } from '@/components/home/HomeContainer'
import { Meta } from '@/components/layouts/Meta'
const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <HomeContainer />
    </>
  )
}

export default Home
