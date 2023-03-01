import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
  ApolloProvider,
  HttpLink,
} from '@apollo/client'
import { ComposeClient } from '@composedb/client'
import { RuntimeCompositeDefinition } from '@composedb/types'
import { createContext, useContext } from 'react'
import { definition as devDifinition } from '../__generated__/dev/definition.js'
import { definition as prodDifinition } from '../__generated__/prod/definition.js'
import { CERAMIC_NETWORK } from '@/constants/common'

/**
 * Configure ceramic Client & create context.
 */
// const ceramic = new CeramicClient('http://localhost:7007')

const compose = new ComposeClient({
  ceramic: process.env.NEXT_PUBLIC_COMPOSE_DB_ENDPOINT || 'http://localhost:7007',
  // cast our definition as a RuntimeCompositeDefinition
  definition: (CERAMIC_NETWORK === 'mainnet'
    ? prodDifinition
    : devDifinition) as RuntimeCompositeDefinition,
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
const cyberconnectLink = new HttpLink({
  uri: 'https://api.cyberconnect.dev/',
})

const lensLink = new HttpLink({
  uri: 'https://api.lens.dev/',
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    (operation) => operation.getContext()['clientName'] === 'cyberconnect',
    cyberconnectLink,
    ApolloLink.split(
      (operation) => operation.getContext()['clientName'] === 'lens',
      lensLink,
      link,
    ),
  ),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
})

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
