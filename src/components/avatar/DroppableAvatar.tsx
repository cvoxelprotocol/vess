import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, forwardRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { useImage } from '@/hooks/useImage'
import { selectedID, useAvatarSizeAtom } from '@/jotai/ui'

const StickerImages = dynamic(() => import('@/components/avatar/CanvasSticker'), { ssr: false })

export type DroppableAvatarProps = {
  baseAvatarImgUrl: string
}

const _DroppableAvatar = forwardRef<any, DroppableAvatarProps>(({ baseAvatarImgUrl }, stageRef) => {
  const { setNodeRef, node } = useDroppable({
    id: 'droppableAvatar',
  })
  const { image } = useImage(`${baseAvatarImgUrl}`)
  const setSelectedID = useSetAtom(selectedID)
  const [avatarSize, setAvatarSize] = useAvatarSizeAtom()

  useEffect(() => {
    const updateSize = () => {
      if (node.current) {
        const { width, height } = node.current.getBoundingClientRect()
        setAvatarSize(width)
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
        <Stage width={avatarSize} height={avatarSize} ref={stageRef}>
          <Layer>
            <Image
              id='sourcePhotoUrl'
              image={image}
              alt='aaa'
              width={avatarSize}
              height={avatarSize}
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
  width: 100%;
  aspect-ratio: 1;

  border-radius: var(--kai-size-sys-round-lg);
  border: 1px solid var(--kai-color-sys-neutral-outline);
  overflow: hidden;
`

export default DroppableAvatar
