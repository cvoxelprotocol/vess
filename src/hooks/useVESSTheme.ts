import { useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { Font } from '@/@types/theme'
import { useThemeMode } from '@/hooks/useThemeMode'

export const useVESSTheme = () => {
  const theme = useTheme()
  const { themeMode, setDarkMode, setThemeMode, initTheme, typoMode } = useThemeMode()

  const currentTheme = useMemo(() => {
    return theme.schemes[themeMode]
  }, [themeMode, theme])

  const currentTypo = useMemo(() => {
    return theme.typography['en']
  }, [typoMode, theme])

  const getBasicFont = (font: Font) => {
    return `font-weight:${font.fontWeight}; \n
    font-size: ${font.fontSize}; \n
    line-height: ${font.lineHeight};`
  }
  const currentEffects = theme.effects

  return {
    setDarkMode,
    initTheme,
    currentTheme,
    currentTypo,
    currentEffects,
    themeMode,
    getBasicFont,
  }
}
