import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans_JP, Noto_Sans } from '@next/font/google'
import 'modern-css-reset/dist/reset.min.css'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import { theme } from '@/lib/theme'

const notoSans = Noto_Sans({
  style: 'normal',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})
const notoSansJP = Noto_Sans_JP({
  style: 'normal',
  weight: ['400', '500', '700'],
  subsets: ['japanese'],
})

const global = css`
  html {
    font-family: ${notoSans.style.fontFamily} ${notoSansJP.style.fontFamily};
  }
`

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={global} />
      <JotaiProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </JotaiProvider>
    </>
  )
}
