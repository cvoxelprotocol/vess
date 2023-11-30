import styled from '@emotion/styled'
import Image from 'next/image'
import React, { FC } from 'react'
import { Button } from 'react-aria-components'
import { NextImageContainer } from '../atom/Images/NextImageContainer'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { Skelton } from '@/kai/skelton'

export type EventItemProps = {
  id: string
  size?: string
}

export const EventItem: FC<EventItemProps> = ({ id, size = '100%' }) => {
  const { eventDetail, isLoadingEventDetail } = useEventAttendance(id)

  return (
    <>
      <Skelton
        variant='outlined'
        isLoading={true}
        width='100%'
        height='auto'
        aspectRatio='1'
        maskColor='var(--kai-color-sys-background)'
        radius='var(--kai-size-sys-round-full)'
        borderWidth='var(--kai-size-ref-2)'
      >
        <EventItemFrame size={size}>
          <Image
            src={'/sample/event_sample.jpg'}
            // src={eventDetail?.icon || ''}
            alt={eventDetail?.name || 'イベント参加証明画像'}
            fill
          />
        </EventItemFrame>
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
