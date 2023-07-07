import styled from '@emotion/styled'
import { Router } from 'next/router'
import { FC, useEffect } from 'react'
import { getAuthorizedSession } from 'vess-sdk'
import { useAccount, useDisconnect } from 'wagmi'
import { NavigationList } from '../molecure/Navigation/NavigationList'
import { Footer } from '../organism/Footer/Footer'
import { BaseHeader } from '../organism/Header/BaseHeader'
import LoadingModal from '../organism/Modal/LoadingModal'
import { footerLinks } from '@/constants/footerLinks'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useConnection } from '@/hooks/useConnection'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSTheme } from '@/hooks/useVESSTheme'
type Props = {
  children: React.ReactNode
}
export const BasicLayout: FC<Props> = ({ children }) => {
  const { isLoading, showLoading, closeLoading } = useVESSLoading()
  const { currentTheme, initTheme } = useVESSTheme()
  const { autoConnect, connectDID } = useConnectDID()
  const { did } = useDIDAccount()
  const { disconnect } = useDisconnect()
  const { connector, isConnected } = useAccount()
  const { migrationInvitaion } = useConnection()

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
    background: ${currentTheme.background};
  `
  const NaviContainer = styled.div`
    grid-column: 1 /2;
    @media (max-width: 1079px) {
      grid-column: 1 /2;
    }
    width: 80px;
    height: 100vh;
    background: ${currentTheme.depth4};
    position: fixed;
    z-index: 30;
    @media (max-width: 599px) {
      display: none;
    }
  `

  const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    grid-column: 2;
    grid-row: 2;
    overflow: hidden;
    @media (max-width: 599px) {
      grid-column: 1;
      grid-row: 2;
    }
  `

  const MainContainer = styled.div`
    background: ${currentTheme.background};
    max-width: 984px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    min-height: 100vh;
    @media (max-width: 599px) {
      width: 100%;
      overflow-x: hidden;
    }
  `
  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    const start = () => {
      showLoading()
    }
    const end = () => {
      closeLoading()
    }
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)
    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', end)
      Router.events.off('routeChangeError', end)
    }
  }, [])

  useEffect(() => {
    async function init() {
      if (!did) {
        const session = await getAuthorizedSession()
        if (session) {
          await autoConnect()
          migrationInvitaion()
        } else if (isConnected && connector) {
          await connectDID(connector)
          migrationInvitaion()
        } else {
          disconnect()
        }
      }
    }
    init()
  }, [])

  return (
    <>
      <LayoutContainer>
        <BaseHeader />
        <NaviContainer>
          <NavigationList />
        </NaviContainer>
        <MainWrapper>
          <MainContainer id={'MainContainer'}>{children}</MainContainer>
          <Footer src='/vess_logo_full_white.png' links={footerLinks} />
          {isLoading && <LoadingModal />}
        </MainWrapper>
      </LayoutContainer>
    </>
  )
}
