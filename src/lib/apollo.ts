import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'

const cyberconnectLink = new HttpLink({
  uri: 'https://api.cyberconnect.dev/',
})

const lensLink = new HttpLink({
  uri: 'https://api.lens.dev/',
})

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export const getCyberApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: cyberconnectLink,
  })
}

export const getlensApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: lensLink,
  })
}

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.split(
      (operation) => operation.getContext().api === 'lens',
      lensLink,
      cyberconnectLink,
    ),
    cache: new InMemoryCache(),
  })
}
export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
