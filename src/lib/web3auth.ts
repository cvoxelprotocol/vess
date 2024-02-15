import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  type CONNECTED_EVENT_DATA,
  type IProvider,
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
  public provider: IProvider | null
  public isInitialized: boolean = false

  private constructor() {
    this.web3auth = new Web3AuthNoModal({
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
      chainConfig: this.chainConfig,
      web3AuthNetwork: isProd() ? 'sapphire_mainnet' : 'sapphire_devnet',
    })
    this.provider = null
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

  public unsubscribeAll() {
    this.subscribers = []
  }

  public notifySubscribers(status: string, data?: any) {
    this.subscribers.forEach((subscriber) => subscriber(status, data))
  }

  async initWeb3Auth() {
    try {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig: this.chainConfig },
      }) // TODO: set verifier to env
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
          uxMode: 'redirect',
          whiteLabel: {
            appName: 'VESS',
          },
          replaceUrlOnRedirect: true,
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
      this.subscribeAuthEvents()
      await this.web3auth.init()
      this.isInitialized = true
    } catch (error) {
      console.error('Web3Auth initialization error:', error)
    }
  }

  private subscribeAuthEvents() {
    this.web3auth.on(ADAPTER_STATUS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
      console.log('connected', data)
      this.provider = this.web3auth.provider
      this.notifySubscribers(ADAPTER_STATUS.CONNECTED, data)
    })
    this.web3auth.on(ADAPTER_STATUS.CONNECTING, () => {
      console.log('connecting')
      this.notifySubscribers(ADAPTER_STATUS.CONNECTING)
    })
    this.web3auth.on(ADAPTER_STATUS.DISCONNECTED, () => {
      console.log('disconnected')
      this.notifySubscribers(ADAPTER_STATUS.DISCONNECTED)
    })
    this.web3auth.on(ADAPTER_STATUS.ERRORED, (error) => {
      console.log({ error })
      this.notifySubscribers(ADAPTER_STATUS.ERRORED, error)
    })
  }

  async loginWithGoogle() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (this.web3auth.status === ADAPTER_STATUS.CONNECTED) return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'google',
    })
  }

  async loginWithDiscord() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (this.web3auth.status === ADAPTER_STATUS.CONNECTED) return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'discord',
    })
  }

  async loginWithEmail(email: string) {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (this.web3auth.status === ADAPTER_STATUS.CONNECTED) return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'email_passwordless',
      extraLoginOptions: {
        login_hint: email,
      },
    })
  }

  async loginWithEmailAndPw() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (this.web3auth.status === ADAPTER_STATUS.CONNECTED) return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'jwt',
      extraLoginOptions: {
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
        verifierIdField: 'sub',
      },
    })
  }
}
