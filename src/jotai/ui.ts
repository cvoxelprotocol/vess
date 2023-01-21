import { atom, useAtom } from 'jotai'
import { NavRailItemType } from '@/components/molecule/NavRail/NavRailItem'

export const themeMode = atom<'light' | 'dark'>('light')

export const useStateThemeMode = () => useAtom(themeMode)

export const typeMode = atom<'en' | 'jp'>('en')

export const useStateTypeMode = () => useAtom(typeMode)

export const navRailSelected = atom<NavRailItemType>('myPage')

export const useStateNavRailSelected = () => useAtom(navRailSelected)
