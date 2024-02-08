import {
  ADAPTER_STATUS,
  ADAPTER_STATUS_TYPE,
  CHAIN_NAMESPACES,
  CONNECTED_EVENT_DATA,
  IProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { mainnet } from 'wagmi'
import { isProd } from '@/constants/common'

export class Web3AuthService {
  private static instance: Web3AuthService
  public web3auth: Web3AuthNoModal
  private subscribers: ((status: string, data?: any) => void)[] = []
  private chains = [mainnet]
  private chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + this.chains[0].id.toString(16),
    rpcTarget: 'https://mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_KEY,
    displayName: this.chains[0].name,
    tickerName: this.chains[0].nativeCurrency?.name,
    ticker: this.chains[0].nativeCurrency?.symbol,
    blockExplorer: this.chains[0]?.blockExplorers.default?.url,
  }

  private constructor() {
    this.web3auth = new Web3AuthNoModal({
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
      chainConfig: this.chainConfig,
      web3AuthNetwork: isProd() ? 'sapphire_mainnet' : 'sapphire_devnet',
    })
  }

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService()
    }
    return Web3AuthService.instance
  }

  public subscribe(subscriber: (status: string, data?: any) => void) {
    this.subscribers.push(subscriber)
  }

  public notifySubscribers(status: string, data?: any) {
    this.subscribers.forEach((subscriber) => subscriber(status, data))
  }

  async initWeb3Auth() {
    try {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig: this.chainConfig },
      })
      // TODO: set verifier to env
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
          uxMode: 'redirect',
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
            jwt: {
              verifier: process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_VERIFIER || '',
              typeOfLogin: 'jwt',
              clientId: process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_CLIENT_ID || '',
            },
          },
        },
        privateKeyProvider: privateKeyProvider,
      })

      this.web3auth.configureAdapter(openloginAdapter)
      await this.web3auth.init()
      this.subscribeAuthEvents()
    } catch (error) {
      console.error('Web3Auth initialization error:', error)
    }
  }

  private subscribeAuthEvents() {
    this.web3auth.on(ADAPTER_STATUS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
      this.notifySubscribers(ADAPTER_STATUS.CONNECTED, data)
    })
    this.web3auth.on(ADAPTER_STATUS.CONNECTING, () => {
      this.notifySubscribers(ADAPTER_STATUS.CONNECTING)
    })
    this.web3auth.on(ADAPTER_STATUS.DISCONNECTED, () => {
      this.notifySubscribers(ADAPTER_STATUS.DISCONNECTED)
    })
    this.web3auth.on(ADAPTER_STATUS.ERRORED, (error) => {
      this.notifySubscribers(ADAPTER_STATUS.ERRORED, error)
    })
  }

  // Instantiating Web3Auth
  // public static initializeInstance = () => {
  //   const chains = [mainnet]
  //   if (!this.instance) {
  //     const chainConfig = {
  //       chainNamespace: CHAIN_NAMESPACES.EIP155,
  //       chainId: '0x' + chains[0].id.toString(16),
  //       rpcTarget: 'https://mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_KEY,
  //       displayName: chains[0].name,
  //       tickerName: chains[0].nativeCurrency?.name,
  //       ticker: chains[0].nativeCurrency?.symbol,
  //       blockExplorer: chains[0]?.blockExplorers.default?.url,
  //     }
  //     this.instance = new Web3AuthNoModal({
  //       clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  //       chainConfig: chainConfig,
  //       web3AuthNetwork: isProd() ? 'sapphire_mainnet' : 'sapphire_devnet',
  //     })
  //     this.subscribeAuthEvents(this.instance)
  //     const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })
  //     // TODO: set verifier to env
  //     const openloginAdapter = new OpenloginAdapter({
  //       adapterSettings: {
  //         clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  //         uxMode: 'redirect',
  //         whiteLabel: {
  //           appName: 'VESS',
  //         },
  //         loginConfig: {
  //           google: {
  //             verifier: process.env.NEXT_PUBLIC_WEB3AUTH_GOOGLE_VERIFIER || '',
  //             typeOfLogin: 'google',
  //             clientId: process.env.NEXT_PUBLIC_WEB3AUTH_GOOGLE_CLIENT_ID || '',
  //           },
  //           discord: {
  //             verifier: process.env.NEXT_PUBLIC_WEB3AUTH_DISCORD_VERIFIER || '',
  //             typeOfLogin: 'discord',
  //             clientId: process.env.NEXT_PUBLIC_WEB3AUTH_DISCORD_CLIENT_ID || '',
  //           },
  //           jwt: {
  //             verifier: process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_VERIFIER || '',
  //             typeOfLogin: 'jwt',
  //             clientId: process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_CLIENT_ID || '',
  //           },
  //         },
  //       },
  //       privateKeyProvider: privateKeyProvider,
  //     })

  //     this.instance.configureAdapter(openloginAdapter)
  //   }
  //   return this.instance
  // }

  // private static subscribeAuthEvents(web3auth: Web3AuthNoModal) {
  //   web3auth.on(ADAPTER_STATUS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
  //     console.log('connected to wallet', data)
  //     this.provider = web3auth.provider
  //     // this.loginButtonStatus = "Logged in";
  //     // this.connected = true;
  //   })
  //   web3auth.on(ADAPTER_STATUS.CONNECTING, () => {
  //     console.log('connecting')
  //     // this.loginButtonStatus = "Connecting...";
  //   })
  //   web3auth.on(ADAPTER_STATUS.DISCONNECTED, () => {
  //     console.log('disconnected')
  //     // this.loginButtonStatus = "";
  //     // this.connected = false;
  //   })
  //   web3auth.on(ADAPTER_STATUS.ERRORED, (error) => {
  //     console.log('error', error)
  //     console.log('errored', error)
  //     // this.loginButtonStatus = "";
  //   })
  // }

  public static loginWithGoogle = () => {
    if (!this.instance) throw new Error('web3Auth.instance is undefined')
    this.web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'google',
    })
  }
}
