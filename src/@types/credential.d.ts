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
  credentialType: CredentialType
  credentialItem?: VSCredentialItem
  organization?: WorkspaceType
}

export type CredentialResponse = {
  data: CredentialStruct
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
  ceramicId: string
  id: string
  keyId: string
  name: string
}

export type VSUser = {
  id: string
  name: string | null
  avatar: string | null
  description: string | null
  did: string | null
  email: string | null
  createdAt: Date
  updatedAt: Date
  profiles?: Profile[]
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
  credentialTypeId: string
  credentialType: CredentialType
  collectionId: string
  organizationId: string | null
  title: string
  description: string | null
  icon: string | null
  image: string | null
  primaryColor: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
  organization?: OrganizationType
  Tagged: Tagged[]
  credentials?: VSCredential[]
}

export type GetCollectionItemResponse = GetCollectionResponse & {
  items: VSCredentialItemFromBuckup[]
}
