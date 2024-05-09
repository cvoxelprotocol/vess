import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { IconButton } from 'kai-kit'
import { FC, useEffect, useState, memo, useRef } from 'react'
import { PiTrash } from 'react-icons/pi'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import { StickerImages } from './CanvasSticker'
import { useImage } from '@/hooks/useImage'

export type DroppableAvatarProps = {
  baseAvatarImgUrl: string
}

export const DroppableAvatar: FC<DroppableAvatarProps> = memo(({ baseAvatarImgUrl }) => {
  const { isOver, setNodeRef, node } = useDroppable({
    id: 'droppableAvatar',
  })

  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  const { image } = useImage(`${baseAvatarImgUrl}`)

  useEffect(() => {
    const updateSize = () => {
      if (node.current) {
        const { width, height } = node.current.getBoundingClientRect()
        setFrameSize({ width, height })
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize() // 初期サイズを設定

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [node])

  return (
    <DroppableFrame ref={setNodeRef}>
      <Stage width={frameSize.width} height={frameSize.height}>
        <Layer>
          <Image
            id='profile'
            image={image}
            alt='aaa'
            width={frameSize.width}
            height={frameSize.height}
          />
        </Layer>
        <StickerImages />
      </Stage>
    </DroppableFrame>
  )
})

DroppableAvatar.displayName = 'DroppableAvatar'

const DroppableFrame = styled.div`
  position: relative;
  width: 100vw;
  aspect-ratio: 1;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  border-radius: var(--kai-size-sys-round-lg);
  border: 1px solid var(--kai-color-sys-neutral-outline);
  overflow: hidden;
`
