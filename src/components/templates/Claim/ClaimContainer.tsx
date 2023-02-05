import styled from '@emotion/styled'
import { FC } from 'react'
import { ClaimTabs } from '@/components/organism/Tabs/Claim/ClaimTabs'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ClaimContainer: FC = () => {
  const { currentTheme, getFont, currentTypo } = useVESSTheme()

  const Container = styled.div`
    width: 100%;
    height: auto;
    background: ${currentTheme.background};
    display: flex;
    align-items: center;
    justify-content: center;
  `
  return (
    <Container>
      <ClaimTabs />
    </Container>
  )
}
