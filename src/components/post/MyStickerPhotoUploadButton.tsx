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

export const MyStickerPhotoUploadButton: FC<IconUploadButtonProps> = ({
  size = 'md',
  isDisabled = false,
  isUploading = false,
  ...props
}) => {
  return (
    <FileTrigger allowsMultiple={false} {...props}>
      <PhotoFrame>
        <StyledButton data-size={size} isDisabled={isDisabled || isUploading}>
          <>
            {isUploading ? (
              <Spinner size='80px' />
            ) : (
              <>
                <PiImageSquare size={64} color='var(--kai-color-sys-on-layer)' />
                <Text
                  typo='label-lg'
                  color='var(--kai-color-sys-on-layer)'
                  style={{ textAlign: 'center' }}
                >
                  ステッカー画像をアップロード
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
  background: var(--kai-color-sys-layer-nearer);
  aspect-ratio: 1;
  position: relative;
  width: 100%;
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  overflow: hidden;
  border-radius: 16px;
  border: var(--1, 1px) dashed var(--dominant-dominant-outline, #502964);

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
  border: none;
  background: var(--kai-color-sys-layer-nearer);
  display: flex;
  flex-direction: column;
  width: 120px;
  padding: 0;
  align-items: center;
  gap: 4px;
  transition: transform var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  &[data-hovered] {
    transform: scale(1.02);
  }
`
