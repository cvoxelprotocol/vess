import styled from '@emotion/styled'
import { Text } from 'kai-kit'
import React, { FC } from 'react'
import { Separator as RACSeparator } from 'react-aria-components'
import type { SeparatorProps as RACSeparatorProps } from 'react-aria-components'
import { ColorProps, SizeProps } from '@/constants/propType'

export type SeparatorProps = {
  color?: 'default'
  size?: SizeProps
  orientation?: 'horizontal' | 'vertical'
  title?: string
  titlePlacement?: 'on' | 'in-left' | 'in-center' | 'in-right'
  lineWeight?: 'thin' | 'thick'
} & RACSeparatorProps

export const Separator: FC<SeparatorProps> = ({
  color = 'default',
  size = 'md',
  title,
  titlePlacement = 'on',
  lineWeight = 'thin',
  ...props
}) => {
  return (
    <SeparatorFrame data-placement={titlePlacement} data-size={size}>
      {titlePlacement == 'in-center' && (
        <StyledSeparator
          elementType='hr'
          color={color == 'default' ? 'neutral' : color}
          orientation='horizontal'
          data-size={size}
          data-placement={titlePlacement}
          data-weight={lineWeight}
          {...props}
        />
      )}
      {title && (
        <Text as='p' color={`var(--kai-color-sys-outline)`} typo='label-md'>
          {title}
        </Text>
      )}
      <StyledSeparator
        elementType='hr'
        color={color == 'default' ? 'neutral' : color}
        orientation='horizontal'
        data-size={size}
        data-placement={titlePlacement}
        data-weight={lineWeight}
        {...props}
      />
    </SeparatorFrame>
  )
}

const SeparatorFrame = styled.div`
  display: flex;
  width: 100%;

  &[data-placement='on'] {
    flex-direction: column;
    align-items: start;
    justify-content: center;
    column-gap: var(--kai-size-ref-0);
  }
  &[data-placement='in-left'] {
    column-gap: var(--kai-size-ref-8);
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  &[data-placement='in-center'] {
    column-gap: var(--kai-size-ref-8);
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  &[data-size='sm'] {
    row-gap: var(--kai-size-ref-2);
    padding: var(--kai-size-ref-0) var(--kai-size-ref-0);
  }
  &[data-size='md'] {
    row-gap: var(--kai-size-ref-2);
    padding: var(--kai-size-ref-4) var(--kai-size-ref-0);
  }
  &[data-size='lg'] {
    row-gap: var(--kai-size-ref-2);
    padding: var(--kai-size-ref-8) var(--kai-size-ref-0);
  }
`

const StyledSeparator = styled(RACSeparator)<{ color: ColorProps }>`
  flex: 0 0 auto;
  height: var(--kai-size-ref-1);
  width: 100%;
  background: ${(props) => `var(--kai-color-sys-outline-variant)`};
  border: none;
  border-radius: var(--kai-size-sys-round-full);
  margin: 0;

  &[data-placement='in-left'] {
    flex: 1;
  }
  &[data-placement='in-center'] {
    flex: 1;
  }

  &[data-weight='default'] {
    height: var(--kai-size-ref-1);
  }
  &[data-weight='thin'] {
    height: var(--kai-size-ref-1);
  }
  &[data-weight='thick'] {
    height: var(--kai-size-ref-2);
  }
`
