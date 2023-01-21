import { useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { useThemeMode } from '@/hooks/useThemeMode'

export const useVESSTheme = () => {
  const theme = useTheme()
  const { themeMode, setLightMode, setDarkMode, setThemeMode, typoMode } = useThemeMode()

  const currentTheme = useMemo(() => {
    return theme.schemes[themeMode]
  }, [themeMode, theme])

  const currentTypo = useMemo(() => {
    return theme.typography[typoMode]
  }, [typoMode, theme])

  return { setLightMode, setDarkMode, setThemeMode, currentTheme, currentTypo }
}
