import styled from '@emotion/styled'
import React, { FC } from 'react'
import type { InputProps, TextAreaProps, TextFieldProps } from 'react-aria-components'
import { TextField, Input, Label, FieldError, TextArea as RACTextArea } from 'react-aria-components'
import { Text } from '../text/Text'

export type TextInputProps = {
  label: string
  labelStartContent?: React.ReactNode
  labelEndContent?: React.ReactNode
  errorMessage?: string
  description?: string
  width?: string
  placeholder?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
} & Omit<TextFieldProps, 'onChange'>

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextInputProps>(
  (
    { onChange, onBlur, name, label, errorMessage, description, placeholder, width, ...props },
    ref,
  ) => {
    return (
      <>
        <StyledTextField width={width} onBlur={onBlur} {...props}>
          <StyledLabel>
            <Text as='span' typo='label-md' color={'var(--kai-color-sys-on-surface)'}>
              {label}
            </Text>
          </StyledLabel>
          <StyledTextArea
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            placeholder={placeholder}
          />
        </StyledTextField>
      </>
    )
  },
)

const StyledTextField = styled(TextField)<{ width?: string }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: ${({ width }) => (width ? width : 'fit-content')};
`

const StyledLabel = styled(Label)`
  width: var(--kai-size-ref-112);
  height: fit-content;
`

const StyledTextArea = styled(RACTextArea)`
  flex: 1;
  height: var(--kai-size-ref-160);
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: var(--kai-size-ref-12) var(--kai-size-ref-16) var(--kai-size-ref-12)
    var(--kai-size-ref-16);
  border-radius: var(--kai-size-sys-round-md);
  background: var(--kai-color-sys-surface-container-lowest);
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-outline-variant);
  resize: none;
  transition: background 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  font-family: var(--kai-typo-sys-body-lg-bold-font-family);
  font-size: var(--kai-typo-sys-body-lg-bold-font-size);
  line-height: var(--kai-typo-sys-body-lg-bold-line-height);
  letter-spacing: var(--kai-typo-sys-body-lg-bold-letter-spacing);
  color: var(--kai-color-sys-on-primary-container);

  &[data-focused] {
    outline: var(--kai-size-ref-2) solid var(--kai-color-sys-primary);
    outline-offset: -1px;
  }
`

const StyledFieldError = styled(FieldError)``

TextArea.displayName = 'TextInput'
