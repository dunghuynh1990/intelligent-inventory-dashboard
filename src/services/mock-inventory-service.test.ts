import { describe, expect, it } from 'vitest'
import type { InventoryService } from './inventory-service'
import { MockInventoryService } from './mock-inventory-service'

describe('MockInventoryService', () => {
  it('reports that vehicle retrieval is not implemented yet', async () => {
    const service: InventoryService = new MockInventoryService()

    await expect(service.getVehicles()).rejects.toThrow(
      'MockInventoryService.getVehicles is not implemented',
    )
  })

  it('reports that action updates are not implemented yet', async () => {
    const service: InventoryService = new MockInventoryService()

    await expect(
      service.updateVehicleAction('vehicle-1', { action: 'Price Reduction Planned' }),
    ).rejects.toThrow('MockInventoryService.updateVehicleAction is not implemented')
  })
})
