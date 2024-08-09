import styled from '@emotion/styled'
import { Text } from 'kai-kit'
import { FC } from 'react'
import { Checkbox as RACCheckbox } from 'react-aria-components'
import type { CheckboxProps as RACCheckboxProps } from 'react-aria-components'
import { PiCheckBold } from 'react-icons/pi'

type CheckboxProps = {} & RACCheckboxProps

export const Checkbox: FC<CheckboxProps> = ({ children, ...props }) => {
  return (
    <StyledCheckbox {...props}>
      {({ isSelected }) => (
        <>
          <CheckboxIconFrame>
            {isSelected && <PiCheckBold size={12} color='var(--kai-color-sys-on-dominant)' />}
          </CheckboxIconFrame>
          <Text typo='body-md' color='var(--kai-color-sys-on-layer)'>
            {children as string}
          </Text>
        </>
      )}
    </StyledCheckbox>
  )
}

const StyledCheckbox = styled(RACCheckbox)`
  --icon-background-color: var(--kai-color-sys-layer-default);
  width: 100%;
  height: var(--kai-size-sys-widget-sm);
  display: flex;
  align-items: center;
  gap: var(--kai-size-sys-space-sm);
  max-width: 320px;
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  &[data-disabled] {
    opacity: var(--kai-opacity-sys-state-disabled);
  }
  &[data-hovered] {
    --icon-background-color: var(--kai-color-sys-layer-nearest);
    cursor: pointer;
  }
  &[data-selected] {
    --icon-background-color: var(--kai-color-sys-dominant);
    &[data-hovered] {
      --icon-background-color: var(--kai-color-sys-dominant);
      cursor: pointer;
    }
  }
`

const CheckboxIconFrame = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--kai-size-ref-24);
  height: var(--kai-size-ref-24);
  border-radius: var(--kai-size-sys-round-sm);
  background-color: var(--icon-background-color);
  border: 1px solid var(--kai-color-sys-neutral-outline);
`
