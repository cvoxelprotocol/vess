import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { mainnet } from 'wagmi'
import { isProd } from '@/constants/common'

let web3AuthInstance: Web3AuthNoModal | undefined

// Instantiating Web3Auth
const initializeInstance = (chains: any[]) => {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: 'https://mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_KEY,
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0]?.blockExplorers.default?.url,
  }
  const instance = new Web3AuthNoModal({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
    chainConfig: chainConfig,
    web3AuthNetwork: isProd() ? 'sapphire_mainnet' : 'sapphire_devnet',
  })
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })
  // TODO: set verifier to env
  const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
      uxMode: 'popup',
      whiteLabel: {
        appName: 'VESS',
      },
      loginConfig: {
        google: {
          verifier: process.env.NEXT_PUBLIC_WEB3AUTH_GOOGLE_VERIFIER || '',
          typeOfLogin: 'google',
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_GOOGLE_CLIENT_ID || '',
        },
        discord: {
          verifier: process.env.NEXT_PUBLIC_WEB3AUTH_DISCORD_VERIFIER || '',
          typeOfLogin: 'discord',
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_DISCORD_CLIENT_ID || '',
        },
      },
    },
    privateKeyProvider: privateKeyProvider,
  })

  instance.configureAdapter(openloginAdapter)
  return instance
}

export const initializeWeb3Auth = (): Web3AuthNoModal => {
  const _instance = web3AuthInstance ?? initializeInstance([mainnet])
  // For SSG and SSR always create a new Client
  if (typeof window === 'undefined') return _instance
  if (!web3AuthInstance) web3AuthInstance = _instance
  return _instance
}
