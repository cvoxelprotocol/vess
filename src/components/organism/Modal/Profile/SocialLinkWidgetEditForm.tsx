import styled from '@emotion/styled'
import { BaseSyntheticEvent, FC, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { SocialLinks } from 'vess-sdk'
import { Button } from '@/components/atom/Buttons/Button'
import { Input } from '@/components/atom/Forms/Input'
import { ICONS } from '@/components/atom/Icons/Icon'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { removeUndefined, removeUndefinedFromArray } from '@/utils/objectUtil'
import { domainRegExp, handleNameREgExp } from '@/utils/url'

type Props = {
  did: string
  socialLinks?: SocialLinks | null
  editable?: boolean
}

type Input = {
  twitter?: string
  discord?: string
  telegram?: string
  github?: string
  mail?: string
  otherLinks: { link?: string }[]
}

export const SocialLinkWidgetEditForm: FC<Props> = ({ did, socialLinks, editable = false }) => {
  const { currentTheme } = useVESSTheme()
  const { closeSocialLinkModal } = useVESSWidgetModal()
  const { storeSocialLinks } = useSocialLinks(did)

  const Form = styled.form`
    padding: 32px;
    border-radius: 32px;
    position: relative;
    height: 60vh;
    display: flex;
    flex-direction: column;
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

  const existedVal = useMemo(() => {
    if (!socialLinks || !socialLinks.links || socialLinks.links?.length === 0) return null
    const otherLinks = removeUndefinedFromArray(
      socialLinks.links
        .filter((l) => {
          if (!l.linkType) return false
          return !['twitter', 'discord', 'telegram', 'github', 'mail'].includes(l.linkType)
        })
        .map((l) => l.value),
    )
    const input: Input = {
      twitter: socialLinks.links.find((l) => l.linkType === 'twitter')?.value,
      discord: socialLinks.links.find((l) => l.linkType === 'discord')?.value,
      telegram: socialLinks.links.find((l) => l.linkType === 'telegram')?.value,
      github: socialLinks.links.find((l) => l.linkType === 'github')?.value,
      mail: socialLinks.links.find((l) => l.linkType === 'mail')?.value,
      otherLinks:
        !otherLinks || otherLinks.length === 0
          ? [{ link: undefined }]
          : otherLinks.map((l) => {
              return { link: l }
            }),
    }
    return input
  }, [socialLinks?.links])

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      ...existedVal,
    },
  })

  const { fields, append, remove } = useFieldArray<Input, 'otherLinks', 'link'>({
    control,
    name: 'otherLinks',
  })

  const removeRow = (index: number) => {
    if (!editable) return
    if (fields.length < 2) return
    remove(index)
  }

  const onClickSubmit = async (data: Input, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!editable) return
    const contentData = removeUndefined<Input>(data)
    const { twitter, discord, telegram, github, mail, otherLinks } = contentData
    let content: SocialLinks = { links: [] }
    if (twitter) content.links?.push({ linkType: 'twitter', value: twitter })
    if (discord) content.links?.push({ linkType: 'discord', value: discord })
    if (telegram) content.links?.push({ linkType: 'telegram', value: telegram })
    if (github) content.links?.push({ linkType: 'github', value: github })
    if (mail) content.links?.push({ linkType: 'mail', value: mail })
    if (otherLinks && otherLinks.length > 0) {
      otherLinks.forEach((item) => {
        if (item.link) {
          content.links?.push({ linkType: 'url', value: item.link })
        }
      })
    }
    await storeSocialLinks(content)
    closeSocialLinkModal()
  }

  return (
    <Form id={'SocialLinkWidgetEditForm'} onSubmit={handleSubmit(onClickSubmit)}>
      <FormContent>
        <Input
          label={'twitter'}
          name={`twitter`}
          control={control}
          error={errors.twitter?.message}
          icon={ICONS.TWITTER}
          iconSize={'MM'}
          pattern={{ value: domainRegExp('twitter'), message: 'only https://twitter.com accepted' }}
          onClickClear={editable ? () => setValue('twitter', '') : undefined}
          placeholder={'https://twitter.com/vess_id'}
          disabled={!editable}
        />
        <Input
          label={'discord'}
          name={`discord`}
          control={control}
          error={errors.discord?.message}
          icon={ICONS.DISCORD}
          iconSize={'MM'}
          onClickClear={editable ? () => setValue('discord', '') : undefined}
          placeholder={'0xKantaro | VESS#4407'}
          disabled={!editable}
        />
        <Input
          label={'telegram'}
          name={`telegram`}
          control={control}
          error={errors.telegram?.message}
          icon={ICONS.TELEGRAM}
          iconSize={'MM'}
          onClickClear={editable ? () => setValue('telegram', '') : undefined}
          placeholder={'@kantaro_eth'}
          pattern={{ value: handleNameREgExp, message: 'Only names beginning with @ accepted' }}
          disabled={!editable}
        />
        <Input
          label={'github'}
          name={`github`}
          control={control}
          error={errors.github?.message}
          icon={ICONS.GITHUB}
          iconSize={'MM'}
          onClickClear={editable ? () => setValue('github', '') : undefined}
          placeholder={'https://github.com/kitakaze-kan'}
          pattern={{ value: domainRegExp('github'), message: 'only https://github.com accepted' }}
          disabled={!editable}
        />
        {fields.map((_, index) => {
          return (
            <Input
              key={index}
              label={'link'}
              name={`otherLinks.${index}.link`}
              control={control}
              error={errors.otherLinks && errors.otherLinks[index]?.link?.message}
              icon={ICONS.CHAIN}
              iconSize={'MM'}
              onClickClear={editable ? () => removeRow(index) : undefined}
              disabled={!editable}
            />
          )
        })}
        {editable && (
          <Button
            variant='outlined'
            icon={ICONS.ADD}
            text='Add Link'
            mainColor={currentTheme.outline}
            textColor={currentTheme.onSurface}
            type={'button'}
            onClick={() => append({ link: undefined })}
          />
        )}
      </FormContent>
      {editable && (
        <ButtonContainer>
          <Button
            variant='text'
            text='Cancel'
            type='button'
            onClick={() => closeSocialLinkModal()}
          />
          <Button variant='filled' text='Issue' type={'submit'} />
        </ButtonContainer>
      )}
    </Form>
  )
}
