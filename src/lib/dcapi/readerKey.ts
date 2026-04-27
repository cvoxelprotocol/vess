import { base64urlDecode } from './base64url'

export interface ReaderKey {
  privateKey: CryptoKey
  publicKey: CryptoKey
  publicKeyXY: { x: Uint8Array; y: Uint8Array }
}

// HPKE 応答暗号化用のリーダーエフェメラル鍵 (P-256)。
// レスポンス本体はクライアントでは復号せず、暗号文のまま表示する想定。
export const generateReaderKey = async (): Promise<ReaderKey> => {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  )
  const jwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  if (!jwk.x || !jwk.y) throw new Error('JWK に x / y がありません')

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
    publicKeyXY: { x: base64urlDecode(jwk.x), y: base64urlDecode(jwk.y) },
  }
}

export const generateNonce = (length = 16): Uint8Array => {
  const nonce = new Uint8Array(length)
  crypto.getRandomValues(nonce)
  return nonce
}
