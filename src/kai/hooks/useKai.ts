import { useTheme } from 'next-themes'
import React, { useEffect, useMemo } from 'react'
import KaiTokens from '@/tokens/build/json/kai-tokens.json'

export type KaiThemeType = 'light' | 'dark'
export type KaiTokensType = typeof KaiTokens
export type KaiTokensColorType = typeof KaiTokens.color
export type KaiTokensColorRefType = typeof KaiTokens.color.ref
export type KaiTokensColorSysType = typeof KaiTokens.color.sys
export type KaiTokensColorSysKeys = keyof KaiTokensColorSysType
export type KaiTokensSize = typeof KaiTokens.size
export type KaiTokensTypo = typeof KaiTokens.typo

export type ThemedKaiTokens = Omit<KaiTokensType, 'color'> & {
  color: {
    ref: KaiTokensColorRefType
    sys: {
      [key in KaiTokensColorSysKeys]: string
    }
  }
}

type TempSys = {
  sys: {
    [key: string]: string
  }
}

export const useKai = () => {
  const { theme, setTheme } = useTheme()

  /* Switch token value depends on theme mode (light or dark) */
  const kai = useMemo(() => {
    const { color, ...keys } = KaiTokens
    let themedKaiToken: ThemedKaiTokens
    let tempSys: TempSys = { sys: {} }

    for (const key in KaiTokens.color.sys) {
      tempSys.sys[key as KaiTokensColorSysKeys] =
        color.sys[key as KaiTokensColorSysKeys][theme as KaiThemeType]
    }

    themedKaiToken = {
      ...keys,
      color: {
        ...color,
        sys: tempSys.sys as ThemedKaiTokens['color']['sys'],
      },
    }

    return themedKaiToken
  }, [theme])

  const initKai = () => {
    setTheme('light')
  }

  const setDarkMode = () => {
    setTheme('dark')
  }

  const setLightMode = () => {
    setTheme('light')
  }

  const toggleMode = () => {
    if (theme === 'light') {
      setDarkMode()
    } else {
      setLightMode()
    }
  }

  return {
    initKai,
    setDarkMode,
    setLightMode,
    toggleMode,
    currentMode: theme,
    kai,
    kaiColor: kai.color.sys,
  }
}
