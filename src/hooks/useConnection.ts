import type { QueryResult } from '@apollo/client'
import {
  ConnectionInput,
  Exact,
  GetMyConnectionInvitaionsQuery,
  useCreateConnectionMutation,
  useGetMyConnectionInvitaionsLazyQuery,
} from '@/graphql/generated'

export const useConnection = () => {
  // === Invitation ===
  const [getMyConnectionInvitaions] = useGetMyConnectionInvitaionsLazyQuery()
  const [createConnection] = useCreateConnectionMutation()

  const migrationInvitaion = async () => {
    const invitations = await getMyConnectionInvitaions()
    await issueCOnnectionOnBackground(invitations)
  }

  const issueCOnnectionOnBackground = async (
    res: QueryResult<
      GetMyConnectionInvitaionsQuery,
      Exact<{
        [key: string]: never
      }>
    >,
  ) => {
    const edges = res.data?.viewer?.connectionInvitationList?.edges
    if (!edges || edges.length === 0) return
    const invitationsForIssue = edges.filter((edge) => {
      const connections = edge?.node?.connection.edges
      return connections && connections.length === 1
    })
    const connectionsForIssue = invitationsForIssue.map((edge) => edge?.node?.connection)
    if (connectionsForIssue && connectionsForIssue.length > 0) {
      let promises: Promise<any>[] = []
      for (const connections of connectionsForIssue) {
        if (!connections?.edges) return
        for (const connection of connections?.edges) {
          const userId = connection?.node?.did.id
          const unused = connection?.node?.invitationId
          if (!userId) return
          const content: ConnectionInput = {
            userId: userId,
            invitationId: unused,
            connectAt: new Date().toISOString(),
          }
          const promise = createConnection({ variables: { content } })
          promises.push(promise)
        }
      }
      await Promise.all(promises)
    }
  }

  return {
    migrationInvitaion,
  }
}
