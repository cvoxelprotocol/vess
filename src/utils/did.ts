export const ETH_CHAIN_ID = `eip155:1:`

export const getPkhDIDFromAddress = (address: string): string => {
  if (isEthereumAddress(address)) {
    return `did:pkh:${ETH_CHAIN_ID}${address.toLowerCase()}`
  } else {
    return address.toLowerCase()
  }
}
export const getAddressFromPkh = (did: string): string => {
  if (isDIDstring(did)) {
    return did.replace(`did:pkh:${ETH_CHAIN_ID}`, '')
  } else {
    return did
  }
}

export function isEthereumAddress(address: string): boolean {
  return /^0x[0-9a-f]{40}$/i.test(address)
}

export const isDIDstring = (did: string): boolean => {
  const didRegex = /^did:([A-Za-z0-9]+):([A-Za-z0-9.\-:_]+)$/
  return didRegex.test(did)
}

export function formatDID(did: string, maxLength = 20): string {
  if (maxLength < 12) {
    maxLength = 12
  }
  const half = Math.floor(maxLength / 2)
  const remaining = half - 3 - maxLength
  return did.length <= maxLength ? did : `${did.slice(0, half)}...${did.slice(remaining)}`
}
