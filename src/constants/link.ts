import { ICONS, IconsType } from '@/components/atom/Icons/Icon'

export const LINK_ITEM = ['twitter', 'github', 'discord', 'telegram', 'mail', 'more'] as const
export type LinkTypes = typeof LINK_ITEM[number]

export const isLinkTypeCandidate = (str?: string): str is LinkTypes => {
  return LINK_ITEM.some((v) => v === str)
}

export const getLinkIcon = (linkType?: string): IconsType => {
  if (isLinkTypeCandidate(linkType)) {
    if (linkType === 'twitter') return ICONS.TWITTER
    if (linkType === 'github') return ICONS.GITHUB
    if (linkType === 'discord') return ICONS.DISCORD
    if (linkType === 'telegram') return ICONS.TELEGRAM
    if (linkType === 'mail') return ICONS.MAIL
    if (linkType === 'more') return ICONS.POINTS
  }
  return ICONS.CHAIN
}
