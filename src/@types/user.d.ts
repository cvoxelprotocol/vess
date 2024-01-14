export interface CreateUserInfo {
  email?: string
  did?: string
}

export interface CreateUserWithGoogleInfo extends CreateUserInfo {
  idToken: string
  googleUserId?: string
  accessToken?: string
  refreshToken?: string
}
