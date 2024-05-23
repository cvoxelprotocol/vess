import { walletConnect, injected } from '@wagmi/connectors'
import { createConfig, http } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { createClient } from 'viem'

const WALLETCONNECT_DEEPLINK_CHOICE = 'WALLETCONNECT_DEEPLINK_CHOICE'
const WALLETCONNECT_SESSION = 'wc@2:client:0.3//session'
const WCM_RECENT_WALLET_DATA = 'WCM_RECENT_WALLET_DATA'

const metamaskConnector = injected({ target: 'metaMask' })
const walletConnectConnector = walletConnect({
  projectId: process.env.NEXT_PUBLIC_WC_KEY || '',
  showQrModal: true,
  metadata: {
    name: 'VESS',
    description: 'VESS Wallet',
    url: 'https://app.vess.id/',
    icons: ['https://app.vess.id/VESS_app_icon.png'],
  },
})

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [walletConnectConnector, metamaskConnector],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})

export function clearWeb3ConnectorCache() {
  window.localStorage.removeItem(WALLETCONNECT_DEEPLINK_CHOICE)
  window.localStorage.removeItem(WALLETCONNECT_SESSION)
  window.localStorage.removeItem(WCM_RECENT_WALLET_DATA)
}
