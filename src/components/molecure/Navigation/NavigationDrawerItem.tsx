import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Icon, ICONS, IconsType } from '@/components/atom/Icons/Icon'
import { Text } from '@/components/atom/Texts/Text'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconsType
  title?: string
  selected?: boolean
  metadata?: string
  external?: boolean
}

export const NavigationDrawerItem: FC<Props> = ({
  icon,
  title,
  metadata,
  selected = false,
  external,
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const NavigationItemContainer = styled.button`
    background: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: start;
    border: none;
    border-radius: 10rem;
    padding: 1rem 1.5rem;
    cursor: pointer;
    background: ${selected ? currentTheme.secondaryContainer : 'none'};
    &:hover {
      background: ${selected ? currentTheme.secondaryContainer : currentTheme.depth2};
      transition: all 0.15s ease-out;
    }
  `

  const NavigationItemLayer = styled.div`
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
        <Icon
          icon={icon}
          size={'L'}
          mainColor={selected ? currentTheme.secondary : currentTheme.onSecondaryContainer}
        />
      </NavigationItemLayer>
      {title && (
        <Text
          type='p'
          color={selected ? currentTheme.secondary : currentTheme.onSecondaryContainer}
          font={getBasicFont(currentTypo.title.medium)}
          text={title}
          afterIcon={external ? ICONS.EXTERNAL : undefined}
        />
      )}
    </NavigationItemContainer>
  )
}
