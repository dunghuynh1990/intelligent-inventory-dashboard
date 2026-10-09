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
export const EARLY_WARNING_DAYS = 7
export const ACTION_STALE_AFTER_DAYS = 14

export type ActionFilter = 'any' | 'no-action' | 'has-action'
export type FreshnessLevel = 'normal' | 'amber' | 'warning'
export type PageSize = (typeof PAGE_SIZES)[number]

export type InventoryPresetId =
  | 'all-vehicles'
  | 'needs-action'
  | 'aging-stock'
  | 'action-planned'
  | 'turning-aging-this-week'
  | 'approaching-90-days'
  | 'data-issues'
  | 'new-arrivals'

export interface InventoryFilterCriteria {
  searchText: string
  make: string
  model: string
  ageBand: AgeBand | ''
  agingOnly: boolean
  dataIssuesOnly: boolean
  turningAgingSoonOnly: boolean
  actionFilter?: ActionFilter
}

export interface InventoryPreset {
  id: InventoryPresetId
  label: string
  filters: InventoryFilterCriteria
  count: number
}

export interface InventorySummaryCounts {
  totalVehicles: number
  agingVehicles: number
  agingVehiclesWithAction: number
  dataIssueVehicles: number
  turningAgingSoonVehicles: number
}

export interface AgeBandProfileEntry {
  ageBand: AgeBand
  count: number
  share: number
}

export interface AgeBandProfile {
  bands: AgeBandProfileEntry[]
  knownAgeVehicles: number
}

export interface PaginatedItems<T> {
  items: T[]
  currentPage: number
  pageSize: PageSize
  totalItems: number
  totalPages: number
}

const noFilters: InventoryFilterCriteria = {
  searchText: '',
  make: '',
  model: '',
  ageBand: '',
  agingOnly: false,
  dataIssuesOnly: false,
  turningAgingSoonOnly: false,
  actionFilter: 'any',
}

const inventoryPresetDefinitions: ReadonlyArray<
  Omit<InventoryPreset, 'count'>
> = [
  { id: 'all-vehicles', label: 'All vehicles', filters: noFilters },
  {
    id: 'needs-action',
    label: 'Needs action',
    filters: { ...noFilters, actionFilter: 'no-action' },
  },
  {
    id: 'aging-stock',
    label: 'Aging stock',
    filters: { ...noFilters, ageBand: '>90' },
  },
  {
    id: 'action-planned',
    label: 'Action planned',
    filters: { ...noFilters, actionFilter: 'has-action' },
  },
  {
    id: 'turning-aging-this-week',
    label: 'Turning aging this week',
    filters: { ...noFilters, turningAgingSoonOnly: true },
  },
  {
    id: 'approaching-90-days',
    label: 'Approaching 90 days',
    filters: { ...noFilters, ageBand: '61-90' },
  },
  {
    id: 'data-issues',
    label: 'Data issues',
    filters: { ...noFilters, dataIssuesOnly: true },
  },
  {
    id: 'new-arrivals',
    label: 'New arrivals (0-30)',
    filters: { ...noFilters, ageBand: '0-30' },
  },
]

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
      const matchesEarlyWarning =
        !filters.turningAgingSoonOnly || getDaysUntilAging(vehicle.daysInStock) !== null

      return (
        matchesSearch &&
        matchesAction &&
        (!filters.dataIssuesOnly || vehicle.entryDateIssue !== null) &&
        matchesEarlyWarning &&
        (!filters.make || vehicle.make === filters.make) &&
        (!filters.model || vehicle.model === filters.model) &&
        (!filters.ageBand || vehicle.ageBand === filters.ageBand) &&
        (!filters.agingOnly || vehicle.isAging)
      )
    })
    .sort((left, right) => left.vehicleId.localeCompare(right.vehicleId))
}

export const SORT_KEYS = [
  'stockNumber',
  'vin',
  'make',
  'model',
  'entryDate',
  'daysInStock',
  'status',
  'currentAction',
] as const

export type SortKey = (typeof SORT_KEYS)[number]
export type SortDirection = 'asc' | 'desc'
export interface VehicleSort {
  key: SortKey
  direction: SortDirection
}

