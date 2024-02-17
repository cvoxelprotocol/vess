import { walletConnect, injected } from '@wagmi/connectors'
import { createConfig, http } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { createClient } from 'viem'

const metamaskConnector = injected({ target: 'metaMask' })
const walletConnectConnector = walletConnect({
  projectId: process.env.NEXT_PUBLIC_WC_KEY || '',
  showQrModal: true,
})

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [walletConnectConnector, metamaskConnector],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})
