import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { LoginPage } from '@/components/login/LoginPage'
import { LoginCard } from '@/components/organism/Accounts/LoginCard'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const Login: NextPage = () => {
  const { did } = useDIDAccount()
  const { currentTheme } = useVESSTheme()
  const router = useRouter()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${currentTheme.background};
    padding: 8px;
  `

  // useEffect(() => {
  //   if (did) {
  //     router.push(`/did/${did}`)
  //   }
  // }, [did, router])

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <LoginPage />
    </Wrapper>
  )
}

export default Login
