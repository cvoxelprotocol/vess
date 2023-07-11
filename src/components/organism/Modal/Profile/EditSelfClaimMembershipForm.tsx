import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { SelfClaimedMembershipSubject, WithCeramicId } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { BaseDatePicker } from '@/components/atom/Forms/BaseDatePicker'
import { Input } from '@/components/atom/Forms/Input'
import { ICONS } from '@/components/atom/Icons/Icon'
import { useSelfClaimedMembership , UpdateSelfClaimedMembershipParams } from '@/hooks/useSelfClaimedMembership'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  selfClaim?: WithCeramicId<SelfClaimedMembershipSubject>
}

type Input = {
  id: string
  organizationName: string
  membershipName: string
  startDate?: Date
  endDate?: Date
}

export const EditSelfClaimMembershipForm: FC<Props> = ({ selfClaim }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { closeMembershipModal } = useVESSWidgetModal()
  const { updateSelfClaimedMembership } = useSelfClaimedMembership()

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
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

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const Desc = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.medium)};
  `
  const DatePickerContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;
    width: 100%;
    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Input>({
    defaultValues: {
      id: selfClaim?.ceramicId,
      organizationName: '',
      membershipName: '',
    },
  })

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const start = data.startDate?.toISOString() || ''
    const end = data.endDate?.toISOString() || ''

    const params: UpdateSelfClaimedMembershipParams = {
      id: selfClaim?.ceramicId || '',
      param: removeUndefined<SelfClaimedMembershipSubject>({ ...data, startDate: start, endDate: end })
    }
    const res = await updateSelfClaimedMembership(params) // This function will cause errors until we update and release VESS-Sdk
    if (res.status) {
      reset()
      closeMembershipModal()
    }
  }

  const handleCancel = async () => {
    reset()
    closeMembershipModal()
  }

  return (
    <Form id={'EditSelfClaimMembershipForm'} onSubmit={handleSubmit(onClickSubmit)}>
      <Title>Edit Experience</Title>
      <Desc>Edit your self-claimed experience</Desc>
      <Input
        label={'Organization'}
        name={`organizationName`}
        control={control}
        required={'this is required item'}
        error={errors.organizationName?.message}
        icon={ICONS.WORKSPACE}
        iconSize={'MM'}
        onClickClear={() => setValue('organizationName', '')}
        placeholder={selfClaim?.organizationName}
      />
      <Input
        label={'Role'}
        name={`membershipName`}
        control={control}
        required={'this is required item'}
        error={errors.membershipName?.message}
        icon={ICONS.PERSON}
        iconSize={'MM'}
        onClickClear={() => setValue('membershipName', '')}
        placeholder={selfClaim?.membershipName}
      />
      <DatePickerContainer>
        <BaseDatePicker
          label='Start Date'
          name='startDate'
          control={control}
          error={errors.startDate?.message}
        />
        <BaseDatePicker
          label='End Date'
          name='endDate'
          control={control}
          error={errors.endDate?.message}
        />
      </DatePickerContainer>
      <ButtonContainer>
        <Button
          variant='outlined'
          text='Cancel'
          type={'button'}
          onClick={() => handleCancel()}
          fill
        />
        <Button variant='filled' text='Save' type={'submit'} style={{ marginRight: '5px' }} fill />
      </ButtonContainer>
    </Form>
  )
}
