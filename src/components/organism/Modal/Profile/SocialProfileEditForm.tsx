import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/atom/Buttons/Button'
import { IconInput } from '@/components/atom/Forms/IconInput'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useUpdateSocialAccount } from '@/hooks/useUpdateSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import type { OrbisProfileDetail } from '@/lib/OrbisHelper'
import { removeUndefined } from '@/utils/objectUtil'
import { throws } from 'assert'

type Props = {
  did: string
}

export const SocialProfileEditForm: FC<Props> = ({ did }) => {
  const { setShowSocialProfileModal } = useVESSWidgetModal()
  const { uploadIcon, status, icon,  } = useFileUpload()
  const { profile } = useSocialAccount(did)
  const { update } = useUpdateSocialAccount(did)

  const Form = styled.form`
    padding: 16px 32px 0px 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 65vh;
    gap: 16px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const FormContent = styled.div`
    padding: 16px 0px;
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 16px;
    overflow-y: scroll;
  `
  const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 16px 0px;
    gap: 8px;
  `

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrbisProfileDetail>({
    defaultValues: {
      username: profile.displayName,
      pfp: profile.avatarSrc || '',
      description: profile.bio || '',
    },
  })

  const onClickSubmit = async (data: OrbisProfileDetail, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!icon) console.error("NO pfp")
    setValue('pfp', icon? icon : '' ) // ToDo: Add ipfs url of VESS default profile image here
    console.log("form data" + data);
    const res = await update({ did, content: removeUndefined(data) })
    if (res.status === 200) {
      setShowSocialProfileModal(true)
    }
  }

  return (
    <>
      <Form id={'SocialProfileEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <FormContent>
          <Input
            label={'Name'}
            name={`username`}
            control={control}
            error={errors.username?.message}
            iconSize={'MM'}
            onClickClear={() => setValue('username', '')}
          />
          
          <IconInput
            required={false}
            label={'Icon'}
            recommendText={'Drag and drop or click here to upload'}
          />
          
          <MultiInput
            label={'Bio'}
            name={`description`}
            control={control}
            error={errors.description?.message}
          />
        </FormContent>
        <ButtonContainer>
          <Button
            variant='outlined'
            text='Cancel'
            type='button'
            onClick={() => setShowSocialProfileModal(false)}
            fill
          />
          <Button variant='filled' text='Save' type={'submit'} fill />
        </ButtonContainer>
      </Form>
    </>
  )
}
