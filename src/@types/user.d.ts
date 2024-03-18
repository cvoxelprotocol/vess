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
