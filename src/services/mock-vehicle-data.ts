import { calculateVehicleAge } from '../core/aging'
import type { Vehicle } from '../types/vehicle'

const vehicleCount = 200
const boundaryAges = [89, 90, 91]
const defaultSeed = 20261008
const vinSeed = defaultSeed ^ 0x9e3779b9
const badDateStartIndex = boundaryAges.length
const vinCharacters = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'

const makes = [
  { make: 'Honda', models: ['Accord', 'Civic', 'CR-V', 'Pilot'] },
  { make: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Prius'] },
  { make: 'Ford', models: ['Escape', 'Explorer', 'F-150', 'Mustang'] },
  { make: 'Chevrolet', models: ['Equinox', 'Malibu', 'Silverado', 'Trailblazer'] },
  { make: 'Nissan', models: ['Altima', 'Frontier', 'Rogue', 'Sentra'] },
  { make: 'Hyundai', models: ['Elantra', 'Palisade', 'Santa Fe', 'Tucson'] },
]

export function generateMockVehicles(referenceDate: Date): Vehicle[] {
  if (!Number.isFinite(referenceDate.getTime())) {
    throw new RangeError('referenceDate must be a valid date')
  }

  const random = createSeededRandom(defaultSeed)
  const vinRandom = createSeededRandom(vinSeed)
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )

  return Array.from({ length: vehicleCount }, (_, index) => {
    const makeData = makes[random.int(makes.length)]
    const ageInDays = boundaryAges[index] ?? random.int(181)
    const generatedEntryDate = localDateString(addCalendarDays(today, -ageInDays))
    const stockEntryDate = getStockEntryDate(index, generatedEntryDate, today)
    const vehicleId = `vehicle-${String(index + 1).padStart(3, '0')}`

    return {
      vehicleId,
      stockNumber: `STK-${String(index + 1).padStart(4, '0')}`,
      vin: generateVin(vinRandom),
      make: makeData.make,
      model: makeData.models[random.int(makeData.models.length)],
      stockEntryDate,
      currentAction: null,
      ...calculateVehicleAge(stockEntryDate, referenceDate),
    }
  })
}

function getStockEntryDate(
  index: number,
  generatedEntryDate: string,
  today: Date,
): string | null {
  switch (index - badDateStartIndex) {
    case 0:
      return null
    case 1:
      return 'not-a-date'
    case 2:
      return localDateString(addCalendarDays(today, 1))
    default:
      return generatedEntryDate
  }
}

function generateVin(random: { int: (maxExclusive: number) => number }): string {
  return Array.from(
    { length: 17 },
    () => vinCharacters[random.int(vinCharacters.length)],
  ).join('')
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function localDateString(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createSeededRandom(seed: number): { int: (maxExclusive: number) => number } {
  let state = seed >>> 0

  return {
    int(maxExclusive: number): number {
      state = (1664525 * state + 1013904223) >>> 0
      return state % maxExclusive
    },
  }
}
