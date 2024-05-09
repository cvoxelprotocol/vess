import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import styled from '@emotion/styled'
import {
  Button,
  FlexVertical,
  ModalOverlay,
  Modal,
  useModal,
  Text,
  FlexHorizontal,
  IconButton,
} from 'kai-kit'
import { FC, useEffect, useMemo, memo, useCallback } from 'react'
import { Button as RACButton } from 'react-aria-components'
import { PiTrash, PiStickerDuotone, PiUserSquare, PiUserSwitch } from 'react-icons/pi'
import { IconUploadButton } from '../home/IconUploadButton'
import { DraggableSticker } from './DraggableSticker'
import { DroppableAvatar } from './DroppableAvatar'
import { vcImage } from './ImageCanvas'
import { StickerType } from './StickersProvider'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { useSelectedIDAtom, useStickersAtom } from '@/jotai/ui'

export const AvatarEditModal: FC = () => {
  const { did } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { openModal, closeModal } = useModal()
  const { formatedCredentials, isInitialLoading, certificates, attendances, memberships } =
    useVerifiableCredentials(did)
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const [stickers, setStickers] = useStickersAtom()

  const { uploadIcon, status, icon, setIcon, cid } = useFileUpload()

  const stickerImages = useMemo(() => {
    console.log({ formatedCredentials })
    return formatedCredentials.map((item) => {
      return { id: item.id, url: item.image } as vcImage
    })
  }, [formatedCredentials])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    setStickers((currentStickers) => {
      if (over?.id !== 'droppableAvatar') {
        return currentStickers
      }
      return [
        ...currentStickers,
        {
          id: active.id,
          imgUrl: active.data.current?.imageUrl,
          position: {
            x: (active.rect.current.translated?.left ?? 0) - over.rect.left,
            y: (active.rect.current.translated?.top ?? 0) - over.rect.top,
          },
          width: active.data.current?.width,
          height: active.data.current?.height,
        },
      ] as StickerType[]
    })
  }

  const onClose = () => {
    console.log('Closing Modal')
    setIcon('')
    setSelectedID(undefined)
    setStickers([])
  }

  const onSelect = useCallback(
    async (files: FileList | null) => {
      if (files !== null && files[0]) {
        await uploadIcon(files[0])
        const objectURL = URL.createObjectURL(files[0])
        URL.revokeObjectURL(objectURL)
        // setErrors('')
      }
    },
    [cid, icon, uploadIcon],
  )
  // useEffect(() => {
  //   console.log('Dropped Stickers: ', stickers)
  //   if (stickers.length > 0) {
  //     console.log('Stickers 0: ', stickers[0])
  //   }
  // }, [stickers])

  return (
    <>
      <ModalOverlay isCloseButton className={'dark'} overlayColor={'#000000F0'} onClose={onClose}>
        <DndContext onDragEnd={handleDragEnd}>
          <ContentFrame>
            <FlexVertical gap={'var(--kai-size-sys-space-md)'} justifyContent='space-between'>
              <DroppableAvatar
                baseAvatarImgUrl={(icon || vsUser?.avatar) ?? 'default_profile.jpg'}
              />
              <StickerTools>
                <InstantTools data-visible={selectedID ? true : undefined}>
                  <IconButton
                    icon={<PiTrash size={28} />}
                    variant='outlined'
                    color='error'
                    onPress={() => {
                      setSelectedID(undefined)
                      setStickers((currentStickers) => {
                        return currentStickers.filter((sticker) => sticker.id !== selectedID)
                      })
                    }}
                  />
                </InstantTools>
                <IconUploadButton
                  onSelect={onSelect}
                  defaultIcon={icon || vsUser?.avatar || '/default_profile.jpg'}
                  isUploading={status === 'uploading'}
                />
              </StickerTools>
            </FlexVertical>
            <FlexHorizontal gap={'var(--kai-size-sys-space-md)'} style={{ width: '100%' }}>
              <Button
                color='neutral'
                variant='tonal'
                style={{ flexGrow: 0 }}
                onPress={() => {
                  onClose()
                  closeModal()
                }}
              >
                キャンセル
              </Button>
              <Button variant='tonal' style={{ flexGrow: 1 }}>
                保存する
              </Button>
            </FlexHorizontal>
          </ContentFrame>
          <StickerList>
            <FlexHorizontal gap='var(--kai-size-sys-space-xs)'>
              <PiStickerDuotone color='var(--kai-color-sys-on-layer)' size={28} />
              <Text typo='title-lg' color='var(--kai-color-sys-on-layer)'>
                ステッカー
              </Text>
            </FlexHorizontal>
            {stickerImages.length !== 0 ? (
              <InnerFrame>
                {stickerImages.map((sticker, index) => (
                  <DraggableSticker
                    key={`${sticker.id}-${index}`}
                    id={sticker.id}
                    imageUrl={sticker.url}
                  />
                ))}
              </InnerFrame>
            ) : (
              <Text typo='body-md' color='var(--kai-color-sys-on-layer-minor)'>
                ステッカーはまだありません
              </Text>
            )}
          </StickerList>
        </DndContext>
      </ModalOverlay>
      <Modal name='baseImage'>Base Image Here</Modal>
    </>
  )
}

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100svh;
  padding: var(--kai-size-sys-space-2xl);
  gap: var(--kai-size-sys-space-md);
`

const StickerButtonGroup = styled.div`
  display: flex;

  width: 100%;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  height: var(--kai-size-sys-widget-lg);
  border-radius: var(--kai-size-sys-round-full);
  border: 1px solid var(--kai-color-sys-neutral-outline-minor);
  overflow: hidden;
  box-sizing: content-box;
`

const StickerButton = styled(RACButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: var(--kai-color-sys-layer-farther);
  border: none;
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  &[data-hovered] {
    background-color: var(--kai-color-sys-layer-default);
    cursor: pointer;
  }

  &[data-focused] {
    outline: none;
    border: none;
  }

  &[data-focus-visible] {
    outline: none;
    border: none;
  }
`

const StickerTools = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
`

const InstantTools = styled.div`
  display: flex;
  gap: var(--kai-size-sys-space-md);
  transition: opacity var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  opacity: 0;
  pointer-events: none;

  &[data-visible] {
    opacity: 1;
    pointer-events: auto;
  }
`

const StickerList = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-lg);
  width: var(--kai-size-ref-288);
  padding: var(--kai-size-sys-space-md);
  padding-right: var(--kai-size-sys-space-xl);
  padding-top: var(--kai-size-sys-space-xl);
`

const InnerFrame = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--kai-size-sys-space-md);
`
