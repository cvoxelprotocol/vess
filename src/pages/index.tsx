import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { HomeContainer } from '@/components/home/HomeContainer'
import { Meta } from '@/components/layouts/Meta'
import { useDIDAccount } from '@/hooks/useDIDAccount'
const Home: NextPage = () => {
  const { did } = useDIDAccount()
  const router = useRouter()

  useEffect(() => {
    if (!did) {
      router.push(`/login`)
    }
  }, [did])
  return (
    <>
      <Meta />
      <HomeContainer did={did || ''} />
    </>
  )
}

export default Home
