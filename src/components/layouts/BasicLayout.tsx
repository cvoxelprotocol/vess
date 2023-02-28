import styled from '@emotion/styled'
import { FC, useEffect } from 'react'
import { getAuthorizedSession } from 'vess-sdk'
import { useAccount, useDisconnect } from 'wagmi'
import { NavigationList } from '../molecure/Navigation/NavigationList'
import { BaseHeader } from '../organism/Header/BaseHeader'
import LoadingModal from '../organism/Modal/LoadingModal'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useConnection } from '@/hooks/useConnection'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  children: React.ReactNode
}
export const BasicLayout: FC<Props> = ({ children }) => {
  const { isLoading } = useVESSLoading()
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
      grid-template-rows: 64px 1fr 64px;
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
    z-index: 999;
    @media (max-width: 599px) {
      height: 64px;
      width: 100%;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      grid-row: 3/4;
    }
  `
  const MainContainer = styled.div`
    background: ${currentTheme.background};
    overflow: hidden;
    grid-column: 2;
    grid-row: 2;
    max-width: 984px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    min-height: 100vh;
    @media (max-width: 599px) {
      grid-column: 1;
      grid-row: 2;
      width: 100%;
      overflow-x: hidden;
    }
  `
  useEffect(() => {
    initTheme()
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
    <LayoutContainer>
      <BaseHeader />
      <NaviContainer>
        <NavigationList />
      </NaviContainer>
      <MainContainer id={'MainContainer'}>{children}</MainContainer>
      {isLoading && <LoadingModal />}
    </LayoutContainer>
  )
}
