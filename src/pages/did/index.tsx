import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import { NextPageWithLayout } from '../_app'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { LoginCard } from '@/components/organism/Accounts/LoginCard'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
const NoDid: NextPageWithLayout = () => {
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
      <LoginCard />
    </Wrapper>
  )
}

NoDid.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export default NoDid
