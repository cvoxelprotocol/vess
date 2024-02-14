import { getVESSKit } from 'vess-kit-web'
import { isProd } from '@/constants/common'

export const getVESSService = () => {
  return getVESSKit(!isProd())
}
