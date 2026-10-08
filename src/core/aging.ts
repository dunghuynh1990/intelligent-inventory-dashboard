import type { AgeBand, CalculatedVehicleData, Vehicle } from '../types/vehicle'

export const AGING_THRESHOLD_DAYS = 90
export const AGE_BANDS: readonly AgeBand[] = ['0-30', '31-60', '61-90', '>90']

export interface InventoryFilterCriteria {
  searchText: string
  make: string
  model: string
  ageBand: AgeBand | ''
  agingOnly: boolean
}

export interface InventorySummaryCounts {
  totalVehicles: number
  agingVehicles: number
  agingVehiclesWithAction: number
}

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

export function filterVehicles(
  vehicles: Vehicle[],
  filters: InventoryFilterCriteria,
): Vehicle[] {
  const searchText = filters.searchText.trim().toLowerCase()

  return vehicles
    .filter((vehicle) => {
      const matchesSearch =
        !searchText ||
        [vehicle.stockNumber, vehicle.make, vehicle.model].some((value) =>
          value.toLowerCase().includes(searchText),
        )

      return (
        matchesSearch &&
        (!filters.make || vehicle.make === filters.make) &&
        (!filters.model || vehicle.model === filters.model) &&
        (!filters.ageBand || vehicle.ageBand === filters.ageBand) &&
        (!filters.agingOnly || vehicle.isAging)
      )
    })
    .sort((left, right) => left.vehicleId.localeCompare(right.vehicleId))
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
      if (vehicle.isAging) {
        summary.agingVehicles += 1
        if (vehicle.currentAction) {
          summary.agingVehiclesWithAction += 1
        }
      }
      return summary
    },
    { totalVehicles: 0, agingVehicles: 0, agingVehiclesWithAction: 0 },
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
