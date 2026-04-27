export interface ParsedCredentialOffer {
  credentialOffer?: Record<string, unknown>
  credentialOfferUri?: string
}

// `openid-credential-offer://?credential_offer=...` または
// `openid-credential-offer://?credential_offer_uri=...` をパースする。
// haip:// など他スキームでも query 抽出ロジックは同じなので緩く扱う。
export const parseCredentialOfferUri = (input: string): ParsedCredentialOffer => {
  const trimmed = input.trim()
  if (!trimmed) throw new Error('Offer URI が空です')

  const queryIndex = trimmed.indexOf('?')
  const queryString = queryIndex >= 0 ? trimmed.slice(queryIndex + 1) : trimmed
  const params = new URLSearchParams(queryString)

  const offerJson = params.get('credential_offer')
  const offerUri = params.get('credential_offer_uri')

  if (!offerJson && !offerUri) {
    throw new Error('credential_offer または credential_offer_uri が見つかりません')
  }

  if (offerJson) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(offerJson)
    } catch (e) {
      throw new Error(`credential_offer の JSON パースに失敗: ${(e as Error).message}`)
    }
    return { credentialOffer: parsed }
  }

  return { credentialOfferUri: offerUri ?? undefined }
}
