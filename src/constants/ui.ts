import { ICONS, IconsType } from '@/components/atom/Icons/Icon'

export const NAVIGATION_ITEM = {
  MEMBERSHIP: 'Membership',
  ATTENDANCE: 'Attendance',
  PROFILE: 'Profile',
  SETTING: 'Setting',
} as const

export type NavigationItemType = typeof NAVIGATION_ITEM[keyof typeof NAVIGATION_ITEM]

export type NAVIGATION_LIST_TYPE = {
  item: NavigationItemType
  icon: IconsType
  path: string
}

export const NAVIGATION_LIST: NAVIGATION_LIST_TYPE[] = [
  { item: NAVIGATION_ITEM.PROFILE, icon: ICONS.VOXEL, path: '/' },
  { item: NAVIGATION_ITEM.MEMBERSHIP, icon: ICONS.VOXELS, path: '/memberships' },
  { item: NAVIGATION_ITEM.ATTENDANCE, icon: ICONS.EVENT_ATTENDANCE, path: '/events' },
  { item: NAVIGATION_ITEM.SETTING, icon: ICONS.SETTING, path: '/setting' },
]

export const DefaultCardColor = {
  mainColor: '#242424',
  secondColor: '#505050',
  textColor: '#FFFFFF',
}
