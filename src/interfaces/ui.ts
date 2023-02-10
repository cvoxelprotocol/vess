import type { MembershipSubjectWithOrg } from 'vess-sdk'

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