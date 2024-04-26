// components/ImageCanvas.tsx
import { FlexHorizontal, Text } from 'kai-kit'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { AddAvatarRequest, Avatar, CanvasJson } from '@/@types/user'
import { useAvatar } from '@/hooks/useAvatar'
import { useFileUpload } from '@/hooks/useFileUpload'
import { dataURLtoFile } from '@/utils/objectUtil'

type ImageProps = {
  imgObj?: vcImage
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
  imgObj,
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
      if (imgObj?.width) {
        imageRef.current.width(imgObj?.width)
      }
      if (imgObj?.height) {
        imageRef.current.height(imgObj?.height)
      }
      imageRef.current.rotate(imgObj?.rotation || 0)
      imageRef.current.skew({ x: imgObj?.skewX || 0, y: imgObj?.skewY || 0 })

      // Scale
      if (!imgObj?.width && !imgObj?.height) {
        const scaleX = imgObj?.scaleX || stageWidth / image.width
        const scaleY = imgObj?.scaleY || stageHeight / image.height
        const scale = Math.min(scaleX, scaleY, 1)

        imageRef.current.scale({ x: scale, y: scale })
        // position
        imageRef.current.position({
          x: (stageWidth - image.width * scale) / 2,
          y: (stageHeight - image.height * scale) / 2,
        })
      }

      // position
      if (imgObj?.x && imgObj?.y) {
        imageRef.current.position({
          x: imgObj?.x,
          y: imgObj?.y,
        })
      }

      imageRef.current.getLayer()?.batchDraw()

      // トランスフォーマーの更新
      if (editable && transformerRef?.current) {
        transformerRef.current.nodes([imageRef.current])
        transformerRef.current.getLayer().batchDraw()
      }
      if (status === 'loaded' && !initialized) {
        setInitialized(true)
      }
    }
  }, [image, stageWidth, stageHeight, editable, imgObj])

  // トランスフォームの操作をトリガーするためのイベントハンドラ
  const onTransform = () => {
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
  }

  if (!editable) {
    return (
      <Image
        id={imgObj?.id || 'sourcePhotoUrl'}
        image={image}
        ref={imageRef}
        draggable={editable}
      />
    )
  }

  return (
    <>
      <Image
        id={imgObj?.id}
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

export type vcImage = {
  id: string
  url: string
  [x: string]: any
}

type Props = {
  images: vcImage[]
  avatarUrl: string
  did: string
  profileAvatar?: Avatar
}

const ImageCanvas: React.FC<Props> = ({ avatarUrl, images, did, profileAvatar }) => {
  const stageRef = useRef<any>(null)
  const dragUrl = useRef<vcImage | null>(null)
  const [stagedImages, setStagedImages] = useState<vcImage[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibleTransformers, setVisibleTransformers] = useState(true)
  const { uploadIcon, status, icon, setIcon, cid } = useFileUpload()

  const { add } = useAvatar(did)

  useEffect(() => {
    if (profileAvatar) {
      setStagedImages(profileAvatar.canvasJson.vcImages || [])
    }
  }, [profileAvatar])

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

    setTimeout(async () => {
      const stageJson = stageRef.current.toJSON()
      const stageJ = JSON.parse(stageJson) as { [x: string]: any }

      const stage = stageJ.attrs
      const layer = stageJ.children[0]

      const children = layer.children
      const attrs = children.map((c: { attrs: any }) => c.attrs)
      const sourcePhoto = attrs.find((a: { id: string }) => a.id === 'sourcePhotoUrl')

      const vcChildren = attrs.filter((a: { id: string }) => a.id !== 'sourcePhotoUrl')
      const vcImages: vcImage[] = vcChildren.map((vc: { id: string }) => {
        const imageUrl = stagedImages.find((si) => si.id === vc.id)?.url
        if (!imageUrl) return null
        return {
          ...vc,
          id: vc.id,
          url: imageUrl,
        }
      })
      const canvasJson: CanvasJson = {
        stageWidth: stage.width,
        stageHeight: stage.height,
        baseImage: {
          ...sourcePhoto,
          url: avatarUrl,
        },
        vcImages: vcImages,
      }
      console.log('canvasJson:', canvasJson)

      const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 })
      const file = dataURLtoFile(dataURL, 'vess-avatar.png')
      if (!file) {
        console.log('file is null')
        return
      }
      const newUrl = await uploadIcon(file)
      if (!newUrl) {
        console.log('newUrl is null')
        return
      }
      const vcs = stagedImages.map((image) => image.id)
      const avatarRequest: AddAvatarRequest = {
        did: did,
        sourcePhotoUrl: avatarUrl,
        canvasJson: canvasJson,
        isProfilePhoto: true,
        credentialIds: vcs,
        avatarUrl: newUrl,
      }
      await add(avatarRequest)
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
          setStagedImages(
            stagedImages.concat([
              {
                ...stageRef.current.getPointerPosition(),
                id: dragUrl.current?.id,
                url: dragUrl.current?.url,
              },
            ]),
          )
          setSelectedId(dragUrl.current?.id || '')
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage ref={stageRef} width={320} height={320} style={{ border: '1px solid grey' }}>
          <Layer>
            <CanvasImage
              imageUrl={profileAvatar?.canvasJson?.baseImage.url || avatarUrl}
              imgObj={profileAvatar?.canvasJson?.baseImage}
              stageWidth={profileAvatar?.canvasJson?.baseImage?.width || 320}
              stageHeight={profileAvatar?.canvasJson?.baseImage?.height || 320}
            />
            {stagedImages.map((image) => (
              <CanvasImage
                key={image.id}
                imgObj={image}
                imageUrl={image.url}
                stageWidth={image.width || 80}
                stageHeight={image.height || 80}
                editable
                isSelected={image.id === selectedId}
                onSelect={() => setSelectedId(image.id)}
                visibleTransformers={visibleTransformers}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <Text as='p' typo='title-lg' color='var(--kai-color-sys-on-layer)'>
        デジタルステッカー(drag & dropで配置可能)
      </Text>
      <FlexHorizontal gap='12px'>
        {images &&
          images.length > 0 &&
          images.map((image) => {
            return (
              <ImageContainer
                id={image.id}
                key={image.id}
                src={image.url}
                width='80px'
                height='fit-content'
                objectFit='contain'
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text', '')
                  console.log('e.target: ', e.target)
                  const target = e.target as HTMLImageElement
                  dragUrl.current = { url: target.src, id: image.id }
                }}
              />
            )
          })}
      </FlexHorizontal>
      <FlexHorizontal gap='12px'>
        <button onClick={handleDownload}>Download Image</button>
        <button onClick={handleRemove}>Remove</button>
        <button onClick={handleRemoveAll}>Remove All</button>
        <button onClick={handleSave}>Save Canvas</button>
      </FlexHorizontal>
    </>
  )
}

export default ImageCanvas
