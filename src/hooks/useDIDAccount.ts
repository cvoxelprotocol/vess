import {
  useAccount,
  useChainId,
  useConnectionStatus,
  useLoginType,
  useMyDid,
  useOriginalAddress,
} from '@/jotai/account'

export const useDIDAccount = () => {
  const did = useMyDid()
  const account = useAccount()
  const originalAddress = useOriginalAddress()
  const chainId = useChainId()
  const connection = useConnectionStatus()
  const loginType = useLoginType()

  return {
    did,
    account,
    originalAddress,
    connection,
    chainId,
    loginType,
  }
}