const descendingFirstSortKeys: readonly SortKey[] = ['daysInStock', 'status']

const sortDirectionWords: Record<SortKey, readonly [string, string]> = {
  stockNumber: ['A-Z', 'Z-A'],
  vin: ['A-Z', 'Z-A'],
  make: ['A-Z', 'Z-A'],
  model: ['A-Z', 'Z-A'],
  entryDate: ['oldest first', 'newest first'],
  daysInStock: ['fewest first', 'most first'],
  status: ['in range first', 'aging first, then soon'],
  currentAction: ['A-Z', 'Z-A'],
}

export const SORT_LABELS: Record<SortKey, string> = {
  stockNumber: 'Stock no.',
  vin: 'VIN',
  make: 'Make',
  model: 'Model',
  entryDate: 'Entry date',
  daysInStock: 'Days in stock',
  status: 'Status',
  currentAction: 'Current action',
}

export function getNextSort(
  current: VehicleSort | null,
  key: SortKey,
): VehicleSort | null {
  const first: SortDirection = descendingFirstSortKeys.includes(key) ? 'desc' : 'asc'
  const second: SortDirection = first === 'asc' ? 'desc' : 'asc'

  if (current?.key !== key) {
    return { key, direction: first }
  }

  return current.direction === first ? { key, direction: second } : null
}

export function getSortLabel(sort: VehicleSort): string {
  const [ascending, descending] = sortDirectionWords[sort.key]
  return `${SORT_LABELS[sort.key]}, ${sort.direction === 'asc' ? ascending : descending}`
}

function getEntryDateTime(vehicle: Vehicle): number | null {
  const match = isoCalendarDate.exec(vehicle.stockEntryDate?.trim() ?? '')
  if (!match) {
    return null
  }

  const [, year, month, day] = match
  const date = new Date(0)
  date.setUTCFullYear(Number(year), Number(month) - 1, Number(day))
  return date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
    ? date.getTime()
    : null
}

function getSortValue(vehicle: Vehicle, key: SortKey): string | number | null {
  switch (key) {
    case 'stockNumber':
      return vehicle.stockNumber
    case 'vin':
      return vehicle.vin
    case 'make':
      return vehicle.make
    case 'model':
      return vehicle.model
    case 'entryDate':
      return getEntryDateTime(vehicle)
    case 'daysInStock':
      return vehicle.daysInStock
    case 'status':
      return vehicle.isAging
        ? 2
        : getDaysUntilAging(vehicle.daysInStock) !== null
          ? 1
          : 0
    case 'currentAction':
      return vehicle.currentAction?.action ?? null
  }
}

function compareVehicleId(left: Vehicle, right: Vehicle): number {
  return left.vehicleId.localeCompare(right.vehicleId)
}

export function sortRows(vehicles: Vehicle[], sort: VehicleSort | null): Vehicle[] {
  if (sort === null) {
    return vehicles
  }

  const directionFactor = sort.direction === 'asc' ? 1 : -1
  return [...vehicles].sort((left, right) => {
    const leftValue = getSortValue(left, sort.key)
    const rightValue = getSortValue(right, sort.key)

    if (leftValue === null && rightValue === null) {
      return compareVehicleId(left, right)
    }
    if (leftValue === null) {
      return 1
    }
    if (rightValue === null) {
      return -1
    }

    const comparison =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), 'en', {
            numeric: true,
            sensitivity: 'base',
          })

    return comparison === 0
      ? compareVehicleId(left, right)
      : comparison * directionFactor
  })
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

export function getDaysUntilAging(daysInStock: number | null): number | null {
  if (!isValidAge(daysInStock)) {
    return null
  }

  const daysUntilAging = AGING_THRESHOLD_DAYS + 1 - daysInStock
  return daysUntilAging >= 1 && daysUntilAging <= EARLY_WARNING_DAYS
    ? daysUntilAging
    : null
}

