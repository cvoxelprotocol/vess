import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
// This component is under development
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  btnWidth?: string
  variant?: 'filled' | 'outlined' | 'text'
  mainColor?: string
  textColor?: string
  focusColor?: string
  size?: IconSize
  fill?: boolean
}

export const TextButton: FC<ButtonProps> = ({
  btnWidth = 'fit-content',
  variant = 'filled',
  size = 'M',
  textColor,
  focusColor,
  mainColor,
  fill = false,
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
      width: ${fill ? '100%' : btnWidth};
    `
    const ButtonLayer = styled.div`
      background: none;
      border-radius: 79px;
      padding: ${size === 'M' ? '10px 20px' : '4px 8px'};
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      width: ${fill ? '100%' : btnWidth};
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
         
          <ButtonText>{props.text}</ButtonText>
        </ButtonLayer>
      </ButtonContainer>
    )
  }

  const ButtonContainer = styled.button`
    background: 'transparent';
    border:  'none';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    width: ${fill ? '100%' : btnWidth};
  `
  const ButtonLayer = styled.div`
    background: none;
    &:hover {
      background: ${focusColor ||
      (variant === 'filled' ? currentTheme.onPrimaryContainerOpacity40 : currentTheme.surface5)};
      transition: all 0.15s ease-out;
      cursor: pointer;
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: ${fill ? '100%' : btnWidth};
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
        
        <ButtonText>{props.text}</ButtonText>
      </ButtonLayer>
    </ButtonContainer>
  )
}
