import { getVESSKit } from 'vess-kit-web'
import { VessForKMS, getVESSForKMS } from 'vess-sdk'
import { CERAMIC_NETWORK } from '@/constants/common'

export const getOldVESS = (): VessForKMS => {
  return getVESSForKMS(CERAMIC_NETWORK !== 'mainnet')
}

export const getVESS = () => {
  return getVESSKit(CERAMIC_NETWORK !== 'mainnet')
}
