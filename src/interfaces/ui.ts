import type { SelfClaimedMembershipSubject, WithCeramicId } from 'vess-sdk'
import { BaseCredential } from '@/@types/credential'

export type VoxelVisType = {
  color: string
  opacity: number
  lattice: boolean
  scale?: number
}

export type VoxelThree = VoxelVisType & {
  position: THREE.Vector3
  offset?: THREE.Vector3
}

export type sortedMembership = {
  item?: WithCeramicId<BaseCredential>
  selfClaim?: WithCeramicId<SelfClaimedMembershipSubject>
  startDate?: string
  endDate?: string
}
