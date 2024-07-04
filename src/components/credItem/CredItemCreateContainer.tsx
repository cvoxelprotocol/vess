import styled from '@emotion/styled'
import {
  Button,
  FlexHorizontal,
  FlexVertical,
  IconButton,
  Text,
  TextInput,
  useBreakpoint,
} from 'kai-kit'
import { useRouter } from 'next/router'
import { BaseSyntheticEvent, FC, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiPencil, PiTrash } from 'react-icons/pi'
import { MyStickerPhotoUploadButton } from '../post/MyStickerPhotoUploadButton'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { IIssueCredentialItemByUserRequest, VSCredentialItemFromBuckup } from '@/@types/credential'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { checkAndConvertImageResolution } from '@/utils/hexImage'
import { isGoodResponse } from '@/utils/http'
import { compressImage } from '@/utils/image'

type Input = {
  title: string
  description?: string
  startDate?: string
  endDate?: string
  link?: string
}
export const CredItemCreateContainer: FC = () => {
  const { id } = useVESSAuthUser()
  const { userCredentialItems, create, isCreating } = useUserCredItem(id)
  const { breakpointProps } = useBreakpoint()
  const { uploadIcon, status, icon, setIcon } = useFileUpload()
  const [uploadError, setUploadError] = useState<any>()
  const router = useRouter()

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      title: '',
    },
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    console.log({ userCredentialItems })
  }, [userCredentialItems])

  const addItem = async (data: Input) => {
    if (!id) return
    if (!icon) {
      setUploadError('please upload icon!')
      return
    }
    const { title, description, startDate, endDate, link } = data
    try {
      const param: IIssueCredentialItemByUserRequest = {
        userId: id,
        title,
        description: description || '',
        icon: icon,
        image: icon,
        startDate: startDate || '',
        endDate: endDate || '',
        link: link || '',
        saveCompose: false,
        stickers: [icon],
      }
      const res = await create(param)
      console.log({ res })
      if (isGoodResponse(res.status)) {
        const resJson = await res.json()
        const resPost = resJson.data as VSCredentialItemFromBuckup
        if (resPost.id) {
          setIcon(undefined)
          setUploadError(undefined)
          router.push(`/creds/items/share/${resPost.id}`)
        } else {
          setUploadError("something's wrong! please try again!")
        }
      } else {
        setUploadError("something's wrong! please try again!")
      }
    } catch (error) {
      console.error(error)
      setUploadError(error)
    }
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
          setUploadError(error)
        }
      }
    },
    [icon, uploadIcon],
  )

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    await addItem(data)
  }

  return (
    <>
      <AddPostFrame className='dark'>
        <ContentFrame {...breakpointProps}>
          <AvatarFrame {...breakpointProps}>
            <InstantTools data-visible={!!icon}>
              <IconButton
                icon={<PiTrash size={28} />}
                variant='outlined'
                color='error'
                onPress={() => {
                  setIcon(undefined)
                }}
              />
            </InstantTools>
            {icon ? (
              <ImageContainer
                src={icon}
                width='100%'
                height='auto'
                objectFit='contain'
                style={{ borderRadius: 'var(--kai-size-sys-round-none)' }}
              />
            ) : (
              <MyStickerPhotoUploadButton
                onSelect={onSelect}
                isUploading={status === 'uploading'}
              />
            )}

            <Form id='add-cred-item' onSubmit={handleSubmit(onClickSubmit)}>
              <TextInput
                label='Title'
                align='vertical'
                labelWidth={'var(--kai-size-ref-96)'}
                width='100%'
                {...register('title', { required: 'please set "title"!' })}
                placeholder='ステッカーの名前を入力してください'
                errorMessage={errors.title?.message}
                inputStartContent={<PiPencil size={16} />}
                isRequiredMark
              />
              <TextInput
                label='Description'
                align='vertical'
                labelWidth={'var(--kai-size-ref-96)'}
                width='100%'
                {...register('description')}
                placeholder='説明文(任意)'
                errorMessage={errors.description?.message}
                inputStartContent={<PiPencil size={16} />}
              />
            </Form>
          </AvatarFrame>

          <FlexVertical
            alignItems='center'
            gap={'var(--kai-size-sys-space-sm)'}
            style={{ width: '100%' }}
          >
            {uploadError && (
              <Text typo='body-md' color='var(--kai-color-sys-error)'>
                {`アップロードに失敗しました: ${uploadError}`}
              </Text>
            )}
            <FlexHorizontal gap='var(--kai-size-sys-space-xs)' style={{ width: '100%' }}>
              <Button
                color='neutral'
                variant='tonal'
                isDisabled={isCreating}
                style={{ flexGrow: 0 }}
                onPress={() => {
                  router.back()
                }}
              >
                キャンセル
              </Button>
              <Button
                variant='filled'
                style={{ flexGrow: 1 }}
                isLoading={isCreating}
                isDisabled={!icon || isCreating}
                type='submit'
                form='add-cred-item'
              >
                保存する
              </Button>
            </FlexHorizontal>
          </FlexVertical>
        </ContentFrame>
      </AddPostFrame>
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
  padding: var(--kai-size-sys-space-xl) var(--kai-size-sys-space-md) 40px;
  background: var(--kai-color-sys-background);
  overflow-y: scroll;
  overflow-x: hidden;
`
const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  height: 100svh;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-2xl);
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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
`

const InstantTools = styled.div`
  display: flex;
  gap: var(--kai-size-sys-space-md);
  transition: opacity var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  opacity: 0;
  pointer-events: none;
  align-self: flex-end;

  &[data-visible] {
    opacity: 1;
    pointer-events: auto;
  }
`
