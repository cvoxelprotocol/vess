import React, { FC } from 'react'
import type { IconContext as IconContextType } from 'react-icons'
import {
  PiHouseLineBold,
  PiHouseLineFill,
  PiUserBold,
  PiUserFill,
  PiGearBold,
  PiGearFill,
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
  SETTING: {
    default: 'PiGearBold',
    filled: 'PiGearFill',
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
    case 'SETTING':
      if (variant === 'default') return <PiGearBold {...props} />
      else return <PiGearFill {...props} />
  }
}
