import styled from '@emotion/styled'
import { useKai } from 'kai-kit'
import React, { FC } from 'react'
import type { ButtonProps } from 'react-aria-components'
import { Button as RACButtton } from 'react-aria-components'
import { Text } from '@/kai/text/Text'

type MenuButtonProps = {
  startContent?: React.ReactNode
  children?: React.ReactNode
} & ButtonProps

export const MenuButton: FC<MenuButtonProps> = ({ startContent, children, ...props }) => {
  const { kai } = useKai()

  return (
    <MenuButtonFrame {...props}>
      <Text
        as='h3'
        typo='label-lg'
        color={kai.color.sys.onPrimaryContainer}
        startContent={startContent}
      >
        {children}
      </Text>
    </MenuButtonFrame>
  )
}

const MenuButtonFrame = styled(RACButtton)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: var(--kai-size-ref-12);
  border-radius: var(--kai-size-sys-round-sm);
  background: var(--kai-color-sys-surface-container);
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-primary-container);
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  &[data-hovered='true'] {
    transform: scale(1.02);
    cursor: pointer;
  }

  &[data-pressed='true'] {
    transform: scale(0.98);
    opacity: 0.8;
  }

  &[data-focused='true'] {
    outline: none;
  }
`
