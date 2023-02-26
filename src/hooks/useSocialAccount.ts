import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDID } from 'vess-sdk'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { useCcProfile } from './useCcProfile'
import { useLensProfile } from './useLensProfile'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { DisplayProfile } from '@/@types'
import { BUSINESS_PROFILE_SET_FAILED, BUSINESS_PROFILE_SET_SUCCEED } from '@/constants/toastMessage'
import { useStateDisplayProfile } from '@/jotai/account'
import {
  getOrbisHelper,
  OrbisBaseResponse,
  OrbisProfileDetail,
  UpdateOrbisProfileParam,
} from '@/lib/OrbisHelper'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

export const useSocialAccount = (did?: string) => {
  const orbisHelper = getOrbisHelper()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { data: ensAvatar, isLoading: ensAvatarLoading } = useEnsAvatar({
    address: getAddressFromPkhForWagmi(did),
  })
  const { data: ensName, isLoading: ensLoading } = useEnsName({
    address: getAddressFromPkhForWagmi(did),
  })
  const { ccProfile, ccLoading } = useCcProfile(did)
  const { lensProfile, lensLoading } = useLensProfile(did)
  const [displayProfile, setDisplayProfile] = useStateDisplayProfile()

  const { data: orbisProfile, isInitialLoading: isFetchingSocialAccount } =
    useQuery<OrbisProfileDetail | null>(
      ['orbisProfile', did],
      () => orbisHelper.fetchOrbisProfile(did),
      {
        enabled: !!did && did !== '',
        staleTime: Infinity,
        cacheTime: 1000000,
      },
    )

  // const { data: socialProfile } = useQuery<DisplayProfile | null>(
  //   ['socialProfile', did],
  //   () => fetchSocialProfile(did),
  //   {
  //     enabled: !!did && did !== '',
  //     staleTime: Infinity,
  //     cacheTime: 1000000,
  //   },
  // )

  const { mutateAsync: updateOrbisProfile } = useMutation<
    OrbisBaseResponse,
    unknown,
    UpdateOrbisProfileParam
  >((param) => orbisHelper.updateOrbisProfile(param), {
    onMutate: async (variables) => {
      showLoading()
      // ootimistic mutation
      await queryClient.cancelQueries(['orbisProfile', did])
      const optimistic = { ...variables.content }
      queryClient.setQueryData(['orbisProfile', did], () => optimistic)
      return { optimistic }
    },
    onSuccess(data, v, _) {
      if (data.status === 200) {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_SUCCEED)
      } else {
        closeLoading()
        showToast(BUSINESS_PROFILE_SET_FAILED)
        console.error(data.result)
      }
      queryClient.setQueryData(['orbisProfile', did], () => v.content)
    },
    onError(error) {
      console.error('error', error)
      queryClient.invalidateQueries(['orbisProfile', did])
      closeLoading()
      showToast(BUSINESS_PROFILE_SET_FAILED)
    },
  })

  // const fetchSocialProfile = async (did?: string): Promise<DisplayProfile | null> => {
  //   if (!did) return null
  //   const address = getAddressFromPkhForWagmi(did)
  //   const res = await Promise.all([
  //     fetchENS(address),
  //     getLensProfile(address),
  //     getCCProfile(address),
  //   ])
  //   // == ens ==
  //   const ens = res[0]
  //   const ensProfile = formatENS(ens)
  //   // == lens ==
  //   const lens = res[1]
  //   const lensProfile = formatLens(lens)
  //   // == cc ==
  //   const cc = res[2]
  //   const ccProfile = formatCc(cc)

  //   console.log({ res })

  //   return {
  //     avatarSrc: lensProfile?.avatar || ccProfile?.avatar || ensProfile.avatar || undefined,
  //     displayName:
  //       lensProfile?.name ||
  //       ccProfile?.handle ||
  //       ensProfile.name ||
  //       (!!did ? formatDID(did, 12) : ''),
  //     bio: lensProfile?.bio || ccProfile?.metadataInfo?.bio || '',
  //   }
  // }

  // const formatLens = (
  //   lens: QueryResult<
  //     any,
  //     {
  //       ethereumAddress: `0x${string}` | undefined
  //     }
  //   >,
  // ) => {
  //   const profile = lens?.data?.defaultProfile
  //   if (!profile) return null
  //   const avatarUrl = profile?.picture?.original?.url as string | undefined
  //   const avatar =
  //     avatarUrl && avatarUrl?.startsWith('ipfs://')
  //       ? avatarUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/')
  //       : null
  //   return {
  //     name: profile?.handle || '',
  //     bio: profile?.bio || '',
  //     avatar: avatar || null,
  //   }
  // }
  // const formatCc = (
  //   cc: QueryResult<
  //     any,
  //     {
  //       address: `0x${string}` | undefined
  //     }
  //   >,
  // ) => {
  //   const edges = cc?.data.address?.wallet?.profiles?.edges
  //   if (!edges) return null
  //   if (edges?.length == 0) return null
  //   return edges[0]?.node
  // }

  // const formatENS = (
  //   ens: {
  //     isMigrated: boolean | null
  //     createdAt: string | null
  //     address?: string | undefined
  //     name?: string | null | undefined
  //     decryptedName?: string | null | undefined
  //     match?: boolean | undefined
  //     message?: string | undefined
  //     records?:
  //       | {
  //           contentHash?: string | any | null | undefined
  //           texts?:
  //             | {
  //                 key: string | number
  //                 type: 'text' | 'addr' | 'contentHash'
  //                 coin?: string | undefined
  //                 value: string
  //               }[]
  //             | undefined
  //           coinTypes?:
  //             | {
  //                 key: string | number
  //                 type: 'text' | 'addr' | 'contentHash'
  //                 coin?: string | undefined
  //                 value: string
  //               }[]
  //             | undefined
  //         }
  //       | undefined
  //     resolverAddress?: string | undefined
  //     isInvalidResolverAddress?: boolean | undefined
  //     reverseResolverAddress?: string | undefined
  //   } | null,
  // ) => {
  //   return {
  //     name: ens?.decryptedName || '',
  //     bio: ens?.records?.texts?.find((t) => t.key === 'description')?.value || '',
  //     avatar: ens?.records?.texts?.find((t) => t.key === 'avatar')?.value || null,
  //   }
  // }

  const pickCcProfile = () => {
    if (!ccProfile) return
    setDisplayProfile({
      avatarSrc: ccProfile?.avatar || undefined,
      displayName: ccProfile?.handle || (!!did ? formatDID(did, 12) : ''),
      bio: ccProfile?.metadataInfo?.bio || '',
    })
  }

  const pickLensProfile = () => {
    if (!lensProfile) return
    setDisplayProfile({
      avatarSrc: lensProfile?.avatar || undefined,
      displayName: lensProfile?.name || (!!did ? formatDID(did, 12) : ''),
      bio: lensProfile?.bio || '',
    })
  }

  const pickEnsProfile = () => {
    if (!lensProfile) return
    setDisplayProfile({
      avatarSrc: ensAvatar || undefined,
      displayName: ensName || (!!did ? formatDID(did, 12) : ''),
      bio: displayProfile?.bio || '',
    })
  }

  const pickDefaultProfile = () => {
    setDisplayProfile({
      avatarSrc:
        orbisProfile?.pfp || lensProfile?.avatar || ensAvatar || ccProfile?.avatar || undefined,
      displayName:
        orbisProfile?.username ||
        lensProfile?.name ||
        ensName ||
        ccProfile?.handle ||
        (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description || lensProfile?.bio || ccProfile?.metadataInfo?.bio || '',
    })
  }

  const profile = useMemo<DisplayProfile>(() => {
    if (displayProfile) return displayProfile
    return {
      avatarSrc:
        orbisProfile?.pfp || lensProfile?.avatar || ensAvatar || ccProfile?.avatar || undefined,
      displayName:
        orbisProfile?.username ||
        lensProfile?.name ||
        ensName ||
        ccProfile?.handle ||
        (!!did ? formatDID(did, 12) : ''),
      bio: orbisProfile?.description || lensProfile?.bio || ccProfile?.metadataInfo?.bio || '',
    }
  }, [orbisProfile, ensAvatar, ensName, ccProfile, lensProfile, displayProfile])

  const haslens = useMemo<boolean>(() => {
    return !lensLoading || !!lensProfile?.name
  }, [lensProfile, lensLoading])

  const hasCc = useMemo<boolean>(() => {
    return !ccLoading && !!ccProfile?.handle
  }, [ccProfile, ccLoading])

  const hasEns = useMemo<boolean>(() => {
    return !ensLoading && !!ensName
  }, [ensName, ensLoading])

  return {
    profile,
    isFetchingSocialAccount,
    updateOrbisProfile,
    orbisProfile,
    pickCcProfile,
    pickLensProfile,
    pickEnsProfile,
    pickDefaultProfile,
    haslens,
    hasCc,
    hasEns,
  }
}
