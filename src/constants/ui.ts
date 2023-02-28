import { ICONS, IconsType } from '@/components/atom/Icons/Icon'

export const NAVIGATION_ITEM = {
  HOME: 'Home',
  PROFILE: 'Profile',
  CLAIM: 'Self Claim',
  WAVES: 'Waves',
  OTHER: 'Other',
} as const

export type NavigationItemType = typeof NAVIGATION_ITEM[keyof typeof NAVIGATION_ITEM]

export type NAVIGATION_LIST_TYPE = {
  item: NavigationItemType
  icon: IconsType
  path: string
}

export const NAVIGATION_LIST: NAVIGATION_LIST_TYPE[] = [
  { item: NAVIGATION_ITEM.HOME, icon: ICONS.HOME, path: '/' },
  { item: NAVIGATION_ITEM.WAVES, icon: ICONS.WAVE, path: '/connection/list' },
  { item: NAVIGATION_ITEM.PROFILE, icon: ICONS.ACCOUNT, path: '/did' },
  // { item: NAVIGATION_ITEM.CLAIM, icon: ICONS.VOXEL, path: '/claim' },
]

export const getNaviItem = (path: string, did?: string): NAVIGATION_LIST_TYPE => {
  if (path === '/')
    return {
      item: NAVIGATION_ITEM.HOME,
      icon: ICONS.HOME,
      path: '/',
    }
  if (did && path === `/did/${did}`) {
    return {
      item: NAVIGATION_ITEM.PROFILE,
      icon: ICONS.ACCOUNT,
      path: `/did/${did}`,
    }
  }
  return (
    NAVIGATION_LIST.find((n) => n.path !== '/' && n.path !== '/did' && path.startsWith(n.path)) || {
      item: NAVIGATION_ITEM.OTHER,
      icon: ICONS.HOME,
      path: '',
    }
  )
}

export const DefaultCardColor = {
  mainColor: '#242424',
  secondColor: '#505050',
  textColor: '#FFFFFF',
}

export type ProfileTabType = 'Attendances' | 'Tasks' | 'Connections'
