import type { IconsName, IconVariants } from '@/components/app/IconDic'

export type NavigationItemValue = 'HOME' | 'PROFILE' | 'SETTING' | 'IDENTITY' | 'USER' | 'FEED'

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
  {
    id: 'FEED',
    label: 'フィード',
    icon: 'IDENTITY',
    path: '/post/feed/all',
  },
  // {
  //   id: 'SETTING',
  //   label: '設定',
  //   icon: 'SETTING',
  //   path: '/setting',
  // },
]

export const SCALABLY_VC_IDS = ['3288bc77-724a-4325-9c95-5f226b8973dd']
