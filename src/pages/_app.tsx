import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
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

export default function App({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  const { chains, provider } = configureChains(
    [mainnet],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || '' }), publicProvider()],
  )

  const metamaskConnector = new MetaMaskConnector({ chains })
  const walletConnectConnector = new WalletConnectConnector({
    chains,
    options: {
      projectId: process.env.NEXT_PUBLIC_WC_KEY || '',
      chainId: 1,
      infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
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
