import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

export const unused = atom<string | undefined>(undefined)

export const useStateUnUsedInvitaion = () => useAtom(unused)

export const useSetUnUsedInvitaion = () => useSetAtom(unused)

export const useUnUsedInvitaion = () => useAtomValue(unused)

export const myConnectionInvitaions = atom<any>(undefined)

export const useStateMyConnectionInvitaions = () => useAtom(myConnectionInvitaions)
