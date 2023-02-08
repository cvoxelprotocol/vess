import { TagOption } from './tags'

export const WORK_STATUS_ITEM = ['available', 'a little busy', 'busy', 'ask'] as const

export type WorkStatus = typeof WORK_STATUS_ITEM[number]

export const convertStatusToTagOption = (): TagOption[] => {
  return WORK_STATUS_ITEM.map((v) => {
    return { value: v, label: v }
  })
}

export const isWorkStatus = (str: string): str is WorkStatus => {
  return WORK_STATUS_ITEM.some((v) => v === str)
}

export const WORK_STATUS: TagOption[] = convertStatusToTagOption()

export const WORK_STYLES: TagOption[] = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'In-Office', label: 'In-Office' },
]

export const PAYMENT_METHODS: TagOption[] = [
  { value: 'Fiat', label: 'Fiat' },
  { value: 'Crypto', label: 'Crypto' },
  { value: 'Ask', label: 'Ask' },
]

export const LANGUAGE_TAGS: TagOption[] = [
  { value: 'English', label: 'English' },
  { value: 'Japanese', label: 'Japanese' },
]
