import styled from '@emotion/styled'
import { FC } from 'react'

type Props = {
  children: React.ReactNode
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  rowGap?: string
  colGap?: string
  height?: string
}
export const Flex: FC<Props> = ({
  children,
  flexDirection = 'row',
  alignItems = 'center',
  justifyContent = 'center',
  rowGap,
  colGap,
  height = 'auto',
}) => {
  const Flex = styled.div`
    display: flex;
    flex-direction: ${flexDirection};
    align-items: ${alignItems};
    justify-content: ${justifyContent};
    row-gap: ${rowGap};
    column-gap: ${colGap || rowGap};
    height: ${height};
  `
  return <Flex>{children}</Flex>
}
