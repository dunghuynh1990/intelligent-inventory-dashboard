import { describe, expect, it } from 'vitest'
import type { Vehicle } from '../types/vehicle'
import {
  calculateVehicleAge,
  classifyEntryDateIssue,
  formatActionLoggedAge,
  filterVehicles,
  getAgeBand,
  getAvailableMakes,
  getAvailableModels,
  getFreshnessLevel,
  getInventorySummary,
  isAging,
  paginateItems,
  type PageSize,
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
    vin: '1HGCM82633C004353',
    make: 'Toyota',
    model: 'Camry',
    stockEntryDate: entryDateDaysBefore(30),
    currentAction: null,
    daysInStock: 30,
    isAging: false,
    ageBand: '0-30',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-001',
    stockNumber: 'STK-COROLLA',
    vin: '1HGCM82633B004351',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: entryDateDaysBefore(91),
    currentAction: null,
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-002',
    stockNumber: 'STK-CIVIC',
    vin: '1HGCM82633A004352',
    make: 'Honda',
    model: 'Civic',
    stockEntryDate: entryDateDaysBefore(31),
    currentAction: null,
    daysInStock: 31,
    isAging: false,
    ageBand: '31-60',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-004',
    stockNumber: 'STK-UNKNOWN',
    vin: '1HGCM82633D004354',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: 'invalid',
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
    entryDateIssue: 'Invalid entry date',
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
      entryDateIssue: null,
    })

  })

  it('compares local calendar dates and ignores time of day', () => {
    const entryDate = `${entryDateDaysBefore(91)}T23:59:00`

    expect(calculateVehicleAge(entryDate, referenceDate).daysInStock).toBe(91)
  })

  it.each([
    ['', 'Missing entry date'],
    ['not-a-date', 'Invalid entry date'],
    ['2024-02-30', 'Invalid entry date'],
  ] as const)(
    'returns unknown age and the %s issue without throwing',
    (entryDate, entryDateIssue) => {
      expect(() => calculateVehicleAge(entryDate, referenceDate)).not.toThrow()
      expect(calculateVehicleAge(entryDate, referenceDate)).toEqual({
        daysInStock: null,
        isAging: false,
        ageBand: null,
        entryDateIssue,
      })
    },
  )

  it('returns unknown age for a future entry date', () => {
    expect(calculateVehicleAge('2024-06-02', referenceDate)).toEqual({
      daysInStock: null,
      isAging: false,
      ageBand: null,
      entryDateIssue: 'Future entry date',
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

describe('entry-date issue classification', () => {
  it.each([
    ['', 'Missing entry date'],
    ['   ', 'Missing entry date'],
    ['not-a-date', 'Invalid entry date'],
    ['2024-02-30', 'Invalid entry date'],
    ['2024-06-02', 'Future entry date'],
    [entryDateDaysBefore(1), null],
  ] as const)(
    'classifies entry date %j as %s',
    (entryDate, expectedIssue) => {
      expect(classifyEntryDateIssue(entryDate, referenceDate)).toBe(expectedIssue)
    },
  )

  it('classifies an absent entry date as missing', () => {
    expect(classifyEntryDateIssue(undefined, referenceDate)).toBe('Missing entry date')
  })

  it.each([
    { days: 89, isAging: false, ageBand: '61-90' },
    { days: 90, isAging: false, ageBand: '61-90' },
    { days: 91, isAging: true, ageBand: '>90' },
  ] as const)(
    'does not classify the $days-day boundary vehicle as an entry-date issue',
    ({ days, isAging: expectedIsAging, ageBand }) => {
      const entryDate = entryDateDaysBefore(days)

      expect(classifyEntryDateIssue(entryDate, referenceDate)).toBeNull()
      expect(calculateVehicleAge(entryDate, referenceDate)).toEqual({
        daysInStock: days,
        isAging: expectedIsAging,
        ageBand,
        entryDateIssue: null,
      })
    },
  )

  it('rejects an invalid injected reference date explicitly', () => {
    expect(() => classifyEntryDateIssue('', new Date(Number.NaN))).toThrow(RangeError)
  })
})

describe('inventory filtering', () => {
  const noFilters = {
    searchText: '',
    make: '',
    model: '',
    ageBand: '',
    agingOnly: false,
    dataIssuesOnly: false,
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

  it('searches stock number, VIN, make, and model case-insensitively', () => {
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
    expect(
      filterVehicles(filterTestVehicles, { ...noFilters, searchText: 'a0043' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-002'])
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

  it('filters to vehicles with a classified entry-date issue', () => {
    expect(
      filterVehicles(filterTestVehicles, {
        ...noFilters,
        dataIssuesOnly: true,
      }).map(({ vehicleId }) => vehicleId),
    ).toEqual(['vehicle-004'])
  })

  it('filters no-action results to aging vehicles without a current action', () => {
    const vehicles = [
      ...filterTestVehicles,
      {
        ...filterTestVehicles[1],
        vehicleId: 'vehicle-005',
        currentAction: { action: 'Review' },
      },
    ]

    expect(
      filterVehicles(vehicles, {
        ...noFilters,
        actionFilter: 'no-action',
      }).map(({ vehicleId }) => vehicleId),
    ).toEqual(['vehicle-001'])
  })

  it('filters has-action results to vehicles with a current action regardless of age', () => {
    const vehicles = filterTestVehicles.map((vehicle) =>
      vehicle.vehicleId === 'vehicle-001' || vehicle.vehicleId === 'vehicle-002'
        ? { ...vehicle, currentAction: { action: 'Review' } }
        : vehicle,
    )

    expect(
      filterVehicles(vehicles, { ...noFilters, actionFilter: 'has-action' }).map(
        ({ vehicleId }) => vehicleId,
      ),
    ).toEqual(['vehicle-001', 'vehicle-002'])
  })

  it('combines search, make, model, age band, and aging-only with AND', () => {
    expect(
      filterVehicles(filterTestVehicles, {
        searchText: 'cor',
        make: 'Toyota',
        model: 'Corolla',
        ageBand: '>90',
        agingOnly: true,
        dataIssuesOnly: false,
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

describe('inventory pagination', () => {
  const items = Array.from({ length: 45 }, (_, index) => index + 1)

  it('slices first and last pages and clamps an out-of-range page', () => {
    expect(paginateItems(items, 1, 20)).toEqual({
      items: items.slice(0, 20),
      currentPage: 1,
      pageSize: 20,
      totalItems: 45,
      totalPages: 3,
    })
    expect(paginateItems(items, 3, 20)).toEqual({
      items: items.slice(40),
      currentPage: 3,
      pageSize: 20,
      totalItems: 45,
      totalPages: 3,
    })
    expect(paginateItems(items, 9, 20).currentPage).toBe(3)
  })

  it('keeps an empty list on page one and clamps non-positive page requests', () => {
    expect(paginateItems([], 0, 10)).toEqual({
      items: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    })
  })

  it.each([10, 20, 50, 100] as const)(
    'supports the configured page size %i',
    (pageSize) => {
      const page = paginateItems(items, 1, pageSize)

      expect(page.pageSize).toBe(pageSize)
      expect(page.items).toEqual(items.slice(0, pageSize))
    },
  )

  it('rejects non-finite page requests and unsupported page sizes', () => {
    expect(() => paginateItems(items, Number.NaN, 20)).toThrow(RangeError)
    expect(() => paginateItems(items, 1, 25 as PageSize)).toThrow(RangeError)
  })
})

describe('inventory freshness', () => {
  const now = new Date(2024, 5, 1, 12, 0)

  it.each([
    [14, 'normal'],
    [15, 'amber'],
    [59, 'amber'],
    [60, 'warning'],
  ] as const)('classifies data aged %i minutes as %s', (ageMinutes, level) => {
    const lastRefreshedAt = new Date(now.getTime() - ageMinutes * 60 * 1000)

    expect(getFreshnessLevel(lastRefreshedAt, now)).toBe(level)
  })

  it('rejects invalid injected timestamps explicitly', () => {
    expect(() => getFreshnessLevel(new Date(Number.NaN), now)).toThrow(RangeError)
    expect(() => getFreshnessLevel(now, new Date(Number.NaN))).toThrow(RangeError)
  })
})

describe('action logged age', () => {
  const now = new Date(2024, 5, 4, 12)

  it.each([
    { loggedAt: new Date(2024, 5, 4, 8), label: 'Logged today' },
    { loggedAt: new Date(2024, 5, 3, 23), label: 'Logged yesterday' },
    { loggedAt: new Date(2024, 5, 1, 9), label: 'Logged 3 days ago' },
  ])('formats action age as $label', ({ loggedAt, label }) => {
    expect(formatActionLoggedAge(loggedAt.toISOString(), now)).toBe(label)
  })

  it('omits an age label for missing, invalid, or future timestamps', () => {
    expect(formatActionLoggedAge(undefined, now)).toBeNull()
    expect(formatActionLoggedAge('not-a-date', now)).toBeNull()
    expect(
      formatActionLoggedAge(new Date(2024, 5, 5, 9).toISOString(), now),
    ).toBeNull()
  })
})

describe('inventory summary counts', () => {
  it('counts total, aging, and aging-with-action vehicles independently', () => {
    const vehicles = filterTestVehicles.map((vehicle) => {
      if (vehicle.vehicleId === 'vehicle-001') {
        return { ...vehicle, currentAction: { action: 'Price Reduction Planned' } }
      }
      if (vehicle.vehicleId === 'vehicle-003') {
        return { ...vehicle, currentAction: { action: 'Review' } }
      }
      return vehicle
    })

    expect(getInventorySummary(vehicles)).toEqual({
      totalVehicles: 4,
      agingVehicles: 1,
      agingVehiclesWithAction: 1,
      dataIssueVehicles: 1,
    })
  })

  it('returns zero counts for an empty inventory', () => {
    expect(getInventorySummary([])).toEqual({
      totalVehicles: 0,
      agingVehicles: 0,
      agingVehiclesWithAction: 0,
      dataIssueVehicles: 0,
    })
  })
})
