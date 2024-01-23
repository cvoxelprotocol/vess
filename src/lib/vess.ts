import { getVESSKit } from 'vess-kit-web'
import { VessForKMS, getVESSForKMS } from 'vess-sdk'
import { isProd } from '@/constants/common'

export const getOldVESS = (): VessForKMS => {
  return getVESSForKMS(!isProd())
}

export const getVESSService = () => {
  return getVESSKit(!isProd())
}
