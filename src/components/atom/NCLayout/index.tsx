import styled from '@emotion/styled'
import React, { FC } from 'react'
import { Navigation } from 'react-calendar'

type Props = {
  navigation?: React.ReactNode
  children?: React.ReactNode
  backgroundColor?: string
  width?: string
  height?: string
  showGrid?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const NCLayoutContext = React.createContext({
  isNavigationOpen: false,
  setIsNavigationOpen: (isOpen: boolean) => {},
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

  return (
    <NCLayoutContext.Provider
      value={{ isNavigationOpen: isNavigationOpen, setIsNavigationOpen: setIsNavigationOpen }}
    >
      <LayoutFrame>
        <NavigationFrame data-nav-opened={isNavigationOpen}>{navigation}</NavigationFrame>
        <ContentFrame data-nav-opened={isNavigationOpen} onClick={() => setIsNavigationOpen(false)}>
          {children}
        </ContentFrame>
      </LayoutFrame>
    </NCLayoutContext.Provider>
  )
}

const LayoutFrame = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: min-content min-content;
  background: var(--kai-color-sys-background);

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
  transition: width 1s cubic-bezier(0, 0.7, 0.3, 1);
  /* background: var(--kai-color-sys-surface-container-high); */
  overflow: hidden;
  &[data-nav-opened='true'] {
    width: var(--kai-size-ref-240);
    height: 100%;
  }
`

const ContentFrame = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  width: 100vw;
  max-width: var(--kai-size-breakpoint-sm-max-width);
  height: 100vh;
  transition: all 1s cubic-bezier(0, 0.7, 0.3, 1);

  &[data-nav-opened='true'] {
    opacity: 0.4;
    transform: scale(0.98);
  }
  &:hover {
    &[data-nav-opened='true'] {
      cursor: pointer;
    }
  }
`
