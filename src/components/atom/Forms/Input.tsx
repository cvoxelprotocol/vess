import styled from '@emotion/styled'
import { FocusEvent, ChangeEvent, HTMLInputTypeAttribute, useMemo } from 'react'
import { Control, Controller, FieldValues, Path, ValidationRule } from 'react-hook-form'
import { IconButton } from '../Buttons/IconButton'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props<T extends FieldValues> = {
  label?: string
  name: Path<T>
  error?: string
  control: Control<T>
  width?: number
  required?: string
  pattern?: ValidationRule<RegExp> | undefined
  icon?: IconsType
  iconSize?: IconSize
  iconColor?: string
  placeholder?: string
  inputType?: HTMLInputTypeAttribute
  onClickClear?: () => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const Input = <T extends FieldValues>({
  required,
  pattern,
  name,
  label,
  control,
  error,
  icon,
  iconSize = 'S',
  iconColor,
  placeholder,
  width,
  inputType = 'text',
  onClickClear,
  onChange,
  onBlur,
  disabled = false,
}: Props<T>) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const ContainerWidth = useMemo(() => {
    return !width ? '100%' : `${width}px`
  }, [width])

  const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    justify-content: center;
    width: ${ContainerWidth};
    position: relative;
  `
  const Label = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.large)}
  `
  const InputLayer = styled.div`
    background: none;
    outline: none;
    border-radius: 8px 8px 0px 0px;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    border: solid ${currentTheme.onSurface};
    border-width: 0px 0px 1px 0px;
    column-gap: 8px;
    position: relative;
    display: flex;
    min-width: 160px;
    width: 100%;
  `
  const Input = styled.input`
    &:hover {
      background: ${currentTheme.depth1};
      outline: none;
    }
    &:focus {
      outline: none;
      background: ${currentTheme.depth2};
    }
    &:active {
      outline: none;
    }
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.large)}
    flex-grow: 1;
    border: none;
    background: transparent;
    position: absolute;
    border-radius: 8px 8px 0px 0px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    padding: ${icon ? '0px 44px 0 46px' : '0px 44px 0 16px'};
    margin: 0;
  `
  const TailIconButtonWrapper = styled.div`
    position: absolute;
    right: 18px;
  `
  const IconWrapper = styled.div`
    position: absolute;
    left: 16px;
    z-index: 20;
  `
  const SupportingText = styled.span`
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.body.small)}
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)}
  `

  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <InputLayer>
        {icon && (
          <IconWrapper>
            {' '}
            <Icon icon={icon} size={iconSize} mainColor={iconColor || currentTheme.onSurface} />
          </IconWrapper>
        )}
        <Controller
          control={control}
          rules={{ required: required || false, pattern: pattern }}
          name={name}
          render={({ field }) => (
            <Input
              disabled={disabled}
              placeholder={placeholder}
              {...field}
              type={inputType}
              // onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {onClickClear && (
          <TailIconButtonWrapper>
            <IconButton
              icon={ICONS.CROSS}
              size={'S'}
              mainColor={currentTheme.depth1}
              backgroundColor={currentTheme.outline}
              onClick={() => onClickClear()}
            />
          </TailIconButtonWrapper>
        )}
      </InputLayer>
      {error && <SupportingText>{error}</SupportingText>}
    </InputContainer>
  )
}
