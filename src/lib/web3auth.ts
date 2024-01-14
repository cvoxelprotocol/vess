import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { mainnet } from 'wagmi'

let web3AuthInstance: Web3Auth | undefined

// Instantiating Web3Auth
const initializeInstance = (chains: any[]) => {
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
  return web3AuthInstance
}

export const initializeWeb3Auth = (chains: any[]): Web3Auth => {
  const _instance = web3AuthInstance ?? initializeInstance(chains || [mainnet])
  // For SSG and SSR always create a new Client
  if (typeof window === 'undefined') return _instance
  // Create the Apollo Client once in the client
  if (!web3AuthInstance) web3AuthInstance = _instance

  return _instance
}
