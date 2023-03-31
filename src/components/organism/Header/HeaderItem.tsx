import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
}

export const HeaderItem: FC<Props> = ({ title, ...props }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const NavigationItemContainer = styled.button`
    background: none;
    border: none;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    align-self: stretch;
    flex-shrink: 0;
    padding: 8px;
    width: 100%;
  `

  const NavigationItemLayer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
    border-width: 1px;
  `

  const NavigationItemTitle = styled.span`
    background: none;
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.large)}
    text-align: left;
    white-space: nowrap;
  `

  return (
    <NavigationItemContainer {...props}>
      <NavigationItemLayer>
        <NavigationItemTitle>{title}</NavigationItemTitle>
      </NavigationItemLayer>
    </NavigationItemContainer>
  )
}
