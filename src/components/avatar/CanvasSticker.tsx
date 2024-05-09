import { KonvaEventObject } from 'konva/lib/Node'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { Transformer, Layer, Image } from 'react-konva'
import { StickerType, useStickers } from './StickersProvider'
import { useImage } from '@/hooks/useImage'
import { isTransformer, useIstransformerAtom, useSelectedIDAtom, useStickersAtom } from '@/jotai/ui'

export type StickerImageProps = {
  isSelected?: boolean
  selectedId?: string
  isEditable?: boolean
  onUpdate?: (newPrams: Partial<StickerType>) => void
  onSelect?: () => void
} & StickerType

export const StickerImage: FC<StickerImageProps> = ({
  id,
  imgUrl,
  position,
  width,
  height,
  rotation,
  scale,
  isSelected,
  selectedId,
  isEditable = true,
  onUpdate,
  onSelect,
}) => {
  const { image } = useImage(imgUrl)
  const [isTransformer, setIsTransformer] = useIstransformerAtom()
  const transformerRef = useRef<any>(null)
  const imageRef = useRef<any>(null)

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // トランスフォーマーを選択した画像に適用
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const onTransform = (e: KonvaEventObject<Event>) => {
    // 更新されたプロパティ (位置、サイズ、回転) を保存または使用する
    const node = imageRef.current
    const scaleX = node?.scaleX()
    const scaleY = node?.scaleY()
    if (scaleX) {
      node?.width(node?.width() * scaleX)
    }
    if (scaleY) {
      node?.height(node?.height() * scaleY)
    }
    node?.scaleX(1)
    node?.scaleY(1)
    onUpdate?.({
      position: {
        x: node?.x(),
        y: node?.y(),
      },
      width: node?.width(),
      height: node?.height(),
      rotation: node?.rotation(),
    })
  }

  if (!isEditable) {
    return (
      <Image
        ref={imageRef}
        id={id}
        image={image}
        alt='aaa'
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        rotation={rotation}
        x={position.x}
        y={position.y}
        draggable={isEditable}
      />
    )
  }
  return (
    <>
      <Image
        ref={imageRef}
        id={id}
        image={image}
        alt='aaa'
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        rotation={rotation}
        x={position.x}
        y={position.y}
        draggable={true}
        onClick={onSelect}
        onTap={onSelect}
        onTouchEnd={onSelect}
        onDragEnd={(e) => {
          onUpdate?.({
            position: {
              x: e.target.x(),
              y: e.target.y(),
            },
          })
        }}
        onTransformEnd={onTransform}
      />
      {isSelected && isTransformer && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          keepRatio={true}
          anchorSize={8}
          anchorStrokeWidth={1}
          anchorFill='#fff'
          anchorStroke='#0066aa'
          borderStroke='#50adff'
          rotateAnchorOffset={16}
          rotate
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  )
}

export const StickerImages: FC = () => {
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const [stickers, setStickers] = useStickersAtom()

  const updateSticker = (index: number) => {
    return (newPrams: Partial<StickerType>) => {
      const newStickers = [...stickers]
      newStickers[index] = {
        ...newStickers[index],
        ...newPrams,
      }
      setStickers(newStickers)
    }
  }

  return (
    <Layer>
      {stickers.map((sticker, index) => (
        <StickerImage
          key={`${sticker.id}-${index}`}
          {...sticker}
          onUpdate={updateSticker(index)}
          onSelect={() => {
            setSelectedID(sticker.id)
          }}
          selectedId={selectedID}
          isSelected={selectedID === sticker.id}
        />
      ))}
    </Layer>
  )
}