export function formatElapsedRefreshTime(
  lastRefreshedAt: Date,
  now: Date,
): string {
  const lastRefreshedTime = lastRefreshedAt.getTime()
  const currentTime = now.getTime()
  if (!Number.isFinite(lastRefreshedTime)) {
    throw new RangeError('lastRefreshedAt must be a valid date')
  }
  if (!Number.isFinite(currentTime)) {
    throw new RangeError('now must be a valid date')
  }

  const elapsedMinutes = Math.max(
    0,
    Math.floor((currentTime - lastRefreshedTime) / millisecondsPerMinute),
  )
  if (elapsedMinutes === 0) {
    return 'Just now'
  }
  return `${elapsedMinutes} min ago`
}

export function formatActionLoggedAge(
  loggedAt: string | undefined,
  now: Date,
): string | null {
  const daysAgo = getActionAgeInCalendarDays(loggedAt, now)
  if (daysAgo === null) {
    return null
  }
  if (daysAgo === 0) {
    return 'Logged today'
  }
  if (daysAgo === 1) {
    return 'Logged yesterday'
  }
  return `Logged ${daysAgo} days ago`
}

export function isActionStale(loggedAt: string | undefined, now: Date): boolean {
  const daysAgo = getActionAgeInCalendarDays(loggedAt, now)
  return daysAgo !== null && daysAgo > ACTION_STALE_AFTER_DAYS
}

function getActionAgeInCalendarDays(
  loggedAt: string | undefined,
  now: Date,
): number | null {
  if (loggedAt === undefined) {
    return null
  }

  const loggedDate = new Date(loggedAt)
  const nowTime = now.getTime()
  if (!Number.isFinite(loggedDate.getTime()) || !Number.isFinite(nowTime)) {
    return null
  }

  const loggedDay = Date.UTC(
    loggedDate.getFullYear(),
    loggedDate.getMonth(),
    loggedDate.getDate(),
  )
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const daysAgo = Math.floor((today - loggedDay) / millisecondsPerDay)
  return daysAgo < 0 ? null : daysAgo
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
      if (getDaysUntilAging(vehicle.daysInStock) !== null) {
        summary.turningAgingSoonVehicles += 1
      }
      if (vehicle.isAging) {
        summary.agingVehicles += 1
        if (vehicle.currentAction) {
          summary.agingVehiclesWithAction += 1
        }
      }
      return summary
    },
    {
      totalVehicles: 0,
      agingVehicles: 0,
      agingVehiclesWithAction: 0,
      dataIssueVehicles: 0,
      turningAgingSoonVehicles: 0,
    },
  )
}

export function getInventoryPresets(vehicles: Vehicle[]): InventoryPreset[] {
  return inventoryPresetDefinitions.map((preset) => ({
    ...preset,
    count: filterVehicles(vehicles, preset.filters).length,
  }))
}

export function getActiveInventoryPresetId(
  filters: InventoryFilterCriteria,
): InventoryPresetId | null {
  const activeFilterMatch = inventoryPresetDefinitions.find((preset) =>
    haveSameFilters(filters, preset.filters),
  )

  return activeFilterMatch?.id ?? null
}

export function getAgeBandProfile(vehicles: Vehicle[]): AgeBandProfile {
  const counts: Record<AgeBand, number> = {
    '0-30': 0,
    '31-60': 0,
    '61-90': 0,
    '>90': 0,
  }

  for (const vehicle of vehicles) {
    if (vehicle.ageBand !== null) {
      counts[vehicle.ageBand] += 1
    }
  }

  const knownAgeVehicles = Object.values(counts).reduce(
    (total, count) => total + count,
    0,
  )
  const bands = AGE_BANDS.map((ageBand) => ({
    ageBand,
    count: counts[ageBand],
    share: knownAgeVehicles === 0 ? 0 : counts[ageBand] / knownAgeVehicles,
  }))

  return { bands, knownAgeVehicles }
}

function haveSameFilters(
  left: InventoryFilterCriteria,
  right: InventoryFilterCriteria,
): boolean {
  return (
    left.searchText === right.searchText &&
    left.make === right.make &&
    left.model === right.model &&
    left.ageBand === right.ageBand &&
    left.agingOnly === right.agingOnly &&
    left.dataIssuesOnly === right.dataIssuesOnly &&
    left.turningAgingSoonOnly === right.turningAgingSoonOnly &&
    (left.actionFilter ?? 'any') === (right.actionFilter ?? 'any')
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
