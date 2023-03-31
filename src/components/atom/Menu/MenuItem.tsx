import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Icon, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  title: string
  icon?: IconsType
  tailIcon?: IconsType
  width?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const MenuItem: FC<Props> = ({ title, icon, tailIcon, width, ...props }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const ItemContainer = styled.button`
    width: ${width || '100%'};
    padding: 16px 16px;
    display: flex;
    justify-content: space-between;
    background: transparent;
    border: none;

    &:hover {
      background: ${currentTheme.surface5};
      cursor: pointer;
    }
  `
  const ItemTitleContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
  `

  const IconContainer = styled.div`
    width: 16px;
    height: 16px;
  `

  const Title = styled.span`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.large)};
  `

  return (
    <ItemContainer {...props}>
      <ItemTitleContainer>
        {icon && <Icon icon={icon} size={'L'} mainColor={currentTheme.onSurface} />}
        <Title>{title}</Title>
      </ItemTitleContainer>
      {tailIcon && <Icon icon={tailIcon} size={'L'} mainColor={currentTheme.onSurface} />}
    </ItemContainer>
  )
}
