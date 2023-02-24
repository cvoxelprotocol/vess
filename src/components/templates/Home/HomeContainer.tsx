import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { UserCard } from '@/components/molecure/User/UserCard'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const FEATURED_USER_LIST = [
  'did:pkh:eip155:1:0xde695cbb6ec0cf3f4c9564070baeb032552c5111',
  'did:pkh:eip155:1:0xb69cb3efbadb1b30f6d88020e1fa1fc84b8804d4',
  'did:pkh:eip155:1:0xe43577d0fa22a0c156414677bee9baf99a33cfa9',
  'did:pkh:eip155:1:0xad44f4c7703ab3fac0c46624fb52e6e668e4cd24',
  'did:pkh:eip155:1:0x9df610ec3e37e8da858b3d53d6c68178140cf24f',
]
export const HomeContainer: FC = () => {
  const { did } = useDIDAccount()
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const router = useRouter()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${currentTheme.background};
    padding: 8px;
    gap: 16px;
  `

  const SectionHeader = styled.div`
    padding: 32px 0 8px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.small)};
    border: 1px solid ${currentTheme.surfaceVariant};
    border-width: 0px 0px 1px 0px;
  `

  const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    text-align: center;
    @media (max-width: 599px) {
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 8px;
    }
  `
  const Content = styled.div`
    margin: 0 auto;
  `

  const MainContent = styled.div`
    margin-top: 24px;
    color: ${currentTheme.depth3};
    border: 1px solid ${currentTheme.outline};
    border-radius: 24px;
    width: 100%;
    padding: 62px 10px 16px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
  `

  const LogoContainer = styled.div`
    width: 380px;
    @media (max-width: 599px) {
      width: 200px;
    }
  `
  const CatchContainer = styled.div`
    width: 520px;
    @media (max-width: 599px) {
      width: 300px;
    }
  `

  const jumpToLP = () => {
    window.open('https://vess.id/', '_blank')
  }

  return (
    <Wrapper>
      <MainContent>
        <Flex flexDirection='column' rowGap='6px'>
          <LogoContainer>
            <NextImageContainer src={'/vess_logo_full.png'} width='100%' height='50px' />
          </LogoContainer>
          <Chip
            variant='filled'
            text='Beta Ver.'
            mainColor={currentTheme.tertiary}
            textColor={currentTheme.onTertiary}
          />
        </Flex>
        <Flex flexDirection='column' rowGap='20px'>
          <CatchContainer>
            <NextImageContainer src={'/top_image.png'} width='100%' height='200px' />
          </CatchContainer>
          <Button
            mainColor={currentTheme.primary}
            variant='filled'
            text='Learn More'
            btnWidth='100%'
            onClick={() => jumpToLP()}
          />
        </Flex>
      </MainContent>
      <SectionHeader>Featured Talents</SectionHeader>
      <Container>
        {FEATURED_USER_LIST.map((userId) => {
          return (
            <Content key={userId}>
              <UserCard userId={userId} />
            </Content>
          )
        })}
      </Container>
    </Wrapper>
  )
}
