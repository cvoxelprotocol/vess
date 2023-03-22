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
    const contents = getMigrationTargets(invitations)
    await issueCOnnectionOnBackground(contents)
  }

  const getMigrationTargets = (
    res: QueryResult<
      GetMyConnectionInvitaionsQuery,
      Exact<{
        [key: string]: never
      }>
    >,
  ) => {
    const edges = res.data?.viewer?.connectionInvitationList?.edges
    if (!edges || edges.length === 0) return []
    const invitationsForIssue = edges.filter((edge) => {
      const connections = edge?.node?.connection.edges
      return connections && connections.length === 1
    })
    const connectionsForIssue = invitationsForIssue.map((edge) => edge?.node?.connection)
    if (!connectionsForIssue || connectionsForIssue.length === 0) return []
    let targets: ConnectionInput[] = []
    for (const connections of connectionsForIssue) {
      if (connections?.edges) {
        for (const connection of connections?.edges) {
          const userId = connection?.node?.did.id
          const unused = connection?.node?.invitationId
          if (userId) {
            const content: ConnectionInput = {
              userId: userId,
              invitationId: unused,
              connectAt: new Date().toISOString(),
            }
            targets.push(content)
          }
        }
      }
    }
    return targets
  }

  const issueCOnnectionOnBackground = async (targets: ConnectionInput[]) => {
    if (targets.length === 0) return
    let promises: Promise<any>[] = []
    for (const content of targets) {
      const promise = createConnection({ variables: { content } })
      promises.push(promise)
    }

    await Promise.all(promises)
  }

  return {
    migrationInvitaion,
  }
}
