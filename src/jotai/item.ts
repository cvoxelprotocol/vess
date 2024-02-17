import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { VerifiableMembershipSubjectCredential, WithCeramicId } from 'vess-sdk'
import { BaseCredential } from '@/@types/credential'

export const selectAttendance = atom<WithCeramicId<BaseCredential> | undefined>(undefined)

export const useStateSelectAttendance = () => useAtom(selectAttendance)

export const useSetSelectAttendance = () => useSetAtom(selectAttendance)

export const useSelectedAttendance = () => useAtomValue(selectAttendance)

export const selectExperience = atom<VerifiableMembershipSubjectCredential | undefined>(undefined)

export const useStateSelectExperience = () => useAtom(selectExperience)

export const selectTask = atom<string | undefined>(undefined)

export const useSetSelectTask = () => useSetAtom(selectTask)

export const useSelectedTask = () => useAtomValue(selectTask)
