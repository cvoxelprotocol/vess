import { NextPage } from 'next'
import { HomeContainer } from '@/components/home/HomeContainer'
import { Meta } from '@/components/layouts/Meta'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

const Home: NextPage = () => {
  const { did } = useVESSAuthUser()
  return (
    <>
      <Meta />
      <HomeContainer did={did || ''} />
    </>
  )
}

export default Home
