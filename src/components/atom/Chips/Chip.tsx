import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC, useMemo } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  variant?: 'filled' | 'outlined'
  solo?: boolean
  mainColor: string
  textColor: string
  focusColor?: string
  borderColor?: string
  headIcon?: IconsType
  tailIcon?: IconsType
  size?: IconSize
  btnType?: 'button' | 'submit' | 'reset'
  selected?: boolean
  tailIconAction?: () => void
}

export const Chip: FC<ChipProps> = ({
  variant = 'outlined',
  headIcon,
  tailIcon,
  solo = false,
  size = 'M',
  mainColor,
  focusColor,
  borderColor,
  textColor,
  btnType = 'button',
  selected,
  tailIconAction,
  ...props
}) => {
  const { currentTheme, currentTypo } = useVESSTheme()

  const label = useMemo(() => {
    if (size === 'S') return currentTypo.label.small
    if (size === 'L') return currentTypo.label.large
    return currentTypo.label.medium
  }, [size, currentTypo])

  if (props.disabled) {
    const ChipContainer = styled.button`
      background: none;
      opacity: ${variant === 'outlined' ? 1 : 0.4};
      border-radius: 67px;
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
      background: ${variant === 'filled' ? mainColor || currentTheme.surfaceVariant : 'none'};
      border: ${borderColor || (variant === 'outlined' ? `solid ${currentTheme.outline}` : 'none')};
      border-radius: ${solo ? '8px' : '79px'};
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: flex;
      width: fit-content;
      border-width: 1px;
      padding: 6px 16px 6px 16px;
    `

    const ChipText = styled.span`
      background: none;
      color: ${textColor ||
      (variant === 'filled' ? currentTheme.onSurfaceVariant : currentTheme.onSurface)};
      opacity: ${variant === 'filled' ? 1 : 0.4};
      text-align: center;
      font-family: ${label.fontFamily};
      font-size: ${label.fontSize};
      line-height: ${label.lineHeight};
      font-weight: ${label.fontWeight};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    `
    return (
      <ChipContainer {...props} type={btnType}>
        <ChipLayer>
          {headIcon && (
            <Icon
              icon={headIcon}
              size={size}
              mainColor={variant === 'filled' ? currentTheme.onPrimary : currentTheme.primary}
              focusColor={
                variant === 'filled' ? currentTheme.primaryContainer : currentTheme.primary
              }
            />
          )}
          <ChipText>{props.text}</ChipText>
        </ChipLayer>
      </ChipContainer>
    )
  }

  const ChipContainer = styled.button`
    background: ${variant === 'filled' ? mainColor : 'none'};
    &:hover {
      background: ${variant === 'filled' ? focusColor || mainColor : 'none'};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled' ? focusColor || mainColor : 'none'};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled' ? focusColor || mainColor : 'none'};
    }
    border-radius: ${solo ? '8px' : '67px'};
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
    background: ${selected
      ? focusColor || currentTheme.onPrimaryContainerOpacity40
      : variant === 'filled'
      ? focusColor || mainColor
      : 'none'};
    &:hover {
      background: ${variant === 'filled'
        ? focusColor || currentTheme.onPrimaryContainerOpacity10
        : currentTheme.surface1};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled'
        ? focusColor || currentTheme.onPrimaryContainerOpacity10
        : currentTheme.surface1};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${variant === 'filled'
        ? focusColor || currentTheme.onPrimaryContainerOpacity10
        : currentTheme.surface1};
    }
    border: ${variant === 'outlined' ? `solid ${currentTheme.outline}` : 'none'};
    border-radius: ${solo ? '8px' : '79px'};
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
    border-width: 1px;
    padding: 6px 16px 6px 16px;
  `

  const ChipText = styled.span`
    background: none;
    color: ${variant === 'filled'
      ? textColor || currentTheme.onPrimaryContainer
      : currentTheme.onSurface};
    &:active {
      transition: all 0.15s ease-out;
      color: ${variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer};
    }
    &:focus {
      transition: all 0.15s ease-out;
      color: ${variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer};
    }
    text-align: center;
    font-family: ${label.fontFamily};
    font-size: ${label.fontSize};
    line-height: ${label.lineHeight};
    font-weight: ${label.fontWeight};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  `

  return (
    <ChipContainer {...props} type={btnType}>
      <ChipLayer>
        {headIcon && (
          <Icon
            icon={headIcon}
            size={size}
            mainColor={
              variant === 'filled'
                ? textColor || currentTheme.onPrimaryContainer
                : currentTheme.onSurface
            }
            focusColor={
              variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer
            }
          />
        )}
        <ChipText>{props.text}</ChipText>
        {tailIcon && (
          <>
            {tailIconAction ? (
              <IconButton
                icon={tailIcon}
                size={size}
                mainColor={
                  mainColor || variant === 'filled'
                    ? currentTheme.onPrimaryContainer
                    : currentTheme.onSurface
                }
                focusColor={
                  mainColor ||
                  (variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer)
                }
                onClick={() => tailIconAction()}
              />
            ) : (
              <Icon
                icon={tailIcon}
                size={size}
                mainColor={
                  mainColor || variant === 'filled'
                    ? currentTheme.onPrimaryContainer
                    : currentTheme.onSurface
                }
                focusColor={
                  mainColor ||
                  (variant === 'filled' ? currentTheme.onPrimary : currentTheme.onPrimaryContainer)
                }
              />
            )}
          </>
        )}
      </ChipLayer>
    </ChipContainer>
  )
}
