import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Icon, IconsType } from '@/components/atom/Icons/Icon'
import { Text } from '@/components/atom/Texts/Text'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconsType
  title?: string
  selected?: boolean
  metadata?: string
}

export const NavigationItem: FC<Props> = ({
  icon,
  title,
  metadata,
  selected = false,
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

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
    cursor: pointer;
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
    @media (max-width: 599px) {
      padding: 0;
      max-width: 32px;
      height: 32px;
    }
  `
  return (
    <NavigationItemContainer {...props}>
      <NavigationItemLayer>
        <Icon icon={icon} size={'LL'} mainColor={currentTheme.onSecondaryContainer} />
      </NavigationItemLayer>
      {title && (
        <Text
          type='p'
          color={selected ? currentTheme.secondary : currentTheme.onSecondaryContainer}
          font={getBasicFont(currentTypo.label.medium)}
          text={title}
        />
      )}
    </NavigationItemContainer>
  )
}
