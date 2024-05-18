export type ConnectNetwork = 'mainnet' | 'testnet-clay' | 'dev-unstable'
const CERAMIC_NETWORK: ConnectNetwork =
  process.env.NEXT_PUBLIC_CERAMIC_ENV === 'mainnet' ? 'mainnet' : 'testnet-clay'

export const isProd = () => {
  return CERAMIC_NETWORK == 'mainnet'
}

export const X_URL = 'https://x.com/'
