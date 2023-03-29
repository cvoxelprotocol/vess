import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans_JP, Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { walletConnectProvider } from '@web3modal/ethereum'
import { Provider as JotaiProvider } from 'jotai'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import { GATracking } from '@/components/atom/Common/GATracking'
import { VESSToast } from '@/components/atom/Toasts/VESSToast'
import { Meta } from '@/components/layouts/Meta'
import LoadingModal from '@/components/organism/Modal/LoadingModal'
import { ComposeWrapper } from '@/context/compose'
import { theme } from '@/lib/theme'
import 'modern-css-reset/dist/reset.min.css'
import '@/styles/globals.css'

const notoSans = Noto_Sans({
  style: 'normal',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
// const notoSansJP = Noto_Sans_JP({
//   style: 'normal',
//   weight: ['400', '500', '700'],
//   subsets: ['japanese'],
//   display: 'swap',
// })

const global = css`
  html {
    font-family: ${notoSans.style.fontFamily};
  }
`
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState }> & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { chains, provider } = configureChains(
    [mainnet],
    [walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WC_KEY || '' }), publicProvider()],
  )

  const metamaskConnector = new MetaMaskConnector({ chains })
  // const injectedCOnnector = new InjectedConnector({
  //   options: {
  //     name: 'Light Wallet',
  //   },
  // })
  const walletConnectConnector = new WalletConnectConnector({
    chains,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
      chainId: 1,
      qrcodeModalOptions: {
        desktopLinks: [],
      },
    },
  })
  const connectors = [metamaskConnector, walletConnectConnector]
  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
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
                  <GATracking trackingId={process.env.NEXT_PUBLIC_GA_ID} />
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
