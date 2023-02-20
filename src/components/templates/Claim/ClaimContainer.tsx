import styled from '@emotion/styled'
import { FC } from 'react'
import { LoginCard } from '@/components/organism/Accounts/LoginCard'
import { ClaimTabs } from '@/components/organism/Tabs/Claim/ClaimTabs'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ClaimContainer: FC = () => {
  const { currentTheme } = useVESSTheme()
  const { did } = useDIDAccount()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${currentTheme.background};
  `

  const Container = styled.div`
    width: 100%;
    height: auto;
    background: ${currentTheme.background};
    display: flex;
    align-items: center;
    justify-content: center;
  `
  if (!did) {
    return (
      <Wrapper>
        <LoginCard />
      </Wrapper>
    )
  }
  return (
    <Container>
      <ClaimTabs />
    </Container>
  )
}
