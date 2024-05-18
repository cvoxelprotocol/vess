import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { StickerType } from '@/@types/avatar'
import { Post } from '@/@types/user'
export const themeMode = atomWithStorage<'light' | 'dark'>('vessThemeMode', 'light')

export const useStateThemeMode = () => useAtom(themeMode)

export const typeMode = atom<'en' | 'jp'>('en')

export const useStateTypeMode = () => useAtom(typeMode)

export const vessLoadingModal = atom<boolean>(false)

export const useStateVESSLoadingModal = () => useAtom(vessLoadingModal)

export const vcVerifiedStatus = atom<'verified' | 'failed' | 'verifying' | 'idle'>('idle')

export const useStateVcVerifiedStatus = () => useAtom(vcVerifiedStatus)

export const rPath = atomWithStorage<string | null>('vessRPath', null)

export const useStateRPath = () => useAtom(rPath)

// Stickers
export const stickers = atom<StickerType[]>([])
export const useStickersAtom = () => useAtom(stickers)
export const selectedID = atom<string | undefined>(undefined)
export const useSelectedIDAtom = () => useAtom(selectedID)
export const isTransformer = atom<boolean>(true)
export const useIstransformerAtom = () => useAtom(isTransformer)
export const avatarSize = atom<number>(100)
export const useAvatarSizeAtom = () => useAtom(avatarSize)

export const posts = atom<Post[]>([])
export const usePostsAtom = () => useAtom(posts)
