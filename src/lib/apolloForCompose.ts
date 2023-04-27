import { ApolloClient, ApolloLink, Observable, InMemoryCache } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import { ComposeClient } from '@composedb/client'
import { RuntimeCompositeDefinition } from '@composedb/types'
import { definition as devDifinition } from '../__generated__/dev/definition.js'
import { definition as prodDifinition } from '../__generated__/prod/definition.js'
import { CERAMIC_NETWORK } from '@/constants/common'

export type ClientType = {
  apolloClient: ApolloClient<NormalizedCacheObject>
  composeClient: ComposeClient
}
let client: ClientType | undefined

const createClient = (): ClientType => {
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
  return {
    apolloClient: new ApolloClient({
      ssrMode: typeof window === 'undefined',
      cache: new InMemoryCache(),
      link: link,
    }),
    composeClient: compose,
  }
}

export const initializeApolloForCompose = (initialState = null): ClientType => {
  const _client = client ?? createClient()
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _client
  // Create the Apollo Client once in the client
  if (!client) client = _client

  return _client
}
