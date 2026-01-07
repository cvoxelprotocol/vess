import type { TAgent, IResolver, ICredentialPlugin } from '@veramo/core-types'

let agentInstance: TAgent<IResolver & ICredentialPlugin> | null = null

const getAgent = async (): Promise<TAgent<IResolver & ICredentialPlugin>> => {
  if (agentInstance) {
    return agentInstance
  }

  const [
    { createAgent },
    { CredentialIssuerEIP712 },
    {
      CredentialIssuerLD,
      LdDefaultContexts,
      VeramoEcdsaSecp256k1RecoverySignature2020,
      VeramoEd25519Signature2018,
      VeramoEd25519Signature2020,
      VeramoJsonWebSignature2020,
    },
    { CredentialPlugin },
    { DIDResolverPlugin },
    { Resolver },
    pkhResolver,
    webResolver,
  ] = await Promise.all([
    import('@veramo/core'),
    import('@veramo/credential-eip712'),
    import('@veramo/credential-ld'),
    import('@veramo/credential-w3c'),
    import('@veramo/did-resolver'),
    import('did-resolver'),
    import('pkh-did-resolver'),
    import('web-did-resolver'),
  ])

  agentInstance = createAgent<IResolver & ICredentialPlugin>({
    plugins: [
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...pkhResolver.getResolver(),
          ...webResolver.getResolver(),
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

  return agentInstance
}

export const verifyCredential = async (vc: string) => {
  if (typeof window === 'undefined') {
    return { verified: false }
  }

  const veramo = await getAgent()
  const veramoRes = await veramo.verifyCredential({
    credential: JSON.parse(vc),
  })
  console.log(JSON.stringify(veramoRes, null, 2))
  return veramoRes
}
