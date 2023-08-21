import { getAddress } from '@ethersproject/address'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getAddressFromPkh, getVESS } from 'vess-sdk'
import { Connector, useConnect, useDisconnect } from 'wagmi'
import { useHeldEventAttendances } from './useHeldEventAttendances'
import { useHeldMembershipSubject } from './useHeldMembershipSubject'
import { CERAMIC_NETWORK } from '@/constants/common'
import { useComposeContext } from '@/context/compose'
import {
  useSetStateAccount,
  useSetStateChainId,
  useSetStateConnectionStatus,
  useSetStateLoginType,
  useSetStateMyDid,
  useSetStateOriginalAddress,
} from '@/jotai/account'

export const useConnectDID = () => {
  const setMyDid = useSetStateMyDid()
  const setAccount = useSetStateAccount()
  const setOriginalAddress = useSetStateOriginalAddress()
  const setChainId = useSetStateChainId()
  const setConnectionStatus = useSetStateConnectionStatus()
  const setStateLoginType = useSetStateLoginType()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { issueHeldMembershipFromBackup } = useHeldMembershipSubject()
  const { issueHeldEventFromBackup } = useHeldEventAttendances()
  const { composeClient } = useComposeContext()
  const { disconnect } = useDisconnect()
  const { connectAsync } = useConnect()

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

  const connectDID = async (connector?: Connector<any, any, any>): Promise<boolean> => {
    try {
      // connect vess sdk
      const res = await connectAsync({ connector })
      // await connectAsync({ connector })
      const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
      const ethProvider =
        connector?.id === 'walletConnect' ? (res.provider as any).provider : window.ethereum
      const { session } = await vess.connect(res.account, ethProvider, env)
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

      // issue credentials from DB //temporary closed for ETHDenver
      issueHeldEventFromBackup(session.did.parent)
      issueHeldMembershipFromBackup(session.did.parent)
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
      issueHeldMembershipFromBackup(session.did.parent)
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
