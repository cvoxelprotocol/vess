import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Spinner, useKai } from 'kai-kit'
import React, { FC } from 'react'
import { FileTrigger, Button } from 'react-aria-components'
import type { FileTriggerProps } from 'react-aria-components'
import { PiCameraPlusBold } from 'react-icons/pi'
import { CommonSpinner } from '../ui-v1/Loading/CommonSpinner'

type IconUploadButtonProps = {
  defaultIcon: string
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isUploading?: boolean
} & Omit<FileTriggerProps, 'acceptedFileTypes' | 'allowMultiple'>

export const IconUploadButton: FC<IconUploadButtonProps> = ({
  defaultIcon,
  size = 'md',
  isDisabled = false,
  isUploading = false,
  ...props
}) => {
  const { kai } = useKai()

  return (
    <FileTrigger acceptedFileTypes={['image/png', 'image/jpg']} allowsMultiple={false} {...props}>
      <StyledButton
        data-size={size}
        defaultIcon={defaultIcon}
        isDisabled={isDisabled || isUploading}
      >
        <OverlayIcon>
          {isUploading ? (
            <Spinner size='24px' color='neutral' />
          ) : (
            <PiCameraPlusBold size={kai.size.ref[32]} color={'var(--kai-color-sys-on-surface)'} />
          )}
        </OverlayIcon>
      </StyledButton>
    </FileTrigger>
  )
}

const StyledButton = styled(Button)<{ defaultIcon: string }>`
  background-image: url(${({ defaultIcon }) => defaultIcon});
  background-size: cover;
  aspect-ratio: 1;
  position: relative;
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  overflow: hidden;

  &[data-size='sm'] {
    width: var(--kai-size-ref-40);
    height: var(--kai-size-ref-40);
    border: var(--kai-size-ref-2) solid var(--kai-color-sys-white);
    border-radius: var(--kai-size-sys-round-sm);
  }
  &[data-size='md'] {
    width: var(--kai-size-ref-48);
    height: var(--kai-size-ref-48);
    border: var(--kai-size-ref-2) solid var(--kai-color-sys-white);
    border-radius: var(--kai-size-sys-round-sm);
  }
  &[data-size='lg'] {
    width: var(--kai-size-ref-80);
    height: var(--kai-size-ref-80);
    border: var(--kai-size-ref-4) solid var(--kai-color-sys-white);
    border-radius: var(--kai-size-sys-round-md);
  }

  &[data-hovered] {
    transform: scale(1.02);
    cursor: pointer;
  }
  &[data-pressed] {
    transform: scale(0.98);
    opacity: 0.8;
  }
  &[data-focused] {
    outline: none;
  }
  &[data-disabled] {
    cursor: default;
    opacity: 0.4;
    pointer-events: none;
  }
`

const OverlayIcon = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  background: var(--kai-color-sys-layer-farthest);
  opacity: 0.7;
`
