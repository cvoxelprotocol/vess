import { getAddress } from '@ethersproject/address'
import { useQueryClient } from '@tanstack/react-query'
import {
  type CUSTOM_LOGIN_PROVIDER_TYPE,
  LOGIN_PROVIDER,
  type LOGIN_PROVIDER_TYPE,
} from '@toruslabs/openlogin-utils'
import { type IProvider } from '@web3auth/base'
import { useMemo } from 'react'
import { getAddressFromPkh } from 'vess-kit-web'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { Connector, useConnect, useDisconnect } from 'wagmi'
import { useVESSLoading } from './useVESSLoading'
import { useVESSUser } from './userVESSUser'
import { isProd } from '@/constants/common'
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
  const { web3AuthService } = useWeb3AuthContext()
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
      const env = isProd() ? 'mainnet' : 'testnet-clay'
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
          'wallet',
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

  const loginWithGoogle = async (): Promise<void> => {
    try {
      if (!web3AuthService) throw new Error('web3Auth.instance is undefined')
      if (!web3AuthService.isInitialized) {
        await web3AuthService.initWeb3Auth()
      }
      await web3AuthService.loginWithGoogle()
    } catch (error) {
      console.error(error)
      disConnectDID()
    }
  }

  const loginWithDiscord = async (): Promise<void> => {
    try {
      if (!web3AuthService) throw new Error('web3Auth.instance is undefined')
      if (!web3AuthService.isInitialized) {
        await web3AuthService.initWeb3Auth()
      }
      await web3AuthService.loginWithDiscord()
    } catch (error) {
      console.error(error)
      disConnectDID()
    }
  }

  const loginWithEmail = async (email: string): Promise<void> => {
    try {
      if (!web3AuthService) throw new Error('web3Auth.instance is undefined')
      if (!web3AuthService.isInitialized) {
        await web3AuthService.initWeb3Auth()
      }
      await web3AuthService.loginWithEmail(email)
    } catch (error) {
      console.error(error)
      disConnectDID()
    }
  }

  const loginWithEmailAndPw = async (): Promise<void> => {
    try {
      if (!web3AuthService) throw new Error('web3Auth.instance is undefined')
      if (!web3AuthService.isInitialized) {
        await web3AuthService.initWeb3Auth()
      }
      await web3AuthService.loginWithEmailAndPw()
    } catch (error) {
      console.error(error)
      disConnectDID()
    }
  }

  const connectDIDWithWeb3Auth = async (web3authProvider: IProvider | null): Promise<boolean> => {
    try {
      if (!web3authProvider) throw new Error('web3authProvider is null')
      console.log({ web3authProvider })
      showLoading()
      const client = createWalletClient({
        chain: mainnet,
        transport: custom(web3authProvider),
      })
      const addresses = await client.getAddresses()
      if (!addresses || addresses.length === 0) throw new Error('addresses is undefined')

      const env = isProd() ? 'mainnet' : 'testnet-clay'
      const { session } = await vess.connect(addresses[0], web3authProvider, env)
      const user = await web3AuthService.web3auth.getUserInfo()
      console.log({ user })

      let isLoginSucceeded = false
      switch (user.typeOfLogin) {
        case LOGIN_PROVIDER.GOOGLE:
          isLoginSucceeded = await addUserWithGoogle({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          break
        case LOGIN_PROVIDER.DISCORD:
          isLoginSucceeded = await addUserWithDiscord({
            did: session.did.parent,
            email: user.email,
            idToken: user.idToken || '',
            accessToken: user.oAuthAccessToken,
          })
          break
        case LOGIN_PROVIDER.EMAIL_PASSWORDLESS:
          isLoginSucceeded = await addUserWithEmail({
            did: session.did.parent,
            email: user.email,
          })
          break
        case LOGIN_PROVIDER.JWT:
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
        setLoginState(session.did.parent, addresses[0], user.typeOfLogin)
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
    const env = isProd() ? 'mainnet' : 'testnet-clay'
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
    console.log('disconnectDID web3AuthService.web3auth: ', web3AuthService.web3auth)
    if (web3AuthService.web3auth && web3AuthService.web3auth.connected) {
      await web3AuthService.web3auth.logout()
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

  const setLoginState = (
    did: string,
    address: string,
    loginType?: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE,
  ): void => {
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
    loginWithEmailAndPw,
    connectDIDWithWeb3Auth,
  }
}
