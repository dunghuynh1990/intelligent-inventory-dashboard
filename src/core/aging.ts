import type {
  AgeBand,
  CalculatedVehicleData,
  EntryDateIssue,
  Vehicle,
} from '../types/vehicle'

export type { EntryDateIssue } from '../types/vehicle'

export const AGING_THRESHOLD_DAYS = 90
export const AGE_BANDS: readonly AgeBand[] = ['0-30', '31-60', '61-90', '>90']
export const PAGE_SIZES = [10, 20, 50, 100] as const
export const FRESHNESS_AMBER_AFTER_MINUTES = 15
export const FRESHNESS_WARNING_AFTER_MINUTES = 60

export type ActionFilter = 'any' | 'no-action' | 'has-action'
export type FreshnessLevel = 'normal' | 'amber' | 'warning'
export type PageSize = (typeof PAGE_SIZES)[number]

export interface InventoryFilterCriteria {
  searchText: string
  make: string
  model: string
  ageBand: AgeBand | ''
  agingOnly: boolean
  dataIssuesOnly: boolean
  actionFilter?: ActionFilter
}

export interface InventorySummaryCounts {
  totalVehicles: number
  agingVehicles: number
  agingVehiclesWithAction: number
  dataIssueVehicles: number
}

export interface PaginatedItems<T> {
  items: T[]
  currentPage: number
  pageSize: PageSize
  totalItems: number
  totalPages: number
}

const millisecondsPerDay = 24 * 60 * 60 * 1000
const millisecondsPerMinute = 60 * 1000
const isoCalendarDate = /^(\d{4})-(\d{2})-(\d{2})(?:$|[Tt ])/

export function calculateDaysInStock(
  stockEntryDate: string | null | undefined,
  referenceDate: Date,
): number | null {
  const referenceDay = getReferenceCalendarDay(referenceDate)
  if (stockEntryDate == null) {
    return null
  }

  const entryDay = getEntryCalendarDay(stockEntryDate)
  if (entryDay === null) {
    return null
  }

  const daysInStock = referenceDay - entryDay

  return daysInStock < 0 ? null : daysInStock
}

export function classifyEntryDateIssue(
  stockEntryDate: string | null | undefined,
  referenceDate: Date,
): EntryDateIssue | null {
  const referenceDay = getReferenceCalendarDay(referenceDate)
  if (stockEntryDate == null || stockEntryDate.trim() === '') {
    return 'Missing entry date'
  }

  const entryDay = getEntryCalendarDay(stockEntryDate)
  if (entryDay === null) {
    return 'Invalid entry date'
  }
  return entryDay > referenceDay ? 'Future entry date' : null
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
  stockEntryDate: string | null | undefined,
  referenceDate: Date,
): CalculatedVehicleData {
  const daysInStock = calculateDaysInStock(stockEntryDate, referenceDate)

  return {
    daysInStock,
    isAging: isAging(daysInStock),
    ageBand: getAgeBand(daysInStock),
    entryDateIssue: classifyEntryDateIssue(stockEntryDate, referenceDate),
  }
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: InventoryFilterCriteria,
): Vehicle[] {
  const searchText = filters.searchText.trim().toLowerCase()
  const actionFilter = filters.actionFilter ?? 'any'

  return vehicles
    .filter((vehicle) => {
      const matchesSearch =
        !searchText ||
        [vehicle.stockNumber, vehicle.vin ?? '', vehicle.make, vehicle.model].some(
          (value) => value.toLowerCase().includes(searchText),
        )
      const matchesAction =
        actionFilter === 'any' ||
        (actionFilter === 'no-action' && vehicle.isAging && vehicle.currentAction === null) ||
        (actionFilter === 'has-action' && vehicle.currentAction !== null)

      return (
        matchesSearch &&
        matchesAction &&
        (!filters.dataIssuesOnly || vehicle.entryDateIssue !== null) &&
        (!filters.make || vehicle.make === filters.make) &&
        (!filters.model || vehicle.model === filters.model) &&
        (!filters.ageBand || vehicle.ageBand === filters.ageBand) &&
        (!filters.agingOnly || vehicle.isAging)
      )
    })
    .sort((left, right) => left.vehicleId.localeCompare(right.vehicleId))
}

export function paginateItems<T>(
  items: T[],
  requestedPage: number,
  pageSize: PageSize,
): PaginatedItems<T> {
  if (!Number.isFinite(requestedPage)) {
    throw new RangeError('requestedPage must be a finite number')
  }
  if (!PAGE_SIZES.includes(pageSize)) {
    throw new RangeError(`pageSize must be one of ${PAGE_SIZES.join(', ')}`)
  }

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const currentPage = Math.min(
    Math.max(Math.trunc(requestedPage), 1),
    Math.max(totalPages, 1),
  )
  const startIndex = (currentPage - 1) * pageSize

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    currentPage,
    pageSize,
    totalItems,
    totalPages,
  }
}

export function getFreshnessLevel(lastRefreshedAt: Date, now: Date): FreshnessLevel {
  const lastRefreshedTime = lastRefreshedAt.getTime()
  const currentTime = now.getTime()
  if (!Number.isFinite(lastRefreshedTime)) {
    throw new RangeError('lastRefreshedAt must be a valid date')
  }
  if (!Number.isFinite(currentTime)) {
    throw new RangeError('now must be a valid date')
  }

  const ageInMinutes = (currentTime - lastRefreshedTime) / millisecondsPerMinute
  if (ageInMinutes >= FRESHNESS_WARNING_AFTER_MINUTES) {
    return 'warning'
  }
  if (ageInMinutes >= FRESHNESS_AMBER_AFTER_MINUTES) {
    return 'amber'
  }
  return 'normal'
}

export function getAvailableMakes(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map(({ make }) => make))].sort((left, right) =>
    left.localeCompare(right),
  )
}

export function getAvailableModels(vehicles: Vehicle[], make: string): string[] {
  const matchingVehicles = make
    ? vehicles.filter((vehicle) => vehicle.make === make)
    : vehicles

  return [...new Set(matchingVehicles.map(({ model }) => model))].sort((left, right) =>
    left.localeCompare(right),
  )
}

export function getInventorySummary(vehicles: Vehicle[]): InventorySummaryCounts {
  return vehicles.reduce<InventorySummaryCounts>(
    (summary, vehicle) => {
      summary.totalVehicles += 1
      if (vehicle.daysInStock === null) {
        summary.dataIssueVehicles += 1
      }
      if (vehicle.isAging) {
        summary.agingVehicles += 1
        if (vehicle.currentAction) {
          summary.agingVehiclesWithAction += 1
        }
      }
      return summary
    },
    { totalVehicles: 0, agingVehicles: 0, agingVehiclesWithAction: 0, dataIssueVehicles: 0 },
  )
}

function getReferenceCalendarDay(referenceDate: Date): number {
  if (!Number.isFinite(referenceDate.getTime())) {
    throw new RangeError('referenceDate must be a valid date')
  }

  return getCalendarDay(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )
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
