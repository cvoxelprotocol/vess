import { ICONS, IconsType } from '@/components/atom/Icons/Icon'

export type LinkTypes = 'twitter' | 'github' | 'discord' | 'url' | string

export const getLinkIcon = (linkType?: string): IconsType => {
  if (linkType === 'twitter') return ICONS.TWITTER
  if (linkType === 'github') return ICONS.GITHUB
  if (linkType === 'discord') return ICONS.DISCORD
  return ICONS.CHAIN
}
