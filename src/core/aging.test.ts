import { describe, expect, it } from 'vitest'
import type { Vehicle } from '../types/vehicle'
import {
  calculateVehicleAge,
  filterVehicles,
  getAgeBand,
  getAvailableMakes,
  getAvailableModels,
  isAging,
} from './aging'

const referenceDate = new Date(2024, 5, 1, 0, 1)

function localDateString(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function entryDateDaysBefore(days: number): string {
  return localDateString(new Date(2024, 5, 1 - days))
}

const filterTestVehicles: Vehicle[] = [
  {
    vehicleId: 'vehicle-003',
    stockNumber: 'STK-CAMRY',
    make: 'Toyota',
    model: 'Camry',
    stockEntryDate: entryDateDaysBefore(30),
    currentAction: null,
    daysInStock: 30,
    isAging: false,
    ageBand: '0-30',
  },
  {
    vehicleId: 'vehicle-001',
    stockNumber: 'STK-COROLLA',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: entryDateDaysBefore(91),
    currentAction: null,
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
  },
  {
    vehicleId: 'vehicle-002',
    stockNumber: 'STK-CIVIC',
    make: 'Honda',
    model: 'Civic',
    stockEntryDate: entryDateDaysBefore(31),
    currentAction: null,
    daysInStock: 31,
    isAging: false,
    ageBand: '31-60',
  },
  {
    vehicleId: 'vehicle-004',
    stockNumber: 'STK-UNKNOWN',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: 'invalid',
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
  },
]

describe('vehicle aging rules', () => {
  it.each([
    { days: 89, aging: false, ageBand: '61-90' },
    { days: 90, aging: false, ageBand: '61-90' },
    { days: 91, aging: true, ageBand: '>90' },
  ] as const)('classifies $days days in stock as aging: $aging', ({ days, aging, ageBand }) => {
    expect(calculateVehicleAge(entryDateDaysBefore(days), referenceDate)).toEqual({
      daysInStock: days,
      isAging: aging,
      ageBand,
    })
  })

  it('compares local calendar dates and ignores time of day', () => {
    const entryDate = `${entryDateDaysBefore(91)}T23:59:00`

    expect(calculateVehicleAge(entryDate, referenceDate).daysInStock).toBe(91)
  })

  it.each(['', 'not-a-date', '2024-02-30'])(
    'returns unknown age without throwing for invalid entry date %j',
    (entryDate) => {
      expect(() => calculateVehicleAge(entryDate, referenceDate)).not.toThrow()
      expect(calculateVehicleAge(entryDate, referenceDate)).toEqual({
        daysInStock: null,
        isAging: false,
        ageBand: null,
      })
    },
  )

  it('returns unknown age for a future entry date', () => {
    expect(calculateVehicleAge('2024-06-02', referenceDate)).toEqual({
      daysInStock: null,
      isAging: false,
      ageBand: null,
    })
  })

  it('uses the injected reference date when evaluating aging', () => {
    const entryDate = entryDateDaysBefore(90)
    const nextDayReference = new Date(2024, 5, 2, 0, 1)

    expect(calculateVehicleAge(entryDate, referenceDate).isAging).toBe(false)
    expect(calculateVehicleAge(entryDate, nextDayReference).isAging).toBe(true)
  })

  it.each([
    [0, '0-30'],
    [30, '0-30'],
    [31, '31-60'],
    [60, '31-60'],
    [61, '61-90'],
    [90, '61-90'],
    [91, '>90'],
  ] as const)('maps %i days to age band %s', (days, ageBand) => {
    expect(getAgeBand(days)).toBe(ageBand)
  })

  it('does not classify unknown, negative, or non-integer ages', () => {
    expect(getAgeBand(null)).toBeNull()
    expect(getAgeBand(-1)).toBeNull()
    expect(getAgeBand(1.5)).toBeNull()
    expect(isAging(null)).toBe(false)
    expect(isAging(-1)).toBe(false)
    expect(isAging(90)).toBe(false)
    expect(isAging(91)).toBe(true)
  })

  it('rejects an invalid injected reference date explicitly', () => {
    expect(() => calculateVehicleAge('2024-01-01', new Date(Number.NaN))).toThrow(RangeError)
  })
})

describe('inventory filtering', () => {
  const noFilters = {
    searchText: '',
    make: '',
    model: '',
    ageBand: '',
    agingOnly: false,
  } as const

  it('returns every vehicle in ascending ID order when no filters are active', () => {
    const results = filterVehicles(filterTestVehicles, noFilters)

    expect(results.map(({ vehicleId }) => vehicleId)).toEqual([
      'vehicle-001',
      'vehicle-002',
      'vehicle-003',
      'vehicle-004',
    ])
    expect(filterTestVehicles[0].vehicleId).toBe('vehicle-003')
  })

  it('searches stock number, make, and model case-insensitively', () => {
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, searchText: ' cIv ' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-002'])
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, searchText: 'toyota' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-001', 'vehicle-003', 'vehicle-004'])
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, searchText: 'STK-UNKNOWN' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-004'])
  })

  it('filters by make and model', () => {
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, make: 'Toyota' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-001', 'vehicle-003', 'vehicle-004'])
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, model: 'Corolla' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-001', 'vehicle-004'])
  })

  it('filters by age band and excludes vehicles with unknown age', () => {
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, ageBand: '31-60' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-002'])
  })

  it('filters to aging vehicles only', () => {
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, agingOnly: true }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-001'])
  })

  it('combines search, make, model, age band, and aging-only with AND', () => {
    expect(
      filterVehicles(filterTestVehicles, {
        searchText: 'cor',
        make: 'Toyota',
        model: 'Corolla',
        ageBand: '>90',
        agingOnly: true,
      }).map(({ vehicleId }) => vehicleId),
    ).toEqual(['vehicle-001'])
  })

  it('provides unique sorted makes and make-dependent model options', () => {
    expect(getAvailableMakes(filterTestVehicles)).toEqual(['Honda', 'Toyota'])
    expect(getAvailableModels(filterTestVehicles, 'Toyota')).toEqual(['Camry', 'Corolla'])
    expect(getAvailableModels(filterTestVehicles, '')).toEqual([
      'Camry',
      'Civic',
      'Corolla',
    ])
  })

  it('returns no vehicles when active filters do not match', () => {
    expect(
      filterVehicles(filterTestVehicles, {
        ...noFilters,
        make: 'Honda',
        model: 'Corolla',
      }),
    ).toEqual([])
  })

  it('filters and orders an approximately 200-vehicle inventory', () => {
    const vehicles = Array.from({ length: 200 }, (_, index) => ({
      ...filterTestVehicles[index % filterTestVehicles.length],
      vehicleId: `vehicle-${String(200 - index).padStart(3, '0')}`,
    }))
    const results = filterVehicles(vehicles, noFilters)
    const toyotaVehicles = filterVehicles(vehicles, { ...noFilters, make: 'Toyota' })

    expect(results).toHaveLength(200)
    expect(results[0].vehicleId).toBe('vehicle-001')
    expect(results.at(-1)?.vehicleId).toBe('vehicle-200')
    expect(toyotaVehicles).toHaveLength(150)
    expect(toyotaVehicles.every(({ make }) => make === 'Toyota')).toBe(true)
  })
})
