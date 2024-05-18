import styled from '@emotion/styled'
import { Modal, useModal, Button, TextInput, TextArea } from 'kai-kit'
import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { UpdateUserInfo } from '@/@types/user'
import { X_URL } from '@/constants/common'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { checkVESSId } from '@/lib/vessApi'
import { removeUndefined } from '@/utils/objectUtil'

export type ProfileEditModalProps = {
  did: string
  name?: string
}

type UpdateUserInfoInput = UpdateUserInfo & {
  xUserName?: string
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
  } = useForm<UpdateUserInfoInput>({
    defaultValues: {
      name: vsUser?.name || '',
      avatar: vsUser?.avatar || '',
      description: vsUser?.description || '',
      vessId: vsUser?.vessId || '',
      xUserName: vsUser?.socialLink?.some((s) => s.title === 'X')
        ? vsUser?.socialLink?.find((s) => s.title === 'X').url.replace(X_URL, '')
        : '',
    },
    reValidateMode: 'onChange',
  })
  const { closeModal } = useModal()

  const onClickSubmit = async (data: UpdateUserInfoInput, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    try {
      //validate VESS ID
      if (!hasVESSId) {
        const vessId = data.vessId
        if (vessId) {
          if (!(await isAvailableId(vessId))) {
            setError('vessId', { message: `ID:${vessId}はすでに使われています。` })
            return
          }
        }
      }
      const xUserNameWithOutPrefix =
        data.xUserName && data.xUserName?.includes('@')
          ? data.xUserName.replace('@', '')
          : data.xUserName
      const xLink = xUserNameWithOutPrefix ? `${X_URL}${xUserNameWithOutPrefix}` : undefined
      const content: UpdateUserInfo = removeUndefined<UpdateUserInfo>({
        name: data.name || vsUser?.name || '',
        avatar: icon || undefined,
        description: data.description || vsUser?.description || '',
        did,
        vessId: data.vessId || vsUser?.vessId || '',
        socialLinks: xLink
          ? [
              {
                title: 'X',
                url: xLink,
                displayLink: `@${xUserNameWithOutPrefix}`,
              },
            ]
          : undefined,
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
        <TextInput
          label='VESS ID'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('vessId', {
            required: false,
            validate: (value) => {
              if (value !== '' && !/^[a-zA-Z0-9]{4,}$/.test(value || '')) {
                return '半角英数字のみ、4文字以上で入力してください'
              }
              return true
            },
          })}
          align='vertical'
          defaultValue={vsUser?.vessId || ''}
          placeholder='YourVESSID'
          isReadOnly={hasVESSId}
          description={
            hasVESSId
              ? '変更できません。'
              : '一度設定すると変更できません。半角英数字のみ、4文字以上で入力してください。'
          }
          errorMessage={errors.vessId?.message}
        />

        <TextInput
          label='ニックネーム'
          align='vertical'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('name', { required: 'ニックネームは必須です' })}
          defaultValue={vsUser?.name || ''}
          placeholder='ニックネームを入力'
          errorMessage={errors.name?.message}
        />
        <TextArea
          label='自己紹介文'
          align='vertical'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          defaultValue={vsUser?.description || ''}
          {...register('description')}
          placeholder='自己紹介文を入力'
          errorMessage={errors.description?.message}
        />
        <TextInput
          label='X(Twitter)'
          align='vertical'
          labelWidth={'var(--kai-size-ref-96)'}
          width='100%'
          {...register('xUserName')}
          defaultValue={
            vsUser?.socialLink?.some((s) => s.title === 'X')
              ? vsUser?.socialLink?.find((s) => s.title === 'X').url.replace(X_URL, '')
              : ''
          }
          placeholder='@vess_id'
          errorMessage={errors.xUserName?.message}
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
  padding: var(--kai-size-sys-space-lg) var(--kai-size-sys-space-none);
`
