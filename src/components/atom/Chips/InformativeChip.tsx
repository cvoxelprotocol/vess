import styled from '@emotion/styled'
import { FC } from 'react'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface ChipStyleProps {
  variant?: 'filled' | 'outlined'
  solo?: boolean
  mainColor?: string
  textColor?: string
  headIcon?: IconsType
  size?: IconSize
}

interface ChipProps extends ChipStyleProps {
  text: string
}

export const InformativeChip: FC<ChipProps> = ({
  variant = 'outlined',
  headIcon,
  solo = false,
  size = 'M',
  textColor = 'light:text-light-on-primary dark:text-dark-on-primary',
  mainColor = 'light:bg-light-primary dark:bg-dark-primary',
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const ChipContainer = styled.div`
    background: none;
    border-radius: ${solo ? '6px' : '67px'};
    border: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: fit-content;
    height: fit-content;
  `
  const ChipLayer = styled.div`
    background: ${variant === 'filled' ? currentTheme.primaryContainer : 'none'};
    border: ${variant === 'outlined' ? `solid ${currentTheme.outline}` : 'none'};
    border-radius: ${solo ? '6px' : '79px'};
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
    border-width: 1px;
    padding: ${size === 'S' ? '4px 12px 4px 12px' : '6px 16px 6px 16px'};
  `

  const ChipText = styled.span`
    background: none;
    color: ${variant === 'filled' ? currentTheme.onPrimaryContainer : currentTheme.onSurface};
    text-align: center;
    ${getBasicFont(currentTypo.label.small)}
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  `

  return (
    <ChipContainer {...props}>
      <ChipLayer>
        {headIcon && (
          <Icon
            icon={headIcon}
            size={size}
            mainColor={
              variant === 'filled' ? currentTheme.onPrimaryContainer : currentTheme.onSurface
            }
            focusColor={
              variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer
            }
          />
        )}
        <ChipText>{props.text}</ChipText>
      </ChipLayer>
    </ChipContainer>
  )
}
