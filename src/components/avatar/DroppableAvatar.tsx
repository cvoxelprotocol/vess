import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { add } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import { Button, IconButton } from 'kai-kit'
import { FC, useEffect, useState, memo, useRef, useCallback, forwardRef } from 'react'
import { PiTrash } from 'react-icons/pi'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import { StickerImages } from './CanvasSticker'
import { vcImage } from './ImageCanvas'
import { CanvasJson, AddAvatarRequest } from '@/@types/user'
import { useAvatar } from '@/hooks/useAvatar'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useImage } from '@/hooks/useImage'
import { selectedID, useIstransformerAtom, stickers as stickersAtom } from '@/jotai/ui'
import { dataURLtoFile } from '@/utils/objectUtil'

export type DroppableAvatarProps = {
  baseAvatarImgUrl: string
}

export const DroppableAvatar = forwardRef<any, DroppableAvatarProps>(
  ({ baseAvatarImgUrl }, stageRef) => {
    const { setNodeRef, node } = useDroppable({
      id: 'droppableAvatar',
    })
    const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
    const { image } = useImage(`${baseAvatarImgUrl}`)
    const setSelectedID = useSetAtom(selectedID)

    useEffect(() => {
      const updateSize = () => {
        if (node.current) {
          const { width, height } = node.current.getBoundingClientRect()
          setFrameSize({ width, height })
        }
      }

      window.addEventListener('resize', updateSize)
      updateSize() // 初期サイズを設定

      return () => {
        window.removeEventListener('resize', updateSize)
      }
    }, [node])

    const deselect = () => {
      setSelectedID(undefined)
    }

    // useEffect(() => {
    //   if (action === 'save') {
    //     try {
    //       handleSave()
    //       // onSave?.()
    //       onChangeAciton?.('idle')
    //     } catch {
    //       console.log('error')
    //       onChangeAciton?.('idle')
    //     }
    //   }
    // }, [action])

    return (
      <>
        <DroppableFrame ref={setNodeRef}>
          <Stage width={frameSize.width} height={frameSize.height} ref={stageRef}>
            <Layer>
              <Image
                id='profile'
                image={image}
                alt='aaa'
                width={frameSize.width}
                height={frameSize.height}
                onClick={deselect}
                onTap={deselect}
                onTouchEnd={deselect}
              />
            </Layer>
            <StickerImages />
          </Stage>
        </DroppableFrame>
      </>
    )
  },
)

DroppableAvatar.displayName = 'DroppableAvatar'

const DroppableFrame = styled.div`
  position: relative;
  width: 100vw;
  aspect-ratio: 1;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  border-radius: var(--kai-size-sys-round-lg);
  border: 1px solid var(--kai-color-sys-neutral-outline);
  overflow: hidden;
`
