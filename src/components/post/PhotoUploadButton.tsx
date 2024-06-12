import styled from '@emotion/styled'
import { Spinner, Text } from 'kai-kit'
import React, { FC } from 'react'
import { FileTrigger, Button } from 'react-aria-components'
import type { FileTriggerProps } from 'react-aria-components'
import { PiImageSquare } from 'react-icons/pi'

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
    <FileTrigger
      // acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml', 'image/heif', 'image/heic']}
      allowsMultiple={false}
      {...props}
    >
      <PhotoFrame>
        <StyledButton data-size={size} isDisabled={isDisabled || isUploading}>
          <>
            {isUploading ? (
              <Spinner size='80px' />
            ) : (
              <>
                <PiImageSquare size={16} color='var(--kai-color-sys-on-dominant-backing)' />
                <Text typo='label-lg' color='var(--kai-color-sys-on-dominant-backing)'>
                  写真をアップロード
                </Text>
              </>
            )}
          </>
        </StyledButton>
      </PhotoFrame>
    </FileTrigger>
  )
}

const PhotoFrame = styled.div`
  display: flex;
  gap: var(--kai-size-sys-space-sm);
  justify-content: center;
  align-items: center;
  background: #a6a5a5;
  aspect-ratio: 1;
  position: relative;
  width: 100%;
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

const StyledButton = styled(Button)`
  border-radius: var(--button-button-round, 16px);
  border: 1px solid var(--button-button-outline-tonal, #502964);
  background: var(--button-button-background-tonal, #412152);
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 4px;
`
