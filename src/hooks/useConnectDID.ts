import { getAddress } from '@ethersproject/address'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getAddressFromPkh } from 'vess-kit-web'
import { Connector, useConnect, useDisconnect } from 'wagmi'
import { useVESSUser } from './userVESSUser'
import { CERAMIC_NETWORK } from '@/constants/common'
import { useComposeContext } from '@/context/compose'

import { useWeb3AuthContext } from '@/context/web3AuthContext'
import {
  useSetStateAccount,
  useSetStateChainId,
  useSetStateConnectionStatus,
  useSetStateLoginType,
  useSetStateMyDid,
  useSetStateOriginalAddress,
} from '@/jotai/account'
import { getVESS } from '@/lib/vess'

export const useConnectDID = () => {
  const setMyDid = useSetStateMyDid()
  const setAccount = useSetStateAccount()
  const setOriginalAddress = useSetStateOriginalAddress()
  const setChainId = useSetStateChainId()
  const setConnectionStatus = useSetStateConnectionStatus()
  const setStateLoginType = useSetStateLoginType()
  const vess = getVESS()
  const queryClient = useQueryClient()
  const { composeClient } = useComposeContext()
  const { web3AuthInstance } = useWeb3AuthContext()
  const { disconnect } = useDisconnect()
  const { connectAsync } = useConnect()
  const { addUserOnlyWithDid, addUserWithEmail, addUserWithGoogle } = useVESSUser()

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

  const connectDID = async (connector?: Connector<any, any>): Promise<boolean> => {
    try {
      // connect vess sdk
      const res = await connectAsync({ connector })
      const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
      const provider = await connector?.getProvider()
      const { session } = await vess.connect(res.account, provider, env)
      console.log({ session })
      // @ts-ignore TODO:fixed
      composeClient.setDID(session.did)
      setMyDid(session.did.parent)
      const address = getAddress(getAddressFromPkh(session.did.parent))
      setAccount(address)
      setOriginalAddress(address)
      setChainId(1)
      setConnectionStatus('connected')
      setStateLoginType('wallet')

      //save user info
      let createdUserInfo

      try {
        if (res.connector?.name !== 'web3auth') {
          createdUserInfo = await addUserOnlyWithDid({
            did: session.did.parent,
          })
        } else {
          const user = await web3AuthInstance?.getUserInfo()
          console.log(JSON.stringify(user, null, 2))

          if (user.typeOfLogin === 'google') {
            createdUserInfo = await addUserWithGoogle({
              did: session.did.parent,
              email: user.email,
              idToken: user.idToken || '',
              accessToken: user.oAuthAccessToken,
            })
          } else if (user.typeOfLogin === 'jwt' && user.email) {
            createdUserInfo = await addUserWithEmail({
              did: session.did.parent,
              email: user.email,
            })
          } else {
            createdUserInfo = await addUserOnlyWithDid({
              did: session.did.parent,
            })
          }
        }
      } catch (error) {}
      console.log({ createdUserInfo })

      queryClient.invalidateQueries(['hasAuthorizedSession'])
      return true
    } catch (error) {
      console.error(error)
      disConnectDID()
      if (error instanceof Error) {
        console.error(error)
      }
      return false
    }
  }

  const autoConnect = async () => {
    const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
    const auth = await vess.autoConnect(env)
    if (auth) {
      const { session } = auth
      // @ts-ignore TODO:fixed
      composeClient.setDID(session.did)
      setMyDid(session.did.parent)
      const address = getAddress(getAddressFromPkh(session.did.parent))
      setAccount(address)
      setOriginalAddress(address)
      setChainId(1)
      setConnectionStatus('connected')
      setStateLoginType('wallet')
      console.log('Connection restored!')
    }
  }

  const disConnectDID = async (): Promise<void> => {
    disconnect()
    vess.disconnect()
    clearState()
  }
  const isAuthorized = useMemo(() => {
    if (!vess) return false
    return vess.isAuthenticated()
  }, [vess])

  return {
    disConnectDID,
    isAuthorized,
    autoConnect,
    connectDID,
  }
}
