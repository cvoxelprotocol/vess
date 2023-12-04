import styled from '@emotion/styled'
import React, { forwardRef, ForwardedRef, ReactNode } from 'react'
import type { ButtonProps as RACButtonProps } from 'react-aria-components'
import { Button as RACButton } from 'react-aria-components'

export type IconButtonProps = RACButtonProps & {
  icon: ReactNode
  variant?: 'filled' | 'outlined' | 'tonal' | 'text'
  color?: 'primary' | 'secondary' | 'neutral'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  round?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const IconButton = forwardRef(
  (
    {
      icon,
      variant = 'filled',
      color = 'primary',
      size = 'md',
      round = 'md',
      isLoading = false,
      ...props
    }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <ButtonFrame
        color={color}
        slot='button'
        isDisabled={props.isDisabled}
        ref={ref}
        data-variant={variant}
        data-size={size}
        data-round={round}
        {...props}
      >
        <IconFrame data-size={size}>{icon}</IconFrame>
      </ButtonFrame>
    )
  },
)

const ButtonFrame = styled(RACButton)<{
  color: string
  isDisabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  /* state */
  &[data-hovered='true'] {
    transform: scale(1.05);
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
  &[data-size='xs'] {
    width: var(--kai-size-ref-32);
    height: var(--kai-size-ref-32);
  }
  &[data-size='sm'] {
    width: var(--kai-size-ref-40);
    height: var(--kai-size-ref-40);
  }
  &[data-size='md'] {
    width: var(--kai-size-ref-48);
    height: var(--kai-size-ref-48);
  }
  &[data-size='lg'] {
    width: var(--kai-size-ref-56);
    height: var(--kai-size-ref-56);
  }

  /* variant prop */
  &[data-variant='filled'] {
    background: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-inverse-surface)`
        : `var(--kai-color-sys-${props.color})`};
    color: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-inverse-on-surface)`
        : `var(--kai-color-sys-on-${props.color})`};
    border: none;
  }
  &[data-variant='outlined'] {
    background: transparent;
    color: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-on-surface-variant)`
        : `var(--kai-color-sys-${props.color})`};
    border: var(--kai-size-ref-1) solid
      ${(props) =>
        props.color == 'neutral'
          ? `var(--kai-color-sys-outline-variant)`
          : `var(--kai-color-sys-${props.color})`};
  }
  &[data-variant='tonal'] {
    background: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-surface-variant)`
        : `var(--kai-color-sys-${props.color}-container)`};
    color: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-on-surface-variant)`
        : `var(--kai-color-sys-${props.color})`};
    border: none;
  }
  &[data-variant='text'] {
    background: transparent;
    color: ${(props) =>
      props.color == 'neutral'
        ? `var(--kai-color-sys-on-surface-variant)`
        : `var(--kai-color-sys-${props.color})`};
    border: none;
    &[data-hovered='true'] {
      background: ${(props) =>
        props.color == 'neutral'
          ? `var(--kai-color-sys-surface-variant)`
          : `var(--kai-color-sys-${props.color}-container);`};
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
`

const IconFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* size prop */
  &[data-size='xs'] {
    width: var(--kai-size-ref-16);
    height: var(--kai-size-ref-16);
  }
  &[data-size='sm'] {
    width: var(--kai-size-ref-16);
    height: var(--kai-size-ref-16);
  }
  &[data-size='md'] {
    width: var(--kai-size-ref-20);
    height: var(--kai-size-ref-20);
  }
  &[data-size='lg'] {
    width: var(--kai-size-ref-24);
    height: var(--kai-size-ref-24);
  }
`

IconButton.displayName = 'IconButton'
