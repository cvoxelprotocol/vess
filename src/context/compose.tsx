import { ApolloProvider } from '@apollo/client'
import { createContext, useContext } from 'react'
import { initializeApolloForCompose } from '@/lib/apolloForCompose'

const { apolloClient, composeClient } = initializeApolloForCompose()
const CeramicContext = createContext({
  composeClient,
  apolloClient,
})

export const ComposeWrapper = ({ children }: any) => {
  return (
    <CeramicContext.Provider value={{ composeClient, apolloClient }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </CeramicContext.Provider>
  )
}

/**
 * Provide access to the Ceramic & Compose clients.
 * @example const { ceramic, compose } = useCeramicContext()
 * @returns CeramicClient
 */

export const useComposeContext = () => useContext(CeramicContext)
