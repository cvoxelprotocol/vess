import styled from '@emotion/styled'
import { FC } from 'react'

type Props = {
  children: React.ReactNode
  flexDirection?: string
  flexDirectionSP?: string
  alignItems?: string
  justifyContent?: string
  alignItemsSP?: string
  justifyContentSP?: string
  rowGap?: string
  colGap?: string
  height?: string
  flexWrap?: string
  width?: string
  padding?: string
  paddingSP?: string
}
export const Flex: FC<Props> = ({
  children,
  flexDirection = 'row',
  alignItems = 'center',
  justifyContent = 'center',
  rowGap,
  colGap,
  height = 'auto',
  flexWrap = 'wrap',
  width = 'fit-content',
  padding = '0px',
  paddingSP,
  flexDirectionSP,
  alignItemsSP,
  justifyContentSP,
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
    @media (max-width: 599px) {
      flex-direction: ${flexDirectionSP ?? flexDirection};
      align-items: ${alignItemsSP ?? alignItems};
      justify-content: ${justifyContentSP ?? justifyContent};
      padding: ${paddingSP || padding};
    }
  `
  return <Flex>{children}</Flex>
}
