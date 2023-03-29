// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    ConnectionInvitation: {
      id: 'kjzl6hvfrbw6c9b91yjiwj0lsabmu0xp8joqpdf7kf3hhzwrgpqaxoq9bfs7nfl',
      accountRelation: { type: 'list' },
    },
    Connection: {
      id: 'kjzl6hvfrbw6ca9dikl6yftd0zj905rgnmj1b82lqwrf1o5lq5oq3sefva4svzs',
      accountRelation: { type: 'list' },
    },
  },
  objects: {
    ConnectionInvitation: {
      type: { type: 'string', required: false },
      status: { type: 'string', required: false },
      eventId: { type: 'id', required: false },
      greeting: { type: 'string', required: true },
      location: { type: 'string', required: false },
      response: { type: 'string', required: false },
      did: { type: 'view', viewType: 'documentAccount' },
      connection: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6ca9dikl6yftd0zj905rgnmj1b82lqwrf1o5lq5oq3sefva4svzs',
          property: 'invitationId',
        },
      },
    },
    Connection: {
      userId: { type: 'id', required: true },
      connectAt: { type: 'datetime', required: false },
      invitationId: { type: 'streamid', required: true },
      did: { type: 'view', viewType: 'documentAccount' },
      invitaion: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c9b91yjiwj0lsabmu0xp8joqpdf7kf3hhzwrgpqaxoq9bfs7nfl',
          property: 'invitationId',
        },
      },
    },
  },
  enums: {},
  accountData: {
    connectionInvitationList: {
      type: 'connection',
      name: 'ConnectionInvitation',
    },
    connectionList: { type: 'connection', name: 'Connection' },
  },
}
