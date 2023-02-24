import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans_JP, Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { VESSToast } from '@/components/atom/Toasts/VESSToast'
import { Meta } from '@/components/layouts/Meta'
import LoadingModal from '@/components/organism/Modal/LoadingModal'
import { ComposeWrapper } from '@/context/compose'
import { theme } from '@/lib/theme'
import 'modern-css-reset/dist/reset.min.css'
import '@/styles/globals.css'

const notoSans = Noto_Sans({
  style: 'normal',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})
const notoSansJP = Noto_Sans_JP({
  style: 'normal',
  weight: ['400', '500', '700'],
  subsets: ['japanese'],
  display: 'swap',
})

const global = css`
  html {
    font-family: ${notoSans.style.fontFamily}, ${notoSansJP.style.fontFamily};
  }
`
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState }> & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || '' }), publicProvider()],
  )
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
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
  const [isLoading, setLoading] = useState(false)
  const getLayout = Component.getLayout ?? ((page) => page)
  useEffect(() => {
    const start = () => {
      setLoading(true)
    }
    const end = () => {
      setLoading(false)
    }
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)
    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', end)
      Router.events.off('routeChangeError', end)
    }
  }, [])
  return (
    <>
      <Global styles={global} />
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <WagmiConfig client={client}>
              <ComposeWrapper>
                <ThemeProvider theme={theme}>
                  <Meta />
                  {getLayout(<Component {...props} />)}
                  {isLoading && <LoadingModal />}
                  <VESSToast />
                </ThemeProvider>
              </ComposeWrapper>
            </WagmiConfig>
          </Hydrate>
        </QueryClientProvider>
      </JotaiProvider>
    </>
  )
}
