import { differenceInSeconds, format, isBefore, parseISO } from 'date-fns'
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
  try {
    const d = new Date(Number(timestamp) * 1000)
    return formatDate(d.toISOString())
  } catch (error) {
    console.error(error)
    return ''
  }
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

export const isWithinSeconds = (seconds: number, date?: string): boolean => {
  if (!date) return false
  return differenceInSeconds(new Date(), new Date(date)) < seconds
}

export const convertDateStringToDate = (potentialDateStr: any): Date | null => {
  if (!potentialDateStr || potentialDateStr === undefined) return null
  if (typeof potentialDateStr === 'string') {
    return new Date(potentialDateStr)
  }
  return potentialDateStr as Date
}
