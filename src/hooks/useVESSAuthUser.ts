import { useAtomValue } from 'jotai'
import { useVESSAuthContext, vessAuthAtom } from '@/context/DidAuthContext'

export const useVESSAuthUser = () => {
  const store = useVESSAuthContext()
  const vessUser = useAtomValue(vessAuthAtom, { store })

  return {
    did: vessUser?.did,
    account: vessUser?.account,
    originalAddress: vessUser?.originalAddress,
    connection: vessUser?.connectionStatus,
    chainId: vessUser?.chainId,
    loginType: vessUser?.stateLoginType,
  }
}
