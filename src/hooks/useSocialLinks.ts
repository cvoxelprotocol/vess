import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { SocialLinks, CustomResponse } from 'vess-sdk'
import { getVESS } from 'vess-sdk'
import { useENS } from './useENS'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import { SOCIAL_LINKS_SET_FAILED, SOCIAL_LINKS_SET_SUCCEED } from '@/constants/toastMessage'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

export const useSocialLinks = (did?: string) => {
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const ensProfile = useENS(getAddressFromPkhForWagmi(did))

  const { mutateAsync: storeSocialLinks, isLoading: isStoringSocialLinks } = useMutation<
    CustomResponse<{ streamId: string | undefined }>,
    unknown,
    SocialLinks
  >((param) => vess.storeSocialLinks(param), {
    onMutate() {
      showLoading()
    },
    onSuccess(data) {
      if (data.streamId) {
        closeLoading()
        showToast(SOCIAL_LINKS_SET_SUCCEED)
      } else {
        closeLoading()
        showToast(SOCIAL_LINKS_SET_FAILED)
        console.error(data.result)
      }
    },
    onError(error) {
      console.error('error', error)
      closeLoading()
      showToast(SOCIAL_LINKS_SET_FAILED)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['socialLinks', did])
    },
  })

  const { data: socialLinks, isInitialLoading: isFetchingSocialLinks } =
    useQuery<SocialLinks | null>(['socialLinks', did], () => vess.getSocialLinks(did), {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
      retry: false,
    })

  const twitter = useMemo(() => {
    const url = socialLinks?.links?.find((link) => link.linkType === 'twitter')
    return url?.value || ensProfile.ensTwitter
  }, [socialLinks?.links, ensProfile])

  const discord = useMemo(() => {
    const url = socialLinks?.links?.find((link) => link.linkType === 'discord')
    return url?.value || ensProfile.ensDiscord
  }, [socialLinks?.links, ensProfile])

  const telegram = useMemo(() => {
    const url = socialLinks?.links?.find((link) => link.linkType === 'telegram')
    return url?.value || ensProfile.ensTelegram
  }, [socialLinks?.links, ensProfile])

  const github = useMemo(() => {
    const url = socialLinks?.links?.find((link) => link.linkType === 'github')
    return url?.value || ensProfile.ensGithub
  }, [socialLinks?.links, ensProfile])

  return {
    socialLinks,
    isFetchingSocialLinks,
    storeSocialLinks,
    isStoringSocialLinks,
    ensProfile,
    twitter,
    discord,
    telegram,
    github,
  }
}
