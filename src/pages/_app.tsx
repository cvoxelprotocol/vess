import { css, Global, ThemeProvider } from '@emotion/react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { KaiProvider } from 'kai-kit'
import type { AppProps } from 'next/app'
import { Noto_Sans } from 'next/font/google'
import { useState } from 'react'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { GATracking } from '@/components/ui-v1/Common/GATracking'
import { VESSAuthProvider } from '@/context/DidAuthContext'
import { theme } from '@/lib/theme'
import { kaiTokens } from '@/styles/kaiTokens'
import 'modern-css-reset/dist/reset.min.css'
import '@/styles/globals.css'

const notoSans = Noto_Sans({
  style: 'normal',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const global = css`
  :root {
    --kai-font-family-base: ${notoSans.style.fontFamily};
  }
  html {
    font-family: ${notoSans.style.fontFamily};
    padding: 0 !important;
  }
  body {
    min-height: 100svh;
  }
`

export default function App({
  Component,
  pageProps,
  router,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  // 飲食店デモは独立した店舗サイトとして見せるため、アプリ共通のレイアウトを外す
  const standalone = router.pathname.startsWith('/restaurant')
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )
  const { dehydratedState, ...props } = pageProps
  return (
    <>
      <Global styles={global} />
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <ThemeProvider theme={theme}>
              <KaiProvider style={kaiTokens}>
                <VESSAuthProvider>
                  <GATracking trackingId={process.env.NEXT_PUBLIC_GA_ID} />
                  {standalone ? (
                    <Component {...props} />
                  ) : (
                    <BasicLayout>
                      <Component {...props} />
                    </BasicLayout>
                  )}
                </VESSAuthProvider>
              </KaiProvider>
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </JotaiProvider>
    </>
  )
}
