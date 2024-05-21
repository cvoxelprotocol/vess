import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Spinner, Text, useKai } from 'kai-kit'
import React, { FC } from 'react'
import { FileTrigger, Button } from 'react-aria-components'
import type { FileTriggerProps } from 'react-aria-components'
import { PiCameraPlus } from 'react-icons/pi'
import { CommonSpinner } from '../ui-v1/Loading/CommonSpinner'

type IconUploadButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isUploading?: boolean
} & Omit<FileTriggerProps, 'acceptedFileTypes' | 'allowMultiple'>

export const PhotoUploadButton: FC<IconUploadButtonProps> = ({
  size = 'md',
  isDisabled = false,
  isUploading = false,
  ...props
}) => {
  return (
    <FileTrigger acceptedFileTypes={['image/png', 'image/jpg']} allowsMultiple={false} {...props}>
      <StyledButton data-size={size} isDisabled={isDisabled || isUploading}>
        <>
          {isUploading ? (
            <Spinner size='80px' />
          ) : (
            <>
              <PiCameraPlus size={80} color='var(--kai-color-sys-on-dominant-backing)' />
              <Text typo='title-lg' color='var(--kai-color-sys-on-dominant-backing)'>
                写真をアップロード
              </Text>
            </>
          )}
          {/* <OverlayIcon>
          {isUploading ? (
            <CommonSpinner size='lg' color='var(--kai-color-sys-on-surface)' />
          ) : (
            <PiCameraPlusBold size={kai.size.ref[32]} color={'var(--kai-color-sys-on-surface)'} />
          )}
        </OverlayIcon> */}
        </>
      </StyledButton>
    </FileTrigger>
  )
}

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-sm);
  justify-content: center;
  align-items: center;
  background: var(--kai-color-sys-dominant-backing);
  aspect-ratio: 1;
  position: relative;
  width: 100%;
  border: 2px dashed var(--kai-color-sys-dominant);
  border-radius: var(--kai-size-sys-round-md);
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  overflow: hidden;

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
