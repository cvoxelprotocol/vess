import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A Ceramic Commit ID */
  CeramicCommitID: any
  /** A Ceramic Stream ID */
  CeramicStreamID: any
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any
}

export type CeramicAccount = Node & {
  __typename?: 'CeramicAccount'
  connectionInvitationList?: Maybe<ConnectionInvitationConnection>
  connectionList?: Maybe<ConnectionConnection>
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID']
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean']
}

export type CeramicAccountConnectionInvitationListArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type CeramicAccountConnectionListArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type Connection = Node & {
  __typename?: 'Connection'
  connectAt?: Maybe<Scalars['DateTime']>
  /** Account controlling the document */
  did: CeramicAccount
  id: Scalars['ID']
  invitaion?: Maybe<ConnectionInvitation>
  invitationId: Scalars['CeramicStreamID']
  userId: Scalars['ID']
}

/** A connection to a list of items. */
export type ConnectionConnection = {
  __typename?: 'ConnectionConnection'
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ConnectionEdge>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

/** An edge in a connection. */
export type ConnectionEdge = {
  __typename?: 'ConnectionEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<Connection>
}

export type ConnectionInput = {
  connectAt?: InputMaybe<Scalars['DateTime']>
  invitationId: Scalars['CeramicStreamID']
  userId: Scalars['ID']
}

export type ConnectionInvitation = Node & {
  __typename?: 'ConnectionInvitation'
  connection: ConnectionConnection
  /** Account controlling the document */
  did: CeramicAccount
  eventId?: Maybe<Scalars['ID']>
  greeting: Scalars['String']
  id: Scalars['ID']
  location?: Maybe<Scalars['String']>
  response?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type ConnectionInvitationConnectionArgs = {
  account?: InputMaybe<Scalars['ID']>
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

/** A connection to a list of items. */
export type ConnectionInvitationConnection = {
  __typename?: 'ConnectionInvitationConnection'
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ConnectionInvitationEdge>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

/** An edge in a connection. */
export type ConnectionInvitationEdge = {
  __typename?: 'ConnectionInvitationEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ConnectionInvitation>
}

export type ConnectionInvitationInput = {
  eventId?: InputMaybe<Scalars['ID']>
  greeting: Scalars['String']
  location?: InputMaybe<Scalars['String']>
  response?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
}

export type CreateConnectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>
  content: ConnectionInput
}

export type CreateConnectionInvitationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>
  content: ConnectionInvitationInput
}

export type CreateConnectionInvitationPayload = {
  __typename?: 'CreateConnectionInvitationPayload'
  clientMutationId?: Maybe<Scalars['String']>
  document: ConnectionInvitation
  /** Fetches an object given its ID */
  node?: Maybe<Node>
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>
}

export type CreateConnectionInvitationPayloadNodeArgs = {
  id: Scalars['ID']
}

export type CreateConnectionPayload = {
  __typename?: 'CreateConnectionPayload'
  clientMutationId?: Maybe<Scalars['String']>
  document: Connection
  /** Fetches an object given its ID */
  node?: Maybe<Node>
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>
}

export type CreateConnectionPayloadNodeArgs = {
  id: Scalars['ID']
}

export type Mutation = {
  __typename?: 'Mutation'
  createConnection?: Maybe<CreateConnectionPayload>
  createConnectionInvitation?: Maybe<CreateConnectionInvitationPayload>
  updateConnection?: Maybe<UpdateConnectionPayload>
  updateConnectionInvitation?: Maybe<UpdateConnectionInvitationPayload>
}

export type MutationCreateConnectionArgs = {
  input: CreateConnectionInput
}

export type MutationCreateConnectionInvitationArgs = {
  input: CreateConnectionInvitationInput
}

export type MutationUpdateConnectionArgs = {
  input: UpdateConnectionInput
}

export type MutationUpdateConnectionInvitationArgs = {
  input: UpdateConnectionInvitationInput
}

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>
}

export type PartialConnectionInput = {
  connectAt?: InputMaybe<Scalars['DateTime']>
  invitationId?: InputMaybe<Scalars['CeramicStreamID']>
  userId?: InputMaybe<Scalars['ID']>
}

export type PartialConnectionInvitationInput = {
  eventId?: InputMaybe<Scalars['ID']>
  greeting?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['String']>
  response?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  connectionIndex?: Maybe<ConnectionConnection>
  connectionInvitationIndex?: Maybe<ConnectionInvitationConnection>
  /** Fetches an object given its ID */
  node?: Maybe<Node>
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>
}

export type QueryConnectionIndexArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type QueryConnectionInvitationIndexArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type QueryNodeArgs = {
  id: Scalars['ID']
}

export type UpdateConnectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>
  content: PartialConnectionInput
  id: Scalars['ID']
  options?: InputMaybe<UpdateOptionsInput>
}

