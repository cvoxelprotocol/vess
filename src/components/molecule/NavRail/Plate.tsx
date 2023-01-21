import styled from '@emotion/styled'
import { FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const Plate: FC = () => {
  const { currentTheme } = useVESSTheme()

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 64px;
    height: 40px;
    background: ${currentTheme.primaryContainer};
    border-radius: 67px;
  `

  const PfpContainer = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    overflow: hidden;
  `

  return (
    <Container>
      <PfpContainer>
        <img src='https://placehold.jp/150x150.png' />
      </PfpContainer>
    </Container>
  )
}
