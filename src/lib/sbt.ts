import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import type { NFT } from '@thirdweb-dev/sdk'
import { getAddressFromPkhForWagmi } from '@/utils/objectUtil'

// set SBT contract address
const DOT_JP_CONTRACT = '0x868af4106aeFDf7EddC3DbF98B0ff1d21D0f3347'

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
  try {
    if (contractAddress.toLowerCase() !== DOT_JP_CONTRACT.toLowerCase()) {
      return null
    }
    const chain = process.env.NEXT_PUBLIC_OPEASEA_CHAIN || 'polygon'
    const sdk = new ThirdwebSDK(chain)
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
  } catch (error) {
    return null
  }
}

const fetchCertSBT = async (did?: string) => {
  if (!did) return null
  const chain = process.env.NEXT_PUBLIC_OPEASEA_CHAIN || 'polygon'
  const sdk = new ThirdwebSDK(chain)
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
