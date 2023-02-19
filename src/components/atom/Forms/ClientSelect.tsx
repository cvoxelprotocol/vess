import styled from '@emotion/styled'
import { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { components } from 'react-select'
import type { GroupBase, OptionProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { VerifiedMark } from '../Badges/VerifiedMark'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { getTagOption, colourStyles, CLIENTS, TagOption } from '@/constants/tags'
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
}

export const ClientSelect = <T extends FieldValues>({
  required = false,
  name,
  control,
  label,
  val,
  width,
  error,
  placeholder,
  icon,
  iconSize = 'S',
  iconColor,
  ...props
}: Props<T>) => {
  const { currentTheme, currentTypo, themeMode, getBasicFont } = useVESSTheme()

  const defaultVal = useMemo(() => {
    return !val ? undefined : getTagOption(val, CLIENTS)
  }, [val])

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
    ${getBasicFont(currentTypo.label.large)};
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
    ${getBasicFont(currentTypo.body.small)};
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)};
  `
  const IconWrapper = styled.div`
    position: absolute;
    left: 16px;
    z-index: 20;
  `
  const OptionContainer = styled.div`
    display: flex;
    gap: 8px;
    width: fit-content;
    white-space: nowrap;
    padding: 8px 12px;
  `

  const formatOptionLabel = (props: OptionProps<TagOption, false, GroupBase<TagOption>>) => {
    return (
      <>
        {CLIENTS?.find((x) => x.label === props.label) ? (
          <components.Option {...props}>
            <OptionContainer>
              <VerifiedMark />
              {props.label}
            </OptionContainer>
          </components.Option>
        ) : (
          <components.Option {...props}>
            <OptionContainer>{props.label}</OptionContainer>
          </components.Option>
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
            <CreatableSelect
              {...field}
              styles={colourStyles(themeMode === 'dark', !!icon)}
              defaultValue={defaultVal}
              onChange={(newValue) => {
                field.onChange(newValue?.value || newValue?.label)
              }}
              components={{ Option: formatOptionLabel }}
              value={CLIENTS?.find((x) => x.value === field.value)}
              options={CLIENTS}
              placeholder={placeholder || 'Enter tags as you like..'}
              isClearable
            />
          )}
        />
      </InputLayer>
      {error && <SupportingText>{error}</SupportingText>}
    </InputContainer>
  )
}
