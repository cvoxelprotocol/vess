import { getAddress } from '@ethersproject/address'
import { useQueryClient } from '@tanstack/react-query'
import { type IProvider, WALLET_ADAPTERS } from '@web3auth/base'
import { useMemo } from 'react'
import { getAddressFromPkh } from 'vess-kit-web'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { Connector, useConnect, useDisconnect } from 'wagmi'
import { useVESSLoading } from './useVESSLoading'
import { useVESSUser } from './userVESSUser'
import { CERAMIC_NETWORK } from '@/constants/common'
import { useComposeContext } from '@/context/compose'
import { useWeb3AuthContext } from '@/context/web3AuthContext'
import {
  useSetStateAccount,
  useSetStateChainId,
  useSetStateConnectionStatus,
  useSetStateMyDid,
  useSetStateOriginalAddress,
  useStateLoginType,
} from '@/jotai/account'
import { getVESSService } from '@/lib/vess'

export const LOGIN_TYPE = {
  WALLET: 'wallet',
  GOOGLE: 'google',
  DISCORD: 'discord',
  EMAIL: 'email',
} as const
export type LoginTypeProps = typeof LOGIN_TYPE[keyof typeof LOGIN_TYPE]

export const useConnectDID = () => {
  const setMyDid = useSetStateMyDid()
  const setAccount = useSetStateAccount()
  const setOriginalAddress = useSetStateOriginalAddress()
  const setChainId = useSetStateChainId()
  const setConnectionStatus = useSetStateConnectionStatus()
  const [stateLoginType, setStateLoginType] = useStateLoginType()
  const vess = getVESSService()
  const queryClient = useQueryClient()
  const { composeClient } = useComposeContext()
  const { web3Auth } = useWeb3AuthContext()
  const { disconnect } = useDisconnect()
  const { connectAsync } = useConnect()
  const { addUserOnlyWithDid, addUserWithEmail, addUserWithGoogle, addUserWithDiscord } =
    useVESSUser()
  const { showLoading, closeLoading } = useVESSLoading()

  const loginWithWallet = async (connector?: Connector<any, any>): Promise<boolean> => {
    try {
      // connect vess sdk
      const res = await connectAsync({ connector })
      console.log({ res })

      showLoading()
      const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
      const provider = await connector?.getProvider()
      const { session } = await vess.connect(res.account, provider, env)
      console.log({ session })
      //save user info
      const isLoginSucceeded = await addUserOnlyWithDid({
        did: session.did.parent,
      })
      console.log({ isLoginSucceeded })
      if (isLoginSucceeded) {
        // @ts-ignore TODO:fixed
        composeClient.setDID(session.did)
        setLoginState(
          session.did.parent,
          getAddress(getAddressFromPkh(session.did.parent)),
          LOGIN_TYPE.WALLET,
        )
        queryClient.invalidateQueries(['hasAuthorizedSession'])
      } else {
        disConnectDID()
      }
      closeLoading()
      return isLoginSucceeded
    } catch (error) {
      console.error(error)
      closeLoading()
      disConnectDID()
      console.error(error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      if (!web3Auth) throw new Error('web3Auth.instance is undefined')
      await web3Auth.init()
      const web3authProvider = await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'google',
      })
      return await connectDIDWithWeb3Auth(web3authProvider, LOGIN_TYPE.GOOGLE)
    } catch (error) {
      console.error(error)
      disConnectDID()
      return false
    }
  }

  const loginWithDiscord = async (): Promise<boolean> => {
    try {
      if (!web3Auth) throw new Error('web3Auth.instance is undefined')
      await web3Auth.init()
      const web3authProvider = await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'discord',
      })
      return await connectDIDWithWeb3Auth(web3authProvider, LOGIN_TYPE.DISCORD)
    } catch (error) {
      console.error(error)
      disConnectDID()
      return false
    }
  }

  const loginWithEmail = async (email: string): Promise<boolean> => {
    try {
      if (!web3Auth) throw new Error('web3Auth.instance is undefined')
      await web3Auth.init()
      const web3authProvider = await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'email_passwordless',
        extraLoginOptions: {
          login_hint: email,
        },
      })
      return await connectDIDWithWeb3Auth(web3authProvider, LOGIN_TYPE.EMAIL)
    } catch (error) {
      console.error(error)
      disConnectDID()
      return false
    }
  }

  const connectDIDWithWeb3Auth = async (
    web3authProvider: IProvider | null,
    loginType: LoginTypeProps,
  ): Promise<boolean> => {
    try {
      if (!web3authProvider) throw new Error('web3authProvider is null')

      showLoading()
      const client = createWalletClient({
        chain: mainnet,
        transport: custom(web3authProvider),
      })
      const addresses = await client.getAddresses()
      if (!addresses || addresses.length === 0) throw new Error('addresses is undefined')

      const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
      const { session } = await vess.connect(addresses[0], web3authProvider, env)
      const user = await web3Auth.getUserInfo()

      let isLoginSucceeded = false
      switch (loginType) {
        case LOGIN_TYPE.GOOGLE:
          isLoginSucceeded = await addUserWithGoogle({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          break
        case LOGIN_TYPE.DISCORD:
          isLoginSucceeded = await addUserWithDiscord({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          break
        case LOGIN_TYPE.EMAIL:
          isLoginSucceeded = await addUserWithEmail({
            did: session.did.parent,
            email: user.email,
          })
          break
        default:
          throw new Error('loginType is invalid')
      }

      if (isLoginSucceeded) {
        // @ts-ignore TODO:fixed
        composeClient.setDID(session.did)
        setLoginState(session.did.parent, addresses[0], loginType)
        queryClient.invalidateQueries(['hasAuthorizedSession'])
      } else {
        disConnectDID()
      }

      closeLoading()
      return isLoginSucceeded
    } catch (error) {
      closeLoading()
      throw error
    }
  }

  const autoConnect = async () => {
    const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
    const auth = await vess.autoConnect(env)
    if (auth) {
      const { session } = auth
      // @ts-ignore TODO:fixed
      composeClient.setDID(session.did)
      setLoginState(
        session.did.parent,
        getAddress(getAddressFromPkh(session.did.parent)),
        stateLoginType,
      )
      console.log('Connection restored!')
    }
  }

  const disConnectDID = async (): Promise<void> => {
    disconnect()
    vess.disconnect()
    if (web3Auth && web3Auth.connected) {
      await web3Auth.logout()
    }

    clearState()
  }

  // clear all state
  const clearState = (): void => {
    setMyDid(undefined)
    setAccount(undefined)
    setOriginalAddress(undefined)
    setChainId(undefined)
    setConnectionStatus('disconnected')
    setStateLoginType(undefined)
    queryClient.invalidateQueries(['hasAuthorizedSession'])
  }

  const setLoginState = (did: string, address: string, loginType?: LoginTypeProps): void => {
    setMyDid(did)
    setAccount(address)
    setOriginalAddress(address)
    setChainId(1)
    setConnectionStatus('connected')
    setStateLoginType(loginType)
  }

  const isAuthorized = useMemo(() => {
    if (!vess) return false
    return vess.isAuthenticated()
  }, [vess])

  return {
    disConnectDID,
    isAuthorized,
    autoConnect,
    loginWithWallet,
    loginWithGoogle,
    loginWithDiscord,
    loginWithEmail,
  }
}
