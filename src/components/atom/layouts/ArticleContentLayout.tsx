import styled from '@emotion/styled'
import React, { FC } from 'react'

type Props = {
  children?: React.ReactNode
  width?: string
  height?: string
  maxWidth?: string
  showGrid?: boolean
  gap?: string
}

export const ArticleContentLayout: FC<Props> = ({
  children,
  width = '100%',
  height = '100%',
  maxWidth = '800px',
  showGrid = false,
  gap = '16px',
}) => {
  const LayoutContainer = styled.div`
    display: flex;
    justify-content: center;
    width: ${width};
    height: ${height};
    background: ${showGrid ? 'red' : 'transparent'};
    overflow: scroll;
  `

  const ContentContainer = styled.main`
    width: 100%;
    height: fit-content;
    max-width: ${maxWidth};

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    row-gap: ${gap};
    padding: 32px;
  `

  return (
    <LayoutContainer>
      <ContentContainer>{children}</ContentContainer>
    </LayoutContainer>
  )
}
