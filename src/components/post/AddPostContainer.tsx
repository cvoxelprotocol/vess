import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import styled from '@emotion/styled'
import {
  Button,
  useModal,
  Text,
  FlexHorizontal,
  IconButton,
  useBreakpoint,
  FlexVertical,
} from 'kai-kit'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, {
  BaseSyntheticEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { PiTrash, PiStickerDuotone } from 'react-icons/pi'
import { vcImage } from '../avatar/ImageCanvas'
import { IconUploadButton } from '../home/IconUploadButton'
import { PhotoUploadButton } from './PhotoUploadButton'
import { PostCompleteModal } from './PostCompleteModal'
import { PostFrame } from './PostFrame'
import { PostStikerListModal } from './PostStikerListModal'
import { AddPostRequest, Post, AddAvatarRequest, CanvasJson } from '@/@types/user'
import { useAvatar } from '@/hooks/useAvatar'
import { useFileUpload } from '@/hooks/useFileUpload'
import { usePost } from '@/hooks/usePost'
import { removeStickerIdSurfix, useStickers } from '@/hooks/useStickers'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import {
  useIstransformerAtom,
  usePostImageSizeAtom,
  useSelectedIDAtom,
  useSelectedPostAtom,
  useStateRPath,
  useStickersAtom,
} from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { getAddressFromPkh } from '@/utils/did'
import { checkAndConvertImageResolution } from '@/utils/hexImage'
import { isGoodResponse } from '@/utils/http'
import { compressImage } from '@/utils/image'
import { dataURLtoFile } from '@/utils/objectUtil'

const DroppablePostImage = dynamic(() => import('@/components/post/DroppablePostImage'), {
  ssr: false,
})
const DraggablePostSticker = dynamic(() => import('@/components/post/DraggablePostSticker'), {
  ssr: false,
})

type Input = {
  comment?: string
}

export const AddPostContainer: FC = () => {
  const { user } = useVESSAuthUser()
  const { vsUser } = useVESSUserProfile(user?.did)
  const router = useRouter()
  const { addItem } = usePost()
  const [rPath, setRpath] = useStateRPath()
  const [receiveStatus, setReceiveStatus] = React.useState<
    'default' | 'receiving' | 'success' | 'failed'
  >('default')

  const { openModal, closeModal } = useModal()
  const { formatedCredentials, isInitialLoading } = useVerifiableCredentials(user?.did)
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const [stickers, setStickers] = useStickersAtom()
  const { matches, breakpointProps } = useBreakpoint()

  const stageRef = useRef<any>()
  const { uploadIcon, status, icon, setIcon } = useFileUpload()
  const [isTransformer, setIsTransformer] = useIstransformerAtom()
  const { add } = useAvatar(user?.did)
  const [isSaving, setIsSaving] = useState(false)
  const [postImageSize, _] = usePostImageSizeAtom()
  const { addSticker } = useStickers()
  const [selectedPost, setPost] = useSelectedPostAtom()
  const [uploadError, setUploadError] = useState<any>()

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      comment: '',
    },
    reValidateMode: 'onChange',
  })

  const userIcon = useMemo(() => {
    return vsUser?.avatar || '/default_profile.jpg'
  }, [vsUser])

  const userName = useMemo(() => {
    return vsUser?.vessId
      ? `@${vsUser?.vessId}`
      : vsUser?.name || getAddressFromPkh(vsUser?.did || '')
  }, [vsUser])

  const today = useMemo(() => {
    return formatDate(new Date().toISOString())
  }, [])

  const stickerImages = useMemo(() => {
    return formatedCredentials
      .filter((item) => {
        return item.sticker && item.sticker.length > 0
      })
      .map((item) => {
        const stickers = item.sticker as string[]
        return stickers.map((s: string) => {
          return {
            id: item.id,
            url: s,
          } as vcImage
        })
      })
      .flat()
  }, [formatedCredentials])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (over?.id !== 'droppableAvatar') {
      return
    }
    const imgUrl = active.data.current?.imageUrl as string
    const credId = stickerImages.find((s) => s.url === imgUrl)?.id
    addSticker({
      id: credId || active.id.toString(),
      imgUrl: imgUrl,
      position: {
        x: ((active.rect.current.translated?.left ?? 0) - over.rect.left) / postImageSize.w,
        y: ((active.rect.current.translated?.top ?? 0) - over.rect.top) / postImageSize.h,
      },
      width: active.data.current?.width / postImageSize.w,
      height: active.data.current?.height / postImageSize.h,
    })
  }

  const getCredItemIds = (ids: string[]) => {
    return [...new Set(formatedCredentials.filter((c) => ids.includes(c.id)).map((c) => c.credId))]
  }

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    await handleSave(data.comment)
  }

  const handleSave = async (comment?: string) => {
    if (!user?.did) {
      setRpath(router.asPath)
      router.push(`/login`)
      return
    }

    if (!icon) return
    setIsTransformer(false)
    setIsSaving(true)

    // save image
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

      const canvasJson: CanvasJson = {
        stageWidth: stage.width,
        stageHeight: stage.height,
        baseImage: {
          ...sourcePhoto,
          url: icon,
        },
        vcImages: vcImages,
      }
      console.log('canvasJson:', canvasJson)

      try {
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 1000 / postImageSize.w })
        const file = dataURLtoFile(dataURL, 'vess-avatar.jpg')
        if (!file) {
          console.log('file is null')
          return
        }
        const convertedFile = await compressImage(file)
        const newUrl = await uploadIcon(convertedFile)
        if (!newUrl) {
          return
        }
        const vcs = [
          ...new Set(
            stickers.map((sticker) => {
              return removeStickerIdSurfix(sticker.id)
            }),
          ),
        ]
        console.log({ vcs })
        const avatarRequest: AddAvatarRequest = {
          did: user?.did || '',
          sourcePhotoUrl: icon,
          canvasJson: canvasJson,
          isProfilePhoto: false,
          credentialIds: vcs,
          avatarUrl: newUrl,
        }
        const res = await add(avatarRequest)
        const resJson = await res.json()
        const canvasId = resJson.canvasId

        // save post
        const credItemIds = getCredItemIds(vcs)
        console.log({ credItemIds })
        console.log({ comment })
        console.log({ resJson })
        await handlePost(newUrl, canvasId, credItemIds, comment)

        setIsSaving(false)
      } catch (error) {
        console.error(error)
        setUploadError(error)
        setIsSaving(false)
        onClose()
      }
    }, 100) // 非表示状態を適用するために少し遅延を入れる

    setTimeout(() => {
      // Transformerを再表示
      setIsTransformer(true)
    }, 500)
  }

  const handlePost = async (
    image: string,
    canvasId: string,
    credItemIds: string[],
    comment?: string,
  ) => {
    try {
      if (credItemIds.length === 0) {
        setUploadError('credItemIds is empty')
        setReceiveStatus('failed')
        return
      }

      const addItemPromises = credItemIds.map(async (credItemId) => {
        const postItem: AddPostRequest = {
          userId: vsUser?.id || '',
          credentialItemId: credItemId,
          image: image,
          canvasId: canvasId,
          text: comment,
        }
        return addItem(postItem)
      })
      const resArr = await Promise.all(addItemPromises)
      const res = resArr[0]
      if (isGoodResponse(res.status)) {
        const resJson = await res.json()
        const resPost = resJson.data as Post
        if (resPost.id) {
          setReceiveStatus('success')
          setPost(resPost)
          setIcon('')
          setSelectedID(undefined)
          setStickers([])
          openModal('PostCompleteModal')
        }
      }
    } catch (error) {
      console.log(error)
      setUploadError(error)
      setReceiveStatus('failed')
    }
  }

  const onClose = () => {
    setIcon('')
    setSelectedID(undefined)
    setStickers([])
    router.back()
  }

  const onSelect = useCallback(
    async (files: FileList | null) => {
      if (files !== null && files[0]) {
        try {
          const checkedFile = await checkAndConvertImageResolution(files[0])
          const convertedFile = await compressImage(checkedFile)
          await uploadIcon(convertedFile)
          const objectURL = URL.createObjectURL(files[0])
          URL.revokeObjectURL(objectURL)
        } catch (error) {
          console.error(error)
        }
      }
    },
    [icon, uploadIcon],
  )

  useEffect(() => {
    setReceiveStatus('default')
  }, [])

  return (
    <>
      <AddPostFrame className='dark'>
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
                  defaultIcon={icon || '/default_profile.jpg'}
                  isUploading={status === 'uploading'}
                />
              </StickerTools>
              <PostFrame userIcon={userIcon} userId={userName} date={today}>
                {/* <FlexVertical
                  gap='var(--kai-size-sys-space-sm)'
                  width='100%'
                  background='transparent'
                > */}
                {icon ? (
                  <DroppablePostImage
                    baseAvatarImgUrl={icon || '/default_profile.jpg'}
                    stageRef={stageRef}
                  />
                ) : (
                  <PhotoUploadButton onSelect={onSelect} isUploading={status === 'uploading'} />
                )}
                <Form id='add-post' onSubmit={handleSubmit(onClickSubmit)}>
                  <TextArea {...register('comment')} placeholder='コメントを入力' rows={2} />
                </Form>
                {/* </FlexVertical> */}
              </PostFrame>
            </AvatarFrame>

            <FlexVertical
              alignItems='center'
              gap={'var(--kai-size-sys-space-sm)'}
              style={{ width: '100%' }}
            >
              {uploadError && (
                <Text typo='body-md' color='var(--kai-color-sys-error)'>
                  {`画像のアップロードに失敗しました: ${uploadError}`}
                </Text>
              )}
              <FlexHorizontal gap='var(--kai-size-sys-space-xs)' style={{ width: '100%' }}>
                <Button
                  color='neutral'
                  variant='tonal'
                  isDisabled={isSaving}
                  style={{ flexGrow: 0 }}
                  onPress={() => {
                    onClose()
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  variant='filled'
                  style={{ flexGrow: 1 }}
                  isLoading={isSaving}
                  isDisabled={!icon || isSaving}
                  type='submit'
                  form='add-post'
                >
                  投稿する
                </Button>
              </FlexHorizontal>
            </FlexVertical>
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
                    <DraggablePostSticker
                      key={`${sticker.id}-${index}`}
                      id={`${sticker.id}-${index}`}
                      credId={sticker.id}
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
      </AddPostFrame>
      <PostStikerListModal name='stickerListModal' className={'dark'} stickers={stickerImages} />
      <PostCompleteModal
        name='PostCompleteModal'
        className={'dark'}
        post={selectedPost}
        userIcon={userIcon}
        userName={userName}
      />
    </>
  )
}

const AddPostFrame = styled.div`
  position: fixed;
  height: 100svh;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: var(--kai-color-sys-background);
  overflow-y: scroll;
`
const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  height: 100svh;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);
  overflow-y: scroll;

  &[data-media-md] {
    padding: var(--kai-size-sys-space-md) var(--kai-size-sys-space-md);
    gap: var(--kai-size-sys-space-xl);
  }
`

const AvatarFrame = styled.div`
  display: flex;
  flex: 0;
  flex-direction: column;
  gap: var(--kai-size-sys-space-md);
  justify-content: start;
  width: 100%;

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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
`
const TextArea = styled.textarea`
  width: 100%;
  background: transparent;
  color: var(--kai-color-sys-on-layer);
  border: none;
  resize: none;

  &::placeholder {
    color: var(--kai-color-sys-neutral-minor);
  }

  font-family: var(--kai-typo-ref-font-family-base);
  font-size: var(--kai-typo-sys-body-md-font-size);
  font-weight: var(--kai-typo-sys-body-md-font-weight);
  line-height: var(--kai-typo-sys-body-md-line-height);
  letter-spacing: var(--kai-typo-sys-body-md-letter-spacing);

  &:focus {
    outline: none;
    caret-color: skyblue;
  }
`
