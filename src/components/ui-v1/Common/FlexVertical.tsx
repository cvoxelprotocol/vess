import styled from '@emotion/styled'
import { FC } from 'react'

type Props = {
  children: React.ReactNode
  alignItems?: string
  justifyContent?: string
  alignItemsSP?: string
  justifyContentSP?: string
  gap?: string
  gapSP?: string
  height?: string
  width?: string
  padding?: string
  paddingSP?: string
  background?: string
  grow?: number | string
}
export const FlexVertical: FC<Props> = ({
  children,
  alignItems = 'start',
  justifyContent = 'start',
  gap,
  gapSP,
  height = 'auto',
  width = 'fit-content',
  padding = '0px',
  paddingSP,
  alignItemsSP,
  justifyContentSP,
  background = 'transparent',
  grow = 'inherit',
}) => {
  const Flex = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${alignItems};
    justify-content: ${justifyContent};
    row-gap: ${gap};
    column-gap: ${gap};
    height: ${height};
    flex-wrap: none;
    width: ${width};
    padding: ${padding};
    background: ${background};
    flex-grow: ${grow};
    @media (max-width: 599px) {
      flex-direction: column;
      align-items: ${alignItemsSP ?? alignItems};
      justify-content: ${justifyContentSP ?? justifyContent};
      padding: ${paddingSP || padding};
      column-gap: ${gapSP || gap};
      row-gap: ${gapSP || gap};
    }
  `
  return <Flex>{children}</Flex>
}
