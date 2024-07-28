import { useAtomValue } from 'jotai'
import { useVESSAuthContext, vessAuthAtom } from '@/context/DidAuthContext'

export const useVESSAuthUser = () => {
  const store = useVESSAuthContext()
  const vessAuth = useAtomValue(vessAuthAtom, { store })

  return {
    ...vessAuth,
  }
}
