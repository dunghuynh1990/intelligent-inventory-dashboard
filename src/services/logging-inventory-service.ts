import type { Logger } from '../observability/logger'
import { consoleLogger } from '../observability/logger'
import type { InventoryService } from './inventory-service'
import type { Vehicle, VehicleAction } from '../types/vehicle'

type CorrelationIdFactory = () => string

export function withLogging(
  service: InventoryService,
  logger: Logger = consoleLogger,
  createCorrelationId: CorrelationIdFactory = () => globalThis.crypto.randomUUID(),
): InventoryService {
  const run = async <Result>(
    operation: string,
    invoke: () => Promise<Result>,
  ): Promise<Result> => {
    const correlationId = createCorrelationId()
    const details = { operation, correlationId }
    logger.info('inventory.service.started', details)

    try {
      const result = await invoke()
      logger.info('inventory.service.succeeded', details)
      return result
    } catch (cause: unknown) {
      logger.error('inventory.service.failed', {
        ...details,
        error: cause instanceof Error ? cause.message : String(cause),
      })
      throw cause
    }
  }

  return {
    getVehicles: (): Promise<Vehicle[]> =>
      run('getVehicles', () => service.getVehicles()),
    updateVehicleAction: (vehicleId: string, action: VehicleAction): Promise<void> =>
      run('updateVehicleAction', () =>
        service.updateVehicleAction(vehicleId, action),
      ),
  }
}
