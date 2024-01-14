import React, { createContext, useContext } from 'react'
import { mainnet } from 'wagmi'
import { initializeWeb3Auth } from '@/lib/web3auth'

const web3AuthInstance = initializeWeb3Auth([mainnet])
const Web3AuthContext = createContext({ web3AuthInstance })

export const Web3AuthProvider = ({ children }: any) => {
  return (
    <Web3AuthContext.Provider value={{ web3AuthInstance }}>{children}</Web3AuthContext.Provider>
  )
}

export const useWeb3AuthContext = () => useContext(Web3AuthContext)
