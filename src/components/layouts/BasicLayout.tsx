import styled from '@emotion/styled'
import { FC, useEffect } from 'react'
// import { BasicHeader } from '../organism/Headers/BasicHeader'
import { Avatar } from '../atom/Avatars/Avatar'
import { Button } from '../atom/Buttons/Button'
import { Flex } from '../atom/Common/Flex'
import { NavigationList } from '../molecure/Navigation/NavigationList'
import LoadingModal from '../organism/Modal/LoadingModal'
// import { NavigationList } from '../organism/Navigation/NavigationList'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  children: React.ReactNode
}
export const BasicLayout: FC<Props> = ({ children }) => {
  const { isLoading } = useVESSLoading()
  const { currentTheme, initTheme } = useVESSTheme()
  const { connectDID, disConnectDID, isAuthorized } = useConnectDID()
  const { did } = useDIDAccount()
  const { profile } = useSocialAccount(did)
  const LayoutContainer = styled.div`
    display: grid;
    width: 100vw;
    height: auto;
    min-height: 100vh;
    grid-template-columns: 80px 1fr;
    grid-template-rows: 80px 1fr;
    @media (max-width: 1079px) {
      grid-template-columns: 80px 1fr;
      grid-template-rows: 80px 1fr;
    }
    @media (max-width: 599px) {
      grid-template-columns: 1fr;
      grid-template-rows: 64px 1fr;
    }
    @media (max-width: 352px) {
      grid-template-columns: 1fr;
      grid-template-rows: 64px 1fr;
    }
    background: ${currentTheme.background};
  `
  const NaviContainer = styled.div`
    grid-column: 1 /2;
    @media (max-width: 1079px) {
      grid-column: 1 /2;
    }
    @media (max-width: 599px) {
      display: none;
    }
    @media (max-width: 352px) {
      display: none;
    }
    width: 80px;
    height: 100vh;
    background: ${currentTheme.depth4};
    position: fixed;
    z-index: 999;
  `
  const HeaderContainer = styled.div`
    grid-row: 1 /2;
    width: 100%;
    height: 80px;
    position: fixed;
    padding: 12px;
    background: ${currentTheme.depth4};
    z-index: 998;
  `
  const MainContainer = styled.div`
    background: ${currentTheme.background};
    grid-column: 2;
    grid-row: 2;
    width: 936px;
    margin: 0 auto;
    height: min(100%, 100vh);

    @media (max-width: 1079px) {
      grid-column: 2;
      grid-row: 2;
      width: 936px;
      margin: 0 auto;
    }
    @media (max-width: 599px) {
      grid-column: 1/3;
      grid-row: 2;
      width: 100%;
      margin: 12px auto;
      padding: 8px;
    }
  `
  const AccountContainer = styled.button`
    background: none;
    border: none;
  `
  useEffect(() => {
    initTheme()
  }, [])
  return (
    <LayoutContainer>
      <HeaderContainer>
        <Flex alignItems='center' justifyContent={'flex-end'} height={'100%'}>
          {isAuthorized ? (
            <AccountContainer onClick={() => disConnectDID()}>
              <Avatar url={profile.avatarSrc} size={'XXL'} />
            </AccountContainer>
          ) : (
            <Button text={'Connect'} onClick={() => connectDID()}></Button>
          )}
        </Flex>
      </HeaderContainer>
      <NaviContainer>
        <NavigationList />
      </NaviContainer>
      <MainContainer>{children}</MainContainer>
      {isLoading && <LoadingModal />}
    </LayoutContainer>
  )
}
