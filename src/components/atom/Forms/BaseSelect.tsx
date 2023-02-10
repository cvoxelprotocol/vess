import styled from '@emotion/styled'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '@radix-ui/react-select'
import React, { FC, SelectHTMLAttributes, useMemo } from 'react'
import { Icon, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  items: any[]
  required?: boolean
  label?: string
  supportingText?: string
  icon?: IconsType
  iconSize?: IconSize
  placeholder?: string
  width?: number
  handleChangeValue: (val: any) => void
  defaultVal: any
}

export const BaseSelect: FC<Props> = ({
  items,
  required = false,
  label,
  supportingText,
  icon,
  iconSize = 'M',
  placeholder = 'select item',
  width = 220,
  handleChangeValue,
  defaultVal,
  ...props
}) => {
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
  `
  const SelectRoot = styled(Select.Root)`
    width: 100%;
  `
  const SelectTrigger = styled(Select.SelectTrigger)`
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4;
    padding: 0 16px;
    height: 48px;
    gap: 8;
    background-color: transparent;
    width: 100%;
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.body.large)}
    &[data-placeholder] {
      color: ${currentTheme.onSurfaceVariant};
      ${getBasicFont(currentTypo.body.large)}
    }
  `

  const TriggerContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 8;
    width: 100%;
  `

  const SelectIcon = styled(Select.SelectIcon)`
    padding: 0 8px;
  `

  const SelectContent = styled(Select.Content)`
    background: ${currentTheme.surface2};
    overflow: hidden;
    border-radius: 6;
    margin-top: 56px;
  `

  const SelectViewport = styled(Select.Viewport)`
    padding: 5;
  `
  const SupportingText = styled.span`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.small)}
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)}
  `

  const StyledItem = styled(Select.Item)`
    color: ${currentTheme.onSurface};
    border-radius: 3;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 8px 16px;
    position: relative;
    user-select: none;

    &[data-disabled] {
      color: mauve;
      pointer-events: none;
    }

    &[data-highlighted] {
      outline: none;
      background: ${currentTheme.onPrimaryContainerOpacity10};
    }
  `
  const ItemText = styled(Select.ItemText)`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.large)}
  `

  const SelectLabel = styled(Select.Label)`
    padding: 0 25px;
    font-size: 12;
    line-height: 25px;
    color: mauve;
  `

  const SelectIconWrapper = styled.div`
    padding: 0 8px;
  `

  const SelectScrollUpButton = styled(Select.ScrollUpButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25;
    background-color: white;
    color: violet;
    cursor: default;
  `

  const SelectScrollDownButton = styled(Select.ScrollDownButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25;
    background-color: white;
    color: violet;
    cursor: default;
  `

  const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(
    ({ children, ...props }, ref) => {
      return (
        <StyledItem {...props} ref={ref}>
          {icon && (
            <SelectIconWrapper>
              <Icon icon={icon} size={iconSize} />
            </SelectIconWrapper>
          )}
          <ItemText>{children}</ItemText>
        </StyledItem>
      )
    },
  )
  SelectItem.displayName = 'SelectItem'

  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <InputLayer>
        <SelectRoot onValueChange={handleChangeValue} value={defaultVal}>
          <SelectTrigger>
            <TriggerContent>
              {icon && (
                <SelectIconWrapper>
                  <Icon icon={icon} size={iconSize} />
                </SelectIconWrapper>
              )}
              <Select.Value placeholder={placeholder} />
            </TriggerContent>
            <SelectIcon />
          </SelectTrigger>
          <Select.Portal>
            <SelectContent>
              <SelectScrollUpButton>
                <ChevronUpIcon />
              </SelectScrollUpButton>
              <SelectViewport>
                <>
                  {items &&
                    items.map((item, index) => {
                      return (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      )
                    })}
                </>
              </SelectViewport>
              <SelectScrollDownButton>
                <ChevronDownIcon />
              </SelectScrollDownButton>
            </SelectContent>
          </Select.Portal>
        </SelectRoot>
      </InputLayer>
      {supportingText && <SupportingText>{supportingText}</SupportingText>}
    </InputContainer>
  )
}
