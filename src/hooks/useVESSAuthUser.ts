import { useAtomValue } from 'jotai'
import { useVESSAuthContext, vessAuthAtom } from '@/context/DidAuthContext'

export const useVESSAuthUser = () => {
  const store = useVESSAuthContext()
  const vessAuth = useAtomValue(vessAuthAtom, { store })

  return {
    did: vessAuth?.user?.did,
    account: vessAuth?.user?.account,
    originalAddress: vessAuth?.user?.originalAddress,
    connection: vessAuth?.connectionStatus,
    chainId: vessAuth?.user?.chainId,
    loginType: vessAuth?.user?.stateLoginType,
  }
}
