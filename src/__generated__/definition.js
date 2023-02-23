// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    ConnectionInvitation: {
      id: 'kjzl6hvfrbw6carkzq84qaas2vgkn65trdzkcazu0zqunludos2hponng1pko4k',
      accountRelation: { type: 'list' },
    },
    Connection: {
      id: 'kjzl6hvfrbw6c9ktao2y3stc3s2502iz5gcrxejo67nus6j1evy3yia9ya4uhgg',
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
          model: 'kjzl6hvfrbw6c9ktao2y3stc3s2502iz5gcrxejo67nus6j1evy3yia9ya4uhgg',
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
          model: 'kjzl6hvfrbw6carkzq84qaas2vgkn65trdzkcazu0zqunludos2hponng1pko4k',
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
