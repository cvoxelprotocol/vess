import styled from '@emotion/styled'
import { Text, type ButtonProps } from 'kai-kit'
import { FC } from 'react'
import { Button } from 'react-aria-components'

export type IdPlateProps = {
  iconURL: string
  id: string
} & ButtonProps

export const IdPlate: FC<IdPlateProps> = ({ iconURL, id, ...props }) => {
  return (
    <IdPlateFrame {...props}>
      <IconImage src={iconURL} />
      <Text typo='label-md' color={'var(--kai-color-sys-on-layer)'} lineClamp={1}>
        {id}
      </Text>
    </IdPlateFrame>
  )
}

const IdPlateFrame = styled(Button)`
  --plate-height: var(--kai-size-sys-widget-xs);
  appearance: none;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-sys-space-2xs);
  height: var(--plate-height);
  width: fit-content;
  max-width: var(--kai-size-ref-160);
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-sys-round-full);
  border: 1px solid var(--kai-color-sys-neutral-outline);
  padding: var(--kai-size-sys-space-2xs);
  padding-right: var(--kai-size-sys-space-sm);
`

const IconImage = styled.img`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: calc(var(--plate-height) - var(--kai-size-sys-space-xs));
  height: calc(var(--plate-height) - var(--kai-size-sys-space-xs));
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-sys-round-full);
  /* border: 1px solid var(--kai-color-sys-neutral-outline); */
  overflow: hidden;
`
