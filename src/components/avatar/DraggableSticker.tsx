// components/ImageCanvas.tsx
import { useDraggable, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FlexHorizontal, FlexVertical, Text } from 'kai-kit'
import image from 'next/image'
import React, { FC, useState, useRef, useEffect, useMemo } from 'react'
import { StickerType, useStickers } from './StickersProvider'
import { useImage } from '@/hooks/useImage'
type DraggableStickerProps = {
  id: string
  imageUrl: string
}

export const DraggableSticker: FC<DraggableStickerProps> = ({ id, imageUrl }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [stickerSize, setStickerSize] = useState({ width: 0, height: 0 })

  const { attributes, listeners, setNodeRef, transform, isDragging, over, node } = useDraggable({
    id: id ?? imageUrl,
    data: {
      imageUrl: imageUrl,
      width: stickerSize.width,
      height: stickerSize.height,
    },
  })

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height })
    }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (node.current) {
      if (imageSize.width > imageSize.height) {
        setStickerSize({
          width: (node.current as HTMLImageElement).width,
          height: imageSize.height * ((node.current as HTMLImageElement).width / imageSize.width),
        })
      } else {
        setStickerSize({
          width: imageSize.width * ((node.current as HTMLImageElement).height / imageSize.height),
          height: (node.current as HTMLImageElement).height,
        })
      }
    }
    // console.log('image size: ', imageSize)
  }, [imageSize])

  // useEffect(() => {
  //   console.log('sticker size: ', stickerSize)
  // }, [stickerSize])

  return (
    <StickerFrame>
      <StickerUnderlay src={imageUrl} draggable={false} />
      <StickerImage
        ref={setNodeRef}
        src={imageUrl}
        {...attributes}
        {...listeners}
        transform={{
          x: transform?.x ?? 0,
          y: transform?.y ?? 0,
        }}
        data-dragging={isDragging || undefined}
        data-over={(over?.id === 'droppableAvatar' && isDragging) || undefined}
      />
    </StickerFrame>
  )
}

const DroppingAnimation = keyframes`
      0% {
        transform: translate3d(var(--position-x), var(--position-y), 0) rotate(-5deg) scale(1.0);
      }
      50% {
        transform: translate3d(var(--position-x), var(--position-y), 0) rotate(5deg) scale(1.0);
      }
      100% {
        transform: translate3d(var(--position-x), var(--position-y), 0) rotate(-5deg) scale(1.0);
      }
    `

const StickerFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
`

const StickerImage = styled.img<{
  transform: { x: number; y: number }
}>`
  --position-x: ${({ transform }) => transform.x}px;
  --position-y: ${({ transform }) => transform.y}px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  transform: translate3d(
      ${({ transform }) => transform.x}px,
      ${({ transform }) => transform.y}px,
      0
    )
    scale(1);
  transition: transform var(--kai-motion-sys-duration-medium) var(--kai-motion-sys-easing-standard);
  cursor: grab;
  z-index: var(--kai-z-index-sys-component-nearer);

  &[data-dragging] {
    cursor: grabbing;
    z-index: var(--kai-z-index-sys-component-nearest);
    transform: translate3d(
        ${({ transform }) => transform.x}px,
        ${({ transform }) => transform.y}px,
        0
      )
      scale(1.2);
  }

  &[data-over] {
    animation: ${DroppingAnimation} var(--kai-motion-sys-duration-slow) infinite;
  }
`

const StickerUnderlay = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: var(--kai-z-index-sys-component-default);
  opacity: var(--kai-opacity-ref-40);
`
