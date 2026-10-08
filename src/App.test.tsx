import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { InventoryService } from './services/inventory-service'
import type { Vehicle } from './types/vehicle'
import App from './App'

const sampleVehicles: Vehicle[] = [
  {
    vehicleId: 'vehicle-001',
    stockNumber: 'STK-0001',
    make: 'Ford',
    model: 'Escape',
    stockEntryDate: '2026-07-09',
    currentAction: { action: 'Price Reduction Planned', note: 'Review this week' },
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
  },
  {
    vehicleId: 'vehicle-002',
    stockNumber: 'STK-0002',
    make: 'Honda',
    model: 'Civic',
    stockEntryDate: '2026-07-10',
    currentAction: null,
    daysInStock: 90,
    isAging: false,
    ageBand: '61-90',
  },
  {
    vehicleId: 'vehicle-003',
    stockNumber: 'STK-0003',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: 'invalid-date',
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
  },
  {
    vehicleId: 'vehicle-004',
    stockNumber: 'STK-0004',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: '2026-07-09',
    currentAction: null,
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
  },
  {
    vehicleId: 'vehicle-005',
    stockNumber: 'STK-0005',
    make: 'Toyota',
    model: 'Camry',
    stockEntryDate: '2026-09-09',
    currentAction: null,
    daysInStock: 30,
    isAging: false,
    ageBand: '0-30',
  },
]

