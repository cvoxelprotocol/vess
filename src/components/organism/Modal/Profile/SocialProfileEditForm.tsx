import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useUpdateSocialAccount } from '@/hooks/useUpdateSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import type { OrbisProfileDetail } from '@/lib/OrbisHelper'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  did: string
}

export const SocialProfileEditForm: FC<Props> = ({ did }) => {
  const { setShowSocialProfileModal } = useVESSWidgetModal()
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
    const res = await update({ did, content: removeUndefined(data) })
    if (res.status === 200) {
      setShowSocialProfileModal(false)
    }
  }

  return (
    <>
      <Form id={'SocialProfileEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <FormContent>
          <Input
            label={'name'}
            name={`username`}
            control={control}
            error={errors.username?.message}
            iconSize={'MM'}
            onClickClear={() => setValue('username', '')}
          />
          <Input
            label={'pfp url'}
            name={`pfp`}
            control={control}
            error={errors.pfp?.message}
            iconSize={'MM'}
            onClickClear={() => setValue('pfp', '')}
          />
          <MultiInput
            label={'Upload'}
            name={`pfp`}
            control={control}
            error={errors.description?.message}
          />
          <MultiInput
            label={'bio'}
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