export type UpdateConnectionInvitationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>
  content: PartialConnectionInvitationInput
  id: Scalars['ID']
  options?: InputMaybe<UpdateOptionsInput>
}

export type UpdateConnectionInvitationPayload = {
  __typename?: 'UpdateConnectionInvitationPayload'
  clientMutationId?: Maybe<Scalars['String']>
  document: ConnectionInvitation
  /** Fetches an object given its ID */
  node?: Maybe<Node>
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>
}

export type UpdateConnectionInvitationPayloadNodeArgs = {
  id: Scalars['ID']
}

export type UpdateConnectionPayload = {
  __typename?: 'UpdateConnectionPayload'
  clientMutationId?: Maybe<Scalars['String']>
  document: Connection
  /** Fetches an object given its ID */
  node?: Maybe<Node>
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>
}

export type UpdateConnectionPayloadNodeArgs = {
  id: Scalars['ID']
}

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']>
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']>
}

export type GetAllConnectionsQueryVariables = Exact<{ [key: string]: never }>

export type GetAllConnectionsQuery = {
  __typename?: 'Query'
  connectionIndex?: {
    __typename?: 'ConnectionConnection'
    edges?: Array<{
      __typename?: 'ConnectionEdge'
      node?: {
        __typename?: 'Connection'
        id: string
        userId: string
        invitationId: any
        connectAt?: any | null
        did: { __typename?: 'CeramicAccount'; id: string }
        invitaion?: {
          __typename?: 'ConnectionInvitation'
          id: string
          type?: string | null
          status?: string | null
          greeting: string
          location?: string | null
          eventId?: string | null
        } | null
      } | null
    } | null> | null
  } | null
}

export type GetIssuedConnectionsQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetIssuedConnectionsQuery = {
  __typename?: 'Query'
  node?:
    | {
        __typename?: 'CeramicAccount'
        connectionList?: {
          __typename?: 'ConnectionConnection'
          edges?: Array<{
            __typename?: 'ConnectionEdge'
            node?: {
              __typename?: 'Connection'
              id: string
              userId: string
              invitationId: any
              connectAt?: any | null
              invitaion?: {
                __typename?: 'ConnectionInvitation'
                id: string
                type?: string | null
                status?: string | null
                greeting: string
                location?: string | null
                eventId?: string | null
              } | null
            } | null
          } | null> | null
        } | null
      }
    | { __typename?: 'Connection' }
    | { __typename?: 'ConnectionInvitation' }
    | null
}

export type GetConnectionFromInvitaionQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetConnectionFromInvitaionQuery = {
  __typename?: 'Query'
  node?:
    | { __typename?: 'CeramicAccount' }
    | { __typename?: 'Connection' }
    | {
        __typename?: 'ConnectionInvitation'
        id: string
        connection: {
          __typename?: 'ConnectionConnection'
          edges?: Array<{
            __typename?: 'ConnectionEdge'
            node?: {
              __typename?: 'Connection'
              id: string
              userId: string
              connectAt?: any | null
              invitationId: any
              invitaion?: {
                __typename?: 'ConnectionInvitation'
                id: string
                type?: string | null
                status?: string | null
                greeting: string
                location?: string | null
                eventId?: string | null
              } | null
            } | null
          } | null> | null
        }
      }
    | null
}

