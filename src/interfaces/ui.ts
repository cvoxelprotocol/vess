import type {
  MembershipSubjectWithOrg,
  SelfClaimedMembershipSubject,
  WithCeramicId,
} from 'vess-sdk'

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

export interface DisplayMembership extends MembershipSubjectWithOrg {
  roles: string[]
}

export type sortedMembership = {
  item?: DisplayMembership
  selfClaim?: WithCeramicId<SelfClaimedMembershipSubject>
  startDate?: string
  endDate?: string
}
