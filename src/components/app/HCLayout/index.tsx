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
  return (
    <LayoutFrame background={backgroundColor}>
      <HeaderFrame>{header}</HeaderFrame>
      <ContentFrame>{children}</ContentFrame>
    </LayoutFrame>
  )
}

const LayoutFrame = styled.div<{ background: string }>`
  width: 100%;
  height: 100svh;
  display: grid;
  grid-template-rows: min-content 1fr;
  overflow-y: scroll;
  overflow-x: hidden;
  background: ${({ background }) => background};
`

const HeaderFrame = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--kai-z-index-sys-fixed-default);
`

const ContentFrame = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  /* overflow-y: scroll; */
`
