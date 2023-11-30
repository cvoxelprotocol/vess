import styled from '@emotion/styled'
import React, { FC } from 'react'

type Props = {
  navigation?: React.ReactNode
  children?: React.ReactNode
  backgroundColor?: string
  width?: string
  height?: string
  showGrid?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const NCLayout: FC<Props> = ({
  navigation,
  children,
  width = '100%',
  height = '100%',
  showGrid = false,
  backgroundColor = 'transparent',
}) => {
  const LayoutContainer = styled.div`
    display: grid;
    width: ${width};
    height: ${height};
    grid-template-columns: 280px 1fr;
    background: ${backgroundColor};
  `
  const NaviContainer = styled.nav`
    grid-column: 1/2;
    grid-row: 1/2;
    width: 280px;
    height: 100vh;
    position: fixed;
    background: ${showGrid ? 'aliceblue' : 'transparent'};
  `

  const ContentContainer = styled.main`
    grid-column: 2/3;
    grid-row: 1/2;
    background: ${showGrid ? 'lavender' : 'transparent'};
  `

  return (
    <LayoutContainer>
      <NaviContainer>{navigation}</NaviContainer>
      <ContentContainer>{children}</ContentContainer>
    </LayoutContainer>
  )
}
