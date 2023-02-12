import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateDevModal } from '@/jotai/ui'

type Props = {
  did: string
}

type Input = {
  streamId?: string
}

export const DeleteRoleForm: FC<Props> = ({ did }) => {
  const { currentTheme } = useVESSTheme()
  const { deleteRole } = useHeldMembershipSubject()
  const [_, setShow] = useStateDevModal()

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
  } = useForm<Input>()

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const { streamId } = data
    if (!streamId) return
    await deleteRole(streamId)
  }

  return (
    <>
      <Form id={'SocialProfileEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <FormContent>
          <Input
            label={'streamId'}
            name={`streamId`}
            control={control}
            error={errors.streamId?.message}
          />
        </FormContent>
        <ButtonContainer>
          <Button variant='text' text='Cancel' type='button' onClick={() => setShow(false)} />
          <Button variant='filled' text='Delete' type={'submit'} />
        </ButtonContainer>
      </Form>
    </>
  )
}
