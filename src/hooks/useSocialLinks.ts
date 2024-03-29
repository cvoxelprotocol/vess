// TODO: replace with vess-web-kit
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useMemo } from 'react'
// import type { SocialLinks, CustomResponse } from 'vess-sdk'
// import { getVESS } from 'vess-sdk'
// import { useVESSLoading } from './useVESSLoading'
// import { isProd } from '@/constants/common'

// export const useSocialLinks = (did?: string) => {
//   const vess = getVESS(!isProd())
//   const queryClient = useQueryClient()
//   const { showLoading, closeLoading } = useVESSLoading()

//   const { mutateAsync: storeSocialLinks, isLoading: isStoringSocialLinks } = useMutation<
//     CustomResponse<{ streamId: string | undefined }>,
//     unknown,
//     SocialLinks
//   >((param) => vess.storeSocialLinks(param), {
//     onMutate() {
//       showLoading()
//     },
//     onSuccess(data) {
//       if (data.streamId) {
//         closeLoading()
//       } else {
//         closeLoading()
//         console.error(data.result)
//       }
//     },
//     onError(error) {
//       console.error('error', error)
//       closeLoading()
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries(['socialLinks', did])
//     },
//   })

//   const { data: socialLinks, isInitialLoading: isFetchingSocialLinks } =
//     useQuery<SocialLinks | null>(['socialLinks', did], () => vess.getSocialLinks(did), {
//       enabled: !!did && did !== '',
//       staleTime: Infinity,
//       cacheTime: 300000,
//       retry: false,
//     })

//   const twitter = useMemo(() => {
//     const url = socialLinks?.links?.find((link) => link.linkType === 'twitter')
//     return url?.value
//   }, [socialLinks?.links])

//   const discord = useMemo(() => {
//     const url = socialLinks?.links?.find((link) => link.linkType === 'discord')
//     return url?.value
//   }, [socialLinks?.links])

//   const telegram = useMemo(() => {
//     const url = socialLinks?.links?.find((link) => link.linkType === 'telegram')
//     return url?.value
//   }, [socialLinks?.links])

//   const github = useMemo(() => {
//     const url = socialLinks?.links?.find((link) => link.linkType === 'github')
//     return url?.value
//   }, [socialLinks?.links])

//   return {
//     socialLinks,
//     isFetchingSocialLinks,
//     storeSocialLinks,
//     isStoringSocialLinks,
//     twitter,
//     discord,
//     telegram,
//     github,
//   }
// }
