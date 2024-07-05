import Hammer from 'hammerjs'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { FC, useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Transformer, Layer, Image } from 'react-konva'
import { StickerType } from '@/@types/avatar'
import { useImage } from '@/hooks/useImage'
import { useStickers } from '@/hooks/useStickers'
import { useAvatarSizeAtom, useIstransformerAtom, useSelectedIDAtom } from '@/jotai/ui'

export type StickerImageProps = {
  isSelected?: boolean
  selectedId?: string
  isEditable?: boolean
  onUpdate?: (newPrams: Partial<StickerType>) => void
  onSelect?: () => void
  onRemove?: () => void
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
  onRemove,
}) => {
  const { image } = useImage(imgUrl)
  const [isTransformer, setIsTransformer] = useIstransformerAtom()
  const transformerRef = useRef<any>(null)
  const imageRef = useRef<any>(null)
  const [avatarSize, setAvatarSize] = useAvatarSizeAtom()
  const [selectedID, setSelectedID] = useSelectedIDAtom()

  // Avoid hydration error
  const [isMobileClient, setIsMobileClient] = useState(false)
  useEffect(() => {
    setIsMobileClient(isMobile)
  }, [])

  const [imageAttrs, setImageAttrs] = useState<Konva.NodeConfig>({
    x: position.x * avatarSize,
    y: position.y * avatarSize,
    width: width * avatarSize,
    height: height * avatarSize,
    scaleX: scale,
    scaleY: scale,
    rotation: rotation,
    draggable: isEditable,
  })

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // トランスフォーマーを選択した画像に適用
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  useEffect(() => {
    const node = imageRef.current
    if (!node) return

    const hammertime = new Hammer(node as any)

    hammertime.get('rotate').set({ enable: true })

    let oldRotation = 0
    let startScale = 1
    let offsetX = 0
    let offsetY = 0

    hammertime.on('press', () => {
      console.log('press')
    })

    hammertime.on('touchend', () => {
      console.log('touchend')
    })

    hammertime.on('rotatestart', (ev) => {
      oldRotation = ev.rotation
      startScale = node.scaleX()
      node.stopDrag()
      // 要素の中心を計算
      offsetX = node.width() / 2
      offsetY = node.height() / 2
      setImageAttrs((prev) => ({
        ...prev,
        draggable: false,
      }))
    })

    hammertime.on('rotate', (ev) => {
      const delta = oldRotation - ev.rotation
      setImageAttrs((prev) => ({
        ...prev,
        rotation: (prev.rotation ?? 0) - delta,
        scaleX: startScale * ev.scale,
        scaleY: startScale * ev.scale,
        // 回転の中心を設定
        offsetX: offsetX,
        offsetY: offsetY,
      }))
      oldRotation = ev.rotation
    })

    hammertime.on('rotateend rotatecancel', (ev) => {
      setImageAttrs((prev) => ({
        ...prev,
        draggable: true,
      }))
      onUpdate?.({
        position: {
          x: node?.x() / avatarSize,
          y: node?.y() / avatarSize,
        },
        width: node?.width() / avatarSize,
        height: node?.height() / avatarSize,
        rotation: node?.rotation(),
        scale: startScale * ev.scale,
      })
    })

    return () => {
      hammertime.destroy()
    }
  }, [])

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
    if (x < -node.width() || y < -node.height() || x > avatarSize || y > avatarSize) {
      onRemove?.()
      setSelectedID(undefined)
    } else {
      onUpdate?.({
        position: {
          x: node?.x() / avatarSize,
          y: node?.y() / avatarSize,
        },
        width: node?.width() / avatarSize,
        height: node?.height() / avatarSize,
        rotation: node?.rotation(),
      })
    }
  }

  const onDragEnd = (e: KonvaEventObject<Event>) => {
    const node = imageRef.current
    if (
      node.getClientRect().x < -node.getClientRect().width ||
      node.getClientRect().y < -node.getClientRect().height ||
      node.getClientRect().x > avatarSize ||
      node.getClientRect().y > avatarSize
    ) {
      onRemove?.()
      setSelectedID(undefined)
      console.log('remove')
    } else {
      onUpdate?.({
        position: {
          x: node?.x() / avatarSize,
          y: node?.y() / avatarSize,
        },
        width: node?.width() / avatarSize,
        height: node?.height() / avatarSize,
        rotation: node?.rotation(),
      })
    }
  }

  if (!isEditable) {
    return <Image ref={imageRef} id={id} image={image} alt='ステッカー画像' {...imageAttrs} />
  }
  return (
    <>
      <Image
        ref={imageRef}
        id={id}
        image={image}
        alt='aaa'
        {...imageAttrs}
        onClick={onSelect}
        onTap={onSelect}
        onTouchEnd={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransform}
      />
      {isSelected && isTransformer && !isMobileClient && (
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

type Props = {
  isEditable?: boolean
}
const StickerImages: FC<Props> = ({ isEditable = true }) => {
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
        <StickerImage
          key={`${sticker.id}-${index}`}
          {...sticker}
          onUpdate={updateSticker(index)}
          onSelect={() => {
            setSelectedID(sticker.id)
          }}
          onRemove={() => removeSticker(index)}
          selectedId={selectedID}
          isSelected={selectedID === sticker.id}
          isEditable={isEditable}
        />
      ))}
    </Layer>
  )
}

export default StickerImages
