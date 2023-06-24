import styled from '@emotion/styled'
import { errors } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import React, {
  BaseSyntheticEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import type { BusinessProfile } from 'vess-sdk'
import { ButtonGroup } from '../Common/ButtonGroup'
import { ProgressBarModalHeader } from '../Headers/ProgressBarModalHeader'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { MultiInput } from '@/components/atom/Forms/MultiInput'
import { TagSelect } from '@/components/atom/Forms/TagSelect'
import { TagUniqueSelect } from '@/components/atom/Forms/TagUniqueSelect'
import { ICONS } from '@/components/atom/Icons/Icon'
import {
  LANGUAGE_TAGS,
  PAYMENT_METHODS,
  WORK_STATUS,
  WORK_STYLES,
} from '@/constants/businessProfile'
import { ParamList, rateScheme } from '@/constants/profileRate'
import { SKILLS } from '@/constants/tags'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useUpdateSocialAccount } from '@/hooks/useUpdateSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStatePFFilledRate, useStatePFOnbordingPage } from '@/jotai/ui'
import { OrbisProfileDetail } from '@/lib/OrbisHelper'
import { removeUndefined } from '@/utils/objectUtil'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
}

export type ProgressBarHandlerType = {
  setRate: (r: number) => void
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

export const PFOnboardingForm: FC<Props> = ({ did, businessProfile }) => {
  const { setShowPFRateModal } = useVESSWidgetModal()
  const { storeBusinessProfile } = useBusinessProfile(did)
  const { profile } = useSocialAccount(did)
  const { update } = useUpdateSocialAccount(did)

  const { currentTheme } = useVESSTheme()
  const [currentPage, setCurrentPage] = useStatePFOnbordingPage()
  const ProgressBarHandlerRef = useRef({} as ProgressBarHandlerType)
  const prevPage = useRef(0)
  const lastPage = useRef(3)

  useEffect(() => {
    const keys = Object.keys(rateScheme) as Array<keyof typeof rateScheme>
    keys.forEach((k) => {
      rateScheme[k]!.done = false
    })
    setCurrentPage(0)
  }, [])

  const Form = styled.form`
    padding: 16px 32px 0px 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between
    position: relative;
    height: fit-content;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const FormContent = styled.div`
    padding: 16px 0px;
    display: flex;
    height: fit-content;
    flex-direction: column;
    gap: 16px;
    overflow-y: scroll;
  `
  const updatePage = (page?: number) => {
    prevPage.current = currentPage
    if (page) {
      if (page >= 0) {
        setCurrentPage(page)
      } else if (page < 0) {
        setCurrentPage((p) => p - 1)
      }
    } else {
      setCurrentPage((p) => p + 1)
    }
  }

  const turnDirection = useMemo(() => {
    if (currentPage > prevPage.current) {
      return 1
    } else if (currentPage < prevPage.current) {
      return -1
    } else {
      return 1
    }
  }, [currentPage])

  const isLastPage = useMemo(() => {
    if (currentPage == lastPage.current) return true
    else return false
  }, [currentPage])

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<BusinessProfileInput & OrbisProfileDetail>({
    defaultValues: {
      username: profile.displayName,
      pfp: profile.avatarSrc || '',
      description: profile.bio || '',
      ...businessProfile,
      id: did,
      desiredHourlyFee: businessProfile?.desiredHourlyFee,
    },
  })

  const onClickSubmit = async (
    data: BusinessProfileInput & OrbisProfileDetail,
    e?: BaseSyntheticEvent,
  ) => {
    e?.preventDefault()
    e?.stopPropagation()
    const BusinessProfileContent: BusinessProfile = removeUndefined<BusinessProfile>({
      ...data,
      desiredHourlyFee: Number(data.desiredHourlyFee || 0),
    })
    const SocialProfileContent: OrbisProfileDetail = removeUndefined<OrbisProfileDetail>({
      ...data,
    })

    await storeBusinessProfile(BusinessProfileContent)
    const res = await update({ did, content: SocialProfileContent })
    setCurrentPage(0)
    setShowPFRateModal(false)
  }

  const handleUpdateTempRate = useCallback(
    (ref: any, param: ParamList, e?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // In a case the data is entered
      if (e?.currentTarget.value) {
        if (!rateScheme[param]?.done) {
          ProgressBarHandlerRef.current.setRate(rateScheme[param]?.rate || 0)
          rateScheme[param]!.done = true
        }
      } else {
        // In a case the data is not stored and cleared from input
        if (rateScheme[param]?.done) {
          console.log('🍅🍅🍅🍅🍅')
          ProgressBarHandlerRef.current.setRate(-rateScheme[param]!.rate || 0)
          rateScheme[param]!.done = false
          // In a case the data is stored and cleared from input
        } else if (ref[param]) {
          console.log('🐏🐏🐏🐏🐏')
          ProgressBarHandlerRef.current.setRate(-rateScheme[param]!.rate || 0)
        }
      }
    },
    [],
  )

  return (
    <>
      <ProgressBarModalHeader
        lastPage={4}
        titles={['Enter your basic profile', 'Enter your work style', 'Enter your social links']}
        ref={ProgressBarHandlerRef}
      />
      <Form id={'PFOnboardingForm'} onSubmit={handleSubmit(onClickSubmit)}>
        {/* <MultiInput label={'bio'} name={`bio`} control={control} error={errors.bio?.message} /> */}
        <AnimatePresence>
          {currentPage == 0 ? (
            <motion.div
              key='page1'
              initial={{ x: turnDirection * 300, opacity: 0 }}
              animate={{ x: '0px', opacity: 1 }}
              exit={{ x: -turnDirection * 300, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <FormContent>
                <Input
                  label={'name'}
                  name={`username`}
                  control={control}
                  error={errors.username?.message}
                  iconSize={'MM'}
                  onClickClear={() => {
                    setValue('username', '')
                    handleUpdateTempRate(profile, 'displayName')
                  }}
                  onBlur={(e) => handleUpdateTempRate(profile, 'displayName', e)}
                />
                <Input
                  label={'pfp url'}
                  name={`pfp`}
                  control={control}
                  error={errors.pfp?.message}
                  iconSize={'MM'}
                  onClickClear={() => {
                    setValue('pfp', '')
                    handleUpdateTempRate(profile, 'avatarSrc')
                  }}
                  onBlur={(e) => handleUpdateTempRate(profile, 'avatarSrc', e)}
                />
                <MultiInput
                  label={'bio'}
                  name={`description`}
                  control={control}
                  error={errors.description?.message}
                  onBlur={(e) => handleUpdateTempRate(profile, 'bio', e)}
                />
              </FormContent>
            </motion.div>
          ) : null}
          {currentPage == 1 ? (
            <motion.div
              key='page1'
              initial={{ x: turnDirection * 300, opacity: 0 }}
              animate={{ x: '0px', opacity: 1 }}
              exit={{ x: -turnDirection * 300, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <FormContent>
                <TagSelect
                  control={control}
                  name={'skills'}
                  label={'Skills'}
                  error={errors.skills?.message}
                  options={SKILLS}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'skills', e)}
                />
                <Input
                  label={'Base Location'}
                  name={`baseLocation`}
                  control={control}
                  error={errors.baseLocation?.message}
                  icon={ICONS.LOCATION}
                  iconSize={'MM'}
                  onClickClear={() => {
                    setValue('baseLocation', '')
                    handleUpdateTempRate(businessProfile, 'baseLocation')
                  }}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'baseLocation', e)}
                />
                <Input
                  label={'Hourly Fee'}
                  name={`desiredHourlyFee`}
                  control={control}
                  error={errors.desiredHourlyFee?.message}
                  icon={ICONS.DOLLAR}
                  iconSize={'MM'}
                  inputType={'number'}
                  onClickClear={() => {
                    setValue('desiredHourlyFee', 0)
                    handleUpdateTempRate(businessProfile, 'desiredHourlyFee')
                  }}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'desiredHourlyFee', e)}
                />
              </FormContent>
            </motion.div>
          ) : null}
          {currentPage == 2 ? (
            <motion.div
              key='page2'
              initial={{ x: turnDirection * 300, opacity: 0 }}
              animate={{ x: '0px', opacity: 1 }}
              exit={{ x: -turnDirection * 300, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <FormContent>
                <TagUniqueSelect
                  control={control}
                  name={'desiredWorkStyle'}
                  label={'Work style'}
                  icon={ICONS.PC}
                  iconSize={'MM'}
                  options={WORK_STYLES}
                  error={errors.desiredWorkStyle?.message}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'desiredWorkStyle', e)}
                />
                <TagUniqueSelect
                  control={control}
                  name={'workStatus'}
                  label={'Work Status'}
                  icon={ICONS.CHAT}
                  iconSize={'MM'}
                  options={WORK_STATUS}
                  error={errors.workStatus?.message}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'workStatus', e)}
                />
                <TagSelect
                  control={control}
                  name={'languages'}
                  label={'Languages'}
                  icon={ICONS.CHAT}
                  iconSize={'MM'}
                  options={LANGUAGE_TAGS}
                  error={errors.languages?.message}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'languages', e)}
                />
              </FormContent>
            </motion.div>
          ) : null}
          {currentPage == 3 ? (
            <motion.div
              key='OnboardingPage3'
              initial={{ x: turnDirection * 300, opacity: 0 }}
              animate={{ x: '0px', opacity: 1 }}
              exit={{ x: -turnDirection * 300, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <FormContent>
                <TagSelect
                  control={control}
                  name={'paymentMethods'}
                  label={'Payment Methods'}
                  icon={ICONS.CARD}
                  iconSize={'MM'}
                  options={PAYMENT_METHODS}
                  error={errors.paymentMethods?.message}
                  onBlur={(e) => handleUpdateTempRate(businessProfile, 'paymentMethods', e)}
                />
                {/* <TagSelect
                    control={control}
                    name={'roles'}
                    label={'Roles'}
                    error={errors.roles?.message}
                  /> */}
              </FormContent>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <ButtonGroup
          showLeftButton={currentPage == 0 ? false : true}
          showRightButton={isLastPage ? false : true}
          LeftButton={{
            text: 'Back',
            variant: 'outlined',
            fill: false,
            type: 'button',
            onClick: () => updatePage(-1),
          }}
          RightButton={{
            text: 'Next',
            fill: false,
            mainColor: currentTheme.secondary,
            type: 'button',
            onClick: isLastPage ? () => updatePage(0) : () => updatePage(),
          }}
          layout={currentPage == 0 ? 'end' : 'space-between'}
        >
          {currentPage == 0 ? null : (
            <Button text={'Save'} type={'submit'} mainColor={currentTheme.secondary} />
          )}
        </ButtonGroup>
      </Form>
    </>
  )
}
