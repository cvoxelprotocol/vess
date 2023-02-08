import styled from '@emotion/styled'
import { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props<T extends FieldValues> = {
  label?: string
  name: Path<T>
  error?: string
  control: Control<T>
  width?: number
  required?: string
  icon?: IconsType
  iconSize?: IconSize
  placeholder?: string
  rows?: number
}

export const MultiInput = <T extends FieldValues>({
  required,
  name,
  label,
  control,
  error,
  width,
  rows = 3,
  placeholder,
}: Props<T>) => {
  const { currentTheme, currentTypo } = useVESSTheme()

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
    font-family: ${currentTypo.label.large.fontFamily};
    font-size: ${currentTypo.label.large.fontSize};
    line-height: ${currentTypo.label.large.lineHeight};
    font-weight: ${currentTypo.label.large.fontWeight};
  `
  const InputLayer = styled.div`
    background: none;
    outline: none;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    column-gap: 8px;
    position: relative;
    display: flex;
    min-width: 160px;
    width: 100%;
  `
  const Input = styled.textarea`
    &:hover {
      background: ${currentTheme.depth1};
      border: solid ${currentTheme.primary};
      outline: none;
    }
    &:focus {
      outline: none;
      background: ${currentTheme.depth2};
      border: solid ${currentTheme.outline};
    }
    &:active {
      outline: none;
      border: solid ${currentTheme.outline};
    }
    border-radius: 8px;
    border: solid ${currentTheme.outline};
    border-width: 1px;
    padding: 8px 16px;
    color: ${currentTheme.onSurface};
    font-family: ${currentTypo.body.large.fontFamily};
    font-size: ${currentTypo.body.large.fontSize};
    line-height: ${currentTypo.body.large.lineHeight};
    font-weight: ${currentTypo.body.large.fontWeight};
    flex-grow: 1;
    background: transparent;
    width: 100%;
    margin: 0;
  `
  const SupportingText = styled.span`
    color: ${currentTheme.onSurface};
    font-family: ${currentTypo.body.small.fontFamily};
    font-size: ${currentTypo.body.small.fontSize};
    line-height: ${currentTypo.body.small.lineHeight};
    font-weight: ${currentTypo.body.small.fontWeight};
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    font-family: ${currentTypo.label.large.fontFamily};
    font-size: ${currentTypo.label.large.fontSize};
    line-height: ${currentTypo.label.large.lineHeight};
    font-weight: ${currentTypo.label.large.fontWeight};
  `

  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      {error && <SupportingText>{error}</SupportingText>}
      <InputLayer>
        <Controller
          control={control}
          rules={{ required: required || false }}
          name={name}
          render={({ field }) => <Input rows={5} {...field} />}
        />
      </InputLayer>
    </InputContainer>
  )
}
