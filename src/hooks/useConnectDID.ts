import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getVESS } from 'vess-sdk'
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
      const { account, provider } = await web3ModalService.connectWallet()
      if (account && provider) {
        // connect vess sdk
        const env = CERAMIC_NETWORK == 'mainnet' ? 'mainnet' : 'testnet-clay'
        const { session } = await vess.connect(provider.provider, env)
        composeClient.setDID(session.did)
        setMyDid(session.did.parent)
        setAccount(account)
        setOriginalAddress(web3ModalService.originalAddress)
        setChainId(web3ModalService.chainId)
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

  const disConnectDID = async (): Promise<void> => {
    await web3ModalService.disconnectWallet()
    vess.disconnect()
    clearState()
  }
  const { data: isAuthorized, isLoading: isCheckingAuth } = useQuery<boolean>(
    ['hasAuthorizedSession'],
    () => vess.isAuthenticated(),
    {
      enabled: !!vess,
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  return {
    connectDID,
    disConnectDID,
    isAuthorized,
    isCheckingAuth,
  }
}
