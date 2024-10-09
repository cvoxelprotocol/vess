import { connect, disconnect } from '@wagmi/core'
import type { Connector } from '@wagmi/core'
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  type CONNECTED_EVENT_DATA,
  type IProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import {
  type CUSTOM_LOGIN_PROVIDER_TYPE,
  type LOGIN_PROVIDER_TYPE,
  OpenloginAdapter,
  LOGIN_PROVIDER,
} from '@web3auth/openlogin-adapter'
import { createWalletClient, custom, getAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { connectVESSAuth, disconnectVESSAuth } from './vess'
import {
  createUserOnlyWithDid,
  createUserWithDiscord,
  createUserWithEmail,
  createUserWithGoogle,
  vessLogout,
} from './vessApi'
import { clearWeb3ConnectorCache, config } from './wagmi'
import { VSUser } from '@/@types/credential'
import { isProd } from '@/constants/common'
import { getVESSAuth, setVESSAuth } from '@/context/DidAuthContext'
import { getAddressFromPkh } from '@/utils/did'
import { isGoodResponse } from '@/utils/http'
import { getCurrentDomain } from '@/utils/url'

export class DidAuthService {
  private static instance: DidAuthService
  public web3auth: Web3AuthNoModal
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
  public isConnecting: boolean = false

  private constructor() {
    this.web3auth = new Web3AuthNoModal({
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
      chainConfig: this.chainConfig,
      web3AuthNetwork: isProd() ? 'sapphire_mainnet' : 'sapphire_devnet',
    })
    this.provider = null
  }

  //===Wallet(wagmi)===

  async loginWithWallet(connector?: Connector): Promise<boolean> {
    if (!connector) return false
    try {
      this.loadingState()

      const isAuthorized = await connector?.isAuthorized()
      if (!isAuthorized) {
        await connect(config, { connector })
      }
      const provider = await connector?.getProvider()
      const accounts = await connector?.getAccounts()

      // connect vess sdk
      const { session } = await connectVESSAuth(accounts[0], provider)
      console.log({ session })
      //save user info
      const res = await createUserOnlyWithDid({
        did: session.did.parent,
      })
      const isLoginSucceeded = isGoodResponse(res.status)
      console.log({ isLoginSucceeded })
      if (isLoginSucceeded) {
        const resJson = (await res.json()) as VSUser
        const { name, avatar, description, id, vessId } = resJson
        this.setLoginState(
          id,
          session.did.parent,
          getAddress(getAddressFromPkh(session.did.parent)),
          name,
          avatar,
          description,
          vessId,
          'wallet',
        )
      } else {
        this.setLoginState(
          '',
          session.did.parent,
          getAddress(getAddressFromPkh(session.did.parent)),
          null,
          null,
          null,
          null,
          'wallet',
        )
      }
      return isLoginSucceeded
    } catch (error) {
      console.error(error)
      // this.clearState()
      this.disConnectDID()
      await connector.disconnect()
      clearWeb3ConnectorCache()
      return false
    }
  }

  //===Wallet(wagmi)===

  async loginWithGoogle() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (!this.isInitialized) {
      await this.initWeb3Auth()
    }
    if (
      this.web3auth.status === ADAPTER_STATUS.CONNECTED ||
      this.web3auth.status === ADAPTER_STATUS.CONNECTING
    )
      return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'google',
    })
  }

  async loginWithDiscord() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (!this.isInitialized) {
      await this.initWeb3Auth()
    }
    if (
      this.web3auth.status === ADAPTER_STATUS.CONNECTED ||
      this.web3auth.status === ADAPTER_STATUS.CONNECTING
    )
      return

    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'discord',
    })
  }

  async loginWithEmail(email: string) {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (!this.isInitialized) {
      await this.initWeb3Auth()
    }
    if (
      this.web3auth.status === ADAPTER_STATUS.CONNECTED ||
      this.web3auth.status === ADAPTER_STATUS.CONNECTING
    )
      return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'email_passwordless',
      extraLoginOptions: {
        login_hint: email,
      },
    })
  }

  async loginWithEmailAndPw() {
    if (!this.web3auth) throw new Error('web3Auth.instance nor provider is undefined')
    if (!this.isInitialized) {
      await this.initWeb3Auth()
    }
    if (
      this.web3auth.status === ADAPTER_STATUS.CONNECTED ||
      this.web3auth.status === ADAPTER_STATUS.CONNECTING
    )
      return
    await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'jwt',
      extraLoginOptions: {
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
        verifierIdField: 'sub',
      },
    })
  }

  async connectDIDWithWeb3Auth(web3authProvider: IProvider | null) {
    try {
      if (!web3authProvider) throw new Error('web3authProvider is null')
      console.log({ web3authProvider })

      this.loadingState()

      const client = createWalletClient({
        chain: mainnet,
        transport: custom(web3authProvider),
      })
      const addresses = await client.getAddresses()
      if (!addresses || addresses.length === 0) throw new Error('addresses is undefined')
      const { session } = await connectVESSAuth(addresses[0], web3authProvider)
      const user = await this.web3auth.getUserInfo()
      console.log({ user })

      let isLoginSucceeded = false
      let res: Response | null = null
      switch (user.typeOfLogin) {
        case LOGIN_PROVIDER.GOOGLE:
          res = await createUserWithGoogle({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          isLoginSucceeded = isGoodResponse(res.status)
          break
        case LOGIN_PROVIDER.DISCORD:
          res = await createUserWithDiscord({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          isLoginSucceeded = isGoodResponse(res.status)
          break
        case LOGIN_PROVIDER.EMAIL_PASSWORDLESS:
          res = await createUserWithEmail({
            did: session.did.parent,
            email: user.email,
          })
          isLoginSucceeded = isGoodResponse(res.status)
          break
        case LOGIN_PROVIDER.JWT:
          res = await createUserWithEmail({
            did: session.did.parent,
            email: user.email,
          })
          isLoginSucceeded = isGoodResponse(res.status)
          break
        default:
          throw new Error('loginType is invalid')
      }

      if (isLoginSucceeded) {
        if (res) {
          const resJson = (await res.json()) as VSUser
          const { name, avatar, description, id, vessId } = resJson
          this.setLoginState(
            id,
            session.did.parent,
            addresses[0],
            name,
            avatar,
            description,
            vessId,
            user.typeOfLogin,
          )
        } else {
          this.setLoginState(
            '',
            session.did.parent,
            addresses[0],
            null,
            null,
            null,
            null,
            user.typeOfLogin,
          )
        }
      } else {
        this.clearState()
      }
      return isLoginSucceeded
    } catch (error) {
      this.clearState()
      throw error
    }
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
          redirectUrl: `${
            getCurrentDomain() || `${process.env.NEXT_PUBLIC_VESS_URL}`
          }/auth/callback`,
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
      this.isConnecting = false
      this.provider = this.web3auth.provider
      this.connectDIDWithWeb3Auth(this.web3auth.provider)
    })
    this.web3auth.on(ADAPTER_STATUS.CONNECTING, () => {
      this.isConnecting = true
      console.log('connecting')
    })
    this.web3auth.on(ADAPTER_STATUS.DISCONNECTED, () => {
      this.isConnecting = false
      console.log('disconnected')
    })
    this.web3auth.on(ADAPTER_STATUS.ERRORED, (error) => {
      this.isConnecting = false
      console.log({ error })
    })
  }

  //===Web3Auth===

  //===Common===
  public static getInstance(): DidAuthService {
    if (!DidAuthService.instance) {
      DidAuthService.instance = new DidAuthService()
    }
    return DidAuthService.instance
  }

  private setLoginState(
    id: string,
    did: string,
    address: string,
    name: string | null,
    avatar: string | null,
    description: string | null,
    vessId?: string | null,
    loginType?: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE,
  ): void {
    console.log('setVESSAuth called')
    setVESSAuth({
      user: {
        id: id,
        did: did,
        account: address,
        originalAddress: address,
        chainId: 1,
        stateLoginType: loginType,
        name: name,
        avatar: avatar,
        description: description,
        vessId: vessId,
      },
      connectionStatus: 'connected',
    })
  }

  private clearState(): void {
    setVESSAuth({
      user: undefined,
      connectionStatus: 'disconnected',
    })
  }

  private loadingState(): void {
    setVESSAuth({
      user: undefined,
      connectionStatus: 'connecting',
    })
  }

  async disConnectDID(): Promise<void> {
    try {
      disconnectVESSAuth()
      const vessAuth = getVESSAuth()
      if (vessAuth?.user?.stateLoginType === 'wallet') {
        disconnect(config)
      }
      if (this.web3auth && this.web3auth.connected) {
        await this.web3auth.logout()
      }
      //remove session
      await vessLogout()
      this.clearState()
    } catch (error) {
      throw error
    }
  }
  //===Common===
}
