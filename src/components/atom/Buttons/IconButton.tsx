import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC, HTMLAttributes } from 'react'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface IconButtonStyleProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'filled' | 'outlined' | 'text'
  mainColor?: string
  focusColor?: string
  backgroundColor?: string
  icon: IconsType
  size?: IconSize
  disabled?: boolean
}

export const IconButton: FC<IconButtonStyleProps> = ({
  variant = 'filled',
  icon,
  size = 'M',
  mainColor,
  focusColor,
  disabled = false,
  backgroundColor,
  ...props
}) => {
  const { currentTheme } = useVESSTheme()

  if (disabled) {
    const ButtonContainer = styled.div`
      background: ${variant === 'filled' ? currentTheme.surfaceVariant : 'none'};
      opacity: ${variant === 'filled' ? 1 : 0.4};
      border: ${variant === 'outlined' ? `solid ${currentTheme.outline}` : 'none'};
      border-radius: 67px;
      border-width: 1px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0;
      width: fit-content;
    `
    const ButtonLayer = styled.div`
      background: none;
      border-radius: 79px;
      padding: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    `
    return (
      <ButtonContainer {...props}>
        <ButtonLayer>
          {icon && (
            <Icon
              icon={icon}
              size={size}
              mainColor={
                mainColor ?? (variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary)
              }
              focusColor={
                focusColor ??
                (variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary)
              }
            />
          )}
        </ButtonLayer>
      </ButtonContainer>
    )
  }

  const ButtonContainer = styled.div`
    background: ${variant === 'filled' ? backgroundColor : 'transparent'};
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
    width: fit-content;
    cursor: pointer;
  `
  const ButtonLayer = styled.div`
    background: none;
    &:hover {
      background: ${variant === 'filled'
        ? currentTheme.onPrimaryContainerOpacity40
        : currentTheme.surface5};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled'
        ? currentTheme.onPrimaryContainerOpacity40
        : currentTheme.primaryContainer};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled'
        ? currentTheme.onPrimaryContainerOpacity40
        : currentTheme.primaryContainer};
    }
    border-radius: 79px;
    padding: ${size === 'S' || size === 'XS' ? '6px' : '10px'};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
  `

  return (
    <ButtonContainer {...props}>
      <ButtonLayer>
        <Icon
          icon={icon}
          size={size}
          mainColor={
            mainColor ?? (variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary)
          }
          focusColor={
            focusColor ??
            (variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary)
          }
        />
      </ButtonLayer>
    </ButtonContainer>
  )
}
