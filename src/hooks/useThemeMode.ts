import { useCallback } from 'react'
import { useIsClient } from '@/hooks/useIsClient'
import { useStateThemeMode, useStateTypeMode } from '@/jotai/ui'

export const useThemeMode = () => {
  const { isClient } = useIsClient()
  const [mode, setMode] = useStateThemeMode()
  const [typo, setTypo] = useStateTypeMode()

  const setLightMode = useCallback(() => {
    localStorage.removeItem('theme')
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    setMode('light')
  }, [])

  const setDarkMode = useCallback(() => {
    localStorage.removeItem('theme')
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
    setMode('dark')
  }, [])

  const setThemeMode = useCallback(() => {
    if (!isClient) {
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

  const setTypoMode = useCallback((newTypo: 'en' | 'jp') => {
    if (!isClient) {
      return
    }
    localStorage.removeItem('typo')
    localStorage.typo = newTypo
    setTypo(newTypo)
  }, [])

  return { setLightMode, setDarkMode, setThemeMode, themeMode: mode, typoMode: typo, setTypoMode }
}
