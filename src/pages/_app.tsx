import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { Provider as JotaiProvider } from 'jotai'
import { KaiProvider } from 'kai-kit'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { configureChains, mainnet, WagmiConfig, createConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { GATracking } from '@/components/ui-v1/Common/GATracking'
import { VESSToast } from '@/components/ui-v1/Toasts/VESSToast'
import { ComposeWrapper } from '@/context/compose'
import { theme } from '@/lib/theme'
import 'modern-css-reset/dist/reset.min.css'
import '@/styles/globals.css'
import '@/tokens/build/css/kai-tokens.css'
import { kaiTokens } from '@/styles/kaiTokens'

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
`

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || '' }), publicProvider()],
)
const metamaskConnector = new MetaMaskConnector({ chains })
const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_WC_KEY || '',
    showQrModal: true,
  },
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [walletConnectConnector, metamaskConnector],
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
                  <KaiProvider style={kaiTokens}>
                    <GATracking trackingId={process.env.NEXT_PUBLIC_GA_ID} />
                    <BasicLayout>
                      <Component {...props} />
                    </BasicLayout>
                    <VESSToast />
                  </KaiProvider>
                </ThemeProvider>
              </ComposeWrapper>
            </WagmiConfig>
          </Hydrate>
        </QueryClientProvider>
      </JotaiProvider>
    </>
  )
}
