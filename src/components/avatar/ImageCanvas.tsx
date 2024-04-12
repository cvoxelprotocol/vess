// components/ImageCanvas.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import useImage from 'use-image'

type ImageProps = {
  imageUrl: string
  stageWidth: number // キャンバスの幅
  stageHeight: number // キャンバスの高さ
  editable?: boolean
}

const CanvasImage: React.FC<ImageProps> = ({ imageUrl, stageWidth, stageHeight, editable }) => {
  const [image, status] = useImage(imageUrl, 'anonymous')
  const imageRef = useRef<any>()
  const transformerRef = useRef<any>()

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
      if (editable) {
        transformerRef.current.nodes([imageRef.current])
        transformerRef.current.getLayer().batchDraw()
      }
    }
  }, [image, stageWidth, stageHeight, editable])

  // トランスフォームの操作をトリガーするためのイベントハンドラ
  const onTransform = () => {
    // 更新されたプロパティ (位置、サイズ、回転) を保存または使用する
    const node = imageRef.current
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.width(node.width() * scaleX)
    node.height(node.height() * scaleY)
    node.scaleX(1)
    node.scaleY(1)
  }

  if (!editable) {
    return <Image image={image} ref={imageRef} draggable={editable} />
  }

  return (
    <>
      <Image image={image} ref={imageRef} draggable={editable} onTransformEnd={onTransform} />
      <Transformer
        ref={transformerRef}
        rotateEnabled={true}
        borderEnabled={true}
        anchorSize={10}
        anchorStrokeWidth={2}
        anchorFill='#fff'
        anchorStroke='#666'
        borderStroke='#ddd'
        borderDash={[6, 2]}
      />
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
  return (
    <>
      <Stage ref={stageRef} width={window.innerWidth - 20} height={320}>
        <Layer>
          <CanvasImage imageUrl={avatarUrl} stageWidth={window.innerWidth - 20} stageHeight={320} />
          {images.map((image, i) => (
            <CanvasImage key={i} imageUrl={image} stageWidth={80} stageHeight={80} editable />
          ))}
        </Layer>
      </Stage>
    </>
  )
}

export default ImageCanvas
