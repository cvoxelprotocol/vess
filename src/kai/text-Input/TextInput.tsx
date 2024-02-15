import styled from '@emotion/styled'
import React, { ForwardedRef, useEffect, useRef } from 'react'
import type { TextFieldProps } from 'react-aria-components'
import { TextField, Input, Label, FieldError } from 'react-aria-components'
import { ChangeHandler } from 'react-hook-form'
import { PiWarningCircleFill } from 'react-icons/pi'
import { Text } from '../text/Text'
import { FlexVertical } from '@/components/ui-v1/Common/FlexVertical'
import { SizeProps } from '@/constants/propType'

export type TextInputProps = {
  label: string
  isLabel?: boolean
  labelWidth?: string
  labelStartContent?: React.ReactNode
  labelEndContent?: React.ReactNode
  size?: SizeProps
  inputStartContent?: React.ReactNode
  errorMessage?: string
  description?: string
  width?: string
  placeholder?: string
  align?: 'horizontal' | 'vertical'
  onChange?: ChangeHandler
  onBlur?: ChangeHandler
} & Omit<TextFieldProps, 'onChange' | 'onBlur'>

const size2Token = {
  sm: 'var(--kai-size-ref-40)',
  md: 'var(--kai-size-ref-48)',
  lg: 'var(--kai-size-ref-56)',
}

const useForwardRef = <T,>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const targetRef = useRef<T>(initialValue)

  useEffect(() => {
    if (!ref) return

    if (typeof ref === 'function') {
      ref(targetRef.current)
    } else {
      ref.current = targetRef.current
    }
  }, [ref])

  return targetRef
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      isLabel = 'true',
      labelWidth = 'fit-content',
      size = 'md',
      inputStartContent,
      errorMessage,
      description,
      width,
      placeholder,
      align = 'horizontal',
      isRequired = false,
      ...props
    },
    ref,
  ) => {
    const inputRef = useForwardRef<HTMLInputElement>(ref)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [errorMessage])
    return (
      <>
        <StyledTextField
          width={width}
          onBlur={onBlur}
          name={name}
          isRequired={errorMessage ? isRequired : false}
          {...props}
          data-align={align}
        >
          <>
            {isLabel && (
              <StyledLabel
                labelWidth={labelWidth}
                inputHeight={size2Token[size]}
                data-align={align}
              >
                <Text as='span' typo='label-lg' color={'var(--kai-color-sys-on-surface-variant)'}>
                  {label}
                  <Text
                    as='span'
                    typo='label-md'
                    color={
                      isRequired ? 'var(--kai-color-sys-error)' : 'var(--kai-color-sys-on-surface)'
                    }
                  >
                    {isRequired ? ' *' : ''}
                  </Text>
                </Text>
              </StyledLabel>
            )}
            <FlexVertical width='100%' gap='var(--kai-size-ref-2)'>
              <InputFrame>
                <StyledInput
                  ref={inputRef}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  heightsize={size2Token[size]}
                  placeholder={placeholder}
                  data-error={!!errorMessage}
                  data-start-content={!!inputStartContent}
                />
                {inputStartContent && (
                  <InputIconFrame data-error={!!errorMessage}>{inputStartContent}</InputIconFrame>
                )}
              </InputFrame>
              {errorMessage || description ? (
                <MessageFrame>
                  {errorMessage && (
                    <PiWarningCircleFill size={16} color={'var(--kai-color-sys-error)'} />
                  )}
                  <Text
                    as='span'
                    typo='body-md'
                    color={
                      errorMessage
                        ? 'var(--kai-color-sys-error)'
                        : 'var(--kai-color-sys-on-surface)'
                    }
                  >
                    {errorMessage || description}
                  </Text>
                </MessageFrame>
              ) : (
                <StyledFieldError>
                  {({ validationErrors }) => (
                    <MessageFrame>
                      <PiWarningCircleFill size={16} color={'var(--kai-color-sys-error)'} />
                      <Text as='span' typo='body-md' color={'var(--kai-color-sys-error)'}>
                        {validationErrors[0]}
                      </Text>
                    </MessageFrame>
                  )}
                </StyledFieldError>
              )}
            </FlexVertical>
          </>
        </StyledTextField>
      </>
    )
  },
)

const StyledTextField = styled(TextField)<{ width?: string }>`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: var(--kai-size-ref-16);
  width: ${({ width }) => (width ? width : 'fit-content')};

  &[data-align='vertical'] {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--kai-size-ref-8);
  }
`

const StyledLabel = styled(Label)<{ labelWidth: string; inputHeight: string }>`
  width: ${({ labelWidth }) => (labelWidth ? labelWidth : 'fit-content')};
  padding-top: ${(props) =>
    `calc((${props.inputHeight} - var(--kai-typo-sys-label-lg-line-height)) / 2)`};
  &[data-align='vertical'] {
    padding-top: 0;
  }
`

const InputFrame = styled.div`
  position: relative;
  width: 100%;
`

const StyledInput = styled(Input)<{ heightsize: string }>`
  width: 100%;
  border: none;
  padding: var(--kai-size-ref-4) var(--kai-size-ref-16);
  outline: none;
  height: ${({ heightsize }) => heightsize};
  border-radius: var(--kai-size-sys-round-md);
  background: var(--kai-color-sys-surface-container-lowest);
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-outline-variant);
  box-sizing: border-box;
  transition: background 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  font-family: var(--kai-typo-sys-body-lg-bold-font-family);
  font-size: var(--kai-typo-sys-body-lg-bold-font-size);
  line-height: var(--kai-typo-sys-body-lg-bold-line-height);
  letter-spacing: var(--kai-typo-sys-body-lg-bold-letter-spacing);
  color: var(--kai-color-sys-on-surface);

  &[data-start-content='true'] {
    padding-left: var(--kai-size-ref-48);
  }

  &[data-focused] {
    outline: var(--kai-size-ref-2) solid var(--kai-color-sys-primary);
    outline-offset: -1px;
    background: var(--kai-color-sys-surface-container-low);
  }

  &[data-hovered] {
    background: var(--kai-color-sys-surface-container-low);
  }

  &[data-error='true'] {
    outline: var(--kai-size-ref-2) solid var(--kai-color-sys-error);
    outline-offset: -1px;
    &[data-hovered] {
      background: var(--kai-color-sys-error-container);
    }
    &[data-focused] {
      background: var(--kai-color-sys-surface-container-lowest);
    }
  }

  &[data-invalid] {
    outline: var(--kai-size-ref-2) solid var(--kai-color-sys-error);
    outline-offset: -1px;
    &[data-hovered] {
      background: var(--kai-color-sys-error-container);
    }
    &[data-focused] {
      background: var(--kai-color-sys-surface-container-lowest);
    }
  }
`
const InputIconFrame = styled.div`
  width: var(--kai-size-ref-16);
  height: var(--kai-size-ref-16);
  position: absolute;
  top: 50%;
  left: var(--kai-size-ref-20);
  transform: translateY(-60%);
  color: var(--kai-color-sys-outline);

  &[data-error='true'] {
    color: var(--kai-color-sys-error);
  }
  &[data-invalid] {
    color: var(--kai-color-sys-error);
  }
`

const MessageFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--kai-size-ref-4);
  width: 100%;
  padding: var(--kai-size-ref-0) var(--kai-size-ref-4);
`
const StyledFieldError = styled(FieldError)``

TextInput.displayName = 'TextInput'
