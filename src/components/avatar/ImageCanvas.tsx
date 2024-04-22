// components/ImageCanvas.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import useImage from 'use-image'

type ImageProps = {
  imageUrl: string
  stageWidth: number // キャンバスの幅
  stageHeight: number // キャンバスの高さ
  editable?: boolean
  isSelected?: boolean
  onSelect?: () => void
  visibleTransformers?: boolean
}

const CanvasImage: React.FC<ImageProps> = ({
  imageUrl,
  stageWidth,
  stageHeight,
  editable,
  isSelected,
  onSelect,
  visibleTransformers,
}) => {
  const [image, status] = useImage(imageUrl, 'anonymous')
  const imageRef = useRef<any>()
  const transformerRef = useRef<any>(null)

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // トランスフォーマーを選択した画像に適用
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  useEffect(() => {
    if (image && imageRef.current) {
      // 画像とキャンバスのサイズに基づいてスケールを計算
      const scaleX = stageWidth / image.width
      const scaleY = stageHeight / image.height
      const scale = Math.min(scaleX, scaleY, 1) // キャンバスを超えないように調整、または元のサイズを保持

      imageRef.current.scale({ x: scale, y: scale })
      // 画像を中央に配置
      imageRef.current.position({
        x: (stageWidth - image.width * scale) / 2,
        y: (stageHeight - image.height * scale) / 2,
      })
      imageRef.current.getLayer().batchDraw()

      // トランスフォーマーの更新
      if (editable && transformerRef?.current) {
        transformerRef.current.nodes([imageRef.current])
        transformerRef.current.getLayer().batchDraw()
      }
    }
  }, [image, stageWidth, stageHeight, editable])

  // トランスフォームの操作をトリガーするためのイベントハンドラ
  const onTransform = () => {
    // 更新されたプロパティ (位置、サイズ、回転) を保存または使用する
    const node = imageRef.current
    console.log('node: ', node.attrs)
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.width(node.width() * scaleX)
    node.height(node.height() * scaleY)
    node.scaleX(1)
    node.scaleY(1)
  }

  if (!editable) {
    return <Image id={imageUrl} image={image} ref={imageRef} draggable={editable} />
  }

  return (
    <>
      <Image
        id={imageUrl}
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={imageRef}
        draggable={editable}
        onTransformEnd={onTransform}
      />
      {isSelected && visibleTransformers && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          keepRatio={true}
          anchorSize={10}
          anchorStrokeWidth={2}
          anchorFill='#fff'
          anchorStroke='#666'
          borderStroke='#ddd'
          borderDash={[6, 2]}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  )
}

type Props = {
  images: string[]
  avatarUrl: string
}

const ImageCanvas: React.FC<Props> = ({ avatarUrl, images }) => {
  console.log({ images })
  const stageRef = useRef<any>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [visibleTransformers, setVisibleTransformers] = useState(true)

  const handleDownload = () => {
    setVisibleTransformers(false)

    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 })
      const link = document.createElement('a')
      link.download = 'vess-avatar.png'
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 100) // 非表示状態を適用するために少し遅延を入れる

    setTimeout(() => {
      // Transformerを再表示
      setVisibleTransformers(true)
    }, 500)
  }

  const handleSave = () => {
    setVisibleTransformers(false)

    setTimeout(() => {
      const stageJson = stageRef.current.toJSON()
      console.log({ stageJson })
    }, 100) // 非表示状態を適用するために少し遅延を入れる

    setTimeout(() => {
      // Transformerを再表示
      setVisibleTransformers(true)
    }, 500)
  }

  return (
    <>
      <Stage ref={stageRef} width={window.innerWidth - 20} height={320}>
        <Layer>
          <CanvasImage imageUrl={avatarUrl} stageWidth={window.innerWidth - 20} stageHeight={320} />
          {images.map((image, i) => (
            <CanvasImage
              key={i}
              imageUrl={image}
              stageWidth={80}
              stageHeight={80}
              editable
              isSelected={i === selectedId}
              onSelect={() => setSelectedId(i)}
              visibleTransformers={visibleTransformers}
            />
          ))}
        </Layer>
      </Stage>
      <button onClick={handleDownload}>Download Image</button>
      <button onClick={handleSave}>Save Canvas</button>
    </>
  )
}

export default ImageCanvas