function createInventoryService(getVehicles: InventoryService['getVehicles']): InventoryService {
  return {
    getVehicles,
    updateVehicleAction: vi.fn().mockResolvedValue(undefined),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('shows loading and hides the inventory table until retrieval completes', async () => {
    let resolveVehicles: (vehicles: Vehicle[]) => void = () => {
      throw new Error('Inventory request was not initialized')
    }
    const service = createInventoryService(
      vi.fn(
        () =>
          new Promise<Vehicle[]>((resolve) => {
            resolveVehicles = resolve
          }),
      ),
    )

    render(<App inventoryService={service} />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading inventory')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await act(async () => {
      resolveVehicles(sampleVehicles)
    })

    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('shows all returned vehicle details and a textual aging badge only for aging vehicles', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const refreshedAt = new Date('2026-10-08T10:43:00.000Z')
    const clock = vi.fn(() => refreshedAt)

    render(<App inventoryService={service} clock={clock} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    expect(within(table).getAllByRole('row')).toHaveLength(sampleVehicles.length + 1)

    const agingVehicleRow = within(table).getByRole('row', { name: /STK-0001/ })
    expect(agingVehicleRow).toHaveTextContent('Ford')
    expect(agingVehicleRow).toHaveTextContent('Escape')
    expect(agingVehicleRow).toHaveTextContent('2026-07-09')
    expect(agingVehicleRow).toHaveTextContent('91')
    expect(within(agingVehicleRow).getByText('Aging')).toBeInTheDocument()
    expect(agingVehicleRow).toHaveTextContent('Price Reduction Planned')
    expect(agingVehicleRow).toHaveTextContent('Review this week')

    const nonAgingVehicleRow = within(table).getByRole('row', { name: /STK-0002/ })
    expect(within(nonAgingVehicleRow).queryByText('Aging')).not.toBeInTheDocument()
    expect(nonAgingVehicleRow).toHaveTextContent('No action')

    const unknownAgeVehicleRow = within(table).getByRole('row', { name: /STK-0003/ })
    expect(unknownAgeVehicleRow).toHaveTextContent('Unknown')
    expect(within(unknownAgeVehicleRow).queryByText('Aging')).not.toBeInTheDocument()

    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', refreshedAt.toISOString())
    expect(clock).toHaveBeenCalledOnce()
    expect(service.updateVehicleAction).not.toHaveBeenCalled()
  })

  it('shows an empty-inventory message when the service returns no vehicles', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue([]))

    render(<App inventoryService={service} />)

    expect(await screen.findByText('No vehicles in inventory.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a service error and retries inventory retrieval', async () => {
    const getVehicles = vi
      .fn<InventoryService['getVehicles']>()
      .mockRejectedValueOnce(new Error('MockInventoryService forced failure is enabled'))
      .mockResolvedValueOnce(sampleVehicles)
    const service = createInventoryService(getVehicles)
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(getVehicles).toHaveBeenCalledTimes(2)
  })

  it('requests inventory again and updates last-refreshed time on manual refresh', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const firstRefresh = new Date('2026-10-08T10:00:00.000Z')
    const secondRefresh = new Date('2026-10-08T10:05:00.000Z')
    const clock = vi.fn().mockReturnValueOnce(firstRefresh).mockReturnValueOnce(secondRefresh)
    const user = userEvent.setup()

    render(<App inventoryService={service} clock={clock} />)
    await screen.findByRole('table')

    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', firstRefresh.toISOString())

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    await waitFor(() => {
      expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
        .toHaveAttribute('datetime', secondRefresh.toISOString())
    })
    expect(service.getVehicles).toHaveBeenCalledTimes(2)
  })

  it('keeps the last successful inventory and timestamp when refresh fails', async () => {
    const refreshedAt = new Date('2026-10-08T10:00:00.000Z')
    const getVehicles = vi
      .fn<InventoryService['getVehicles']>()
      .mockResolvedValueOnce(sampleVehicles)
      .mockRejectedValueOnce(new Error('Temporary service failure'))
    const service = createInventoryService(getVehicles)
    const clock = vi.fn(() => refreshedAt)
    const user = userEvent.setup()

    render(<App inventoryService={service} clock={clock} />)
    const table = await screen.findByRole('table')

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Temporary service failure')
    expect(table).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', refreshedAt.toISOString())
  })

  it('filters inventory by search, make, model, age band, and aging-only', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'cIv')
    expect(within(table).getAllByRole('row')).toHaveLength(2)
    expect(within(table).getByRole('row', { name: /STK-0002/ })).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox', { name: 'Search' }))
    await user.selectOptions(screen.getByLabelText('Make'), 'Toyota')
    expect(within(table).getAllByRole('row')).toHaveLength(4)
    expect(within(table).queryByRole('row', { name: /STK-0002/ })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Model'), 'Corolla')
    expect(within(table).getAllByRole('row')).toHaveLength(3)

    await user.selectOptions(screen.getByLabelText('Age band'), '>90')
    expect(within(table).getAllByRole('row')).toHaveLength(2)
    expect(within(table).getByRole('row', { name: /STK-0004/ })).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Aging only' }))
    expect(within(table).getAllByRole('row')).toHaveLength(2)
  })

  it('updates model options with make and clears a model unavailable for the new make', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.selectOptions(screen.getByLabelText('Make'), 'Honda')
    await user.selectOptions(screen.getByLabelText('Model'), 'Civic')
    expect(screen.getByLabelText('Model')).toHaveValue('Civic')

    await user.selectOptions(screen.getByLabelText('Make'), 'Toyota')

    expect(screen.getByLabelText('Model')).toHaveValue('')
    expect(
      within(screen.getByLabelText('Model')).getByRole('option', { name: 'Corolla' }),
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Model')).getByRole('option', { name: 'Camry' }),
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Model')).queryByRole('option', { name: 'Civic' }),
    ).not.toBeInTheDocument()
  })

  it('shows only aging vehicles when aging-only is enabled', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.click(screen.getByRole('checkbox', { name: 'Aging only' }))

    expect(screen.getByRole('checkbox', { name: 'Aging only' })).toBeChecked()
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0004/ })).toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-0002/ })).not.toBeInTheDocument()
  })

  it('combines active filters with AND and clears every filter', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'toyota')
    await user.selectOptions(screen.getByLabelText('Make'), 'Toyota')
    await user.selectOptions(screen.getByLabelText('Model'), 'Corolla')
    await user.selectOptions(screen.getByLabelText('Age band'), '>90')
    await user.click(screen.getByRole('checkbox', { name: 'Aging only' }))

    expect(within(table).getAllByRole('row')).toHaveLength(2)
    expect(within(table).getByRole('row', { name: /STK-0004/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
    expect(screen.getByLabelText('Make')).toHaveValue('')
    expect(screen.getByLabelText('Model')).toHaveValue('')
    expect(screen.getByLabelText('Age band')).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: 'Aging only' })).not.toBeChecked()
    expect(within(table).getAllByRole('row')).toHaveLength(sampleVehicles.length + 1)
  })

  it('shows a distinct no-results message and clears filters from that state', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'no matching vehicle')

    expect(await screen.findByText('No vehicles match these filters.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
    expect(screen.queryByText('No vehicles in inventory.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(await screen.findByRole('table', { name: 'Vehicle inventory' })).toBeInTheDocument()
    expect(screen.queryByText('No vehicles match these filters.')).not.toBeInTheDocument()
  })
})
