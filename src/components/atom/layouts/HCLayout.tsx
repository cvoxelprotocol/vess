import styled from '@emotion/styled'
import React, { FC } from 'react'

type Props = {
  header?: React.ReactNode
  children?: React.ReactNode
  width?: string
  height?: string
  sidebarWidth?: string
  showGrid?: boolean
  backgroundColor?: string
}

export const HCLayout: FC<Props> = ({
  header,
  children,
  width = '100%',
  height = '100%',
  sidebarWidth,
  showGrid = false,
  backgroundColor = 'transparent',
}) => {
  const LayoutContainer = styled.div`
    display: grid;
    width: ${width};
    height: ${height};
    grid-template-rows: 80px 1fr;
    background: ${backgroundColor};
  `

  const HeaderContainer = styled.header`
    grid-column: 1/2;
    grid-row: 1/2;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;

    /* left: ${sidebarWidth ? sidebarWidth : '0px'};
    width: ${sidebarWidth ? `calc(100% - ${sidebarWidth})` : '100%'}; */
    height: 80px;
    background: ${showGrid ? 'red' : 'transparent'};
    z-index: 100;
  `

  const ContentContainer = styled.main`
    grid-column: 1/2;
    grid-row: 2/3;
    background: ${showGrid ? 'lavender' : 'transparent'};
  `

  return (
    <LayoutContainer>
      <HeaderContainer>{header}</HeaderContainer>
      <ContentContainer>{children}</ContentContainer>
    </LayoutContainer>
  )
}
