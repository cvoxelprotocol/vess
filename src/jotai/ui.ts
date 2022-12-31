import { atom, useAtom } from 'jotai'

export const themeMode = atom<'light' | 'dark'>('light')

export const useStateThemeMode = () => useAtom(themeMode)

export const typeMode = atom<'en' | 'jp'>('en')

export const useStateTypeMode = () => useAtom(typeMode)
