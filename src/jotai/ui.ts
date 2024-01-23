import { atom, useAtom } from 'jotai'
import { BaseToastProps } from '@/components/ui-v1/Toasts/BaseToast'

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

export const socialProfileEditModal = atom<boolean>(false)

export const useStateSocialProfileEditModal = () => useAtom(socialProfileEditModal)

export const showHeaderMenu = atom<boolean>(false)

export const useStateShowHeaderMenu = () => useAtom(showHeaderMenu)

export const showQRModal = atom<boolean>(false)

export const useStateshowQRModal = () => useAtom(showQRModal)

export const showDetailModal = atom<boolean>(false)

export const useStateShowDetailModal = () => useAtom(showDetailModal)

export const showTaskDetailModal = atom<boolean>(false)

export const useStateShowTaskDetailModal = () => useAtom(showTaskDetailModal)

export const showTaskFormModal = atom<boolean>(false)

export const useStateShowTaskFormModal = () => useAtom(showTaskFormModal)

export const showConnectModal = atom<boolean>(false)

export const useStateShowConnectModal = () => useAtom(showConnectModal)

export const focusEditable = atom<boolean>(false)

export const useStateFocusEditable = () => useAtom(focusEditable)
