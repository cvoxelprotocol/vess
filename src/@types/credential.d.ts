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
  ceramicId: string | undifined
  organizationId: string | undifined
  credentialTypeId: string
  collectionId: string
  title: string
  description: string | undifined
  link: string | undifined
  icon: string | undifined
  image: string | undifined
  primaryColor: string | undifined
  startDate: Date
  endDate: Date | undifined
  createdAt: Date
  updatedAt: Date
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
  organization?: WorkspaceType
  user?: VSUser
  hideFromPublic?: boolean
}

export type CredentialWithHolderUser = CredentialStruct & {
  holder?: VSUser | undifined
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

export const CredTypeUnion = ['membership', 'attendance', 'certificate', 'default'] as const
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
  ceramicId: string | undefined
  id: string
  keyId: string
  name: string
  desc: string | undefined
  icon: string | undefined
  primaryColor: string | undifined
  useCompose: boolean | undifined
}

export type VSUser = {
  id: string
  name: string | undefined
  avatar: string | undefined
  description: string | undefined
  did: string | undefined
  email: string | undefined
  vessId: string | undefined
  createdAt: Date
  updatedAt: Date
  profiles?: Profile[]
  socialLink?: SocialLink[]
  post?: Post[]
  userDIDs?: UserDID[]
}

export type Profile = {
  id: string
  providerUserId: string
  did: string | undefined
  email: string | undefined
  userId: string
  providerId: string
  provider?: Provider
}

export type UserDID = {
  id: string
  userId: string
  didType: string
  didValue: string
  createdAt: Date
  updatedAt: Date
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
  organizationId?: string | undifined
  title: string
  description: string | undifined
  icon: string | undifined
  image: string | undifined
  primaryColor: string | undifined
  startDate: string | undifined
  endDate: string | undifined
  createdAt: string
  updatedAt: string
  organization?: OrganizationType | undifined
  Tagged: Tagged[]
  credentials?: VSCredential[]
  userId?: string | undifined
  user?: VSUser
  sticker?: Sticker[]
  post?: Post[]
  credentialsWithHolder?: CredentialWithHolder[]
  holderContents?: HolderContent[]
}

export type Post = {
  id: string
  userId: string
  text: string | undifined
  image: string | undifined
  createdAt: Date
  updatedAt: Date
  credentialItemId: string | undifined
  canvasId: string | undifined
}

export interface CredentialWithHolder extends VSCredential {
  holder: VSUser | undifined
}

export type HolderContent = {
  id: string
  credentialItemId: string | undifined
  type: string | undifined
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
