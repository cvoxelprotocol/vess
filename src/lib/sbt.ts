import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import type { NFT } from '@thirdweb-dev/sdk'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

const DOT_JP_CONTRACT = '0x98e10e57535553b5d789fcee15154b51b26c6599'

export type CertVCWithSBT = {
  contractAddress: string
  nft: NFT
  ceramicId?: string
}

export const fetchCertifications = async (did?: string) => {
  const nfts = await fetchCertSBT(did)
  if (!nfts) return []
  return nfts.map((nft) => {
    return { nft, contractAddress: DOT_JP_CONTRACT } as CertVCWithSBT
  })
}

export const fetchCertification = async (
  contractAddress: string,
  tokenId: string,
): Promise<CertVCWithSBT | null> => {
  if (contractAddress.toLowerCase() !== DOT_JP_CONTRACT.toLowerCase()) {
    return null
  }
  const sdk = new ThirdwebSDK('mumbai')
  const contract = await sdk.getContract(DOT_JP_CONTRACT)
  const nft = await contract.erc721.get(tokenId)
  const id = getCeramicIdFromSBT(nft)
  if (!nft || !id) {
    return null
  }
  return {
    nft,
    contractAddress: DOT_JP_CONTRACT,
    ceramicId: id,
  }
}

const fetchCertSBT = async (did?: string) => {
  if (!did) return null
  const sdk = new ThirdwebSDK('mumbai')
  const contract = await sdk.getContract(DOT_JP_CONTRACT)
  const nfts = await contract.erc721.getOwned(getAddressFromPkhForWagmi(did))
  return nfts
}

export const getCeramicIdFromSBT = (sbt: any): string | undefined => {
  if (!(sbt && sbt.metadata?.attributes)) return
  const ceramicIdObj = sbt.metadata?.attributes.find(
    (a: { trait_type: string }) => a.trait_type === 'ceramicId',
  )
  return ceramicIdObj?.value || undefined
}
