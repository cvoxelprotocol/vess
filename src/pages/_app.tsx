import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { configureChains, mainnet, WagmiConfig, createConfig, useAccount, useConnect, useDisconnect } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { GATracking } from '@/components/atom/Common/GATracking'
import { VESSToast } from '@/components/atom/Toasts/VESSToast'
import { BasicLayout } from '@/components/layouts/BasicLayout'
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

const global = css`
  html {
    font-family: ${notoSans.style.fontFamily};
  }
`
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || '' }), publicProvider()],
)

// Instantiating Web3Auth
const web3AuthInstance = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: 'https://mainnet.infura.io/v3/'+ process.env.NEXT_PUBLIC_INFURA_KEY,
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0]?.blockExplorers.default?.url,
  },
  uiConfig: {
    appName: 'Vess Resume',
    theme: 'dark',
    defaultLanguage: 'en',
    appLogo: 'public/logo_bard.png', // Your App Logo Here
    modalZIndex: '2147483647',
  },
  web3AuthNetwork: 'cyan',
  enableLogging: true,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new Web3AuthConnector({
      chains,
      options: {
        web3AuthInstance,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {

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
            <WagmiConfig config={wagmiConfig}>
              <ComposeWrapper>
                <ThemeProvider theme={theme}>
                  <GATracking trackingId={process.env.NEXT_PUBLIC_GA_ID} />
                  <BasicLayout>
                    <Component {...props} />
                  </BasicLayout>
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
