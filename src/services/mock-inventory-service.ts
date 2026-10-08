import type { InventoryService } from './inventory-service'

export class MockInventoryService implements InventoryService {
  async getInventoryCount(): Promise<number> {
    return 0
  }
}
