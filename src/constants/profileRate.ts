import type { BusinessProfile } from 'vess-sdk'
import { DisplayProfile } from '@/@types'
import { OrbisProfileDetail } from '@/lib/OrbisHelper'

type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : K]: T[K]
}

export type ParamList = keyof KnownKeys<BusinessProfile & DisplayProfile>

type RateSchemeType = {
  [param in ParamList]?: {
    rate: number
    done: boolean
  }
}

export type RateChangedFlagType = {
  [param in ParamList]?: boolean
}

export const rateScheme: RateSchemeType = {
  // BusinessProfile Contents
  skills: {
    rate: 10,
    done: false,
  },
  languages: {
    rate: 10,
    done: false,
  },
  desiredHourlyFee: {
    rate: 10,
    done: false,
  },
  desiredWorkStyle: {
    rate: 10,
    done: false,
  },
  paymentMethods: {
    rate: 10,
    done: false,
  },
  baseLocation: {
    rate: 10,
    done: false,
  },
  workStatus: {
    rate: 10,
    done: false,
  },
  // SocialProfile Contents
  displayName: {
    rate: 10,
    done: false,
  },
  avatarSrc: {
    rate: 10,
    done: false,
  },
  bio: {
    rate: 10,
    done: false,
  },
}
