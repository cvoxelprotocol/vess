import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { BaseToastProps } from '@/components/ui-v1/Toasts/BaseToast'

export const themeMode = atomWithStorage<'light' | 'dark'>('vessThemeMode', 'light')

export const useStateThemeMode = () => useAtom(themeMode)

export const typeMode = atom<'en' | 'jp'>('en')

export const useStateTypeMode = () => useAtom(typeMode)

export const openToast = atom<boolean>(false)

export const useStateOpenToast = () => useAtom(openToast)

export const vessLoadingModal = atom<boolean>(false)

export const useStateVESSLoadingModal = () => useAtom(vessLoadingModal)

export const vessToastProps = atom<BaseToastProps | null>(null)

export const useStateVessToastProps = () => useAtom(vessToastProps)

export const focusEditable = atom<boolean>(false)

export const useStateFocusEditable = () => useAtom(focusEditable)

export const vcVerifiedStatus = atom<'verified' | 'failed' | 'verifying' | 'idle'>('idle')

export const useStateVcVerifiedStatus = () => useAtom(vcVerifiedStatus)

export const rPath = atomWithStorage<string | null>('vessRPath', null)

export const useStateRPath = () => useAtom(rPath)
