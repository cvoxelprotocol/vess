import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState, forwardRef } from 'react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import { useImage } from '@/hooks/useImage'
import { selectedID, stickers as stickersAtom } from '@/jotai/ui'

const StickerImages = dynamic(() => import('@/components/avatar/CanvasSticker'), { ssr: false })

export type DroppableAvatarProps = {
  baseAvatarImgUrl: string
}

const _DroppableAvatar = forwardRef<any, DroppableAvatarProps>(({ baseAvatarImgUrl }, stageRef) => {
  const { setNodeRef, node } = useDroppable({
    id: 'droppableAvatar',
  })
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  const { image } = useImage(`${baseAvatarImgUrl}`)
  const setSelectedID = useSetAtom(selectedID)

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

  const deselect = () => {
    setSelectedID(undefined)
  }

  return (
    <>
      <DroppableFrame ref={setNodeRef}>
        <Stage width={frameSize.width} height={frameSize.height} ref={stageRef}>
          <Layer>
            <Image
              id='profile'
              image={image}
              alt='aaa'
              width={frameSize.width}
              height={frameSize.height}
              onClick={deselect}
              onTap={deselect}
              onTouchEnd={deselect}
            />
          </Layer>
          <StickerImages />
        </Stage>
      </DroppableFrame>
    </>
  )
})

_DroppableAvatar.displayName = '_DroppableAvatar'

const DroppableAvatar = ({
  stageRef,
  baseAvatarImgUrl,
}: DroppableAvatarProps & { stageRef: React.RefObject<any> }) => {
  return <_DroppableAvatar ref={stageRef} baseAvatarImgUrl={baseAvatarImgUrl} />
}

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

export default DroppableAvatar
