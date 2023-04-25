import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const cyberconnectLink = new HttpLink({
  uri: 'https://api.cyberconnect.dev/',
})

const lensLink = new HttpLink({
  uri: 'https://api.lens.dev/',
})

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
