import styled from '@emotion/styled'
import React, { forwardRef, ForwardedRef, ReactNode } from 'react'
import type { ButtonProps as RACButtonProps } from 'react-aria-components'
import { Button as RACButton } from 'react-aria-components'
import { Text } from '../text/Text'

export type ButtonProps = RACButtonProps & {
  variant?: 'filled' | 'outlined' | 'tonal' | 'text'
  color?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  round?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  width?: string
  height?: string
}

export const Button = forwardRef(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'md',
      round = 'md',
      isLoading = false,
      loadingText,
      width = 'fit-content',
      height = 'fit-content',
      startContent,
      endContent,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <ButtonFrame
        color={color}
        width={width}
        height={height}
        slot='button'
        isDisabled={props.isDisabled}
        ref={ref}
        data-variant={variant}
        data-size={size}
        data-round={round}
        {...props}
      >
        {startContent && startContent}
        <Text as='span' typo='label-lg'>
          {props.children as ReactNode}
        </Text>
        {endContent && endContent}
      </ButtonFrame>
    )
  },
)

const ButtonFrame = styled(RACButton)<{
  color: string
  width: string
  height: string
  isDisabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  gap: 8px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  /* state */
  &[data-hovered='true'] {
    transform: scale(1.02);
  }
  &[data-pressed='true'] {
    transform: scale(0.98);
    opacity: 0.8;
  }
  &[data-focus-visible='true'] {
    outline: var(--kai-size-ref-2) solid var(--kai-color-sys-primary);
    outline-offset: var(--kai-size-ref-2);
  }
  &[data-focused='true'] {
    outline: none;
  }
  &[data-disabled='true'] {
    cursor: default;
    opacity: 0.4;
    pointer-events: none;
  }

  /* size prop */
  &[data-size='sm'] {
    height: var(--kai-size-ref-40);
  }
  &[data-size='md'] {
    height: var(--kai-size-ref-48);
  }
  &[data-size='lg'] {
    height: var(--kai-size-ref-56);
  }

  /* variant prop */
  &[data-variant='filled'] {
    background: ${(props) => `var(--kai-color-sys-${props.color})`};
    color: ${(props) => `var(--kai-color-sys-on-${props.color})`};
    border: none;
  }
  &[data-variant='outlined'] {
    background: transparent;
    color: ${(props) => `var(--kai-color-sys-${props.color})`};
    border: var(--kai-size-ref-1) solid ${(props) => `var(--kai-color-sys-${props.color})`};
  }
  &[data-variant='tonal'] {
    background: ${(props) => `var(--kai-color-sys-${props.color}-container)`};
    color: ${(props) => `var(--kai-color-sys-${props.color})`};
    border: none;
  }
  &[data-variant='text'] {
    background: transparent;
    color: ${(props) => `var(--kai-color-sys-${props.color})`};
    border: none;
    &[data-hovered='true'] {
      background: ${(props) => `var(--kai-color-sys-${props.color}-container);`};
    }
  }

  /* round prop */
  &[data-round='sm'] {
    border-radius: var(--kai-size-sys-round-sm);
  }
  &[data-round='md'] {
    border-radius: var(--kai-size-sys-round-md);
  }
  &[data-round='lg'] {
    border-radius: var(--kai-size-sys-round-full);
  }

  width: ${(props) => props.width};
`

Button.displayName = 'Button'
