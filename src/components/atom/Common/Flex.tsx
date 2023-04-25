import styled from '@emotion/styled'
import { FC, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  flexDirection?: string
  flexDirectionSP?: string
  alignItems?: string
  justifyContent?: string
  alignItemsSP?: string
  justifyContentSP?: string
  rowGap?: string
  colGap?: string
  rowGapSP?: string
  colGapSP?: string
  height?: string
  flexWrap?: string
  width?: string
  padding?: string
  paddingSP?: string
  hideSP?: boolean
  background?: string
  margin?: string
}
export const Flex: FC<Props> = ({
  children,
  flexDirection = 'row',
  alignItems = 'center',
  justifyContent = 'center',
  rowGap,
  colGap,
  rowGapSP,
  colGapSP,
  height = 'auto',
  flexWrap = 'wrap',
  width = 'fit-content',
  padding = '0px',
  paddingSP,
  flexDirectionSP,
  alignItemsSP,
  justifyContentSP,
  hideSP = false,
  background = 'inherit',
  margin = '0px',
  ...props
}) => {
  const Flex = styled.div`
    display: flex;
    flex-direction: ${flexDirection};
    align-items: ${alignItems};
    justify-content: ${justifyContent};
    row-gap: ${rowGap};
    column-gap: ${colGap || rowGap};
    height: ${height};
    flex-wrap: ${flexWrap};
    width: ${width};
    padding: ${padding};
    margin: ${margin};
    background: ${background};
    @media (max-width: 599px) {
      display: ${hideSP ? 'none' : 'flex'};
      flex-direction: ${flexDirectionSP || flexDirection};
      align-items: ${alignItemsSP ?? alignItems};
      justify-content: ${justifyContentSP ?? justifyContent};
      padding: ${paddingSP || padding};
      column-gap: ${colGapSP || colGap};
      row-gap: ${rowGapSP || rowGap};
    }
  `
  return <Flex {...props}>{children}</Flex>
}
