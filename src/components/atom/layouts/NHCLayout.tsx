import styled from '@emotion/styled'
import React, { FC } from 'react'

type Props = {
  navigation?: React.ReactNode
  header?: React.ReactNode
  children?: React.ReactNode
  width?: string
  height?: string
  showGrid?: boolean
}

export const NHCLayout: FC<Props> = ({
  navigation,
  header,
  children,
  width = '100%',
  height = '100%',
  showGrid = false,
}) => {
  const LayoutContainer = styled.div`
    display: grid;
    width: ${width};
    height: ${height};
    grid-template-columns: 280px 1fr;
    grid-template-rows: 80px 1fr;
  `

  const NaviContainer = styled.nav`
    grid-column: 1/2;
    grid-row: 1/3;
    width: 280px;
    height: 100vh;
    position: fixed;
    background: ${showGrid ? 'aliceblue' : 'transparent'};
  `

  const HeaderWrapper = styled.div`
    grid-column: 2/3;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
    position: relative;
  `

  const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    z-index: 100;
    background: ${showGrid ? 'red' : 'transparent'};
    width: 100%;
    height: 80px;
  `

  const ContentContainer = styled.main`
    grid-column: 2/3;
    grid-row: 2/3;
    background: ${showGrid ? 'lavender' : 'transparent'};
  `

  return (
    <LayoutContainer>
      <NaviContainer>{navigation}</NaviContainer>
      <HeaderWrapper>
        <HeaderContainer>{header}</HeaderContainer>
      </HeaderWrapper>
      <ContentContainer>{children}</ContentContainer>
    </LayoutContainer>
  )
}
