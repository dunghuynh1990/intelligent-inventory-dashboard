import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { InventoryService } from './inventory-service'
import { MockInventoryService } from './mock-inventory-service'
import { generateMockVehicles } from './mock-vehicle-data'
import { classifyEntryDateIssue } from '../core/aging'

const referenceDate = new Date(2024, 5, 1, 12)

describe('MockInventoryService', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  afterEach(() => {
    vi.useRealTimers()
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('returns 200 deterministic vehicles with relative 89, 90, and 91 day records', async () => {
    const service: InventoryService = new MockInventoryService({
      referenceDate,
      delayMs: 0,
    })
    const vehicles = await service.getVehicles()
    const repeatedVehicles = await service.getVehicles()

    expect(vehicles).toHaveLength(200)
    expect(vehicles.map(({ vehicleId, make, model, stockEntryDate }) => ({
      vehicleId,
      make,
      model,
      stockEntryDate,
    }))).toEqual(
      repeatedVehicles.map(({ vehicleId, make, model, stockEntryDate }) => ({
        vehicleId,
        make,
        model,
        stockEntryDate,
      })),
    )
    expect(vehicles.slice(0, 3).map(({ daysInStock, isAging }) => [daysInStock, isAging])).toEqual([
      [89, false],
      [90, false],
      [91, true],
    ])
    expect(vehicles.every(({ currentAction }) => currentAction === null)).toBe(true)
  })

  it('generates deterministic 17-character VINs without I, O, or Q', () => {
    const vehicles = generateMockVehicles(referenceDate)
    const repeatedVehicles = generateMockVehicles(referenceDate)
    const validVin = /^[ABCDEFGHJKLMNPRSTUVWXYZ0-9]{17}$/

    expect(vehicles.map(({ vin }) => vin)).toEqual(repeatedVehicles.map(({ vin }) => vin))
    expect(vehicles.every(({ vin }) => validVin.test(vin))).toBe(true)
  })

  it('generates one example of each bad entry date and preserves the age boundaries', () => {
    const vehicles = generateMockVehicles(referenceDate)
    const issues = vehicles
      .map(({ stockEntryDate }) => classifyEntryDateIssue(stockEntryDate, referenceDate))
      .filter((issue) => issue !== null)

    expect(issues).toEqual([
      'Missing entry date',
      'Invalid entry date',
      'Future entry date',
    ])
    expect(vehicles.slice(0, 3).map(({ daysInStock, isAging }) => [daysInStock, isAging])).toEqual([
      [89, false],
      [90, false],
      [91, true],
    ])
    expect(vehicles.slice(3, 6).map(({ stockEntryDate, daysInStock, isAging, ageBand }) => [
      stockEntryDate,
      daysInStock,
      isAging,
      ageBand,
    ])).toEqual([
      [null, null, false, null],
      ['not-a-date', null, false, null],
      ['2024-06-02', null, false, null],
    ])
  })

  it('keeps generated boundary records relative to each injected reference date', async () => {
    const service = new MockInventoryService({
      referenceDate: new Date(2024, 5, 2),
      delayMs: 0,
    })

    const vehicles = await service.getVehicles()

    expect(vehicles.slice(0, 3).map(({ daysInStock }) => daysInStock)).toEqual([89, 90, 91])
  })

  it('persists the current action, optional note, and save timestamp between service instances', async () => {
    vi.useFakeTimers()
    const saveTime = new Date('2024-06-01T12:00:00.000Z')
    vi.setSystemTime(saveTime)
    const firstService = new MockInventoryService({ referenceDate, delayMs: 0 })
    const action = { action: 'Price Reduction Planned', note: 'Review this week' }
    const save = firstService.updateVehicleAction('vehicle-001', action)

    await vi.advanceTimersByTimeAsync(0)
    await save

    const secondService = new MockInventoryService({ referenceDate, delayMs: 0 })
    const getVehicles = secondService.getVehicles()
    await vi.advanceTimersByTimeAsync(0)
    const vehicles = await getVehicles
    const savedAction = { ...action, loggedAt: saveTime.toISOString() }

    expect(vehicles[0].currentAction).toEqual(savedAction)
    expect(JSON.parse(window.localStorage.getItem('intelligent-inventory-dashboard:vehicle-actions') ?? '{}')).toEqual({
      'vehicle-001': savedAction,
    })
  })

  it('rejects updates for unknown vehicle IDs', async () => {
    const service = new MockInventoryService({ referenceDate, delayMs: 0 })

    await expect(
      service.updateVehicleAction('missing-vehicle', { action: 'Review' }),
    ).rejects.toThrow('Unknown vehicle ID: missing-vehicle')
  })

  it('rejects an empty selected action without changing persisted actions', async () => {
    const service = new MockInventoryService({ referenceDate, delayMs: 0 })

    await expect(
      service.updateVehicleAction('vehicle-001', { action: ' ' }),
    ).rejects.toThrow('An action must be selected')
    expect(window.localStorage.length).toBe(0)
  })

  it('does not resolve retrieval before the configured simulated delay elapses', async () => {
    vi.useFakeTimers()
    const service = new MockInventoryService({
      referenceDate,
      delayMs: 250,
    })
    const result = service.getVehicles()
    let resolved = false
    void result.then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(249)
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await expect(result).resolves.toHaveLength(200)
  })

  it('rejects retrieval and updates when forced failure is configured', async () => {
    const service = new MockInventoryService({
      referenceDate,
      delayMs: 0,
      forceFailure: true,
    })

    await expect(service.getVehicles()).rejects.toThrow(
      'MockInventoryService forced failure is enabled',
    )
    await expect(
      service.updateVehicleAction('vehicle-001', { action: 'Review' }),
    ).rejects.toThrow('MockInventoryService forced failure is enabled')
  })

  it('enables forced failures from the browser URL query switch', async () => {
    window.history.replaceState({}, '', '/?forceFailure=true')
    const service = new MockInventoryService({
      referenceDate,
      delayMs: 0,
    })

    await expect(service.getVehicles()).rejects.toThrow(
      'MockInventoryService forced failure is enabled',
    )
  })

  it('generates the same seeded inventory for the same reference date', () => {
    expect(generateMockVehicles(referenceDate)).toEqual(generateMockVehicles(referenceDate))
  })

  it('rejects invalid reference dates and delay settings', () => {
    expect(
      () =>
        new MockInventoryService({
          referenceDate: new Date(Number.NaN),
        }),
    ).toThrow(RangeError)
    expect(() => new MockInventoryService({ delayMs: -1 })).toThrow(RangeError)
  })
})
