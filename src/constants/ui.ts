import type { IconsName, IconVariants } from '@/components/app/IconDic'

export type NavigationItemValue = 'HOME' | 'PROFILE' | 'SETTING'

export type NavigationItemType = {
  id: NavigationItemValue
  label: string
  icon: IconsName
  path: string
  external?: boolean
}

export const NAVIGATION_LIST: NavigationItemType[] = [
  {
    id: 'HOME',
    label: 'ホーム',
    icon: 'HOME',
    path: '/did',
  },
  // {
  //   id: 'PROFILE',
  //   label: 'プロフィール',
  //   icon: 'PROFILE',
  //   path: '/did',
  // },
  // {
  //   id: 'SETTING',
  //   label: '設定',
  //   icon: 'SETTING',
  //   path: '/setting',
  // },
]
