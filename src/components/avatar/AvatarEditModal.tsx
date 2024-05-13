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
  useBreakpoint,
} from 'kai-kit'
import dynamic from 'next/dynamic'
import { FC, useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { Button as RACButton } from 'react-aria-components'
import { PiTrash, PiStickerDuotone } from 'react-icons/pi'
import { IconUploadButton } from '../home/IconUploadButton'
import { vcImage } from './ImageCanvas'
import { StickerListModal } from './StikerListModal'
import { StickerType } from '@/@types/avatar'
import { AddAvatarRequest, Avatar, CanvasJson } from '@/@types/user'
import { useAvatar } from '@/hooks/useAvatar'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useStickers } from '@/hooks/useStickers'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import {
  useAvatarSizeAtom,
  useIstransformerAtom,
  useSelectedIDAtom,
  useStickersAtom,
} from '@/jotai/ui'
import { dataURLtoFile } from '@/utils/objectUtil'

const DroppableAvatar = dynamic(() => import('@/components/avatar/DroppableAvatar'), { ssr: false })
const DraggableSticker = dynamic(() => import('@/components/avatar/DraggableSticker'), {
  ssr: false,
})

type Props = {
  profileAvatar?: Avatar
}

export const AvatarEditModal: FC<Props> = ({ profileAvatar }) => {
  const { did } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { avatars } = useAvatar(did)
  const { openModal, closeModal } = useModal()
  const { formatedCredentials, isInitialLoading } = useVerifiableCredentials(did)
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const [stickers, setStickers] = useStickersAtom()
  const { matches, breakpointProps } = useBreakpoint()

  const stageRef = useRef<any>()
  const { uploadIcon, status, icon, setIcon } = useFileUpload()
  const [isTransformer, setIsTransformer] = useIstransformerAtom()
  const { add } = useAvatar(did)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarSize, setAvatarSize] = useAvatarSizeAtom()
  const { addSticker } = useStickers()

  const stickerImages = useMemo(() => {
    console.log({ formatedCredentials })
    return formatedCredentials.map((item) => {
      return {
        id: item.id,
        url: item.sticker && item.sticker.length > 0 ? item.sticker[0] : item.image,
      } as vcImage
    })
  }, [formatedCredentials])

  const baseImage = useMemo(() => {
    return (icon ||
      profileAvatar?.sourcePhotoUrl ||
      profileAvatar?.canvasJson?.baseImage.url ||
      profileAvatar?.avatarUrl ||
      vsUser?.avatar) as string
  }, [
    icon,
    profileAvatar?.sourcePhotoUrl,
    profileAvatar?.canvasJson?.baseImage.url,
    profileAvatar?.avatarUrl,
    vsUser?.avatar,
  ])

  const currentStickers = useMemo(() => {
    return (
      profileAvatar?.canvasJson?.vcImages?.map((vci) => {
        return {
          id: vci.id,
          imgUrl: vci.url,
          position: {
            x: vci.x,
            y: vci.y,
          },
          width: vci.width,
          height: vci.height,
          rotation: vci.rotation,
        } as StickerType
      }) || []
    )
  }, [profileAvatar])

  useEffect(() => {
    console.log({ profileAvatar })
    if (profileAvatar) {
      setStickers(currentStickers)
    }
  }, [profileAvatar])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (over?.id !== 'droppableAvatar') {
      return
    }
    addSticker({
      id: active.id.toString(),
      imgUrl: active.data.current?.imageUrl,
      position: {
        x: ((active.rect.current.translated?.left ?? 0) - over.rect.left) / avatarSize,
        y: ((active.rect.current.translated?.top ?? 0) - over.rect.top) / avatarSize,
      },
      width: active.data.current?.width / avatarSize,
      height: active.data.current?.height / avatarSize,
    })
  }

  const handleSave = () => {
    setIsTransformer(false)
    setIsSaving(true)

    setTimeout(async () => {
      if (!stageRef.current) {
        console.log('stageRef.current is null')
        return
      }
      if (stageRef.current.retry) {
        stageRef.current.retry()
      }
      console.log('stageRef.current:', stageRef.current)
      const stageJson = stageRef.current.toJSON()
      const stageJ = JSON.parse(stageJson) as { [x: string]: any }
      console.log('stageJson:', JSON.stringify(stageJ, null, 2))

      const stage = stageJ.attrs
      const attrs = stageJ.children.flatMap((child: { children: any[] }) =>
        child.children.map((grandChild) => grandChild.attrs),
      )
      const sourcePhoto = attrs.find((a: { id: string }) => a.id === 'sourcePhotoUrl')
      const vcImages: vcImage[] = stickers.map((sticker) => {
        return {
          id: sticker.id,
          url: sticker.imgUrl,
          x: sticker.position.x,
          y: sticker.position.y,
          width: sticker.width,
          height: sticker.height,
          scale: sticker.scale,
          rotation: sticker.rotation,
        }
      })

      // baseImageがプロフィール画像でvcImgesがステッカー
      const canvasJson: CanvasJson = {
        stageWidth: stage.width,
        stageHeight: stage.height,
        baseImage: {
          ...sourcePhoto,
          url: baseImage,
        },
        vcImages: vcImages,
      }
      console.log('canvasJson:', canvasJson)

      const dataURL = stageRef.current.toDataURL({ pixelRatio: 1000 / avatarSize })
      const file = dataURLtoFile(dataURL, 'vess-avatar.png')
      if (!file) {
        console.log('file is null')
        return
      }
      const newUrl = await uploadIcon(file)
      if (!newUrl) {
        return
      }
      const vcs = stickers.map((sticker) => sticker.id)
      const avatarRequest: AddAvatarRequest = {
        did: did || '',
        sourcePhotoUrl:
          icon || sourcePhoto?.url || profileAvatar?.sourcePhotoUrl || vsUser?.avatar || '',
        canvasJson: canvasJson,
        isProfilePhoto: true,
        credentialIds: vcs,
        avatarUrl: newUrl,
      }
      await add(avatarRequest)
      setIsSaving(false)
      onClose()
    }, 100) // 非表示状態を適用するために少し遅延を入れる

    setTimeout(() => {
      // Transformerを再表示
      setIsTransformer(true)
    }, 500)
  }

  const onClose = () => {
    setIcon('')
    setSelectedID(undefined)
    setStickers(currentStickers)
    closeModal()
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
    [icon, uploadIcon],
  )

  return (
    <>
      <ModalOverlay isCloseButton className={'dark'} overlayColor={'#000000F0'} onClose={onClose}>
        <DndContext onDragEnd={handleDragEnd}>
          <ContentFrame {...breakpointProps}>
            <AvatarFrame {...breakpointProps}>
              <StickerTools {...breakpointProps}>
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
                {matches.lg ? null : (
                  <IconButton
                    variant='tonal'
                    color='dominant'
                    icon={<PiStickerDuotone size={32} />}
                    onPress={() => openModal('stickerListModal')}
                  />
                )}
                <IconUploadButton
                  onSelect={onSelect}
                  defaultIcon={
                    icon || profileAvatar?.avatarUrl || vsUser?.avatar || '/default_profile.jpg'
                  }
                  isUploading={status === 'uploading'}
                />
              </StickerTools>
              <DroppableAvatar
                baseAvatarImgUrl={baseImage ?? 'default_profile.jpg'}
                stageRef={stageRef}
              />
              <Button onPress={() => setStickers([])}>全て削除</Button>
            </AvatarFrame>

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
              <Button
                variant='tonal'
                style={{ flexGrow: 1 }}
                isLoading={isSaving}
                onPress={() => {
                  handleSave()
                }}
              >
                保存する
              </Button>
            </FlexHorizontal>
          </ContentFrame>
          {matches.lg ? (
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
          ) : (
            <></>
          )}
        </DndContext>
      </ModalOverlay>
      <StickerListModal name='stickerListModal' stickers={stickerImages} className={'dark'} />
    </>
  )
}

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100svh;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);

  &[data-media-md] {
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
  }
`

const AvatarFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-md);
  justify-content: start;
  width: 100%;
  height: 100%;

  &[data-media-md] {
    flex-direction: column-reverse;
  }
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
  align-items: center;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  justify-content: end;

  &[data-media-lg] {
    justify-content: space-between;
  }
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
