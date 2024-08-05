import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useVESSAuthContext, vessAuthAtom } from '@/context/DidAuthContext'

export const useVESSAuthUser = () => {
  const store = useVESSAuthContext()
  const vessAuth = useAtomValue(vessAuthAtom, { store })

  // Get the user's first JWK DID
  // TODO: this should allow the user to select one from multiple DIDs
  const userJwk = useMemo(() => {
    if (!vessAuth?.user) return undefined
    return vessAuth.user.userDIDs?.find((d) => d.didType.toLocaleLowerCase() == 'jwk') || undefined
  }, [vessAuth])

  return {
    ...vessAuth,
    userJwk,
  }
}
