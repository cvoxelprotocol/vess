import styled from '@emotion/styled'
import { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import type { ControlProps, MultiValueGenericProps, SingleValueProps } from 'react-select'
import Select, { components } from 'react-select'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { colourStyles, TagOption, getTagOption } from '@/constants/tags'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props<T extends FieldValues> = {
  required?: boolean
  label?: string
  name: Path<T>
  error?: string
  control: Control<T>
  icon?: IconsType
  iconSize?: IconSize
  iconColor?: string
  placeholder?: string
  width?: number
  val?: string
  options: TagOption[]
}

export const TagUniqueSelect = <T extends FieldValues>({
  required = false,
  name,
  control,
  label,
  val,
  width,
  error,
  options,
  placeholder,
  icon,
  iconSize = 'S',
  iconColor,
}: Props<T>) => {
  const { currentTheme, currentTypo, themeMode, getFont } = useVESSTheme()

  const defaultVal = useMemo(() => {
    if (!options) return undefined
    return !val ? undefined : getTagOption(val, options)
  }, [val, options])

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
    font: ${getFont(currentTypo.label.large)};
  `
  const InputLayer = styled.div`
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
    border-radius: 8px 8px 0px 0px;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    border: solid ${currentTheme.onSurface};
    border-width: 0px 0px 1px 0px;
    column-gap: 8px;
    position: relative;
    display: flex;
    width: 100%;
  `
  const SupportingText = styled.span`
    color: ${currentTheme.onSurface};
    font: ${getFont(currentTypo.body.small)};
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    font: ${getFont(currentTypo.label.large)};
  `

  const ChipContainer = styled.div`
    border-radius: 8px;
    border: none;
    padding: 0;
    margin: 4px;
    width: 100%;
  `
  const ChipLayer = styled.div`
    background: ${currentTheme.secondaryContainer};
    color: ${currentTheme.onSecondaryContainer};
    &:hover {
      background: ${currentTheme.onPrimaryContainerOpacity10};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${currentTheme.onPrimaryContainerOpacity10};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${currentTheme.onPrimaryContainerOpacity40};
    }
    border: none;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: fit-content;
    border-width: 1px;
    padding: 4px 8px;
    font: ${getFont(currentTypo.label.medium)};
  `
  const IconWrapper = styled.div`
    position: absolute;
    left: 16px;
    z-index: 20;
  `

  const SignleValueContainer = ({ children, ...props }: ControlProps<TagOption, false>) => {
    return (
      <>
        {props.hasValue ? (
          <ChipContainer>
            <components.Control {...props}>
              <ChipLayer>{children}</ChipLayer>
            </components.Control>
          </ChipContainer>
        ) : (
          <components.Control {...props}>{children}</components.Control>
        )}
      </>
    )
  }

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
          rules={{ required: required || false }}
          name={name}
          render={({ field }) => (
            <Select
              {...field}
              styles={colourStyles(themeMode === 'dark', !!icon)}
              defaultValue={defaultVal}
              components={{ Control: SignleValueContainer }}
              onChange={(newValue) => {
                field.onChange(newValue?.value)
              }}
              value={options.find((x) => x.value === field.value)}
              options={options}
              placeholder={placeholder || 'Enter tags as you like..'}
            />
          )}
        />
      </InputLayer>
      {error && <SupportingText>{error}</SupportingText>}
    </InputContainer>
  )
}
