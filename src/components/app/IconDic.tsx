import React, { FC } from 'react'
import type { IconContext as IconContextType } from 'react-icons'
import {
  PiHouseLineBold,
  PiHouseLineFill,
  PiUserBold,
  PiUserFill,
  PiGearBold,
  PiGearFill,
  PiPersonBold,
  PiPersonFill,
  PiFilmStripBold,
  PiFilmStripFill,
} from 'react-icons/pi'

/* Change ONLY THIS OBJECT to add new icon */
export const ICONS = {
  HOME: {
    default: 'PiHouseLineBold',
    filled: 'PiHouseLineFill',
  },
  PROFILE: {
    default: 'PiUserBold',
    filled: 'PiUserFill',
  },
  IDENTITY: {
    default: 'PiPersonBold',
    filled: 'PiPersonFill',
  },
  SETTING: {
    default: 'PiGearBold',
    filled: 'PiGearFill',
  },
  USER: {
    default: 'PiUserBold',
    filled: 'PiUserFill',
  },
  FEED: {
    default: 'PiPersonBold',
    filled: 'PiPersonFill',
  },
}

/* Do NOT change below */
type IconVariant = 'default' | 'filled'
export type IconsName = keyof typeof ICONS
export type IconVariants = Record<IconVariant, string>
export type IconsType = Record<IconsName, IconVariants>

export type IconDicProps = {
  icon: IconsName
  variant?: IconVariant
} & IconContextType

export const IconDic: FC<IconDicProps> = ({ icon, variant = 'default', ...props }) => {
  switch (icon) {
    case 'HOME':
      if (variant === 'default') return <PiHouseLineBold {...props} />
      else return <PiHouseLineFill {...props} />
    case 'PROFILE':
      if (variant === 'default') return <PiUserBold {...props} />
      else return <PiUserFill {...props} />
    case 'IDENTITY':
      if (variant === 'default') return <PiPersonBold {...props} />
      else return <PiPersonFill {...props} />
    case 'SETTING':
      if (variant === 'default') return <PiGearBold {...props} />
      else return <PiGearFill {...props} />
    case 'USER':
      if (variant === 'default') return <PiUserBold {...props} />
      else return <PiUserFill {...props} />
    case 'FEED':
      if (variant === 'default') return <PiFilmStripBold {...props} />
      else return <PiFilmStripFill {...props} />
  }
}
