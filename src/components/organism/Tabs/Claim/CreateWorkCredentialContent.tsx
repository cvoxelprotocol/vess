import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { WorkSubject } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { BaseDatePicker } from '@/components/atom/Forms/BaseDatePicker'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { TagSelect } from '@/components/atom/Forms/TagSelect'
import { TagUniqueSelect } from '@/components/atom/Forms/TagUniqueSelect'
import { GENRE_LIST } from '@/constants/genre'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useWorkCredentials } from '@/hooks/useWorkCredential'

export const CreateWorkCredentialContent: FC = () => {
  const router = useRouter()
  const { currentTheme, getFont, currentTypo } = useVESSTheme()
  const { did } = useDIDAccount()
  const { workCredentials, isInitialLoading } = useWorkCredentials(did)

  const ClaimWrapper = styled.div`
    background: ${currentTheme.surface3};
    width: 100%;
    height: 780px;
    display: grid;
    grid-template-rows: 1fr 150px;
    grid-template-columns: 1fr 310px;
    @media (max-width: 599px) {
      height: auto;
    }
  `
  const FormContainer = styled.div`
    grid-column: 1/2;
    grid-row: 1/2;
    padding: 12px 32px;
    height: 630px;
  `
  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    transform: translateZ(0);
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const SubmitContainer = styled.form`
    grid-column: 1/2;
    grid-row: 2/3;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 32px;
    background: ${currentTheme.surface1};
  `
  const EvidenceContainer = styled.div`
    grid-column: 2/3;
    grid-row: 1/3;
    border-left: 1px solid ${currentTheme.outline};
  `
  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    font: ${getFont(currentTypo.title.large)};
  `

  const DatePickerContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;
    width: 100%;
  `

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WorkSubject>({})

  const onClickSubmit = async (data: WorkSubject, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    console.log({ data })
    // if (res.streamId) {
    //   const items: HighlightedCredentials = {
    //     memberships: [res.streamId],
    //     attendances: highlightedCredentials?.attendances || [],
    //     works: highlightedCredentials?.works || [],
    //   }
    //   const result = await storeHighlightedCredentials(items)
    //   if (result.status === 200) {
    //     reset()
    //   }
    // }
  }

  return (
    <ClaimWrapper>
      <FormContainer>
        <Form id={'WorkCredentialForm'} onSubmit={handleSubmit(onClickSubmit)}>
          <Title>Claim your work</Title>
          <Input
            label={'Title'}
            name={`work.summary`}
            control={control}
            required={'this is required item'}
            error={errors.work?.summary?.message}
            onClickClear={() => setValue('work.summary', '')}
            placeholder={'Your work title'}
          />
          <MultiInput
            label={'description(optional)'}
            name={`work.detail`}
            control={control}
            error={errors.work?.detail?.message}
          />
          <TagUniqueSelect
            control={control}
            name={'work.genre'}
            label={'Genre'}
            options={GENRE_LIST}
            width={220}
            error={errors.work?.genre?.message}
          />
          <TagSelect
            control={control}
            name={'work.tags'}
            label={'tags'}
            error={errors.work?.tags?.message}
          />
          <DatePickerContainer>
            <BaseDatePicker
              label='Start Date'
              name='work.startTimestamp'
              control={control}
              error={errors.work?.startTimestamp?.message}
            />
            <BaseDatePicker
              label='End Date'
              name='work.endTimestamp'
              control={control}
              error={errors.work?.endTimestamp?.message}
            />
          </DatePickerContainer>
        </Form>
      </FormContainer>
      <EvidenceContainer></EvidenceContainer>
      <SubmitContainer>
        <Button
          variant='filled'
          text='Claim'
          type={'submit'}
          form='WorkCredentialForm'
          disabled={!did}
        />
      </SubmitContainer>
    </ClaimWrapper>
  )
}
