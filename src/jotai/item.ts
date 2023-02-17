import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { EventAttendanceWithId, VerifiableMembershipSubjectCredential } from 'vess-sdk'

export const selectAttendance = atom<EventAttendanceWithId | undefined>(undefined)

export const useStateSelectAttendance = () => useAtom(selectAttendance)

export const useSetSelectAttendance = () => useSetAtom(selectAttendance)

export const useSelectedAttendance = () => useAtomValue(selectAttendance)

export const selectExperience = atom<VerifiableMembershipSubjectCredential | undefined>(undefined)

export const useStateSelectExperience = () => useAtom(selectExperience)
