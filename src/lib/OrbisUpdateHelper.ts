import { Orbis } from '@orbisclub/orbis-sdk'
import { OrbisBaseResponse, OrbisProfileDetail } from './OrbisHelper'

export type UpdateOrbisProfileParam = {
  did: string
  content: OrbisProfileDetail
}

export const updateOrbisProfile = async (
  params: UpdateOrbisProfileParam,
): Promise<OrbisBaseResponse> => {
  if (!params.did) {
    throw new Error('Failed to update Orbis Profile')
  }
  try {
    const orbis = new Orbis()
    const orbisConnection = await orbis.isConnected()
    if (!orbisConnection) {
      await orbis.connect(window.ethereum, false)
    }
    return await orbis.updateProfile({ ...params.content })
  } catch (error) {
    throw error
  }
}
