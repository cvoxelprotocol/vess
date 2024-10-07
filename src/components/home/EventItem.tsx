import styled from '@emotion/styled'
import { Skelton } from 'kai-kit'
import React, { FC } from 'react'
import { Button } from 'react-aria-components'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { WithCredentialType, BaseCredential } from '@/@types/credential'

export type EventItemProps = {
  item?: WithCredentialType<BaseCredential>
  size?: string
}

export const EventItem: FC<EventItemProps> = ({ item, size = '100%' }) => {
  return (
    <>
      <Skelton
        variant='filled'
        isLoading={!item}
        width='100%'
        height='auto'
        aspectRatio='1'
        maskColor='var(--kai-color-sys-background)'
        radius='var(--kai-size-sys-round-full)'
        borderWidth='var(--kai-size-ref-2)'
      >
        <ImageContainer
          src={item?.credentialSubject.eventIcon || '/sample/event_sample.jpg'}
          alt={item?.credentialSubject.eventName || 'イベント参加証明画像'}
          objectFit='cover'
          width={size}
        />
      </Skelton>
    </>
  )
}

const EventItemFrame = styled(Button)<{ size: string }>`
  position: relative;
  aspect-ratio: 1;
  width: ${({ size }) => size};
  border: none;
  background: transparent;
  border-radius: var(--kai-size-sys-round-full);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  &[data-hovered] {
    cursor: pointer;
    transform: scale(1.02);
  }
  &[data-pressed] {
    transform: scale(0.98);
    opacity: 0.8;
  }

  &[data-focused] {
    outline: none;
  }
`
