import styled from '@emotion/styled'
import { Router, useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { getAuthorizedSession } from 'vess-sdk'
import { useAccount, useDisconnect } from 'wagmi'
import { NCLayout } from '../app/NCLayout'
import { NavigationContextProvider, NavigationList } from '../app/NavigationList'
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
  const router = useRouter()

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
    <NavigationContextProvider>
      <CenterLayout>
        <NCLayoutWrapper>
          <NCLayout navigation={<NavigationList></NavigationList>}>{children}</NCLayout>
        </NCLayoutWrapper>
      </CenterLayout>
    </NavigationContextProvider>
  )
}

const CenterLayout = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
  background: var(--kai-color-sys-background);
`

const NCLayoutWrapper = styled.div`
  width: 100%;
  max-width: var(--kai-size-breakpoint-md-min-width);
  height: 100vh;
  display: flex;
  overflow: hidden;

  @media (min-width: 839px) {
    overflow: visible;
  }
`
