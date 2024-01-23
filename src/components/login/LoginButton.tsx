import styled from '@emotion/styled'
import { FC } from 'react'
import { Button } from 'react-aria-components'
import type { ButtonProps } from 'react-aria-components'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'

export type LoginButtonProps = {
  iconSrc: string
  title?: string
} & ButtonProps

export const LoginButton: FC<LoginButtonProps> = ({ iconSrc, ...props }) => {
  return (
    <StyledButton {...props}>
      <NextImageContainer src={iconSrc} width='40px' height='40px' />
    </StyledButton>
  )
}

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  width: 100%;
  height: 100%;
  max-width: 5rem;
  max-height: 5rem;
  padding: var(--kai-size-ref-8);
  background: var(--kai-color-sys-surface-container-lowest);
  border: 1px solid var(--kai-color-sys-outline);
  border-radius: var(--kai-size-sys-round-md);
  box-shadow: 0 2px 0 var(--kai-color-sys-outline);
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  transition-property: background, opacity, box-shadow;

  &[data-hovered] {
    cursor: pointer;
    box-shadow: none;
  }
  &[data-pressed] {
    opacity: 0.4;
  }
  &[data-disabled] {
    cursor: none;
    opacity: 0.4;
  }
  &[data-focused] {
    outline: none;
  }
  &[data-focus-visible] {
    outline: 2px solid var(--kai-color-sys-primary);
    outline-offset: 0px;
  }
`
