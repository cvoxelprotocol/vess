import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, forwardRef, useMemo, useRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { Avatar } from '@/@types/user'
import { useImage } from '@/hooks/useImage'
import { usePostImageSizeAtom, useSelectedIDAtom, useStickersAtom } from '@/jotai/ui'

const CanvasStickerForDisplay = dynamic(
  () => import('@/components/avatar/CanvasStickerForDisplay'),
  { ssr: false },
)

type AvatarForDisplayProps = {
  profileAvatar?: Avatar
  avatarImageUrl?: string
  onSelectSticker?: (id: string) => void
}

const _AvatarForDisplay = forwardRef<any, AvatarForDisplayProps>(
  ({ profileAvatar, avatarImageUrl, onSelectSticker }, stageRef) => {
    const [stickers, setStickers] = useStickersAtom()
    const [selectedID, setSelectedID] = useSelectedIDAtom()
    const frameRef = useRef<any>()
    const router = useRouter()
    const baseImage = useMemo(() => {
      return (profileAvatar?.sourcePhotoUrl ||
        profileAvatar?.canvasJson?.baseImage.url ||
        profileAvatar?.avatarUrl ||
        avatarImageUrl) as string
    }, [
      profileAvatar?.sourcePhotoUrl,
      profileAvatar?.canvasJson?.baseImage.url,
      profileAvatar?.avatarUrl,
      avatarImageUrl,
    ])
    const { imageWithSize: image } = useImage(baseImage)
    const [postImageSize, setPostImageSize] = usePostImageSizeAtom()

    useEffect(() => {
      const updateSize = () => {
        if (frameRef.current) {
          const { width, height } = frameRef.current.getBoundingClientRect()
          console.log('width: ', width, 'height: ', height, 'aspectRatio: ', image?.aspectRatio)
          setPostImageSize({ w: width, h: width / (image?.aspectRatio ?? 1) })
        }
      }

      window.addEventListener('resize', updateSize)
      updateSize() // 初期サイズを設定

      return () => {
        window.removeEventListener('resize', updateSize)
      }
    }, [frameRef, image])

    const currentStickers = useMemo(() => {
      return (
        profileAvatar?.canvasJson?.vcImages?.map((vci) => {
          return {
            id: vci.id,
            imgUrl: vci.url,
            position: {
              x: vci.x,
              y: vci.y,
            },
            width: vci.width,
            height: vci.height,
            rotation: vci.rotation,
          } as StickerType
        }) || []
      )
    }, [profileAvatar])

    useEffect(() => {
      if (profileAvatar) {
        setStickers(currentStickers)
      }
    }, [profileAvatar])

    return (
      <DroppableFrame ref={frameRef}>
        <Stage width={postImageSize.w} height={postImageSize.h} ref={stageRef}>
          <Layer listening={false}>
            <Image
              id='sourcePhotoUrl'
              image={image?.image}
              alt='aaa'
              width={postImageSize.w}
              height={postImageSize.h}
              draggable={false}
            />
          </Layer>
          <Layer listening={false}>
            {stickers.map((sticker, index) => (
              <CanvasStickerForDisplay
                key={`${sticker.id}-${index}`}
                {...sticker}
                onSelect={() => {
                  console.log({ sticker })
                  setSelectedID(sticker.id)
                  if (onSelectSticker) {
                    onSelectSticker(sticker.id)
                  }
                }}
                selectedId={selectedID}
                isSelected={selectedID === sticker.id}
              />
            ))}
          </Layer>
        </Stage>
      </DroppableFrame>
    )
  },
)

_AvatarForDisplay.displayName = '_AvatarForDisplay'

const AvatarForDisplay = ({
  stageRef,
  profileAvatar,
  avatarImageUrl,
}: AvatarForDisplayProps & { stageRef: React.RefObject<any> }) => {
  return (
    <_AvatarForDisplay
      ref={stageRef}
      profileAvatar={profileAvatar}
      avatarImageUrl={avatarImageUrl}
    />
  )
}

AvatarForDisplay.displayName = 'AvatarForDisplay'

const DroppableFrame = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`

export default AvatarForDisplay
