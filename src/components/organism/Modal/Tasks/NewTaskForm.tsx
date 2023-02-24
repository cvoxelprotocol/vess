import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC } from 'react'
import { useForm } from 'react-hook-form'
import type { Client, DeliverableItem, TaskCredential } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { BaseDatePicker } from '@/components/atom/Forms/BaseDatePicker'
import { ClientSelect } from '@/components/atom/Forms/ClientSelect'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { TagSelect } from '@/components/atom/Forms/TagSelect'
import { TagUniqueSelect } from '@/components/atom/Forms/TagUniqueSelect'
import { ICONS } from '@/components/atom/Icons/Icon'
import { GENRE_LIST } from '@/constants/genre'
import { TAGS } from '@/constants/tags'
import { useHeldTaskCredentials } from '@/hooks/useHeldTaskCredentials'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { removeUndefined } from '@/utils/objectUtil'
import { urlRegExp } from '@/utils/url'

type Props = {
  did: string
  isModal?: boolean
}

interface TaskCredentialInput extends TaskCredential {
  tx?: string
  link?: string
  start?: Date
  end?: Date
  clientStr?: string
}

export const NewTaskForm: FC<Props> = ({ did, isModal = false }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowTaskModal } = useVESSWidgetModal()
  const { createTask } = useHeldTaskCredentials(did)

  const FormContainer = styled.div`
    height: 65vh;
    border-radius: 32px;
    background: ${currentTheme.surface3};
    position: relative;
  `

  const Form = styled.form`
    padding: 12px 32px;
    display: flex;
    flex-direction: column;
    height: 65vh;
    gap: 16px;
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
    margin-bottom: 64px;
  `

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.large)};
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
  const ProofContainer = styled.div`
    background: ${currentTheme.surface};
    ${getBasicFont(currentTypo.label.large)};
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
    border-radius: 24px;
    gap: 8px;
  `
  const ProofHeader = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.large)};
  `
  const ProofCaution = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.body.small)};
  `
  const ProofContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `
  const SubmitContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${isModal ? 'space-between' : 'end'};
    padding: 12px 32px;
    background: ${currentTheme.surface3};
    z-index: 20;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  `

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TaskCredentialInput>({
    defaultValues: {
      id: did,
      summary: '',
    },
  })

  const onClickSubmit = async (data: TaskCredentialInput, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const today = new Date()
    const { tx, link, start, end, clientStr, ...rawData } = data
    const txItem: DeliverableItem = {
      format: 'tx',
      value: tx,
    }
    const linkItem: DeliverableItem = {
      format: 'url',
      value: link,
    }

    const client: Client = {
      format: clientStr?.startsWith('did:') ? 'did' : 'name',
      value: clientStr,
    }

    const content: TaskCredential = removeUndefined<TaskCredential>({
      deliverables: [txItem, linkItem],
      startDate: start?.toISOString() || '',
      endDate: end?.toISOString() || '',
      client: client,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      ...rawData,
    })
    console.log({ content })
    const res = await createTask(content)
    if (isModal) {
      setShowTaskModal(false)
    } else {
      console.log('res.streamId', res.streamId)
    }
  }

  return (
    <FormContainer>
      <Form id={'NewTaskForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <Title>Claim New Task Crendential</Title>
        <FormContent>
          {/* <MultiInput label={'bio'} name={`bio`} control={control} error={errors.bio?.message} /> */}
          <Input
            label={'Title'}
            name={`summary`}
            control={control}
            required={'this is required item'}
            error={errors.summary?.message}
            onClickClear={() => setValue('summary', '')}
            placeholder={'Task title'}
          />
          <ClientSelect
            control={control}
            name={'clientStr'}
            label={'Client'}
            error={errors.clientStr?.message}
            placeholder={`${'Client DID or name'}`}
          />
          <MultiInput
            label={'description(optional)'}
            name={`detail`}
            control={control}
            error={errors.detail?.message}
          />
          <TagUniqueSelect
            control={control}
            name={'genre'}
            label={'Genre'}
            options={GENRE_LIST}
            width={220}
            error={errors.genre?.message}
          />
          <TagSelect
            control={control}
            name={'tags'}
            options={TAGS}
            label={'tags'}
            error={errors.tags?.message}
          />
          <DatePickerContainer>
            <BaseDatePicker
              label='Start Date'
              name='start'
              control={control}
              error={errors.start?.message}
            />
            <BaseDatePicker
              label='End Date'
              name='end'
              control={control}
              error={errors.end?.message}
            />
          </DatePickerContainer>
          <ProofContainer>
            <ProofHeader>Proofs</ProofHeader>
            <ProofCaution>You can attach proofs to prove your performance if any.</ProofCaution>
            <ProofContent>
              <Input
                label={'URL'}
                name={`link`}
                control={control}
                error={errors.link?.message}
                onClickClear={() => setValue('link', '')}
                icon={ICONS.CHAIN}
                iconSize={'MM'}
                pattern={{ value: urlRegExp, message: 'only https link accepted' }}
              />
              <Input
                label={'Tx'}
                name={`tx`}
                control={control}
                error={errors.tx?.message}
                onClickClear={() => setValue('tx', '')}
                icon={ICONS.TX}
                iconSize={'MM'}
                pattern={{ value: urlRegExp, message: 'only https link accepted' }}
              />
            </ProofContent>
          </ProofContainer>
        </FormContent>
      </Form>
      <SubmitContainer>
        {isModal && (
          <Button
            variant='text'
            text='Cancel'
            type='button'
            onClick={() => setShowTaskModal(false)}
          />
        )}

        <Button
          mainColor={currentTheme.secondary}
          variant='filled'
          text='Self Claim'
          type={'submit'}
          form='NewTaskForm'
          disabled={!did}
        />
      </SubmitContainer>
    </FormContainer>
  )
}