export type GetConnectionQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetConnectionQuery = {
  __typename?: 'Query'
  node?:
    | { __typename?: 'CeramicAccount' }
    | {
        __typename?: 'Connection'
        id: string
        userId: string
        connectAt?: any | null
        invitationId: any
        invitaion?: {
          __typename?: 'ConnectionInvitation'
          id: string
          type?: string | null
          status?: string | null
          greeting: string
          location?: string | null
          eventId?: string | null
        } | null
      }
    | { __typename?: 'ConnectionInvitation' }
    | null
}

export type CreateConnectionMutationVariables = Exact<{
  content: ConnectionInput
}>

export type CreateConnectionMutation = {
  __typename?: 'Mutation'
  createConnection?: {
    __typename?: 'CreateConnectionPayload'
    document: {
      __typename?: 'Connection'
      id: string
      userId: string
      connectAt?: any | null
      invitationId: any
    }
  } | null
}

export type GetMyConnectionInvitaionsQueryVariables = Exact<{ [key: string]: never }>

export type GetMyConnectionInvitaionsQuery = {
  __typename?: 'Query'
  viewer?: {
    __typename?: 'CeramicAccount'
    connectionInvitationList?: {
      __typename?: 'ConnectionInvitationConnection'
      edges?: Array<{
        __typename?: 'ConnectionInvitationEdge'
        node?: {
          __typename?: 'ConnectionInvitation'
          id: string
          type?: string | null
          status?: string | null
          greeting: string
          location?: string | null
          eventId?: string | null
          connection: {
            __typename?: 'ConnectionConnection'
            edges?: Array<{
              __typename?: 'ConnectionEdge'
              node?: {
                __typename?: 'Connection'
                id: string
                userId: string
                invitationId: any
                connectAt?: any | null
                did: { __typename?: 'CeramicAccount'; id: string }
              } | null
            } | null> | null
          }
        } | null
      } | null> | null
    } | null
  } | null
}

export type GetConnectionInvitaionQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetConnectionInvitaionQuery = {
  __typename?: 'Query'
  node?:
    | { __typename?: 'CeramicAccount' }
    | { __typename?: 'Connection' }
    | {
        __typename?: 'ConnectionInvitation'
        id: string
        type?: string | null
        status?: string | null
        greeting: string
        location?: string | null
        eventId?: string | null
        did: { __typename?: 'CeramicAccount'; did: string }
        connection: {
          __typename?: 'ConnectionConnection'
          edges?: Array<{
            __typename?: 'ConnectionEdge'
            node?: {
              __typename?: 'Connection'
              id: string
              userId: string
              invitationId: any
              connectAt?: any | null
              did: { __typename?: 'CeramicAccount'; id: string }
            } | null
          } | null> | null
        }
      }
    | null
}

export type CreateConnectionInvitaionMutationVariables = Exact<{
  content: ConnectionInvitationInput
}>

export type CreateConnectionInvitaionMutation = {
  __typename?: 'Mutation'
  createConnectionInvitation?: {
    __typename?: 'CreateConnectionInvitationPayload'
    document: {
      __typename?: 'ConnectionInvitation'
      id: string
      type?: string | null
      status?: string | null
      greeting: string
      location?: string | null
      eventId?: string | null
    }
  } | null
}

export type UpdateConnectionInvitaionMutationVariables = Exact<{
  input: UpdateConnectionInvitationInput
}>

export type UpdateConnectionInvitaionMutation = {
  __typename?: 'Mutation'
  updateConnectionInvitation?: {
    __typename?: 'UpdateConnectionInvitationPayload'
    document: {
      __typename?: 'ConnectionInvitation'
      id: string
      type?: string | null
      status?: string | null
      greeting: string
      location?: string | null
    }
  } | null
}

