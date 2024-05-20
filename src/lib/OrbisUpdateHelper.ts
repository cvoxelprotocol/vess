// import { Orbis } from '@orbisclub/orbis-sdk'
// import { getPublicClient } from '@wagmi/core'
// import { OrbisBaseResponse, OrbisProfileDetail } from './OrbisHelper'
// import { config } from './wagmi'

// export type UpdateOrbisProfileParam = {
//   did: string
//   content: OrbisProfileDetail
// }

// export const updateOrbisProfile = async (
//   params: UpdateOrbisProfileParam,
// ): Promise<OrbisBaseResponse> => {
//   if (!params.did) {
//     throw new Error('Failed to update Orbis Profile')
//   }
//   try {
//     const orbis = new Orbis()
//     const publicClient = getPublicClient(config) // publicClient is renamed method for getProvider by Wagmi
//     const orbisConnection = await orbis.isConnected()
//     if (!orbisConnection) {
//       await orbis.connect(publicClient, false)
//     }
//     return await orbis.updateProfile({ ...params.content })
//   } catch (error) {
//     throw error
//   }
// }
