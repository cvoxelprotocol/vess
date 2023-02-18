import { format, isBefore, parseISO } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export const parseISOStrToDate = (iso: string): Date => {
  return zonedTimeToUtc(iso, 'utc')
}

export const formatDate = (date?: string): string => {
  if (!date) return ''
  return format(parseISO(date), 'LLL dd, yyyy')
}

export const convertTimestampToDateStr = (timestamp?: string): string => {
  if (!timestamp) return ''
  const d = new Date(Number(timestamp) * 1000)
  return formatDate(d.toISOString())
}

export const convertDateStrToTimestamp = (str?: string): number => {
  if (!str) return 0
  return new Date(str).getTime()
}

export const isExpired = (date?: string): boolean => {
  if (!date) return false
  const now = new Date()
  return isBefore(parseISOStrToDate(date), now)
}
