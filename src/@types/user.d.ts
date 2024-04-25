import { VSCredential } from './credential'

export interface CreateUserInfo {
  email?: string
  did?: string
}

export interface UpdateUserInfo {
  did: string
  name?: string
  avatar?: string
  description?: string
}

export interface UserAuthInfo {
  did: string
}

export interface CreateUserWithGoogleInfo extends CreateUserInfo {
  idToken: string
  providerUserId?: string
  accessToken?: string
  refreshToken?: string
}

export interface AddAvatarRequest {
  did: string
  sourcePhotoUrl: string
  canvasJson: CanvasJson
  isProfilePhoto: boolean
  credentialIds: string[]
  avatarUrl: string
}

export interface UpdateAvatarRequest {
  canvasId: string
  sourcePhotoUrl: string
  canvasJson: CanvasJson
  isProfilePhoto: boolean
  credentialIds: string[]
  avatarUrl: string
}

export type Avatar = {
  id: string
  userId: string
  sourcePhotoUrl: string
  avatarUrl: string
  canvasJson: CanvasJson
  isProfilePhoto: boolean
  editDate: Date
  canvasCredentials?: CanvasCredential[]
}

export type CanvasCredential = {
  canvasId: string
  credentialId: string
  credential: VSCredential
}

export type CanvasJson = {
  stageWidth: number
  stageHeight: number
  baseImage: vcImage
  vcImages: vcImage[]
}
