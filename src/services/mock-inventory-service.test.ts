import { describe, expect, it } from 'vitest'
import type { InventoryService } from './inventory-service'
import { MockInventoryService } from './mock-inventory-service'

describe('MockInventoryService', () => {
  it('resolves the inventory count through the service interface', async () => {
    const service: InventoryService = new MockInventoryService()

    await expect(service.getInventoryCount()).resolves.toBe(0)
  })
})
