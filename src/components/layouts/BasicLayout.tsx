import styled from '@emotion/styled'
import { useModal, Modal, useKai, useBreakpoint } from 'kai-kit'
import { Router } from 'next/router'
import { FC, useEffect } from 'react'
import { getAuthorizedSession } from 'vess-kit-web'
import { NCLayout } from '../app/NCLayout'
import { NavigationContextProvider, NavigationList } from '../app/NavigationList'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { autoVESSConnect } from '@/lib/vess'
type Props = {
  children: React.ReactNode
}
export const BasicLayout: FC<Props> = ({ children }) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const { did } = useVESSAuthUser()
  const { openModal, closeModal } = useModal()
  const { setDarkMode, setLightMode } = useKai()
  const { breakpointProps } = useBreakpoint()

  useEffect(() => {
    setLightMode()
  }, [])

  useEffect(() => {
    const start = () => {
      showLoading()
      openModal('pageTransitionOverlay')
    }
    const end = () => {
      closeLoading()
      closeModal('pageTransitionOverlay')
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
          await autoVESSConnect()
        }
      }
    }
    init()
  }, [])

  return (
    <>
      <NavigationContextProvider>
        <CenterLayout {...breakpointProps}>
          <NCLayoutWrapper {...breakpointProps}>
            <NCLayout id='NCLayout' navigation={<NavigationList></NavigationList>}>
              {children}
            </NCLayout>
          </NCLayoutWrapper>
        </CenterLayout>
      </NavigationContextProvider>
      {/* <Modal name='pageTransitionOverlay' overlayOnly /> */}
    </>
  )
}

const CenterLayout = styled.div`
  width: 100%;
  height: 100svh;
  display: grid;
  place-content: center;
  background: var(--kai-color-sys-background);
`

const NCLayoutWrapper = styled.div`
  width: 100vw;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  height: 100svh;
  display: flex;
  overflow: hidden;

  &[data-media-md] {
    overflow: visible;
  }

  &[data-media-lg] {
    max-width: 100%;
  }
`
