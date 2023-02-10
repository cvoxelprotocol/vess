import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { SelfClaimedMembershipSubject } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
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
}

export const SelfClaimMembershipContent: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { storeSelfClaimedMembership } = useSelfClaimedMembership(did)

  const ClaimWrapper = styled.div`
    width: 100%;
    height: 780px;
    @media (max-width: 599px) {
      height: auto;
    }
    display: grid;
    grid-template-rows: 1fr 150px;
    grid-template-columns: 1fr;
    background: ${currentTheme.surface3};
  `

  const Form = styled.form`
    grid-column: 1/2;
    grid-row: 1/2;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 12px 32px;
  `
  const ButtonContainer = styled.div`
    grid-column: 1/3;
    grid-row: 2/3;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 32px;
    background: ${currentTheme.surface1};
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
    const res = await storeSelfClaimedMembership(
      removeUndefined<SelfClaimedMembershipSubject>({ ...data }),
    )
    if (res.status === 200) {
      reset()
    }
  }

  return (
    <ClaimWrapper>
      <Form id={'SocialLinkWidgetEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
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
        <Title>Preview</Title>
        <CardContainer>
          <MembershipCardWithWatch
            control={control}
            watchName={'organizationName'}
            watchMembershipName={'membershipName'}
          />
        </CardContainer>
      </Form>
      <ButtonContainer>
        <Button
          variant='filled'
          text='Claim'
          type={'submit'}
          form='SocialLinkWidgetEditForm'
          disabled={!did}
        />
      </ButtonContainer>
    </ClaimWrapper>
  )
}
