import React, { createContext, useContext } from 'react'
import { Web3AuthService } from '@/lib/web3auth'

const web3AuthService = Web3AuthService.getInstance()
const Web3AuthContext = createContext({ web3AuthService })

export const Web3AuthProvider = ({ children }: any) => {
  return <Web3AuthContext.Provider value={{ web3AuthService }}>{children}</Web3AuthContext.Provider>
}

export const useWeb3AuthContext = () => useContext(Web3AuthContext)
