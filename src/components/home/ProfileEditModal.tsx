import styled from '@emotion/styled'
import { Modal, useModal, Button, TextInput, TextArea } from 'kai-kit'
import React, { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { IconUploadButton } from './IconUploadButton'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useUpdateSocialAccount } from '@/hooks/useUpdateSocialAccount'
import { OrbisProfileDetail } from '@/lib/OrbisHelper'
import { removeUndefined } from '@/utils/objectUtil'

export type ProfileEditModalProps = {
  did: string
  name?: string
}

export const ProfileEditModal: FC<ProfileEditModalProps> = ({ did, name }) => {
  const { profile } = useSocialAccount(did)
  const { uploadIcon, status, icon, setIcon, cid } = useFileUpload()
  const { update, isUpdatingSocialAccount } = useUpdateSocialAccount(did)
  const {
    handleSubmit,
    setError,
    setValue,
    register,
    formState: { errors },
  } = useForm<OrbisProfileDetail>({
    defaultValues: {
      username: profile.displayName,
      pfp: profile.avatarSrc || '',
      description: profile.bio || '',
    },
  })
  const { openModal, closeModal } = useModal()

  const onClickSubmit = async (data: OrbisProfileDetail, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!icon) console.error('NO pfp')
    // ToDo: Add ipfs url of VESS default profile image here
    const content: OrbisProfileDetail = removeUndefined<OrbisProfileDetail>({
      ...data,
      pfp: icon ? icon : data.pfp,
    })
    const res = await update({ did, content })
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
    [cid, icon, uploadIcon],
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
          isDisabled={status === 'uploading' || isUpdatingSocialAccount}
        >
          保存
        </Button>
      }
      disableClose={status === 'uploading' || isUpdatingSocialAccount}
      onClose={() => {
        setIcon('')
      }}
    >
      <Form id='profile-edit' onSubmit={handleSubmit(onClickSubmit)}>
        <FlexHorizontal width='100%' gap='var(--kai-size-sys-space-md)'>
          <div style={{ width: 'var(--kai-size-ref-80)' }} />
          <IconUploadButton
            defaultIcon={icon || profile.avatarSrc || '/default_profile.jpg'}
            size='lg'
            onSelect={(files) => onSelect(files)}
            isUploading={status === 'uploading'}
          />
        </FlexHorizontal>
        <TextInput
          label='ニックネーム'
          labelWidth={'var(--kai-size-ref-80)'}
          width='100%'
          {...register('username', { required: true })}
          defaultValue={profile.displayName}
          placeholder='ニックネームを入力'
          // align='vertical'
        />
        <TextArea
          label='自己紹介文'
          labelWidth={'var(--kai-size-ref-80)'}
          width='100%'
          defaultValue={profile.bio}
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
  padding: var(--kai-size-sys-space-md);
`
