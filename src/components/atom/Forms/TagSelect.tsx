import styled from '@emotion/styled'
import { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { components } from 'react-select'
import type { MultiValueGenericProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { TagOption, getTagOption, colourMultiStyles } from '@/constants/tags'
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
  vals?: string[]
  options?: TagOption[]
}

export const TagSelect = <T extends FieldValues>({
  required = false,
  name,
  control,
  label,
  vals,
  width,
  error,
  options,
  placeholder,
  icon,
  iconSize = 'S',
  iconColor,
  ...props
}: Props<T>) => {
  const { currentTheme, currentTypo, themeMode, getBasicFont } = useVESSTheme()

  const defaultVal = useMemo(() => {
    if (!options) return undefined
    return !vals ? undefined : vals.map((v) => getTagOption(v, options))
  }, [vals, options])

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

  const ChipContainer = styled.div`
    background: ${currentTheme.primaryContainer};
    color: ${currentTheme.onPrimaryContainer};
    &:hover {
      background: ${currentTheme.primaryContainer};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${currentTheme.primaryContainer};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${currentTheme.primaryContainer};
    }
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
    margin: 4px;
  `
  const ChipLayer = styled.div`
    background: ${currentTheme.primaryContainer};
    color: ${currentTheme.onPrimaryContainer};
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
    border-radius: 67px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
    border-width: 1px;
    padding: 4px 8px;
    ${getBasicFont(currentTypo.label.medium)};
  `
  const IconWrapper = styled.div`
    position: absolute;
    left: 16px;
    z-index: 20;
  `

  const MultiValueContainer = (props: MultiValueGenericProps<TagOption>) => {
    return (
      <ChipContainer>
        <ChipLayer>
          <components.MultiValueContainer {...props} />
        </ChipLayer>
      </ChipContainer>
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
              isMulti
              components={{
                MultiValueContainer,
              }}
              styles={colourMultiStyles(themeMode === 'dark', !!icon)}
              defaultValue={defaultVal}
              onChange={(newValue) => {
                field.onChange(newValue.map((x) => x.value))
              }}
              value={field.value?.map((v: string) => getTagOption(v, options))}
              options={options}
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
