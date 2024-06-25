import { FC, useRef } from 'react'
import { Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { useImage } from '@/hooks/useImage'
import { usePostImageSizeAtom } from '@/jotai/ui'

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
  const [postImageSize, _] = usePostImageSizeAtom()

  return (
    <Image
      ref={imageRef}
      id={id}
      image={image}
      alt='ステッカー画像'
      width={width * postImageSize.w}
      height={height * postImageSize.h}
      scaleX={scale}
      scaleY={scale}
      rotation={rotation}
      x={position.x * postImageSize.w}
      y={position.y * postImageSize.h}
      draggable={false}
      onClick={() => onSelect()}
      onTap={() => onSelect()}
    />
  )
}

export default CanvasStickerForDisplay
