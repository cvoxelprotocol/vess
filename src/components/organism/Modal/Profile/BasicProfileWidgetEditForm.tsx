import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import type { BusinessProfile } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { TagSelect } from '@/components/atom/Forms/TagSelect'
import { TagUniqueSelect } from '@/components/atom/Forms/TagUniqueSelect'
import { ICONS } from '@/components/atom/Icons/Icon'
import {
  LANGUAGE_TAGS,
  PAYMENT_METHODS,
  WORK_STATUS,
  WORK_STYLES,
} from '@/constants/businessProfile'
import { SKILLS } from '@/constants/tags'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
  updatePage?: (nextPage?: number) => void
}

type BusinessProfileInput = {
  id: string
  bio?: string
  skills?: string[]
  roles?: string[]
  services?: string[]
  languages?: string[]
  desiredHourlyFee?: number
  desiredWorkStyle?: string
  paymentMethods?: string[]
  coverImage?: string
  tags?: string[]
  baseLocation?: string
  workStatus?: string
  createdAt?: string
  updatedAt?: string
}

export const BasicProfileWidgetEditForm: FC<Props> = ({ did, businessProfile, updatePage }) => {
  const { closeModal } = useVESSWidgetModal()
  const { storeBusinessProfile } = useBusinessProfile(did)

  const Form = styled.form`
    padding: 16px 32px 0px 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 65vh;
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
  } = useForm<BusinessProfileInput>({
    defaultValues: {
      ...businessProfile,
      id: did,
      desiredHourlyFee: businessProfile?.desiredHourlyFee,
    },
  })

  const onClickSubmit = async (data: BusinessProfileInput, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const content: BusinessProfile = removeUndefined<BusinessProfile>({
      ...data,
      desiredHourlyFee: Number(data.desiredHourlyFee || 0),
    })
    if (updatePage) {
      console.log('passed')
      updatePage()
    } else {
      closeModal()
    }
    await storeBusinessProfile(content)
  }

  return (
    <>
      <Form id={'BasicProfileEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
        <FormContent>
          {/* <MultiInput label={'bio'} name={`bio`} control={control} error={errors.bio?.message} /> */}
          <TagSelect
            control={control}
            name={'skills'}
            label={'Skills'}
            error={errors.skills?.message}
            options={SKILLS}
          />
          {/* <TagSelect
            control={control}
            name={'tags'}
            label={'Tags'}
            error={errors.tags?.message}
            options={TAGS}
          /> */}
          <Input
            label={'Base Location'}
            name={`baseLocation`}
            control={control}
            error={errors.baseLocation?.message}
            icon={ICONS.LOCATION}
            iconSize={'MM'}
            onClickClear={() => setValue('baseLocation', '')}
          />
          <Input
            label={'Hourly Fee'}
            name={`desiredHourlyFee`}
            control={control}
            error={errors.desiredHourlyFee?.message}
            icon={ICONS.DOLLAR}
            iconSize={'MM'}
            inputType={'number'}
            onClickClear={() => setValue('desiredHourlyFee', 0)}
          />
          <TagUniqueSelect
            control={control}
            name={'desiredWorkStyle'}
            label={'Work style'}
            icon={ICONS.PC}
            iconSize={'MM'}
            options={WORK_STYLES}
            error={errors.desiredWorkStyle?.message}
          />
          <TagUniqueSelect
            control={control}
            name={'workStatus'}
            label={'Work Status'}
            icon={ICONS.CHAT}
            iconSize={'MM'}
            options={WORK_STATUS}
            error={errors.workStatus?.message}
          />
          <TagSelect
            control={control}
            name={'languages'}
            label={'Languages'}
            icon={ICONS.CHAT}
            iconSize={'MM'}
            options={LANGUAGE_TAGS}
            error={errors.languages?.message}
          />
          <TagSelect
            control={control}
            name={'paymentMethods'}
            label={'Payment Methods'}
            icon={ICONS.CARD}
            iconSize={'MM'}
            options={PAYMENT_METHODS}
            error={errors.paymentMethods?.message}
          />
          {/* <TagSelect
            control={control}
            name={'roles'}
            label={'Roles'}
            error={errors.roles?.message}
          /> */}
        </FormContent>
        <ButtonContainer>
          <Button
            variant='outlined'
            text='Cancel'
            type='button'
            onClick={() => closeModal()}
            fill
          />
          <Button
            variant='filled'
            text='Save'
            type={'submit'}
            fill
            //onClick={updatePage ? () => updatePage() : undefined}
          />
        </ButtonContainer>
      </Form>
    </>
  )
}