export const GetAllConnectionsDocument = gql`
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

/**
 * __useGetAllConnectionsQuery__
 *
 * To run a query within a React component, call `useGetAllConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllConnectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllConnectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllConnectionsQuery, GetAllConnectionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAllConnectionsQuery, GetAllConnectionsQueryVariables>(
    GetAllConnectionsDocument,
    options,
  )
}
export function useGetAllConnectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllConnectionsQuery,
    GetAllConnectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAllConnectionsQuery, GetAllConnectionsQueryVariables>(
    GetAllConnectionsDocument,
    options,
  )
}
export type GetAllConnectionsQueryHookResult = ReturnType<typeof useGetAllConnectionsQuery>
export type GetAllConnectionsLazyQueryHookResult = ReturnType<typeof useGetAllConnectionsLazyQuery>
export type GetAllConnectionsQueryResult = Apollo.QueryResult<
  GetAllConnectionsQuery,
  GetAllConnectionsQueryVariables
>
export const GetIssuedConnectionsDocument = gql`
  query getIssuedConnections($id: ID!) {
    node(id: $id) {
      ... on CeramicAccount {
        connectionList(first: 500) {
          edges {
            node {
              id
              userId
              invitationId
              connectAt
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
    }
  }
`

/**
 * __useGetIssuedConnectionsQuery__
 *
 * To run a query within a React component, call `useGetIssuedConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIssuedConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIssuedConnectionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetIssuedConnectionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetIssuedConnectionsQuery,
    GetIssuedConnectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetIssuedConnectionsQuery, GetIssuedConnectionsQueryVariables>(
    GetIssuedConnectionsDocument,
    options,
  )
}
export function useGetIssuedConnectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetIssuedConnectionsQuery,
    GetIssuedConnectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetIssuedConnectionsQuery, GetIssuedConnectionsQueryVariables>(
    GetIssuedConnectionsDocument,
    options,
  )
}
export type GetIssuedConnectionsQueryHookResult = ReturnType<typeof useGetIssuedConnectionsQuery>
export type GetIssuedConnectionsLazyQueryHookResult = ReturnType<
  typeof useGetIssuedConnectionsLazyQuery
>
export type GetIssuedConnectionsQueryResult = Apollo.QueryResult<
  GetIssuedConnectionsQuery,
  GetIssuedConnectionsQueryVariables
>
export const GetConnectionFromInvitaionDocument = gql`
  query getConnectionFromInvitaion($id: ID!) {
    node(id: $id) {
      ... on ConnectionInvitation {
        id
        connection {
          ... on ConnectionConnection {
            edges {
              node {
                ... on Connection {
                  id
                  userId
                  connectAt
                  invitationId
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
        }
      }
    }
  }
`

/**
 * __useGetConnectionFromInvitaionQuery__
 *
 * To run a query within a React component, call `useGetConnectionFromInvitaionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionFromInvitaionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionFromInvitaionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetConnectionFromInvitaionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetConnectionFromInvitaionQuery,
    GetConnectionFromInvitaionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetConnectionFromInvitaionQuery, GetConnectionFromInvitaionQueryVariables>(
    GetConnectionFromInvitaionDocument,
    options,
  )
}
export function useGetConnectionFromInvitaionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetConnectionFromInvitaionQuery,
    GetConnectionFromInvitaionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetConnectionFromInvitaionQuery,
    GetConnectionFromInvitaionQueryVariables
  >(GetConnectionFromInvitaionDocument, options)
}
export type GetConnectionFromInvitaionQueryHookResult = ReturnType<
  typeof useGetConnectionFromInvitaionQuery
>
export type GetConnectionFromInvitaionLazyQueryHookResult = ReturnType<
  typeof useGetConnectionFromInvitaionLazyQuery
>
export type GetConnectionFromInvitaionQueryResult = Apollo.QueryResult<
  GetConnectionFromInvitaionQuery,
  GetConnectionFromInvitaionQueryVariables
>
export const GetConnectionDocument = gql`
  query getConnection($id: ID!) {
    node(id: $id) {
      ... on Connection {
        id
        userId
        connectAt
        invitationId
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
`

/**
 * __useGetConnectionQuery__
 *
 * To run a query within a React component, call `useGetConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<GetConnectionQuery, GetConnectionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetConnectionQuery, GetConnectionQueryVariables>(
    GetConnectionDocument,
    options,
  )
}
export function useGetConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetConnectionQuery, GetConnectionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetConnectionQuery, GetConnectionQueryVariables>(
    GetConnectionDocument,
    options,
  )
}
export type GetConnectionQueryHookResult = ReturnType<typeof useGetConnectionQuery>
export type GetConnectionLazyQueryHookResult = ReturnType<typeof useGetConnectionLazyQuery>
export type GetConnectionQueryResult = Apollo.QueryResult<
  GetConnectionQuery,
  GetConnectionQueryVariables
>
export const CreateConnectionDocument = gql`
  mutation createConnection($content: ConnectionInput!) {
    createConnection(input: { content: $content }) {
      document {
        id
        userId
        connectAt
        invitationId
      }
    }
  }
`
export type CreateConnectionMutationFn = Apollo.MutationFunction<
  CreateConnectionMutation,
  CreateConnectionMutationVariables
>

/**
 * __useCreateConnectionMutation__
 *
 * To run a mutation, you first call `useCreateConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConnectionMutation, { data, loading, error }] = useCreateConnectionMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateConnectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateConnectionMutation,
    CreateConnectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateConnectionMutation, CreateConnectionMutationVariables>(
    CreateConnectionDocument,
    options,
  )
}
export type CreateConnectionMutationHookResult = ReturnType<typeof useCreateConnectionMutation>
export type CreateConnectionMutationResult = Apollo.MutationResult<CreateConnectionMutation>
export type CreateConnectionMutationOptions = Apollo.BaseMutationOptions<
  CreateConnectionMutation,
  CreateConnectionMutationVariables
>
export const GetMyConnectionInvitaionsDocument = gql`
  query getMyConnectionInvitaions {
    viewer {
      ... on CeramicAccount {
        connectionInvitationList(last: 500) {
          edges {
            node {
              id
              type
              status
              greeting
              location
              eventId
              connection(last: 500) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

/**
 * __useGetMyConnectionInvitaionsQuery__
 *
 * To run a query within a React component, call `useGetMyConnectionInvitaionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyConnectionInvitaionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyConnectionInvitaionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyConnectionInvitaionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMyConnectionInvitaionsQuery,
    GetMyConnectionInvitaionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMyConnectionInvitaionsQuery, GetMyConnectionInvitaionsQueryVariables>(
    GetMyConnectionInvitaionsDocument,
    options,
  )
}
export function useGetMyConnectionInvitaionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMyConnectionInvitaionsQuery,
    GetMyConnectionInvitaionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetMyConnectionInvitaionsQuery,
    GetMyConnectionInvitaionsQueryVariables
  >(GetMyConnectionInvitaionsDocument, options)
}
export type GetMyConnectionInvitaionsQueryHookResult = ReturnType<
  typeof useGetMyConnectionInvitaionsQuery
>
export type GetMyConnectionInvitaionsLazyQueryHookResult = ReturnType<
  typeof useGetMyConnectionInvitaionsLazyQuery
>
export type GetMyConnectionInvitaionsQueryResult = Apollo.QueryResult<
  GetMyConnectionInvitaionsQuery,
  GetMyConnectionInvitaionsQueryVariables
>
export const GetConnectionInvitaionDocument = gql`
  query getConnectionInvitaion($id: ID!) {
    node(id: $id) {
      ... on ConnectionInvitation {
        id
        type
        status
        greeting
        location
        eventId
        did {
          ... on CeramicAccount {
            did: id
          }
        }
        connection(last: 500) {
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
            }
          }
        }
      }
    }
  }
`

/**
 * __useGetConnectionInvitaionQuery__
 *
 * To run a query within a React component, call `useGetConnectionInvitaionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionInvitaionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionInvitaionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetConnectionInvitaionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetConnectionInvitaionQuery,
    GetConnectionInvitaionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetConnectionInvitaionQuery, GetConnectionInvitaionQueryVariables>(
    GetConnectionInvitaionDocument,
    options,
  )
}
export function useGetConnectionInvitaionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetConnectionInvitaionQuery,
    GetConnectionInvitaionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetConnectionInvitaionQuery, GetConnectionInvitaionQueryVariables>(
    GetConnectionInvitaionDocument,
    options,
  )
}
export type GetConnectionInvitaionQueryHookResult = ReturnType<
  typeof useGetConnectionInvitaionQuery
>
export type GetConnectionInvitaionLazyQueryHookResult = ReturnType<
  typeof useGetConnectionInvitaionLazyQuery
>
export type GetConnectionInvitaionQueryResult = Apollo.QueryResult<
  GetConnectionInvitaionQuery,
  GetConnectionInvitaionQueryVariables
>
export const CreateConnectionInvitaionDocument = gql`
  mutation createConnectionInvitaion($content: ConnectionInvitationInput!) {
    createConnectionInvitation(input: { content: $content }) {
      document {
        id
        type
        status
        greeting
        location
        eventId
      }
    }
  }
`
export type CreateConnectionInvitaionMutationFn = Apollo.MutationFunction<
  CreateConnectionInvitaionMutation,
  CreateConnectionInvitaionMutationVariables
>

/**
 * __useCreateConnectionInvitaionMutation__
 *
 * To run a mutation, you first call `useCreateConnectionInvitaionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConnectionInvitaionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConnectionInvitaionMutation, { data, loading, error }] = useCreateConnectionInvitaionMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateConnectionInvitaionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateConnectionInvitaionMutation,
    CreateConnectionInvitaionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateConnectionInvitaionMutation,
    CreateConnectionInvitaionMutationVariables
  >(CreateConnectionInvitaionDocument, options)
}
export type CreateConnectionInvitaionMutationHookResult = ReturnType<
  typeof useCreateConnectionInvitaionMutation
>
export type CreateConnectionInvitaionMutationResult =
  Apollo.MutationResult<CreateConnectionInvitaionMutation>
export type CreateConnectionInvitaionMutationOptions = Apollo.BaseMutationOptions<
  CreateConnectionInvitaionMutation,
  CreateConnectionInvitaionMutationVariables
>
export const UpdateConnectionInvitaionDocument = gql`
  mutation updateConnectionInvitaion($input: UpdateConnectionInvitationInput!) {
    updateConnectionInvitation(input: $input) {
      document {
        id
        type
        status
        greeting
        location
      }
    }
  }
`
export type UpdateConnectionInvitaionMutationFn = Apollo.MutationFunction<
  UpdateConnectionInvitaionMutation,
  UpdateConnectionInvitaionMutationVariables
>

/**
 * __useUpdateConnectionInvitaionMutation__
 *
 * To run a mutation, you first call `useUpdateConnectionInvitaionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConnectionInvitaionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConnectionInvitaionMutation, { data, loading, error }] = useUpdateConnectionInvitaionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateConnectionInvitaionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateConnectionInvitaionMutation,
    UpdateConnectionInvitaionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateConnectionInvitaionMutation,
    UpdateConnectionInvitaionMutationVariables
  >(UpdateConnectionInvitaionDocument, options)
}
export type UpdateConnectionInvitaionMutationHookResult = ReturnType<
  typeof useUpdateConnectionInvitaionMutation
>
export type UpdateConnectionInvitaionMutationResult =
  Apollo.MutationResult<UpdateConnectionInvitaionMutation>
export type UpdateConnectionInvitaionMutationOptions = Apollo.BaseMutationOptions<
  UpdateConnectionInvitaionMutation,
  UpdateConnectionInvitaionMutationVariables
>
