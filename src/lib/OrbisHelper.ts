import { Orbis } from '@orbisclub/orbis-sdk'

export type OrbisBaseResponse =
  | {
      status: number
      doc: any
      result: string
      error?: undefined
    }
  | {
      status: number
      error: any
      result: string
      doc?: undefined
    }

export type OrbisProfile = {
  did: string
  details: OrbisDetails
  count_followers: number
  count_following: number
  last_activity_timestamp: number
}

type OrbisDetails = {
  profile: OrbisProfileDetail
  did: string
}

export type OrbisProfileDetail = {
  username: string
  description: string
  pfp: string
}

export type UpdateOrbisProfileParam = {
  did: string
  content: OrbisProfileDetail
}

export class OrbisHelper {
  orbis = undefined as Orbis | undefined

  constructor() {
    this.orbis = new Orbis()
  }

  async fetchOrbisProfile(did?: string): Promise<OrbisProfileDetail | null> {
    if (!did || !this.orbis) return null
    const res = await this.orbis.getProfile(did.toLowerCase())
    const profile: OrbisProfile = res.data as OrbisProfile
    if (!profile || !profile.details || !profile.details.profile) return null
    return profile.details.profile
  }

  async updateOrbisProfile(params: UpdateOrbisProfileParam): Promise<OrbisBaseResponse> {
    if (!params.did || !this.orbis) {
      throw new Error('Failed to update Orbis Profile')
    }
    try {
      const orbisConnection = await this.orbis.isConnected()
      if (!orbisConnection) {
        await this.orbis.connect(window.ethereum, false)
      }
      return await this.orbis.updateProfile({ ...params.content })
    } catch (error) {
      throw error
    }
  }
}

let orbisHelper: OrbisHelper

export const getOrbisHelper = (): OrbisHelper => {
  if (orbisHelper) {
    return orbisHelper
  }
  orbisHelper = new OrbisHelper()
  return orbisHelper
}
