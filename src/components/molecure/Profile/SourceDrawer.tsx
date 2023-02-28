import styled from '@emotion/styled'
import { FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'
type Props = {
  children: React.ReactNode
}

export const SourceDrawer: FC<Props> = ({ children }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const DrawerContainer = styled.div`
    background-color: ${currentTheme.surfaceVariant};
    width: fit-content;
    height: fit-content;
    padding: 4px 8px 4px 4px;
    display: flex;
    grid-template-columns: repeat(3, 30%);
    justify-content: start;
    align-items: center;
    border: 1px solid ${currentTheme.outline};
    border-right: none;
    border-radius: 99px 0 0 99px;
    overflow: hidden;
    transform: translateX(144px);
    transition: all 0.3s;

    &:hover {
      width: fit-content;
      justify-content: start;
      transform: none;
    }
  `

  return <DrawerContainer>{children}</DrawerContainer>
}
