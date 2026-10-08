import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { InventoryService } from './inventory-service'
import { MockInventoryService } from './mock-inventory-service'
import { generateMockVehicles } from './mock-vehicle-data'

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

  it('keeps generated boundary records relative to each injected reference date', async () => {
    const service = new MockInventoryService({
      referenceDate: new Date(2024, 5, 2),
      delayMs: 0,
    })

    const vehicles = await service.getVehicles()

    expect(vehicles.slice(0, 3).map(({ daysInStock }) => daysInStock)).toEqual([89, 90, 91])
  })

  it('persists only the current action and optional note between service instances', async () => {
    const firstService = new MockInventoryService({ referenceDate, delayMs: 0 })
    const action = { action: 'Price Reduction Planned', note: 'Review this week' }

    await firstService.updateVehicleAction('vehicle-001', action)

    const secondService = new MockInventoryService({ referenceDate, delayMs: 0 })
    const vehicles = await secondService.getVehicles()
    expect(vehicles[0].currentAction).toEqual(action)
    expect(JSON.parse(window.localStorage.getItem('intelligent-inventory-dashboard:vehicle-actions') ?? '{}')).toEqual({
      'vehicle-001': action,
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
