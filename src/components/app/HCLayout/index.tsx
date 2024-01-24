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
    <LayoutFrame>
      <HeaderFrame>{header}</HeaderFrame>
      <ContentFrame>{children}</ContentFrame>
    </LayoutFrame>
  )
}

const LayoutFrame = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr;
  overflow-y: scroll;
  overflow-x: hidden;
`

const HeaderFrame = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
`

const ContentFrame = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
`
