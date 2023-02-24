import { useQueryClient } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { getAddressFromPkh, getVESS } from 'vess-sdk'
import { useHeldEventAttendances } from './useHeldEventAttendances'
import { useHeldMembershipSubject } from './useHeldMembershipSubject'
import { useToast } from './useToast'
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
import { getWeb3ModalService } from '@/lib/Web3ModalService'

export const useConnectDID = () => {
  const setMyDid = useSetStateMyDid()
  const setAccount = useSetStateAccount()
  const setOriginalAddress = useSetStateOriginalAddress()
  const setChainId = useSetStateChainId()
  const setConnectionStatus = useSetStateConnectionStatus()
  const setStateLoginType = useSetStateLoginType()
  const web3ModalService = getWeb3ModalService()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()
  const { issueHeldMembershipFromBackup } = useHeldMembershipSubject()
  const { issueHeldEventFromBackup } = useHeldEventAttendances()
  const { composeClient } = useComposeContext()

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

  const connectDID = async (): Promise<void> => {
    setConnectionStatus('connecting')
    try {
      const { provider } = await web3ModalService.connectWallet()
      if (provider) {
        // connect vess sdk
        const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
        const { session } = await vess.connect(provider.provider, env)
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
      } else {
        setConnectionStatus('disconnected')
      }
      queryClient.invalidateQueries(['hasAuthorizedSession'])
    } catch (error) {
      console.error(error)
      await disConnectDID()
      clearState()
      if (error instanceof Error) {
        console.error(error)
      }
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
    await web3ModalService.disconnectWallet()
    vess.disconnect()
    clearState()
  }
  const isAuthorized = useMemo(() => {
    if (!vess) return false
    return vess.isAuthenticated()
  }, [vess])

  return {
    connectDID,
    disConnectDID,
    isAuthorized,
    autoConnect,
  }
}
