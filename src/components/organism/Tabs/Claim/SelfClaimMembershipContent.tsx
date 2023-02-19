import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { SelfClaimedMembershipSubject } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { BaseDatePicker } from '@/components/atom/Forms/BaseDatePicker'
import { Input } from '@/components/atom/Forms/Input'
import { ICONS } from '@/components/atom/Icons/Icon'
import { MembershipCardWithWatch } from '@/components/molecure/Claim/MembershipCardWithWatch'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { removeUndefined } from '@/utils/objectUtil'

type Input = {
  id: string
  organizationName: string
  membershipName: string
  startDate?: Date
  endDate?: Date
}

export const SelfClaimMembershipContent: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { storeSelfClaimedMembership } = useSelfClaimedMembership(did)

  const ClaimWrapper = styled.div`
    width: 100%;
    height: 65vh;
    @media (max-width: 599px) {
      height: auto;
    }
    background: ${currentTheme.surface3};
    position: relative;
  `

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 12px 32px;
    height: 65vh;
    margin-bottom: 64px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    @media (max-width: 599px) {
      padding: 12px 16px;
    }
  `
  const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 80px;
    @media (max-width: 599px) {
      margin-bottom: 160px;
    }
  `
  const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 32px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background: ${currentTheme.surface3};
    z-index: 20;
  `

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.large)};
  `
  const Desc = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.medium)};
  `
  const CardContainer = styled.div`
    width: 220px;
    height: auto;
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
      id: did,
      organizationName: '',
      membershipName: '',
    },
  })

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const start = data.startDate?.toISOString() || ''
    const end = data.endDate?.toISOString() || ''
    const res = await storeSelfClaimedMembership(
      removeUndefined<SelfClaimedMembershipSubject>({ ...data, startDate: start, endDate: end }),
    )
    if (res.status === 200) {
      reset()
    }
  }

  return (
    <ClaimWrapper>
      <Form id={'SocialLinkWidgetEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <FormContent>
          <Title>Claim your experience</Title>
          <Desc>Please write down your experience</Desc>
          <Input
            label={'Organization'}
            name={`organizationName`}
            control={control}
            required={'this is required item'}
            error={errors.organizationName?.message}
            icon={ICONS.WORKSPACE}
            iconSize={'MM'}
            onClickClear={() => setValue('organizationName', '')}
            placeholder={'VESS Labs Inc'}
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
            placeholder={'Developer'}
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
          <Title>Preview</Title>
          <CardContainer>
            <MembershipCardWithWatch
              control={control}
              watchName={'organizationName'}
              watchMembershipName={'membershipName'}
              watchStartDate={'startDate'}
              watchEndDate={'endDate'}
            />
          </CardContainer>
        </FormContent>
      </Form>
      <ButtonContainer>
        <Button
          mainColor={currentTheme.secondary}
          variant='filled'
          text='Self Claim'
          type={'submit'}
          form='SocialLinkWidgetEditForm'
          disabled={!did}
        />
      </ButtonContainer>
    </ClaimWrapper>
  )
}
