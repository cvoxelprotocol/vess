import { css, Global, ThemeProvider } from '@emotion/react'
import { Noto_Sans } from '@next/font/google'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { configureChains, mainnet, WagmiConfig, createConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { BasicLayout } from '@/components/layouts/BasicLayout'
import { GATracking } from '@/components/ui-v1/Common/GATracking'
import { VESSToast } from '@/components/ui-v1/Toasts/VESSToast'
import { ComposeWrapper } from '@/context/compose'

import { KaiProvider } from '@/kai/kai-provider/KaiProvider'
import { theme } from '@/lib/theme'
import 'modern-css-reset/dist/reset.min.css'
import '@/styles/globals.css'
import '@/tokens/build/css/kai-tokens.css'

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
    rpcTarget: 'https://mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_KEY,
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0]?.blockExplorers.default?.url,
  },
  uiConfig: {
    appName: 'VESS',
    theme: 'dark',
    defaultLanguage: 'en',
    appLogo: 'public/logo_bard.png', // Your App Logo Here
    // modalZIndex: '2147483647',
  },
  web3AuthNetwork: 'cyan',
  enableLogging: false,
})
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
    uxMode: 'popup',
    loginConfig: {
      google: {
        verifier: 'vess-google-verifier',
        typeOfLogin: 'google',
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_GOOGLE_CLIENT_ID || '',
      },
    },
  },
})
web3AuthInstance.configureAdapter(openloginAdapter)
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
  connectors: [
    new Web3AuthConnector({
      chains,
      options: {
        web3AuthInstance,
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: 'openlogin',
            loginMethods: {
              facebook: {
                name: 'facebook',
                showOnModal: false,
              },
              reddit: {
                name: 'reddit',
                showOnModal: false,
              },
              discord: {
                name: 'discord',
                showOnModal: false,
              },
              twitch: {
                name: 'twitch',
                showOnModal: false,
              },
              apple: {
                name: 'apple',
                showOnModal: false,
              },
              github: {
                name: 'github',
                showOnModal: false,
              },
              linkedin: {
                name: 'linkedin',
                showOnModal: false,
              },
              twitter: {
                name: 'twitter',
                showOnModal: false,
              },
              weibo: {
                name: 'weibo',
                showOnModal: false,
              },
              line: {
                name: 'line',
                showOnModal: false,
              },
              kakao: {
                name: 'kakao',
                showOnModal: false,
              },
              wechat: {
                name: 'wechat',
                showOnModal: false,
              },
              sms_passwordless: {
                name: 'sms_passwordless',
                showOnModal: false,
              },
            },
          },
        },
      },
    }),
    walletConnectConnector,
    metamaskConnector,
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
                  <KaiProvider>
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
