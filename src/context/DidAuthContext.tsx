import type { LOGIN_PROVIDER_TYPE, CUSTOM_LOGIN_PROVIDER_TYPE } from '@web3auth/openlogin-adapter'
import { atom, createStore } from 'jotai'
import React, { createContext, useContext } from 'react'
import { VSUser } from '@/@types/credential'

export type PartialVESSUser = Omit<
  VSUser,
  'createdAt' | 'updatedAt' | 'profiles' | 'socialLink' | 'post'
>

export type VESSUserInfo = {
  user: PartialVESSUser | undefined
  address: string | undefined
  chainId: number | undefined
  stateLoginType: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE | undefined
  connectionStatus:
    | 'connected'
    | 'disconnected'
    | 'connecting'
    | 'disconnecting'
    | 'error'
    | undefined
}

const initialVESSUserInfo: VESSUserInfo = {
  user: undefined,
  address: undefined,
  chainId: undefined,
  stateLoginType: undefined,
  connectionStatus: 'disconnected',
}

export const vessAuthAtom = atom<VESSUserInfo | null>(initialVESSUserInfo)
export const vessAuthStore = createStore()
vessAuthStore.set(vessAuthAtom, initialVESSUserInfo)

export const setVESSAuth = (userInfo: VESSUserInfo | null) => {
  vessAuthStore.set(vessAuthAtom, userInfo)
}

export const getVESSAuth = () => {
  return vessAuthStore.get(vessAuthAtom)
}

export const VESSAuthContext = createContext<typeof vessAuthStore>(vessAuthStore)

export const VESSAuthProvider = ({ children }: any) => {
  return <VESSAuthContext.Provider value={vessAuthStore}>{children}</VESSAuthContext.Provider>
}

export const useVESSAuthContext = () => useContext(VESSAuthContext)
