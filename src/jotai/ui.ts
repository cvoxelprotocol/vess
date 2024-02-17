import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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
