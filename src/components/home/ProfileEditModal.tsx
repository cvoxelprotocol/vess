import styled from '@emotion/styled'
import { Modal, useModal, Button, TextInput, TextArea } from 'kai-kit'
import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { IconUploadButton } from './IconUploadButton'
import { UpdateUserInfo } from '@/@types/user'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { checkVESSId } from '@/lib/vessApi'
import { removeUndefined } from '@/utils/objectUtil'

export type ProfileEditModalProps = {
  did: string
  name?: string
}

export const ProfileEditModal: FC<ProfileEditModalProps> = ({ did, name }) => {
  const { uploadIcon, status, icon, setIcon } = useFileUpload()
  const { vsUser } = useVESSUserProfile(did)
  const { update, isUpdatingProfile } = useUpdateProfile(did)
  const {
    handleSubmit,
    setError,

    register,
    formState: { errors },
  } = useForm<UpdateUserInfo>({
    defaultValues: {
      name: vsUser?.name || '',
      avatar: vsUser?.avatar || '',
      description: vsUser?.description || '',
      vessId: vsUser?.vessId || '',
    },
  })
  const { closeModal } = useModal()

  const onClickSubmit = async (data: UpdateUserInfo, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    try {
      //validate VESS ID
      if (!hasVESSId) {
        const vessId = data.vessId
        if (!vessId) {
          setError('vessId', { message: `you need VESS ID` })
          return
        }
        if (!(await isAvailableId(vessId))) {
          setError('vessId', { message: `@${vessId} is already in use` })
          return
        }
      }
      const content: UpdateUserInfo = removeUndefined<UpdateUserInfo>({
        name: data.name || vsUser?.name || '',
        avatar: icon || vsUser?.avatar || '',
        description: data.description || vsUser?.description || '',
        did,
        vessId: data.vessId || vsUser?.vessId || '',
      })
      const res = await update(content)
      if (res.status === 200) {
        closeModal(name)
      } else {
        setError('vessId', { message: `something went wrong...` })
      }
    } catch (error) {
      console.error('error', error)
      setError('vessId', { message: `something went wrong...` })
    }
  }

  const onSelect = React.useCallback(
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

  const hasVESSId = useMemo(() => !!vsUser?.vessId && vsUser?.vessId !== '', [vsUser?.vessId])
  const isAvailableId = async (vessId?: string) => {
    try {
      console.log({ vessId })
      if (!vessId) return false
      const res = await checkVESSId(vessId)
      console.log({ res })
      return !res
    } catch (error) {
      console.error('error', error)
      return false
    }
  }

  return (
    <Modal
      name={name}
      title='プロフィール編集'
      height='calc(0.9 * var(--visual-viewport-height))'
      CTA={
        <Button
          variant='text'
          type='submit'
          form='profile-edit'
          width='auto'
          isDisabled={status === 'uploading' || isUpdatingProfile}
        >
          保存
        </Button>
      }
      disableClose={status === 'uploading' || isUpdatingProfile}
      onClose={() => {
        setIcon('')
      }}
    >
      <Form id='profile-edit' onSubmit={handleSubmit(onClickSubmit)}>
        <FlexHorizontal width='100%' gap='var(--kai-size-sys-space-md)'>
          <div style={{ width: 'var(--kai-size-ref-96)' }} />
          <IconUploadButton
            defaultIcon={icon || vsUser?.avatar || '/default_profile.jpg'}
            size='lg'
            onSelect={(files) => onSelect(files)}
            isUploading={status === 'uploading'}
          />
        </FlexHorizontal>
        <TextInput
          label='VESS ID'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('vessId', {
            required: 'VESS IDは必須です',
          })}
          defaultValue={vsUser?.vessId || ''}
          placeholder='VESS IDは一度設定すると変更できません'
          isDisabled={hasVESSId}
          errorMessage={errors.vessId?.message}
        />
        <TextInput
          label='ニックネーム'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('name', { required: 'ニックネームは必須です' })}
          defaultValue={vsUser?.name || ''}
          placeholder='ニックネームを入力'
          errorMessage={errors.name?.message}
        />
        <TextArea
          label='自己紹介文'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          defaultValue={vsUser?.description || ''}
          {...register('description')}
          placeholder='自己紹介文を入力'
          errorMessage={errors.description?.message}
        />
      </Form>
    </Modal>
  )
}

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);
`
