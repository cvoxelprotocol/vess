import { VSCredential, VSCredentialItem, VSUser } from './credential'

export interface CreateUserInfo {
  email?: string
  did?: string
}
export interface UpdateUserInfo {
  did: string
  name?: string
  avatar?: string
  description?: string
  vessId?: string
  socialLink?: (Partial<SocialLink> & { title: string; url: string })[]
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
  credential: VSCredentialWithItem
}

export type VSCredentialWithItem = VSCredential & {
  credentialItem?: VSCredentialItem
}

export type CanvasJson = {
  stageWidth: number
  stageHeight: number
  baseImage: vcImage
  vcImages: vcImage[]
}

export type VSUserResponse = {
  user: VSUser | null
}

export type Post = {
  id: string
  userId: string
  text: string | null
  image: string | null
  credentialItemId: string | null
  credentialItem: VSCredentialItem | null
  canvasId: string | null
  canvas: Avatar | null
  createdAt: Date
  updatedAt: Date
}

export type PostWithUser = Post & { user?: VSUser }

export type PostFeed = VSCredentialItem & {
  post: PostWithUser[]
}

export type SocialLink = {
  id: string
  userId: string | null
  organizationId: string | null
  title: string
  url: string
  displayLink: string | null
}

export type AddPostRequest = {
  userId: string
  text?: string
  image?: string
  credentialItemId?: string
  canvasId?: string
}
