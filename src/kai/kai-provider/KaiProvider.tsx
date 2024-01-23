import { ThemeProvider } from 'next-themes'
import React, { FC } from 'react'
import { ModalProvider } from '../modal/ModalContext'

export type KaiProviderProps = {
  children?: React.ReactNode
}

export const KaiProvider: FC<KaiProviderProps> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      <ModalProvider>{children}</ModalProvider>
    </ThemeProvider>
  )
}
