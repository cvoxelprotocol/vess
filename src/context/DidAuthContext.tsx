import type { LOGIN_PROVIDER_TYPE, CUSTOM_LOGIN_PROVIDER_TYPE } from '@web3auth/openlogin-adapter'
import { atom, createStore } from 'jotai'
import React, { createContext, useContext } from 'react'

export type VESSUserInfo = {
  did: string | undefined
  account: string | undefined
  originalAddress: string | undefined
  chainId: number | undefined
  connectionStatus: string
  stateLoginType: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE | undefined
}

export const vessAuthAtom = atom<VESSUserInfo | null>(null)
export const vessAuthStore = createStore()
vessAuthStore.set(vessAuthAtom, null)

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
