import { ApolloClient, ApolloLink, InMemoryCache, Observable, ApolloProvider } from '@apollo/client'
import { ComposeClient } from '@composedb/client'
import { RuntimeCompositeDefinition } from '@composedb/types'
import { createContext, useContext } from 'react'

import { definition } from '../__generated__/definition.js'

/**
 * Configure ceramic Client & create context.
 */
// const ceramic = new CeramicClient('http://localhost:7007')

const abortController = new AbortController()

const compose = new ComposeClient({
  ceramic: process.env.NEXT_PUBLIC_COMPOSE_DB_ENDPOINT || 'http://localhost:7007',
  // cast our definition as a RuntimeCompositeDefinition
  definition: definition as RuntimeCompositeDefinition,
})

const link = new ApolloLink((operation) => {
  return new Observable((observer) => {
    compose.execute(operation.query, operation.variables).then(
      (result) => {
        observer.next(result)
        observer.complete()
      },
      (error) => {
        observer.error(error)
      },
    )
  })
})
const apolloClient = new ApolloClient({ cache: new InMemoryCache(), link })

const CeramicContext = createContext({
  composeClient: compose,
  apolloClient,
})

export const ComposeWrapper = ({ children }: any) => {
  return (
    <CeramicContext.Provider value={{ composeClient: compose, apolloClient }}>
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
