import type { AgeBand, CalculatedVehicleData } from '../types/vehicle'

export const AGING_THRESHOLD_DAYS = 90

const millisecondsPerDay = 24 * 60 * 60 * 1000
const isoCalendarDate = /^(\d{4})-(\d{2})-(\d{2})(?:$|[Tt ])/

export function calculateDaysInStock(stockEntryDate: string, referenceDate: Date): number | null {
  const referenceTime = referenceDate.getTime()
  if (!Number.isFinite(referenceTime)) {
    throw new RangeError('referenceDate must be a valid date')
  }

  const entryDay = getEntryCalendarDay(stockEntryDate)
  if (entryDay === null) {
    return null
  }

  const referenceDay = getCalendarDay(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )
  const daysInStock = referenceDay - entryDay

  return daysInStock < 0 ? null : daysInStock
}

export function isAging(daysInStock: number | null): boolean {
  return isValidAge(daysInStock) && daysInStock > AGING_THRESHOLD_DAYS
}

export function getAgeBand(daysInStock: number | null): AgeBand | null {
  if (!isValidAge(daysInStock)) {
    return null
  }

  if (daysInStock <= 30) {
    return '0-30'
  }
  if (daysInStock <= 60) {
    return '31-60'
  }
  if (daysInStock <= AGING_THRESHOLD_DAYS) {
    return '61-90'
  }
  return '>90'
}

export function calculateVehicleAge(
  stockEntryDate: string,
  referenceDate: Date,
): CalculatedVehicleData {
  const daysInStock = calculateDaysInStock(stockEntryDate, referenceDate)

  return {
    daysInStock,
    isAging: isAging(daysInStock),
    ageBand: getAgeBand(daysInStock),
  }
}

function getEntryCalendarDay(stockEntryDate: string): number | null {
  const match = isoCalendarDate.exec(stockEntryDate.trim())
  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue) - 1
  const day = Number(dayValue)
  const calendarDay = getCalendarDay(year, month, day)

  if (!Number.isFinite(calendarDay)) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(stockEntryDate.trim())) {
    return calendarDay
  }

  const parsedDate = new Date(stockEntryDate)
  if (!Number.isFinite(parsedDate.getTime())) {
    return null
  }

  return getCalendarDay(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
}

function getCalendarDay(year: number, month: number, day: number): number {
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month, day)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return Number.NaN
  }

  return date.getTime() / millisecondsPerDay
}

function isValidAge(daysInStock: number | null): daysInStock is number {
  return daysInStock !== null && Number.isInteger(daysInStock) && daysInStock >= 0
}
