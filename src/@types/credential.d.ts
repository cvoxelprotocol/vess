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
