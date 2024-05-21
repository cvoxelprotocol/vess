import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { IdentityContainer } from '@/components/identity/IdentityContainer'
import { Meta } from '@/components/layouts/Meta'
import { PIZZA_PARTY_CRED_ID } from '@/constants/campaign'

const Pizza2024Receive: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(`/creds/receive/${PIZZA_PARTY_CRED_ID}`)
  }, [])
  return (
    <>
      <Meta pageTitle='PizzaDAO 2024 受け取りページ' />
    </>
  )
}

export default Pizza2024Receive
