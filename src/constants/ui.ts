import type { IconsName, IconVariants } from '@/components/app/IconDic'

export type NavigationItemValue = 'HOME' | 'PROFILE' | 'SETTING' | 'IDENTITY' | 'USER'

export type NavigationItemType = {
  id: NavigationItemValue
  label: string
  icon: IconsName
  path: string
  external?: boolean
}

export const NAVIGATION_LIST: NavigationItemType[] = [
  // Exception
  {
    id: 'PROFILE',
    label: '',
    icon: 'PROFILE',
    path: '/',
  },
  // {
  //   id: 'HOME',
  //   label: 'ホーム',
  //   icon: 'HOME',
  //   path: '/',
  // },
  {
    id: 'IDENTITY',
    label: 'アイデンティティ',
    icon: 'IDENTITY',
    path: '/identity',
  },
  // {
  //   id: 'SETTING',
  //   label: '設定',
  //   icon: 'SETTING',
  //   path: '/setting',
  // },
]
