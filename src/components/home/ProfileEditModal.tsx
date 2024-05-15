import styled from '@emotion/styled'
import { Modal, useModal, Button, TextInput, TextArea } from 'kai-kit'
import React, { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { IconUploadButton } from './IconUploadButton'
import { UpdateUserInfo } from '@/@types/user'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
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
    setValue,
    register,
    formState: { errors },
  } = useForm<UpdateUserInfo>({
    defaultValues: {
      name: vsUser?.name || '',
      avatar: vsUser?.avatar || '',
      description: vsUser?.description || '',
    },
  })
  const { closeModal } = useModal()

  const onClickSubmit = async (data: UpdateUserInfo, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!icon) console.error('NO pfp')
    // ToDo: Add ipfs url of VESS default profile image here
    const content: UpdateUserInfo = removeUndefined<UpdateUserInfo>({
      name: data.name || vsUser?.name || '',
      avatar: icon ? icon : data.avatar,
      description: data.description || vsUser?.description || '',
      did,
    })
    console.log({ content })
    const res = await update(content)
    if (res.status === 200) {
      closeModal(name)
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
        <TextInput
          label='ニックネーム'
          align='vertical'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('name', { required: true })}
          defaultValue={vsUser?.name || ''}
          placeholder='ニックネームを入力'
          // align='vertical'
        />
        <TextArea
          label='自己紹介文'
          align='vertical'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          defaultValue={vsUser?.description || ''}
          {...register('description', { required: false })}
          placeholder='自己紹介文を入力'
          // align='vertical'
        />
        {/* <Input control={control} label='名前' name='username' />
        <MultiInput label={'自己紹介文'} name={`description`} control={control} />
         */}
      </Form>
    </Modal>
  )
}

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-none);
`
