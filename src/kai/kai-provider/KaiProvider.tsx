import { ThemeProvider } from 'next-themes'
import React, { FC, use, useEffect } from 'react'
import { useKai } from '../hooks/useKai'

export type KaiProviderProps = {
  children?: React.ReactNode
}

export const KaiProvider: FC<KaiProviderProps> = ({ children }) => {
  return (
    // <>{children}</>
    <ThemeProvider attribute='class' defaultTheme='light'>
      {children}
    </ThemeProvider>
  )
}
