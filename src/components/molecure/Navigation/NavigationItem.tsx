import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'

import { Icon, IconSize, IconsType } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconsType
  title: string
  selected?: boolean
  size?: IconSize
  metadata?: string
}

export const NavigationItem: FC<Props> = ({
  icon,
  title,
  metadata,
  size = 'XL',
  selected = false,
  ...props
}) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()

  const NavigationItemContainer = styled.button`
    background: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 0;
  `
  const NavigationItemLayer = styled.div`
    background: ${selected ? currentTheme.secondaryContainer : 'none'};
    &:hover {
      background: ${selected ? currentTheme.secondaryContainer : currentTheme.depth2};
      transition: all 0.15s ease-out;
    }
    border-radius: ${'36px'};
    border: none;
    width: 100%;
    padding: 2px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  const NavigationItemTitle = styled.p`
    background: none;
    color: ${selected ? currentTheme.secondary : currentTheme.onSecondaryContainer};
    text-align: center;
    font: ${getFont(currentTypo.label.medium)};
    white-space: nowrap;
  `

  return (
    <NavigationItemContainer {...props}>
      <NavigationItemLayer>
        <Icon icon={icon} size={size} mainColor={currentTheme.onSecondaryContainer} />
      </NavigationItemLayer>
      <NavigationItemTitle>{title}</NavigationItemTitle>
    </NavigationItemContainer>
  )
}
