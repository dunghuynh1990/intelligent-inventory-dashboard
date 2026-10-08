import type { InventoryService } from './inventory-service'
import type { Vehicle, VehicleAction } from '../types/vehicle'

export class MockInventoryService implements InventoryService {
  getVehicles(): Promise<Vehicle[]> {
    return Promise.reject(new Error('MockInventoryService.getVehicles is not implemented'))
  }

  updateVehicleAction(_vehicleId: string, _action: VehicleAction): Promise<void> {
    void _vehicleId
    void _action
    return Promise.reject(
      new Error('MockInventoryService.updateVehicleAction is not implemented'),
    )
  }
}
