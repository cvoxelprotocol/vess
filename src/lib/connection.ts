import { gql } from '@apollo/client'
import { initializeApolloForCompose } from './apolloForCompose'
import { GetAllConnectionsQuery, GetAllConnectionsQueryVariables } from '@/graphql/generated'

const GET_CONNECTION = gql`
  query getAllConnections {
    connectionIndex(last: 500) {
      edges {
        node {
          id
          userId
          invitationId
          connectAt
          did {
            ... on CeramicAccount {
              id
            }
          }
          invitaion {
            ... on ConnectionInvitation {
              id
              type
              status
              greeting
              location
              eventId
            }
          }
        }
      }
    }
  }
`

export const getConnectionForServerUse = async (): Promise<GetAllConnectionsQuery> => {
  const { apolloClient } = initializeApolloForCompose()
  const { data: allConnections } = await apolloClient.query<
    GetAllConnectionsQuery,
    GetAllConnectionsQueryVariables
  >({
    query: GET_CONNECTION,
  })
  return allConnections
}
