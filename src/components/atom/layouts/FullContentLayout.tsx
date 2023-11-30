import styled from '@emotion/styled'
import React, { FC } from 'react'

type Props = {
  children?: React.ReactNode
  showGrid?: boolean
  backgroundColor?: string
}

export const FullContentLayout: FC<Props> = ({
  children,
  showGrid = false,
  backgroundColor = 'transparent',
}) => {
  const LayoutContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${showGrid ? 'red' : backgroundColor};
  `

  return <LayoutContainer>{children}</LayoutContainer>
}
