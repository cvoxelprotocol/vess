import React, { createContext, useContext } from 'react'
import { web3AuthAgent } from '@/lib/web3auth'

const web3Auth = web3AuthAgent.initializeInstance()
const Web3AuthContext = createContext({ web3Auth })

export const Web3AuthProvider = ({ children }: any) => {
  return <Web3AuthContext.Provider value={{ web3Auth }}>{children}</Web3AuthContext.Provider>
}

export const useWeb3AuthContext = () => useContext(Web3AuthContext)
