import { useQueryClient } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { getAddressFromPkh, getVESS } from 'vess-sdk'
import { useDisconnect, useAccount } from 'wagmi'
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
  const { isConnected } = useAccount()

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

  const connectDID = async (): Promise<boolean> => {
    if (!isConnected) return false
    setConnectionStatus('connecting')
    try {
      // connect vess sdk
      const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
      const { session } = await vess.connect(window.ethereum, env)
      console.log({ session })
      composeClient.setDID(session.did)
      setMyDid(session.did.parent)
      const address = getAddress(getAddressFromPkh(session.did.parent))
      setAccount(address)
      setOriginalAddress(address)
      setChainId(1)
      setConnectionStatus('connected')
      setStateLoginType('wallet')

      // issue credentials from DB
      issueHeldEventFromBackup(session.did.parent)
      issueHeldMembershipFromBackup(session.did.parent)
      queryClient.invalidateQueries(['hasAuthorizedSession'])
      return true
    } catch (error) {
      console.error(error)
      await disConnectDID()
      clearState()
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
