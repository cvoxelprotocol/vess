import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { LoginCard } from '@/components/organism/Accounts/LoginCard'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
const NoDid: NextPage = () => {
  const { did } = useDIDAccount()
  const { currentTheme } = useVESSTheme()
  const router = useRouter()

  const Wrapper = styled.main`
    width: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${currentTheme.background};
    padding: 16px;
  `

  useEffect(() => {
    if (did) {
      router.push(`/did/${did}`)
    }
  }, [did])

  return (
    <Wrapper>
      <Meta robots='noindex, follow' />
      <LoginCard />
    </Wrapper>
  )
}

export default NoDid
