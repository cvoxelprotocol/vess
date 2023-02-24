import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
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
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
  `

  const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    text-align: center;
    @media (max-width: 1517px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 8px;
    }
  `
  const Content = styled.div`
    grid-template-columns: repeat(auto-fill, 1fr);
  `

  return (
    <Wrapper>
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
