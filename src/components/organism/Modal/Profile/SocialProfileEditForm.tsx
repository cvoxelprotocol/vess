import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import type { OrbisProfileDetail } from '@/lib/OrbisHelper'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  did: string
}

export const SocialProfileEditForm: FC<Props> = ({ did }) => {
  const { currentTheme } = useVESSTheme()
  const { setShowSocialProfileModal } = useVESSWidgetModal()
  const { profile, updateOrbisProfile } = useSocialAccount(did)

  const Form = styled.form`
    padding: 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 65vh;
    gap: 16px;
    background: ${currentTheme.surface1};
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 64px;
  `
  const ButtonContainer = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 12px 32px;
    background: ${currentTheme.surface1};
    border-radius: 32px;
    z-index: 999;
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
    const res = await updateOrbisProfile({ did, content: removeUndefined(data) })
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
            label={'bio'}
            name={`description`}
            control={control}
            error={errors.description?.message}
          />
        </FormContent>
        <ButtonContainer>
          <Button
            variant='text'
            text='Cancel'
            type='button'
            onClick={() => setShowSocialProfileModal(false)}
          />
          <Button variant='filled' text='Issue' type={'submit'} />
        </ButtonContainer>
      </Form>
    </>
  )
}
