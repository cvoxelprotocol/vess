import { useCallback } from 'react'
import { useIsClient } from './useIsClient'
import { useStateThemeMode, useStateTypeMode } from '@/jotai/ui'

export const useThemeMode = () => {
  const { isClient } = useIsClient()
  const [mode, setMode] = useStateThemeMode()
  const [typo, setTypo] = useStateTypeMode()

  const setLightMode = useCallback(() => {
    localStorage.removeItem('theme')
    localStorage.theme = 'light'
    setMode('light')
  }, [])

  const setDarkMode = useCallback(() => {
    localStorage.removeItem('theme')
    localStorage.theme = 'dark'
    setMode('dark')
  }, [])

  const setThemeMode = useCallback(() => {
    if (!isClient) {
      setMode('dark')
      return
    }

    if (
      localStorage.theme === 'light' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setDarkMode()
    } else {
      document.documentElement.classList.remove('dark')
      setLightMode()
    }
  }, [isClient])

  const initTheme = useCallback(() => {
    if (!localStorage) return
    if (localStorage.theme === 'dark' || !('theme' in localStorage)) {
      setDarkMode()
    } else {
      setLightMode()
    }
  }, [])

  const setTypoMode = useCallback((newTypo: 'en' | 'jp') => {
    if (!localStorage) return
    localStorage.removeItem('typo')
    localStorage.typo = newTypo
    setTypo(newTypo)
  }, [])

  return {
    setLightMode,
    setDarkMode,
    setThemeMode,
    initTheme,
    themeMode: mode,
    typoMode: typo,
    setTypoMode,
  }
}
