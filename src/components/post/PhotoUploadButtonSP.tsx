import styled from '@emotion/styled'
import { Spinner, Text } from 'kai-kit'
import React, { FC, useRef } from 'react'
import { FileTrigger, Button } from 'react-aria-components'
import type { FileTriggerProps } from 'react-aria-components'
import { PiCameraPlus } from 'react-icons/pi'

type IconUploadButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isUploading?: boolean
  onSelect: (file: FileList | null) => void
} & Omit<FileTriggerProps, 'acceptedFileTypes' | 'allowMultiple'>

export const PhotoUploadButtonSP: FC<IconUploadButtonProps> = ({
  size = 'md',
  isDisabled = false,
  isUploading = false,
  onSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type='file'
        onChange={(e) => {
          onSelect(e.target.files)
        }}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <StyledButton
        onClick={handleButtonClick}
        data-size={size}
        disabled={isDisabled || isUploading}
      >
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
    </>
  )
}

const StyledButton = styled.button`
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
