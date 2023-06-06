import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { DatePicker } from 'react-date-picker'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Icon, ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'

type Props<T extends FieldValues> = {
  label: string
  name: Path<T>
  error?: string
  control: Control<T>
  width?: number
  required?: string
  defaultDate?: Date
  format?: string
}

export const BaseDatePicker = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  width = 220,
  required,
  defaultDate,
  format = 'yyyy-MM-dd',
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
    ${getBasicFont(currentTypo.label.large)};
  `
  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)};
  `
  const InputLayer = styled.div`
    background: none;
    outline: none;
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
    height: 56px;
    border: solid ${currentTheme.onSurface};
    border-width: 0px 0px 1px 0px;
    column-gap: 8px;
    position: relative;
    display: flex;
    min-width: 160px;
    width: 100%;
    color: ${currentTheme.onSurfaceVariant} !important;
  `
  const SupportingText = styled.span`
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.body.small)};
  `

  const PickAction = styled.label`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.large)};
  `

  const defaultVal = useMemo(() => {
    if (defaultDate) return defaultDate
    const d = new Date()
    d.setFullYear(d.getFullYear())
    return d
  }, [defaultDate])

  return (
    <>
      <InputContainer>
        {label && (
          <Label>
            {label}
            {required && <RequiredMark>*</RequiredMark>}
          </Label>
        )}
        <InputLayer>
          <Controller
            control={control}
            name={name}
            rules={{ required: required || false }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                onChange={onChange}
                value={value as Date}
                format={format}
                defaultValue={defaultVal}
                calendarIcon={<PickAction>▼</PickAction>}
                clearIcon={
                  <Icon icon={ICONS.CROSS} mainColor={currentTheme.onSurfaceVariant} size={'SS'} />
                }
              />
            )}
          />
        </InputLayer>
      </InputContainer>
      {error && <SupportingText>{error}</SupportingText>}
    </>
  )
}
