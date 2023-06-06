import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans } from '@next/font/google'
// eslint-disable-next-line import/named
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useState } from 'react'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { GATracking } from '@/components/atom/Common/GATracking'
import { VESSToast } from '@/components/atom/Toasts/VESSToast'
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
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState }> & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
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
  const getLayout = Component.getLayout ?? ((page) => page)
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
                  {getLayout(<Component {...props} />)}
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
