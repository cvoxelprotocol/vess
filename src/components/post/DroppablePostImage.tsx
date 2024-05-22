import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import image from 'next/image'
import { useEffect, forwardRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { useImage } from '@/hooks/useImage'
import { selectedID, usePostImageSizeAtom, useStickersAtom } from '@/jotai/ui'

const PostStickerImages = dynamic(() => import('@/components/post/PostCanvasSticker'), {
  ssr: false,
})

export type DroppableAvatarProps = {
  baseAvatarImgUrl: string
}

const _DroppablePostImage = forwardRef<any, DroppableAvatarProps>(
  ({ baseAvatarImgUrl }, stageRef) => {
    const { setNodeRef, node } = useDroppable({
      id: 'droppableAvatar',
    })
    const { imageWithSize: image } = useImage(`${baseAvatarImgUrl}`)
    const setSelectedID = useSetAtom(selectedID)
    const [postImageSize, setPostImageSize] = usePostImageSizeAtom()
    const [stickers, setStickers] = useStickersAtom()

    useEffect(() => {
      const updateSize = () => {
        if (node.current) {
          const { width, height } = node.current.getBoundingClientRect()
          console.log('width: ', width, 'height: ', height, 'aspectRatio: ', image?.aspectRatio)
          setPostImageSize({ w: width, h: width / (image?.aspectRatio ?? 1) })
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

    useEffect(() => {
      if (image) {
        setPostImageSize((prev) => ({
          w: prev.w,
          h: prev.w / (image?.aspectRatio ?? 1),
        }))
        setStickers([])
      }
    }, [image])

    return (
      <>
        <DroppableFrame ref={setNodeRef}>
          <Stage width={postImageSize.w} height={postImageSize.h} ref={stageRef}>
            <Layer>
              <Image
                id='sourcePhotoUrl'
                image={image?.image}
                alt='aaa'
                width={postImageSize.w}
                height={postImageSize.h}
                onClick={deselect}
                onTap={deselect}
                onTouchEnd={deselect}
              />
            </Layer>
            <PostStickerImages />
          </Stage>
        </DroppableFrame>
      </>
    )
  },
)

_DroppablePostImage.displayName = '_DroppablePostImage'

const DroppablePostImage = ({
  stageRef,
  baseAvatarImgUrl,
}: DroppableAvatarProps & { stageRef: React.RefObject<any> }) => {
  return <_DroppablePostImage ref={stageRef} baseAvatarImgUrl={baseAvatarImgUrl} />
}

DroppablePostImage.displayName = 'DroppablePostImage'

const DroppableFrame = styled.div`
  position: relative;
  width: 100%;
  height: 'auto';
  border-radius: var(--kai-size-sys-round-lg);
  /* border: 1px solid var(--kai-color-sys-neutral-outline); */
  overflow: hidden;
`

export default DroppablePostImage
