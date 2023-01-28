import { useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { Font } from '@/@types/theme'
import { useThemeMode } from '@/hooks/useThemeMode'

export const useVESSTheme = () => {
  const theme = useTheme()
  const { themeMode, setLightMode, setDarkMode, setThemeMode, initTheme, typoMode } = useThemeMode()

  const currentTheme = useMemo(() => {
    return theme.schemes[themeMode]
  }, [themeMode, theme])

  const currentTypo = useMemo(() => {
    return theme.typography[typoMode]
  }, [typoMode, theme])

  const getFont = (font: Font) => {
    return `${font.fontWeight} ${font.fontSize}/${font.lineHeight} ${font.fontFamily}`
  }

  return {
    setLightMode,
    setDarkMode,
    setThemeMode,
    initTheme,
    themeMode,
    getFont,
    currentTheme,
    currentTypo,
  }
}
