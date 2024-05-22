import styled from '@emotion/styled'
import { Modal, useBreakpoint, useModal, useModalContext } from 'kai-kit'
import React, { FC, useEffect } from 'react'
import { Button } from 'react-aria-components'

type Props = {
  navigation?: React.ReactNode
  children?: React.ReactNode
  backgroundColor?: string
  width?: string
  height?: string
  showGrid?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const NCLayoutContext = React.createContext({
  isDefaultOpenOnDesktop: true,
  setIsDefaultOpenOnDesktop: (isOpen: boolean) => {},
  isNavigationOpen: false,
  setIsNavigationOpen: (isOpen: boolean) => {},
  isFullContent: false,
  setIsFullContent: (isFull: boolean) => {},
})

export const useNCLayoutContext = () => {
  const context = React.useContext(NCLayoutContext)

  const openNavigation = () => {
    context.setIsNavigationOpen(true)
  }

  const closeNavigation = () => {
    context.setIsNavigationOpen(false)
  }

  const toggleNavigation = () => {
    context.setIsNavigationOpen(!context.isNavigationOpen)
  }

  return {
    isNavigationOpen: context.isNavigationOpen,
    isDefaultOpenOnDesktop: context.isDefaultOpenOnDesktop,
    setIsDefaultOpenOnDesktop: context.setIsDefaultOpenOnDesktop,
    isFullContent: context.isFullContent,
    setIsFullContent: context.setIsFullContent,
    openNavigation,
    closeNavigation,
    toggleNavigation,
  }
}

export const NCLayout: FC<Props> = ({
  navigation,
  children,
  width = '100%',
  height = '100%',
  showGrid = false,
  backgroundColor = 'transparent',
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false)
  const [isDefaultOpenOnDesktop, setIsDefaultOpenOnDesktop] = React.useState(true)
  const [isFullContent, setIsFullContent] = React.useState(false)
  const { isOpenSomeModal } = useModalContext()
  const { attachToRef } = useModal()
  const { matches, breakpointProps } = useBreakpoint()

  useEffect(() => {
    console.log('navigation state: ', isNavigationOpen)
  }, [isNavigationOpen])

  useEffect(() => {
    if (matches.lg) {
      if (isDefaultOpenOnDesktop) {
        setIsNavigationOpen(true)
      } else {
        setIsNavigationOpen(false)
      }
    } else {
      setIsDefaultOpenOnDesktop(true)
    }
  }, [matches, isDefaultOpenOnDesktop, isFullContent])

  return (
    <NCLayoutContext.Provider
      value={{
        isDefaultOpenOnDesktop,
        setIsDefaultOpenOnDesktop,
        isNavigationOpen,
        setIsNavigationOpen,
        isFullContent,
        setIsFullContent,
      }}
    >
      <LayoutFrame data-modal-open={isOpenSomeModal || undefined} {...breakpointProps}>
        <NavigationFrame
          data-nav-opened={isNavigationOpen && !isOpenSomeModal}
          {...breakpointProps}
        >
          {navigation}
        </NavigationFrame>
        <ContentFrame
          data-nav-opened={!matches.lg && isNavigationOpen && !isOpenSomeModal}
          data-modal-open={isOpenSomeModal || undefined}
          data-full-content={isFullContent || undefined}
          {...breakpointProps}
          // onClick={() => setIsNavigationOpen(false)}
          ref={attachToRef}
        >
          {children}
          {!matches.lg && isNavigationOpen && !isOpenSomeModal && (
            <CloseNaviOverlay onPress={() => setIsNavigationOpen(false)} />
          )}
        </ContentFrame>
      </LayoutFrame>
    </NCLayoutContext.Provider>
  )
}

const LayoutFrame = styled.div<{ contentWidth?: number }>`
  position: relative;
  display: grid;
  height: 100svh;
  grid-template-columns: min-content min-content;
  background: var(--kai-color-sys-background);
  width: 100%;

  &[data-media-lg] {
    display: flex;
    justify-content: center;
  }

  &[data-modal-open] {
    opacity: 0.4;
    transform: scale(0.98);
  }
  /* md */
  /* @media (min-width: var(--kai-size-breakpoint-md-min-width)) {
    width: 100vw;
    height: 100vh;
    grid-template-columns: min-content 1fr;
    background: var(--kai-color-sys-surface-container-high);
  } */
`

const NavigationFrame = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  width: 0;
  height: auto;
  transition: width var(--kai-motion-sys-duration-medium) var(--kai-motion-sys-easing-standard);
  /* background: var(--kai-color-sys-surface-container-high); */
  overflow: hidden;

  &[data-nav-opened='true'] {
    width: var(--kai-size-ref-240);
    height: 100%;
  }

  &[data-media-lg] {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--kai-size-ref-240);
    &[data-nav-opened='false'] {
      width: 0;
    }
  }
`

const ContentFrame = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  position: relative;
  width: 100vw;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  height: 100svh;
  transition: all var(--kai-motion-sys-duration-medium) var(--kai-motion-sys-easing-standard);
  transition-property: opacity, transform;
  overflow-y: scroll;

  &[data-nav-opened='true'] {
    opacity: 0.4;
    /* transform: scale(0.98); */
  }
  &:hover {
    &[data-nav-opened='true'] {
      cursor: pointer;
    }
  }
  &[data-modal-open='true'] {
    opacity: 0.4;
    transform: scale(0.98);
  }
  &[data-full-content] {
    &[data-media-lg] {
      width: 100vw;
      max-width: 100vw;
    }
  }
`

const CloseNaviOverlay = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: transparent;
  opacity: 0;
  outline: none;
  border: none;
  z-index: var(--kai-z-index-sys-overlay-default);
`
