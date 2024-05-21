import { KonvaEventObject } from 'konva/lib/Node'
import { FC, useEffect, useRef } from 'react'
import { Transformer, Layer, Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { useImage } from '@/hooks/useImage'
import { useStickers } from '@/hooks/useStickers'
import { useIstransformerAtom, usePostImageSizeAtom, useSelectedIDAtom } from '@/jotai/ui'

export type StickerImageProps = {
  isSelected?: boolean
  selectedId?: string
  isEditable?: boolean
  onUpdate?: (newPrams: Partial<StickerType>) => void
  onSelect?: () => void
  onRemove?: () => void
} & StickerType

export const PostStickerImage: FC<StickerImageProps> = ({
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
  onRemove,
}) => {
  const { image } = useImage(imgUrl)
  const [isTransformer, setIsTransformer] = useIstransformerAtom()
  const transformerRef = useRef<any>(null)
  const imageRef = useRef<any>(null)
  const [postImageSize, setPostImageSize] = usePostImageSizeAtom()
  const [selectedID, setSelectedID] = useSelectedIDAtom()

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // トランスフォーマーを選択した画像に適用
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  // TODO: Stage外にいったStickerを自動削除する処理
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

    const { x, y } = node.position()

    // キャンバスの外に移動した場合、ノードを削除
    if (x < -node.width() || y < -node.height() || x > postImageSize.w || y > postImageSize.h) {
      onRemove?.()
      setSelectedID(undefined)
    } else {
      onUpdate?.({
        position: {
          x: node?.x() / postImageSize.w,
          y: node?.y() / postImageSize.h,
        },
        width: node?.width() / postImageSize.w,
        height: node?.height() / postImageSize.h,
        rotation: node?.rotation(),
      })
    }
  }

  const onDragEnd = (e: KonvaEventObject<Event>) => {
    const node = imageRef.current
    const { x, y } = node.position()
    if (
      node.getClientRect().x < -node.getClientRect().width ||
      node.getClientRect().y < -node.getClientRect().height ||
      node.getClientRect().x > postImageSize.w ||
      node.getClientRect().y > postImageSize.h
    ) {
      onRemove?.()
      setSelectedID(undefined)
      console.log('remove')
    } else {
      onUpdate?.({
        position: {
          x: node?.x() / postImageSize.w,
          y: node?.y() / postImageSize.h,
        },
      })
    }
  }

  if (!isEditable) {
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
        width={width * postImageSize.w}
        height={height * postImageSize.h}
        scaleX={scale}
        scaleY={scale}
        rotation={rotation}
        x={position.x * postImageSize.w}
        y={position.y * postImageSize.h}
        draggable={true}
        onClick={onSelect}
        onTap={onSelect}
        onTouchEnd={onSelect}
        onDragEnd={onDragEnd}
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

const PostStickerImages: FC = () => {
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const { stickers, setStickers } = useStickers()

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

  const removeSticker = (index: number) => {
    const newStickers = [...stickers]
    newStickers.splice(index, 1)
    setStickers(newStickers)
  }

  return (
    <Layer>
      {stickers.map((sticker, index) => (
        <PostStickerImage
          key={`${sticker.id}-${index}`}
          {...sticker}
          onUpdate={updateSticker(index)}
          onSelect={() => {
            setSelectedID(sticker.id)
          }}
          onRemove={() => removeSticker(index)}
          selectedId={selectedID}
          isSelected={selectedID === sticker.id}
        />
      ))}
    </Layer>
  )
}

export default PostStickerImages
