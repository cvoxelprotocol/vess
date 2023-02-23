// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    ConnectionInvitation: {
      id: 'kjzl6hvfrbw6c63o5mc8rh4csl2llebj9g3xzjl1bztdzw1purnhuhiggic6eqp',
      accountRelation: { type: 'list' },
    },
    Connection: {
      id: 'kjzl6hvfrbw6cb0yxbqouotx4ch9ix5hj5m4ofux3lbmyynp7b9d0kbrw0as5br',
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
          model: 'kjzl6hvfrbw6cb0yxbqouotx4ch9ix5hj5m4ofux3lbmyynp7b9d0kbrw0as5br',
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
          model: 'kjzl6hvfrbw6c63o5mc8rh4csl2llebj9g3xzjl1bztdzw1purnhuhiggic6eqp',
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
