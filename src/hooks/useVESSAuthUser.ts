import { useAtomValue } from 'jotai'
import { useVESSAuthContext, vessAuthAtom } from '@/context/DidAuthContext'

export const useVESSAuthUser = () => {
  const store = useVESSAuthContext()
  const vessAuth = useAtomValue(vessAuthAtom, { store })

  return {
    id: vessAuth?.user?.id,
    did: vessAuth?.user?.did,
    account: vessAuth?.user?.account,
    originalAddress: vessAuth?.user?.originalAddress,
    connection: vessAuth?.connectionStatus,
    chainId: vessAuth?.user?.chainId,
    loginType: vessAuth?.user?.stateLoginType,
    name: vessAuth?.user?.name,
    avatar: vessAuth?.user?.avatar,
    description: vessAuth?.user?.description,
    vessId: vessAuth?.user?.vessId,
  }
}
