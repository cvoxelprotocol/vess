import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { SelfClaimedMembershipSubject, HighlightedCredentials } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { ICONS } from '@/components/atom/Icons/Icon'
import { useHighlightedCredentials } from '@/hooks/useHighlightedCredentials'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  did: string
}

type Input = {
  id: string
  organizationName: string
  membershipName: string
}

export const SelfClaimMembershipForm: FC<Props> = ({ did }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { closeMembershipModal } = useVESSWidgetModal()
  const { storeSelfClaimedMembership } = useSelfClaimedMembership(did)
  const { highlightedCredentials, storeHighlightedCredentials } = useHighlightedCredentials(did)

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `
  const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 32px;
    background: ${currentTheme.surface1};
    border-radius: 32px;
    z-index: 999;
  `

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const Desc = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.medium)};
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
    if (res.streamId) {
      const items: HighlightedCredentials = {
        memberships: [res.streamId],
        attendances: highlightedCredentials?.attendances || [],
        works: highlightedCredentials?.works || [],
      }
      const result = await storeHighlightedCredentials(items)
      if (result.status === 200) {
        reset()
        closeMembershipModal()
      }
    }
  }

  return (
    <Form id={'SocialLinkWidgetEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
      <Title>Claim your membership</Title>
      <Desc>Please write down your membership</Desc>
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
      <ButtonContainer>
        <Button variant='filled' text='Claim' type={'submit'} />
      </ButtonContainer>
    </Form>
  )
}
