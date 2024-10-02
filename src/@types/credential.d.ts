export type WorkspaceType = {
  id: string
  address: string
  ceramicId: string
  name: string
  desc?: string
  icon?: string
  primaryColor?: string
  useCompose?: boolean
}

export type CredentialType = {
  id: string
  name: string
}

export type VSCredentialItem = {
  id: string
  ceramicId: string | null
  organizationId: string | null
  credentialTypeId: string
  collectionId: string
  title: string
  description: string | null
  link: string | null
  icon: string | null
  image: string | null
  primaryColor: string | null
  startDate: Date
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export type OBCredentialItem = {
  id: string
  ceramicId: string | undefined
  credentialTypeId: string
  collectionId: string
  organizationId: string | null
  name: string
  description: string
  criteria: string
  image: string
  bakedImage?: string
  achievementType?: string
  activityStartDate?: string
  activityEndDate?: string
  validFrom?: string
  validUntil?: string
  createdAt: string
  updatedAt: string
}

export type CredentialStruct = {
  id: string
  organizationId: string
  credentialTypeId: string
  issuerDid: string
  holderDid: string
  ceramicId: string
  groupCeramicId: string
  plainCredential: string
  createdAt: Date
  updatedAt: Date
  credentialType?: CredentialType
  credentialItem?: VSCredentialItem
  credentialItemOB?: OBCredentialItem
  organization?: WorkspaceType
  user?: VSUser
  hideFromPublic?: boolean
}

export type CredentialWithHolderUser = CredentialStruct & {
  holder?: VSUser | null
}

export type CredentialResponse = {
  data: CredentialWithHolderUser
}

export type CredentialsResponse = {
  data: CredentialStruct[]
}

export type WithCeramicId<T> = T & {
  ceramicId: string
  credentialType: CredentialType
}

export type BaseCredential = {
  id: string
  issuer: Issuer
  credentialSubject: CredentialSubject
  type: string[]
  '@context': string[]
  credentialSchema?: any
  issuanceDate?: string
  expirationDate?: string
  proof: any
  [x: string]: any
}

type Issuer = {
  id: string
}

type CredentialSubject = {
  id: string
  [x: string]: any
}

export const CredTypeUnion = [
  'membership',
  'attendance',
  'certificate',
  'default',
  'openbadge',
] as const
export type CredType = typeof CredTypeUnion[number]
export type CredTypeProps = {
  type?: CredType
}
export type CredItemInput = {
  title: string
  description?: string
  startDateInput?: Date
  endDateInput?: Date
  primaryColor: string
  link?: string
  image?: string
  tags?: string[]
  customImage?: File | null
  customImagePreview?: string
}

type CredItemRequest = CredItemInput & {
  startDate: string
  endDate: string
  collectionId: string
  credentialTypeName: string
  saveCompose: boolean
  icon?: string
}

export type OrganizationType = {
  address: string
  ceramicId: string | null
  id: string
  keyId: string
  name: string
  desc: string | null
  icon: string | null
  primaryColor: string | null
  useCompose: boolean | null
}

export type VSUser = {
  id: string
  name: string | null
  avatar: string | null
  description: string | null
  did: string | null
  email: string | null
  vessId: string | null
  createdAt: Date
  updatedAt: Date
  profiles?: Profile[]
  socialLink?: SocialLink[]
}

export type Profile = {
  id: string
  providerUserId: string
  did: string | null
  email: string | null
  userId: string
  providerId: string
  provider?: Provider
}

export type Provider = {
  id: string
  name: string
}

export type GetCollectionResponse = {
  id: string
  organizationId: string
  ceramicId: string
  name: string
  parentId?: string
  parent?: GetCollectionResponse
  credentialType: string
  children?: GetCollectionResponse[]
  createdAt: string
  updatedAt: string
}

export type VSCredential = {
  id: string
  organizationId: string
  credentialTypeId: string | null
  issuerDid: string
  holderDid: string
  ceramicId: string | null
  plainCredential: string
  createdAt: Date
  updatedAt: Date
  credentialItemId: string
  holder: VSUser
  credentialType?: CredentialType | null
  hideFromPublic?: boolean
}

type Tag = {
  id: string
  name: string
}

type Tagged = {
  tag: Tag
}

export type VSCredentialItemFromBuckup = {
  id: string
  ceramicId: string | undefined
  credentialTypeId?: string
  credentialType?: CredentialType
  collectionId?: string
  organizationId?: string | null
  title: string
  description: string | null
  icon: string | null
  image: string | null
  primaryColor: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
  organization?: OrganizationType | null
  Tagged: Tagged[]
  credentials?: VSCredential[]
  userId?: string | null
  user?: VSUser
  sticker?: Sticker[]
  post?: Post[]
  credentialsWithHolder?: CredentialWithHolder[]
  holderContents?: HolderContent[]
}

export type OBCredentialItemFromBackup = {
  id: string
  ceramicId: string | undefined
  credentialTypeId?: string
  credentialType?: CredentialType
  collectionId?: string
  organizationId?: string | null
  name: string
  description: string
  criteria: string
  image: string
  bakedImage?: string
  achievementType?: string
  activityStartDate?: string
  activityEndDate?: string
  validFrom?: string
  validUntil?: string
  createdAt: string
  updatedAt: string
  organization?: OrganizationType | null
  credentials?: OBCredential[]
  userId?: string | null
  user?: VSUser
  sticker?: Sticker[]
  post?: Post[]
  credentialsWithHolder?: CredentialWithHolder[]
  holderContents?: HolderContent[]
}

export interface CredentialWithHolder extends VSCredential {
  holder: VSUser | null
}

export type HolderContent = {
  id: string
  credentialItemId: string | null
  type: string | null
  content: string
}

export type Sticker = {
  id: string
  credentialItemId: string
  image: string
}

export type GetCollectionItemResponse = GetCollectionResponse & {
  items: VSCredentialItemFromBuckup[]
}

export interface IIssueCredentialItemByUserRequest {
  userId: string
  title: string
  description?: string
  icon?: string
  image?: string
  startDate?: string
  endDate?: string
  primaryColor?: string
  tags?: string[]
  link?: string
  credentialTypeName?: string
  saveCompose: boolean
  expirationDate?: string
  validDuraion?: string
  collectionId?: string
  stickers?: string[]
}

export interface ICreateHolderContentsRequest {
  itemId: string
  userId: string
  holderContentsData: any[]
}

export interface SetVisibleRequest {
  credentialId: string
  hideFromPublic: boolean
}
