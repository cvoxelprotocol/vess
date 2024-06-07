import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, forwardRef, useMemo, useRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { Avatar } from '@/@types/user'
import { useImage } from '@/hooks/useImage'
import { removeStickerIdSurfix } from '@/hooks/useStickers'
import { useAvatarForDisplaySizeAtom, useSelectedIDAtom, useStickersAtom } from '@/jotai/ui'

const CanvasStickerForDisplay = dynamic(
  () => import('@/components/avatar/CanvasStickerForDisplay'),
  { ssr: false },
)

type AvatarForDisplayProps = {
  profileAvatar?: Avatar
  avatarImageUrl?: string
}

const _AvatarForDisplay = forwardRef<any, AvatarForDisplayProps>(
  ({ profileAvatar, avatarImageUrl }, stageRef) => {
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
    const { image } = useImage(baseImage)
    const [avatarSize, setAvatarSize] = useAvatarForDisplaySizeAtom()

    useEffect(() => {
      const updateSize = () => {
        if (frameRef.current) {
          const { width } = frameRef.current.getBoundingClientRect()
          setAvatarSize(width)
        }
      }

      window.addEventListener('resize', updateSize)
      updateSize() // 初期サイズを設定

      return () => {
        window.removeEventListener('resize', updateSize)
      }
    }, [frameRef])

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

    const jumpToVcDetail = (id: string) => {
      router.push(`/creds/detail/${removeStickerIdSurfix(id)}`)
    }

    return (
      <DroppableFrame ref={frameRef}>
        <Stage width={avatarSize} height={avatarSize} ref={stageRef}>
          <Layer>
            <Image
              id='sourcePhotoUrl'
              image={image}
              alt='aaa'
              width={avatarSize}
              height={avatarSize}
              draggable={false}
            />
          </Layer>
          <Layer>
            {stickers.map((sticker, index) => (
              <CanvasStickerForDisplay
                key={`${sticker.id}-${index}`}
                {...sticker}
                onSelect={() => {
                  console.log({ sticker })
                  setSelectedID(sticker.id)
                  jumpToVcDetail(sticker.id)
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
  aspect-ratio: 1;

  overflow: hidden;
`

export default AvatarForDisplay
