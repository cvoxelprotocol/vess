import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  btnWidth?: string
  variant?: 'filled' | 'outlined' | 'text'
  mainColor?: string
  textColor?: string
  focusColor?: string
  icon?: IconsType
  size?: IconSize
}

export const Button: FC<ButtonProps> = ({
  btnWidth = 'fit-content',
  variant = 'filled',
  icon,
  size = 'M',
  textColor,
  focusColor,
  mainColor,
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  if (props.disabled) {
    const ButtonContainer = styled.button`
      background: ${variant === 'filled' ? currentTheme.surfaceVariant : 'transparent'};
      opacity: ${variant === 'filled' ? 1 : 0.4};
      border: ${variant === 'outlined' ? `solid ${currentTheme.outline}` : 'none'};
      border-radius: 67px;
      border-width: 1px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0;
      width: ${btnWidth};
    `
    const ButtonLayer = styled.div`
      background: none;
      border-radius: 79px;
      padding: 10px 20px 10px 20px;
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      width: ${btnWidth};
    `
    const ButtonText = styled.span`
      background: none;
      color: ${currentTheme.onSurfaceVariant};
      opacity: ${variant === 'filled' ? 0.4 : 1};
      text-align: center;
      ${getBasicFont(currentTypo.label.large)}
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    `
    return (
      <ButtonContainer {...props}>
        <ButtonLayer>
          {icon && (
            <Icon
              icon={icon}
              size={size}
              mainColor={variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary}
              focusColor={
                variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary
              }
            />
          )}
          <ButtonText>{props.text}</ButtonText>
        </ButtonLayer>
      </ButtonContainer>
    )
  }

  const ButtonContainer = styled.button`
    background: ${variant === 'filled' ? mainColor || currentTheme.primary : 'transparent'};
    border: ${variant === 'outlined' ? `solid ${mainColor || currentTheme.primary}` : 'none'};
    border-radius: 67px;
    border-width: 1px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    width: ${btnWidth};
  `
  const ButtonLayer = styled.div`
    background: none;
    &:hover {
      background: ${focusColor ||
      (variant === 'filled' ? currentTheme.onPrimaryContainerOpacity40 : currentTheme.surface5)};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${focusColor ||
      (variant === 'filled'
        ? currentTheme.onPrimaryContainerOpacity40
        : currentTheme.primaryContainer)};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${focusColor ||
      (variant === 'filled'
        ? currentTheme.onPrimaryContainerOpacity40
        : currentTheme.primaryContainer)};
    }
    border-radius: 79px;
    padding: ${size === 'S' ? '8px 12px' : '10px 20px '};
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: ${btnWidth};
  `

  const ButtonText = styled.span`
    background: none;
    color: ${textColor || (variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary)};
    &:active {
      transition: all 0.15s ease-out;
      color: ${variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary};
    }
    &:focus {
      transition: all 0.15s ease-out;
      color: ${variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary};
    }
    text-align: center;
    ${getBasicFont(currentTypo.label.large)}
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  `

  return (
    <ButtonContainer {...props}>
      <ButtonLayer>
        {icon && (
          <Icon
            icon={icon}
            size={size}
            mainColor={
              textColor || (variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary)
            }
            focusColor={
              textColor ||
              (variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary)
            }
          />
        )}
        <ButtonText>{props.text}</ButtonText>
      </ButtonLayer>
    </ButtonContainer>
  )
}
