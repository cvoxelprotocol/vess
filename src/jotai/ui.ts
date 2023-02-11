import { atom, useAtom } from 'jotai'
import { BaseToastProps } from '@/components/atom/Toasts/BaseToast'
import { NavigationItemType, NAVIGATION_ITEM } from '@/constants/ui'

export const themeMode = atom<'light' | 'dark'>('light')

export const useStateThemeMode = () => useAtom(themeMode)

export const typeMode = atom<'en' | 'jp'>('en')

export const useStateTypeMode = () => useAtom(typeMode)

export const openBaseDialog = atom<boolean>(false)

export const useStateOpenBaseDialog = () => useAtom(openBaseDialog)

export const openToast = atom<boolean>(false)

export const useStateOpenToast = () => useAtom(openToast)

export const vessModal = atom<boolean>(false)

export const useStateVESSModal = () => useAtom(vessModal)

export const vessWidgetModal = atom<boolean>(false)

export const useStateVESSWidgetModal = () => useAtom(vessWidgetModal)

export const vessSocialLinkWidgetModal = atom<boolean>(false)

export const useStateVESSSocialLinkWidgetModal = () => useAtom(vessSocialLinkWidgetModal)

export const vessHighlightedMembershipModal = atom<boolean>(false)

export const useStateVESSHighlightedMembershipModal = () => useAtom(vessHighlightedMembershipModal)

export const vessLoadingModal = atom<boolean>(false)

export const useStateVESSLoadingModal = () => useAtom(vessLoadingModal)

export const vessToastProps = atom<BaseToastProps | null>(null)

export const useStateVessToastProps = () => useAtom(vessToastProps)

export const selectedNavigationItem = atom<NavigationItemType>(NAVIGATION_ITEM.HOME)

export const useStateSelectedNavigationItem = () => useAtom(selectedNavigationItem)

export const socialProfileEditModal = atom<boolean>(false)

export const useStateSocialProfileEditModal = () => useAtom(socialProfileEditModal)

export const showHeaderMenu = atom<boolean>(false)

export const useStateShowHeaderMenu = () => useAtom(showHeaderMenu)
