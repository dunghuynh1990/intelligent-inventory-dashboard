import type { InventoryService } from './inventory-service'
import { generateMockVehicles } from './mock-vehicle-data'
import type { Vehicle, VehicleAction } from '../types/vehicle'

const actionStorageKey = 'intelligent-inventory-dashboard:vehicle-actions'
const defaultDelayMs = 250

export interface MockInventoryServiceOptions {
  referenceDate?: Date
  delayMs?: number
  forceFailure?: boolean
  storage?: Storage
}

export class MockInventoryService implements InventoryService {
  private readonly vehicles: Vehicle[]
  private readonly delayMs: number
  private readonly forceFailure: boolean
  private readonly storageOverride: Storage | undefined

  constructor(options: MockInventoryServiceOptions = {}) {
    const referenceDate = options.referenceDate ?? new Date()
    if (!Number.isFinite(referenceDate.getTime())) {
      throw new RangeError('referenceDate must be a valid date')
    }
    const delayMs = options.delayMs ?? defaultDelayMs
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      throw new RangeError('delayMs must be a non-negative finite number')
    }

    this.vehicles = generateMockVehicles(referenceDate)
    this.delayMs = delayMs
    this.forceFailure = options.forceFailure ?? isForcedFailureEnabled()
    this.storageOverride = options.storage
  }

  async getVehicles(): Promise<Vehicle[]> {
    await this.waitForDelay()
    this.throwIfFailureEnabled()

    const actions = this.readStoredActions()
    return this.vehicles.map((vehicle) => ({
      ...vehicle,
      currentAction: actions[vehicle.vehicleId] ?? null,
    }))
  }

  async updateVehicleAction(vehicleId: string, action: VehicleAction): Promise<void> {
    await this.waitForDelay()
    this.throwIfFailureEnabled()

    if (!this.vehicles.some((vehicle) => vehicle.vehicleId === vehicleId)) {
      throw new Error(`Unknown vehicle ID: ${vehicleId}`)
    }
    if (!action.action.trim()) {
      throw new Error('An action must be selected')
    }

    const actions = this.readStoredActions()
    actions[vehicleId] = { ...action, loggedAt: new Date().toISOString() }
    this.storage.setItem(actionStorageKey, JSON.stringify(actions))
  }

  private async waitForDelay(): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, this.delayMs)
    })
  }

  private throwIfFailureEnabled(): void {
    if (this.forceFailure) {
      throw new Error('MockInventoryService forced failure is enabled')
    }
  }

  private readStoredActions(): Record<string, VehicleAction> {
    const serialized = this.storage.getItem(actionStorageKey)
    if (serialized === null) {
      return {}
    }

    const parsed: unknown = JSON.parse(serialized)
    if (!isRecord(parsed)) {
      throw new Error('Stored vehicle actions must be an object')
    }

    const actions: Record<string, VehicleAction> = {}
    for (const [vehicleId, value] of Object.entries(parsed)) {
      if (!isVehicleAction(value)) {
        throw new Error(`Stored action for ${vehicleId} is invalid`)
      }
      actions[vehicleId] = value
    }
    return actions
  }

  private get storage(): Storage {
    if (this.storageOverride) {
      return this.storageOverride
    }
    if (typeof window === 'undefined') {
      throw new Error('MockInventoryService requires browser local storage')
    }
    return window.localStorage
  }
}

function isForcedFailureEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('forceFailure') === 'true'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isVehicleAction(value: unknown): value is VehicleAction {
  if (!isRecord(value) || typeof value.action !== 'string' || !value.action.trim()) {
    return false
  }
  return (
    (value.note === undefined || typeof value.note === 'string') &&
    (value.loggedAt === undefined || typeof value.loggedAt === 'string')
  )
}
