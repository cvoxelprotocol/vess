import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { LoginCard } from '@/components/organism/Accounts/LoginCard'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const HomeContainer: FC = () => {
  const { connectDID } = useConnectDID()
  const { did } = useDIDAccount()
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const router = useRouter()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${currentTheme.background};
  `

  useEffect(() => {
    if (did) {
      router.push(`/${did}`)
    }
  }, [did])

  return (
    <Wrapper>
      <LoginCard />
    </Wrapper>
  )
}
