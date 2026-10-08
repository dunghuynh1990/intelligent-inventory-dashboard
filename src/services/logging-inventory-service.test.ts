import { describe, expect, it, vi } from 'vitest'
import type { Logger } from '../observability/logger'
import { MockInventoryService } from './mock-inventory-service'
import { withLogging } from './logging-inventory-service'

describe('withLogging', () => {
  it('logs mock service calls with unique correlation IDs', async () => {
    const logger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
    }
    const service = new MockInventoryService({
      referenceDate: new Date(2024, 5, 1, 12),
      delayMs: 0,
    })
    const createCorrelationId = vi
      .fn<() => string>()
      .mockReturnValueOnce('call-001')
      .mockReturnValueOnce('call-002')
    const loggedService = withLogging(service, logger, createCorrelationId)

    await expect(loggedService.getVehicles()).resolves.toHaveLength(200)
    await loggedService.updateVehicleAction('vehicle-001', {
      action: 'Price Reduction Planned',
    })

    expect(logger.info).toHaveBeenNthCalledWith(1, 'inventory.service.started', {
      operation: 'getVehicles',
      correlationId: 'call-001',
    })
    expect(logger.info).toHaveBeenNthCalledWith(2, 'inventory.service.succeeded', {
      operation: 'getVehicles',
      correlationId: 'call-001',
    })
    expect(logger.info).toHaveBeenNthCalledWith(3, 'inventory.service.started', {
      operation: 'updateVehicleAction',
      correlationId: 'call-002',
    })
    expect(logger.info).toHaveBeenNthCalledWith(4, 'inventory.service.succeeded', {
      operation: 'updateVehicleAction',
      correlationId: 'call-002',
    })
  })

  it('logs failed calls and rethrows the original service error', async () => {
    const logger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
    }
    const failure = new Error('Service unavailable')
    const service = {
      getVehicles: vi.fn().mockRejectedValue(failure),
      updateVehicleAction: vi.fn().mockResolvedValue(undefined),
    }
    const loggedService = withLogging(service, logger, () => 'call-failed')

    await expect(loggedService.getVehicles()).rejects.toBe(failure)

    expect(logger.error).toHaveBeenCalledWith('inventory.service.failed', {
      operation: 'getVehicles',
      correlationId: 'call-failed',
      error: 'Service unavailable',
    })
  })
})
