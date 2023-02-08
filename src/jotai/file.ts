import { atom, useAtom } from 'jotai'

export const uploadStatus = atom<'completed' | 'uploading' | 'failed' | undefined>(undefined)

export const useStateUploadStatus = () => useAtom(uploadStatus)

export const uploadedCID = atom<string | undefined>(undefined)

export const useStateUploadedCID = () => useAtom(uploadedCID)

export const uploadedIconUrl = atom<string | undefined>(undefined)

export const useStateUploadedIconUrl = () => useAtom(uploadedIconUrl)

export const uploadedIconName = atom<string | undefined>(undefined)

export const useStateUploadedIconName = () => useAtom(uploadedIconName)

export const uploadedCoverImageUrl = atom<string | undefined>(undefined)

export const useStateUploadedCoverImageUrl = () => useAtom(uploadedCoverImageUrl)

export const uploadedCoverName = atom<string | undefined>(undefined)

export const useStateUploadedCoverName = () => useAtom(uploadedCoverName)
