export type AgeBand = '0-30' | '31-60' | '61-90' | '>90'

export interface VehicleAction {
  action: string
  note?: string
}

export interface StoredVehicleData {
  vehicleId: string
  stockNumber: string
  make: string
  model: string
  stockEntryDate: string
  currentAction: VehicleAction | null
}

export interface CalculatedVehicleData {
  daysInStock: number | null
  isAging: boolean
  ageBand: AgeBand | null
}

export interface Vehicle extends StoredVehicleData, CalculatedVehicleData {}
