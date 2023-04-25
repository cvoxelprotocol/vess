import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Flex } from '../Common/Flex'
import { Icon, IconsType } from '../Icons/Icon'
import { Text } from '../Texts/Text'
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

  return (
    <ItemContainer {...props}>
      <Flex rowGap='8px'>
        {icon && <Icon icon={icon} size={'L'} mainColor={currentTheme.onSurface} />}
        <Text
          type='span'
          color={currentTheme.onSurface}
          font={getBasicFont(currentTypo.body.large)}
          text={title}
        />
      </Flex>
      {tailIcon && <Icon icon={tailIcon} size={'L'} mainColor={currentTheme.onSurface} />}
    </ItemContainer>
  )
}
