import type { Vehicle, VehicleAction } from '../types/vehicle'

export interface InventoryService {
  getVehicles(): Promise<Vehicle[]>
  updateVehicleAction(vehicleId: string, action: VehicleAction): Promise<void>
}
