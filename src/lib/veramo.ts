import { isJWS } from '@sphereon/oid4vci-common'
import { getDidJwkResolver } from '@sphereon/ssi-sdk-ext.did-resolver-jwk'
import { createAgent } from '@veramo/core'
import type { TAgent, IResolver, ICredentialPlugin } from '@veramo/core-types'
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712'
import {
  CredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
  VeramoEd25519Signature2018,
  VeramoEd25519Signature2020,
  VeramoJsonWebSignature2020,
} from '@veramo/credential-ld'
import { CredentialPlugin } from '@veramo/credential-w3c'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as pkhDidResolver } from 'pkh-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

export class VeramoAgent {
  private static instance: TAgent<IResolver & ICredentialPlugin>

  private constructor() {}

  public static getAgent(): TAgent<IResolver & ICredentialPlugin> {
    if (!VeramoAgent.instance) {
      VeramoAgent.instance = createAgent<IResolver & ICredentialPlugin>({
        plugins: [
          new DIDResolverPlugin({
            resolver: new Resolver({
              ...pkhDidResolver(),
              ...webDidResolver(),
              ...getDidJwkResolver(),
            }),
          }),
          new CredentialPlugin(),
          new CredentialIssuerEIP712(),
          new CredentialIssuerLD({
            contextMaps: [LdDefaultContexts],
            suites: [
              new VeramoEcdsaSecp256k1RecoverySignature2020(),
              new VeramoJsonWebSignature2020(),
              new VeramoEd25519Signature2020(),
              new VeramoEd25519Signature2018(),
            ],
          }),
        ],
      })
    }
    return VeramoAgent.instance
  }
}

export const verifyCredential = async (vc: any, isJWT: boolean = false) => {
  const veramo = VeramoAgent.getAgent()
  const credential = !isJWT ? JSON.parse(vc) : vc
  const veramoRes = await veramo.verifyCredential({
    credential: credential,
    fetchRemoteContexts: true,
  })
  return veramoRes
}
