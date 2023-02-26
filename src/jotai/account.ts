import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { DisplayProfile } from '@/@types'

export const LOGIN_TYPE_KEY = 'vess-org-login-type'

export type connectionStatusType = 'connecting' | 'connected' | 'disconnected'

export const connectionStatus = atom<connectionStatusType>('disconnected')

export const useStateConnectionStatus = () => useAtom(connectionStatus)
export const useSetStateConnectionStatus = () => useSetAtom(connectionStatus)
export const useConnectionStatus = () => useAtomValue(connectionStatus)

export const myDid = atom<string | undefined>(undefined)

export const useStateMyDid = () => useAtom(myDid)
export const useSetStateMyDid = () => useSetAtom(myDid)
export const useMyDid = () => useAtomValue(myDid)

export const account = atom<string | undefined>(undefined)

export const useStateAccount = () => useAtom(account)
export const useSetStateAccount = () => useSetAtom(account)
export const useAccount = () => useAtomValue(account)

export const originalAddress = atom<string | undefined>(undefined)

export const useStateOriginalAddress = () => useAtom(originalAddress)
export const useSetStateOriginalAddress = () => useSetAtom(originalAddress)
export const useOriginalAddress = () => useAtomValue(originalAddress)

export const chainId = atom<number | undefined>(undefined)

export const useStateChainId = () => useAtom(chainId)
export const useSetStateChainId = () => useSetAtom(chainId)
export const useChainId = () => useAtomValue(chainId)

export const loginType = atomWithStorage<'wallet' | 'cloud' | undefined>(LOGIN_TYPE_KEY, undefined)

export const useStateLoginType = () => useAtom(loginType)
export const useSetStateLoginType = () => useSetAtom(loginType)
export const useLoginType = () => useAtomValue(loginType)

export const displayProfile = atom<DisplayProfile | null>(null)

export const useStateDisplayProfile = () => useAtom(displayProfile)
