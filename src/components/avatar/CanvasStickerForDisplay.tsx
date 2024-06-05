import { FC, useRef } from 'react'
import { Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { useImage } from '@/hooks/useImage'
import { useAvatarForDisplaySizeAtom } from '@/jotai/ui'

export type StickerImageProps = {
  onSelect: () => void
  isSelected?: boolean
  selectedId?: string
} & StickerType

const CanvasStickerForDisplay: FC<StickerImageProps> = ({
  id,
  imgUrl,
  position,
  width,
  height,
  rotation,
  scale,
  onSelect,
}) => {
  const { image } = useImage(imgUrl)
  const imageRef = useRef<any>(null)
  const [avatarSize, setAvatarSize] = useAvatarForDisplaySizeAtom()

  return (
    <Image
      ref={imageRef}
      id={id}
      image={image}
      alt='ステッカー画像'
      width={width * avatarSize}
      height={height * avatarSize}
      scaleX={scale}
      scaleY={scale}
      rotation={rotation}
      x={position.x * avatarSize}
      y={position.y * avatarSize}
      draggable={false}
      onClick={() => onSelect()}
    />
  )
}

export default CanvasStickerForDisplay
