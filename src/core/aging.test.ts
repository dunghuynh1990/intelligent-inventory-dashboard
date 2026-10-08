import { describe, expect, it } from 'vitest'
import { calculateVehicleAge, getAgeBand, isAging } from './aging'

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
