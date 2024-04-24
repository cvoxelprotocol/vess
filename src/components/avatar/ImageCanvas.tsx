// components/ImageCanvas.tsx
import { FlexHorizontal } from 'kai-kit'
import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'

type ImageProps = {
  img?: any
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
  img,
}) => {
  const [image, status] = useImage(imageUrl, 'anonymous')
  const imageRef = useRef<any>()
  const transformerRef = useRef<any>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // トランスフォーマーを選択した画像に適用
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  useEffect(() => {
    if (initialized) return
    if (image && imageRef.current) {
      // 画像とキャンバスのサイズに基づいてスケールを計算
      const scaleX = stageWidth / image.width
      const scaleY = stageHeight / image.height
      const scale = Math.min(scaleX, scaleY, 1) // キャンバスを超えないように調整、または元のサイズを保持

      imageRef.current.scale({ x: scale, y: scale })
      // 画像を中央に配置
      imageRef.current.position({
        x: img?.x || (stageWidth - image.width * scale) / 2,
        y: img?.y || (stageHeight - image.height * scale) / 2,
      })
      imageRef.current.getLayer().batchDraw()

      // トランスフォーマーの更新
      if (editable && transformerRef?.current) {
        transformerRef.current.nodes([imageRef.current])
        transformerRef.current.getLayer().batchDraw()
      }
      if (status === 'loaded' && !initialized) {
        setInitialized(true)
      }
    }
  }, [image, stageWidth, stageHeight, editable, img])

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
  const dragUrl = useRef()
  const [stagedImages, setStagedImages] = useState<any[]>([])
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

  const handleRemove = () => {
    if (selectedId !== null) {
      setStagedImages(stagedImages.filter((image) => image.id !== selectedId))
      setSelectedId(null)
    }
  }

  const handleRemoveAll = () => {
    setSelectedId(null)
    setVisibleTransformers(false)
    setTimeout(() => {
      setStagedImages([])
      setVisibleTransformers(true)
    }, 100)
  }

  return (
    <>
      <div
        id='drag-drop-container'
        onDrop={(e) => {
          e.preventDefault()
          console.log('dragUrl.current', dragUrl.current)
          // register event position
          stageRef.current.setPointersPositions(e)
          // add image
          const id = Math.random()
          setStagedImages(
            stagedImages.concat([
              {
                id: id,
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
              },
            ]),
          )
          setSelectedId(id)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage ref={stageRef} width={320} height={320} style={{ border: '1px solid grey' }}>
          <Layer>
            <CanvasImage imageUrl={avatarUrl} stageWidth={320} stageHeight={320} />
            {stagedImages.map((image) => (
              <CanvasImage
                key={image.id}
                img={image}
                imageUrl={image.src}
                stageWidth={80}
                stageHeight={80}
                editable
                isSelected={image.id === selectedId}
                onSelect={() => setSelectedId(image.id)}
                visibleTransformers={visibleTransformers}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <FlexHorizontal gap='12px'>
        {images &&
          images.length > 0 &&
          images.map((image) => {
            return (
              <ImageContainer
                key={image}
                src={image}
                width='80px'
                height='fit-content'
                objectFit='contain'
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text', '')
                  console.log('e.target.src: ', e.target.src)
                  dragUrl.current = e.target.src
                }}
              />
            )
          })}
      </FlexHorizontal>
      <button onClick={handleDownload}>Download Image</button>
      <button onClick={handleRemove}>Remove</button>
      <button onClick={handleRemoveAll}>Remove All</button>
      <button onClick={handleSave}>Save Canvas</button>
    </>
  )
}

export default ImageCanvas
