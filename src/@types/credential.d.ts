export type CredentialType = {
  id: string
  name: string
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
  credentialTypeId: string
  issuerDid: string
  holderDid: string
  ceramicId: string | null
  plainCredential: string
  createdAt: Date
  updatedAt: Date
}

export type VSCredentialRelation = {
  credentialId: string
  itemId: string
  credential: VSCredential
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
  VSCredentialRelation: VSCredentialRelation[]
  organization?: OrganizationType
}

export type GetCollectionItemResponse = GetCollectionResponse & {
  items: VSCredentialItemFromBuckup[]
}
