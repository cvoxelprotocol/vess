// components/ImageCanvas.tsx
import { useDraggable, DragOverlay } from '@dnd-kit/core'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { FC, useState, useRef, useEffect, useMemo } from 'react'
import { Button } from 'react-aria-components'
import { useStickers } from '@/hooks/useStickers'
import { useAvatarSizeAtom } from '@/jotai/ui'

type DraggableStickerProps = {
  id: string
  credId: string
  imageUrl: string
  onAddEnd?: () => void
}

const DraggableSticker: FC<DraggableStickerProps> = ({ id, credId, imageUrl, onAddEnd }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [stickerSize, setStickerSize] = useState({ width: 0, height: 0 })
  const { addSticker } = useStickers()
  const [avatarSize, setAvatarSize] = useAvatarSizeAtom()

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
    <StickerFrame
      onPress={() => {
        addSticker({
          id: credId,
          imgUrl: imageUrl,
          width: stickerSize.width / avatarSize,
          height: stickerSize.height / avatarSize,
          position: {
            x: 0.5 - stickerSize.width / (2 * avatarSize),
            y: 0.5 - stickerSize.height / (2 * avatarSize),
          },
        })
        onAddEnd?.()
      }}
    >
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
        tabIndex={-1}
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

const StickerFrame = styled(Button)`
  appearance: none;
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: none;
  border: none;
  border-radius: var(--kai-size-sys-round-md);
  padding: 0;
  transition: transform var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);

  &[data-hovered] {
    transform: scale(1.02);
  }

  &[data-pressed] {
    transform: scale(0.98);
  }

  &[data-focused] {
    border: none;
    outline: none;
  }

  &[data-focus-visible] {
    border: none;
    outline: 1px solid var(--kai-color-sys-dominant);
  }
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

  &:focus-visible {
    border: none;
    outline: none;
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

export default DraggableSticker
