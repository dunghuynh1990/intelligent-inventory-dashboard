import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MockInventoryService } from './services/mock-inventory-service'
import type { InventoryService } from './services/inventory-service'
import type { Vehicle } from './types/vehicle'
import App from './App'

const sampleVehicles: Vehicle[] = [
  {
    vehicleId: 'vehicle-001',
    stockNumber: 'STK-0001',
    vin: '1HGCM82633A004351',
    make: 'Ford',
    model: 'Escape',
    stockEntryDate: '2026-07-09',
    currentAction: { action: 'Price Reduction Planned', note: 'Review this week' },
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-002',
    stockNumber: 'STK-0002',
    vin: '1HGCM82633A004352',
    make: 'Honda',
    model: 'Civic',
    stockEntryDate: '2026-07-10',
    currentAction: null,
    daysInStock: 90,
    isAging: false,
    ageBand: '61-90',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-003',
    stockNumber: 'STK-0003',
    vin: '1HGCM82633A004353',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: 'invalid-date',
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
    entryDateIssue: 'Invalid entry date',
  },
  {
    vehicleId: 'vehicle-004',
    stockNumber: 'STK-0004',
    vin: '1HGCM82633A004354',
    make: 'Toyota',
    model: 'Corolla',
    stockEntryDate: '2026-07-09',
    currentAction: null,
    daysInStock: 91,
    isAging: true,
    ageBand: '>90',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-005',
    stockNumber: 'STK-0005',
    vin: '1HGCM82633A004355',
    make: 'Toyota',
    model: 'Camry',
    stockEntryDate: '2026-09-09',
    currentAction: null,
    daysInStock: 30,
    isAging: false,
    ageBand: '0-30',
    entryDateIssue: null,
  },
  {
    vehicleId: 'vehicle-006',
    stockNumber: 'STK-0006',
    vin: '1HGCM82633A004356',
    make: 'Chevrolet',
    model: 'Malibu',
    stockEntryDate: null,
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
    entryDateIssue: 'Missing entry date',
  },
  {
    vehicleId: 'vehicle-007',
    stockNumber: 'STK-0007',
    vin: '1HGCM82633A004357',
    make: 'Nissan',
    model: 'Altima',
    stockEntryDate: '2026-10-09',
    currentAction: null,
    daysInStock: null,
    isAging: false,
    ageBand: null,
    entryDateIssue: 'Future entry date',
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
  window.localStorage.clear()
  window.history.replaceState({}, '', '/')
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
    expect(screen.queryByRole('region', { name: 'Inventory summary' }))
      .not.toBeInTheDocument()

    await act(async () => {
      resolveVehicles(sampleVehicles)
    })

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Inventory summary' }))
      .toBeInTheDocument()
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
    expect(agingVehicleRow).toHaveTextContent('1HGCM82633A004351')
    expect(agingVehicleRow).toHaveTextContent('09-Jul-2026')
    expect(agingVehicleRow).toHaveTextContent('91')
    expect(within(agingVehicleRow).getByText('Aging')).toBeInTheDocument()
    expect(agingVehicleRow).toHaveTextContent('Price Reduction Planned')
    expect(agingVehicleRow).toHaveTextContent('Review this week')

    const nonAgingVehicleRow = within(table).getByRole('row', { name: /STK-0002/ })
    expect(within(nonAgingVehicleRow).queryByText('Aging')).not.toBeInTheDocument()
    expect(nonAgingVehicleRow).toHaveTextContent('No action')
    expect(within(nonAgingVehicleRow).queryByRole('button', { name: /action/i }))
      .not.toBeInTheDocument()
    expect(within(agingVehicleRow).getByRole('button', { name: 'Edit action' }))
      .toBeInTheDocument()
    const agingWithoutActionRow = within(table).getByRole('row', { name: /STK-0004/ })
    expect(within(agingWithoutActionRow).getByRole('button', { name: 'Propose action' }))
      .toBeInTheDocument()

    const unknownAgeVehicleRow = within(table).getByRole('row', { name: /STK-0003/ })
    expect(unknownAgeVehicleRow).toHaveTextContent('Unknown')
    expect(unknownAgeVehicleRow).toHaveTextContent('Invalid entry date')
    expect(within(unknownAgeVehicleRow).queryByText('Aging')).not.toBeInTheDocument()
    expect(within(unknownAgeVehicleRow).queryByRole('button', { name: /action/i }))
      .not.toBeInTheDocument()
    expect(within(unknownAgeVehicleRow).getByText('invalid-date')).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'VIN' })).toBeInTheDocument()

    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', refreshedAt.toISOString())
    expect(clock).toHaveBeenCalledOnce()
    expect(service.updateVehicleAction).not.toHaveBeenCalled()
  })

  it('formats missing and future dates and shows their textual issue states', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const missingDateRow = within(table).getByRole('row', { name: /STK-0006/ })
    const futureDateRow = within(table).getByRole('row', { name: /STK-0007/ })

    expect(missingDateRow).toHaveTextContent('—')
    expect(missingDateRow).toHaveTextContent('Missing entry date')
    expect(futureDateRow).toHaveTextContent('09-Oct-2026')
    expect(futureDateRow).toHaveTextContent('Future entry date')
    for (const row of [missingDateRow, futureDateRow]) {
      expect(row).toHaveTextContent('Unknown')
      expect(within(row).queryByText('Aging')).not.toBeInTheDocument()
      expect(within(row).queryByRole('button', { name: /action/i }))
        .not.toBeInTheDocument()
    }
  })

  it('highlights the matching VIN substring when searching by VIN', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), '004351')

    const row = within(screen.getByRole('table', { name: 'Vehicle inventory' }))
      .getByRole('row', { name: /STK-0001/ })
    expect(within(row).getByText('004351', { selector: 'mark' })).toBeInTheDocument()
  })

  it('replaces active filters with the Data issues view', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })
    await user.selectOptions(screen.getByLabelText('Make'), 'Ford')
    expect(within(screen.getByRole('table', { name: 'Vehicle inventory' }))
      .queryByRole('row', { name: /STK-0003/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Data issues (3)' }))

    const table = screen.getByRole('table', { name: 'Vehicle inventory' })
    expect(within(table).getAllByRole('row')).toHaveLength(4)
    expect(within(table).getByRole('row', { name: /STK-0003/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0006/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0007/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Make')).toHaveValue('')
  })

  it('validates a missing action and does not save a note by itself', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Propose action' }))
    await user.type(screen.getByLabelText('Note (optional)'), 'Review this week')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Select an action before saving.',
    )
    expect(row).toHaveTextContent('No action')
    expect(service.updateVehicleAction).not.toHaveBeenCalled()
  })

  it('keeps the previous action on save failure and retries the replacement', async () => {
    const vehicles: Vehicle[] = sampleVehicles.map((vehicle) =>
      vehicle.vehicleId === 'vehicle-004'
        ? { ...vehicle, currentAction: { action: 'Review', note: 'Existing note' } }
        : vehicle,
    )
    const updateVehicleAction = vi
      .fn<InventoryService['updateVehicleAction']>()
      .mockRejectedValueOnce(
        new Error('MockInventoryService forced failure is enabled'),
      )
      .mockResolvedValue(undefined)
    const service: InventoryService = {
      getVehicles: vi.fn().mockResolvedValue(vehicles),
      updateVehicleAction,
    }
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Edit action' }))
    await user.selectOptions(screen.getByLabelText('Action'), 'Price Reduction Planned')
    await user.clear(screen.getByLabelText('Note (optional)'))
    await user.type(screen.getByLabelText('Note (optional)'), 'New plan')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(row).toHaveTextContent('Review')
    expect(row).toHaveTextContent('Existing note')
    expect(within(row).queryByText('Price Reduction Planned', {
      selector: '.inventory-action span',
    })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry save' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry save' }))

    await waitFor(() => {
      expect(row).toHaveTextContent('Price Reduction Planned')
      expect(row).toHaveTextContent('New plan')
    })
    expect(row).not.toHaveTextContent('Existing note')
    expect(updateVehicleAction).toHaveBeenCalledTimes(2)
    expect(updateVehicleAction).toHaveBeenLastCalledWith('vehicle-004', {
      action: 'Price Reduction Planned',
      note: 'New plan',
    })
  })

  it('keeps the previous row action visible and disables controls while saving', async () => {
    let resolveSave: (() => void) | undefined
    const updateVehicleAction = vi.fn<InventoryService['updateVehicleAction']>(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve
        }),
    )
    const service: InventoryService = {
      getVehicles: vi.fn().mockResolvedValue(sampleVehicles),
      updateVehicleAction,
    }
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Propose action' }))
    await user.selectOptions(screen.getByLabelText('Action'), 'Price Reduction Planned')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    expect(row).toHaveTextContent('No action')
    expect(within(row).queryByText('Price Reduction Planned', {
      selector: '.inventory-action span',
    })).not.toBeInTheDocument()

    await act(async () => {
      resolveSave?.()
    })

    await waitFor(() => expect(row).toHaveTextContent('Price Reduction Planned'))
    expect(updateVehicleAction).toHaveBeenCalledWith('vehicle-004', {
      action: 'Price Reduction Planned',
    })
  })

  it('persists a saved action and note across dashboard reloads', async () => {
    const createService = () =>
      new MockInventoryService({
        referenceDate: new Date(2024, 5, 1, 12),
        delayMs: 0,
      })
    const user = userEvent.setup()
    const firstRender = render(<App inventoryService={createService()} />)
    const firstTable = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const agingVehicleRow = within(firstTable).getByRole('row', { name: /STK-0003/ })

    await user.click(within(agingVehicleRow).getByRole('button', { name: 'Propose action' }))
    await user.selectOptions(screen.getByLabelText('Action'), 'Price Reduction Planned')
    await user.type(screen.getByLabelText('Note (optional)'), 'Revisit next week')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    await waitFor(() => {
      expect(agingVehicleRow).toHaveTextContent('Price Reduction Planned')
      expect(agingVehicleRow).toHaveTextContent('Revisit next week')
    })
    firstRender.unmount()

    render(<App inventoryService={createService()} />)
    const reloadedTable = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const reloadedRow = within(reloadedTable).getByRole('row', { name: /STK-0003/ })
    expect(reloadedRow).toHaveTextContent('Price Reduction Planned')
    expect(reloadedRow).toHaveTextContent('Revisit next week')
    expect(within(reloadedRow).getByRole('button', { name: 'Edit action' }))
      .toBeInTheDocument()
  }, 15000)

  it('shows an empty-inventory message when the service returns no vehicles', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue([]))

    render(<App inventoryService={service} />)

    expect(await screen.findByText('No vehicles in inventory.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Inventory summary' })
    expect(within(summary).getAllByText('0', { selector: 'dd' })).toHaveLength(3)
  })

  it('shows inventory-wide summary counts unaffected by filters and updates after saving an action', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const summary = await screen.findByRole('region', { name: 'Inventory summary' })
    const getCount = (label: string) => {
      return within(summary).getByText(label).parentElement?.querySelector('dd') ?? null
    }

    expect(getCount('Total vehicles')).toHaveTextContent('7')
    expect(getCount('Aging vehicles')).toHaveTextContent('2')
    expect(getCount('Aging with an action')).toHaveTextContent('1')

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'Civic')
    expect(within(await screen.findByRole('table', { name: 'Vehicle inventory' }))
      .getAllByRole('row')).toHaveLength(2)
    expect(getCount('Total vehicles')).toHaveTextContent('7')
    expect(getCount('Aging vehicles')).toHaveTextContent('2')
    expect(getCount('Aging with an action')).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    const row = within(screen.getByRole('table', { name: 'Vehicle inventory' }))
      .getByRole('row', { name: /STK-0004/ })
    await user.click(within(row).getByRole('button', { name: 'Propose action' }))
    await user.selectOptions(screen.getByLabelText('Action'), 'Price Reduction Planned')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    await waitFor(() => {
      expect(getCount('Aging with an action')).toHaveTextContent('2')
    })
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

  it('shows the forced-failure state from the URL switch and offers retry', async () => {
    window.history.replaceState({}, '', '/?forceFailure=true')
    const service = new MockInventoryService({
      referenceDate: new Date(2024, 5, 1, 12),
      delayMs: 0,
    })
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
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
