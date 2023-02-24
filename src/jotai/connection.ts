import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { EventAttendanceWithId, VerifiableMembershipSubjectCredential } from 'vess-sdk'

export const unused = atom<string | undefined>(undefined)

export const useStateUnUsedInvitaion = () => useAtom(unused)

export const useSetUnUsedInvitaion = () => useSetAtom(unused)

export const useUnUsedInvitaion = () => useAtomValue(unused)
