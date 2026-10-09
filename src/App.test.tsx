import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MockInventoryService } from './services/mock-inventory-service'
import type { InventoryService } from './services/inventory-service'
import type { Logger } from './observability/logger'
import { withLogging } from './services/logging-inventory-service'
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

function createVehicles(count: number): Vehicle[] {
  return Array.from({ length: count }, (_, index) => {
    const sourceVehicle = sampleVehicles[index % sampleVehicles.length]
    const number = String(index + 1).padStart(4, '0')

    return {
      ...sourceVehicle,
      vehicleId: `vehicle-${number}`,
      stockNumber: `STK-${number}`,
    }
  })
}

function showing(text: string) {
  return (_content: string, element: Element | null) =>
    element?.classList.contains('inventory-result-count') === true &&
    element.textContent === `${text} vehicles`
}

function getStockOrder(table: HTMLElement): string[] {
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('rowheader')[0].textContent ?? '')
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  window.localStorage.clear()
  window.history.replaceState({}, '', '/')
})

const formFor = (stockNumber: string) =>
  within(screen.getByRole('form', { name: `Propose an action for ${stockNumber}` }))

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
    expect(within(agingVehicleRow).getByText('1 over')).toBeInTheDocument()
    expect(agingVehicleRow).toHaveTextContent('aging, 1 day over')
    expect(agingVehicleRow).toHaveTextContent('Price Reduction Planned')
    expect(agingVehicleRow).toHaveTextContent('Review this week')

    const nonAgingVehicleRow = within(table).getByRole('row', { name: /STK-0002/ })
    expect(within(nonAgingVehicleRow).getByText('1 to go')).toBeInTheDocument()
    expect(within(nonAgingVehicleRow).queryByText(/over/)).not.toBeInTheDocument()
    expect(nonAgingVehicleRow).not.toHaveTextContent('In range')
    const normalRow = within(table).getByRole('row', { name: /STK-0005/ })
    expect(within(normalRow).queryByText(/over|to go/)).not.toBeInTheDocument()
    expect(nonAgingVehicleRow).toHaveTextContent('No action')
    expect(within(nonAgingVehicleRow).queryByRole('button', { name: /action/i }))
      .not.toBeInTheDocument()
    expect(within(agingVehicleRow).getByRole('button', { name: 'Change' }))
      .toBeInTheDocument()
    const agingWithoutActionRow = within(table).getByRole('row', { name: /STK-0004/ })
    expect(within(agingWithoutActionRow).getByRole('button', { name: 'Log action' }))
      .toBeInTheDocument()

    const unknownAgeVehicleRow = within(table).getByRole('row', { name: /STK-0003/ })
    expect(unknownAgeVehicleRow).toHaveTextContent('Invalid entry date')
    expect(unknownAgeVehicleRow).not.toHaveTextContent('Unknown')
    expect(within(unknownAgeVehicleRow).queryByText(/over|to go/)).not.toBeInTheDocument()
    expect(within(unknownAgeVehicleRow).queryByRole('button', { name: /action/i }))
      .not.toBeInTheDocument()
    expect(within(unknownAgeVehicleRow).getByText('invalid-date')).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'VIN' })).toBeInTheDocument()

    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', refreshedAt.toISOString())
    expect(clock).toHaveBeenCalledOnce()
    expect(service.updateVehicleAction).not.toHaveBeenCalled()
  })

  it('toggles the early-warning summary card to filter matching ages and due tags', async () => {
    const earlyWarningVehicles: Vehicle[] = [
      {
        ...sampleVehicles[0],
        vehicleId: 'vehicle-084',
        stockNumber: 'STK-84',
        daysInStock: 84,
        isAging: false,
        ageBand: '61-90',
        currentAction: null,
      },
      {
        ...sampleVehicles[1],
        vehicleId: 'vehicle-090',
        stockNumber: 'STK-90',
        daysInStock: 90,
        isAging: false,
        ageBand: '61-90',
      },
      {
        ...sampleVehicles[4],
        vehicleId: 'vehicle-083',
        stockNumber: 'STK-83',
        daysInStock: 83,
        ageBand: '61-90',
      },
      {
        ...sampleVehicles[3],
        vehicleId: 'vehicle-091',
        stockNumber: 'STK-91',
      },
    ]
    const service = createInventoryService(
      vi.fn().mockResolvedValue(earlyWarningVehicles),
    )
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const earlyWarningButton = screen.getByRole('button', {
      name: 'Show these vehicles',
    })
    expect(earlyWarningButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(earlyWarningButton)

    expect(earlyWarningButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-2 of 2')
    expect(within(table).getByRole('row', { name: /STK-84/ }))
      .toHaveTextContent('7 to go')
    expect(within(table).getByRole('row', { name: /STK-90/ }))
      .toHaveTextContent('1 to go')
    expect(within(table).queryByRole('row', { name: /STK-83/ }))
      .not.toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-91/ }))
      .not.toBeInTheDocument()
    expect(screen.getByRole('button', {
      name: 'Remove Turning aging in 7 days filter',
    })).toBeInTheDocument()

    await user.click(earlyWarningButton)

    expect(earlyWarningButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-4 of 4')
  })

  it('shows age profile counts and shares and replaces filters when a band is selected', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    const summary = await screen.findByRole('region', { name: 'Inventory summary' })
    const profile = within(summary).getByRole('region', { name: 'Age profile' })
    expect(profile.querySelectorAll('.age-profile__segment')).toHaveLength(4)
    expect(summary.querySelector('.age-profile__threshold'))
      .toHaveStyle({ left: '50%' })
    expect(within(summary).getByText('Select a band to filter the list. Exactly 90 days is not aging.'))
      .toBeInTheDocument()
    expect(within(summary).getByRole('button', {
      name: '3 with unknown age (data issue)',
    })).toHaveAttribute('aria-pressed', 'false')
    expect(within(summary).getByText('Aging stock · more than 90 days').parentElement)
      .toHaveTextContent('2')
    expect(within(summary).getByRole('progressbar', {
      name: 'Aging vehicles with an action',
    })).toHaveAttribute('max', '2')
    expect(within(summary).getByText('/ 2')).toBeInTheDocument()

    const bandButton = within(summary).getByRole('button', {
      name: '0-30 days, 1 vehicle, 25%',
    })
    expect(bandButton).toHaveAttribute('aria-pressed', 'false')
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'Civic')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(bandButton)

    expect(bandButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Vehicle inventory' })
    expect(within(table).getByRole('row', { name: /STK-0005/ }))
      .toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-0002/ }))
      .not.toBeInTheDocument()

    await user.click(bandButton)

    expect(bandButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText(showing('Showing 1-7 of 7'))).toBeInTheDocument()
  })

  it('shows counted preset views and replaces all active filters when a preset is selected', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    const views = await screen.findByRole('region', { name: 'Inventory views' })
    expect(within(views).getAllByRole('button')).toHaveLength(8)
    expect(within(views).getByRole('button', { name: 'All vehicles (7)' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(within(views).getByRole('button', { name: 'Needs action (1)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Aging stock (2)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Action planned (1)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Turning aging this week (1)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Approaching 90 days (1)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Data issues (3)' }))
      .toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'New arrivals (0-30) (1)' }))
      .toBeInTheDocument()
    expect(within(views).queryByText('Custom filters')).not.toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'Civic')
    expect(within(views).queryByText('Custom filters')).not.toBeInTheDocument()
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', { name: 'Aging stock (2)' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
    expect(screen.getByLabelText('Age band')).toHaveValue('>90')
    expect(screen.getByText(showing('Showing 1-2 of 2'))).toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Aging stock (2)' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(within(views).queryByText('Custom filters')).not.toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Vehicle inventory' })
    expect(within(table).getByRole('row', { name: /STK-0001/ }))
      .toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0004/ }))
      .toBeInTheDocument()

    await user.click(within(views).getByRole('button', { name: 'All vehicles (7)' }))

    expect(screen.getByLabelText('Age band')).toHaveValue('')
    expect(screen.getByText(showing('Showing 1-7 of 7'))).toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'All vehicles (7)' }))
      .toHaveAttribute('aria-pressed', 'true')

    await user.click(within(views).getByRole('button', { name: 'Needs action (1)' }))
    expect(screen.getByLabelText('Action')).toHaveValue('no-action')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', { name: 'Action planned (1)' }))
    expect(screen.getByLabelText('Action')).toHaveValue('has-action')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', {
      name: 'Turning aging this week (1)',
    }))
    expect(screen.getByRole('button', {
      name: 'Remove Turning aging in 7 days filter',
    })).toBeInTheDocument()
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', {
      name: 'Approaching 90 days (1)',
    }))
    expect(screen.getByLabelText('Age band')).toHaveValue('61-90')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', { name: 'Data issues (3)' }))
    expect(screen.getByText(showing('Showing 1-3 of 3'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', {
      name: 'New arrivals (0-30) (1)',
    }))
    expect(screen.getByLabelText('Age band')).toHaveValue('0-30')
    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()

    await user.click(within(views).getByRole('button', { name: 'All vehicles (7)' }))
    expect(screen.getByText(showing('Showing 1-7 of 7'))).toBeInTheDocument()
  })

  it('flags only aging actions logged more than 14 calendar days ago', async () => {
    const now = new Date()
    const loggedDaysAgo = (daysAgo: number) =>
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - daysAgo,
        8,
      ).toISOString()
    const vehicles = sampleVehicles.map((vehicle) => {
      if (vehicle.vehicleId === 'vehicle-001') {
        return {
          ...vehicle,
          currentAction: {
            action: 'Price Reduction Planned',
            loggedAt: loggedDaysAgo(14),
          },
        }
      }
      if (vehicle.vehicleId === 'vehicle-002') {
        return {
          ...vehicle,
          currentAction: {
            action: 'Under Review',
            loggedAt: loggedDaysAgo(15),
          },
        }
      }
      if (vehicle.vehicleId === 'vehicle-004') {
        return {
          ...vehicle,
          currentAction: {
            action: 'Send to Auction',
            loggedAt: loggedDaysAgo(15),
          },
        }
      }
      return vehicle
    })
    const service = createInventoryService(vi.fn().mockResolvedValue(vehicles))

    render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const actionAt14Days = within(table).getByRole('row', { name: /STK-0001/ })
    const nonAgingActionAt15Days = within(table).getByRole('row', { name: /STK-0002/ })
    const agingActionAt15Days = within(table).getByRole('row', { name: /STK-0004/ })

    expect(within(actionAt14Days).queryByText('check progress'))
      .not.toBeInTheDocument()
    expect(within(nonAgingActionAt15Days).queryByText('check progress'))
      .not.toBeInTheDocument()
    expect(within(agingActionAt15Days).getByText('check progress'))
      .toBeInTheDocument()
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
      expect(row).not.toHaveTextContent('Unknown')
      expect(within(row).queryByText(/over|to go/)).not.toBeInTheDocument()
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

    const issuesButton = screen.getByRole('button', {
      name: '3 with unknown age (data issue)',
    })
    await user.click(issuesButton)

    const table = screen.getByRole('table', { name: 'Vehicle inventory' })
    expect(issuesButton).toHaveAttribute('aria-pressed', 'true')
    expect(within(table).getAllByRole('row')).toHaveLength(4)
    expect(within(table).getByRole('row', { name: /STK-0003/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0006/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0007/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Make')).toHaveValue('')

    await user.click(issuesButton)
    expect(issuesButton).toHaveAttribute('aria-pressed', 'false')
    expect(within(table).getAllByRole('row')).toHaveLength(sampleVehicles.length + 1)
  })

  it('opens the action editor inline under the row and closes it on Cancel', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    const form = within(table).getByRole('form', { name: 'Propose an action for STK-0004' })
    expect(row.nextElementSibling).toContainElement(form)
    expect(within(row).queryByRole('button', { name: 'Log action' })).not.toBeInTheDocument()
    expect(within(form).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Choose an action...',
      'Price Reduction Planned',
      'Transfer to Another Site',
      'Send to Auction',
      'Promote in Campaign',
      'Under Review',
    ])

    await user.click(within(form).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(within(row).getByRole('button', { name: 'Log action' })).toBeInTheDocument()
  })

  it('validates a missing action and does not save a note by itself', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    expect(
      screen.getByRole('form', { name: 'Propose an action for STK-0004' }),
    ).toBeInTheDocument()
    await user.type(screen.getByLabelText('Note (optional)'), 'Review this week')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Select an action before saving.',
    )
    expect(within(row).getByText('No action yet')).toBeInTheDocument()
    expect(service.updateVehicleAction).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
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
    let callNumber = 0
    const logger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
    }
    const loggedService = withLogging(service, logger, () => `call-${++callNumber}`)
    const user = userEvent.setup()

    render(<App inventoryService={loggedService} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })

    await user.click(within(row).getByRole('button', { name: 'Change' }))
    const actionForm = within(
      screen.getByRole('form', { name: 'Propose an action for STK-0004' }),
    )
    await user.selectOptions(actionForm.getByLabelText('Action'), 'Price Reduction Planned')
    await user.clear(actionForm.getByLabelText('Note (optional)'))
    await user.type(actionForm.getByLabelText('Note (optional)'), 'New plan')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Ref: call-2')
    expect(logger.error).toHaveBeenCalledWith('inventory.service.failed', {
      operation: 'updateVehicleAction',
      correlationId: 'call-2',
      error: 'MockInventoryService forced failure is enabled',
    })
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

  it('confirms a successful save and displays its logged age from the injected clock', async () => {
    const loggedAt = new Date()
    const clock = vi.fn(() => loggedAt)
    const vehicles = sampleVehicles.map((vehicle) =>
      vehicle.vehicleId === 'vehicle-001'
        ? {
            ...vehicle,
            currentAction: {
              action: 'Price Reduction Planned',
              note: 'Review this week',
              loggedAt: new Date(loggedAt.getTime() - 3 * 24 * 60 * 60 * 1000)
                .toISOString(),
            },
          }
        : vehicle,
    )
    const service = createInventoryService(vi.fn().mockResolvedValue(vehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} clock={clock} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0004/ })
    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    const actionDialog = screen.getByRole('form', {
      name: 'Propose an action for STK-0004',
    })
    await user.selectOptions(
      within(actionDialog).getByLabelText('Action'),
      'Price Reduction Planned',
    )
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByText('Action saved')).toHaveAttribute('role', 'status')
    expect(row).toHaveTextContent('Logged today')
    expect(
      within(screen.getByRole('row', { name: /STK-0001/ })).getByText(
        'Logged 3 days ago',
      ),
    ).toBeInTheDocument()
    expect(clock).toHaveBeenCalledTimes(2)
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

    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    const actionForm = within(
      screen.getByRole('form', { name: 'Propose an action for STK-0004' }),
    )
    await user.selectOptions(actionForm.getByLabelText('Action'), 'Price Reduction Planned')
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

    await user.click(within(agingVehicleRow).getByRole('button', { name: 'Log action' }))
    const actionForm = within(
      screen.getByRole('form', { name: 'Propose an action for STK-0003' }),
    )
    await user.selectOptions(actionForm.getByLabelText('Action'), 'Price Reduction Planned')
    await user.type(actionForm.getByLabelText('Note (optional)'), 'Revisit next week')
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
    expect(within(reloadedRow).getByRole('button', { name: 'Change' }))
      .toBeInTheDocument()
  }, 15000)

  it('keeps the stored action when a forced service failure rejects a save, and nothing persists on reload', async () => {
    const referenceDate = new Date(2024, 5, 1, 12)
    const healthyService = new MockInventoryService({ referenceDate, delayMs: 0 })
    const failingService = new MockInventoryService({
      referenceDate,
      delayMs: 0,
      forceFailure: true,
    })
    const service: InventoryService = {
      getVehicles: () => healthyService.getVehicles(),
      updateVehicleAction: (vehicleId, action) =>
        failingService.updateVehicleAction(vehicleId, action),
    }
    const user = userEvent.setup()

    const view = render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0003/ })
    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    await user.selectOptions(formFor('STK-0003').getByLabelText('Action'), 'Send to Auction')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'MockInventoryService forced failure is enabled',
    )
    expect(row).toHaveTextContent('No action yet')
    expect(window.localStorage.getItem('intelligent-inventory-dashboard:vehicle-actions'))
      .toBeNull()
    view.unmount()

    render(<App inventoryService={new MockInventoryService({ referenceDate, delayMs: 0 })} />)
    const reloadedTable = await screen.findByRole('table', { name: 'Vehicle inventory' })
    expect(within(reloadedTable).getByRole('row', { name: /STK-0003/ }))
      .toHaveTextContent('No action yet')
  }, 15000)

  it('replaces a saved action with a new one and persists only the replacement', async () => {
    const referenceDate = new Date(2024, 5, 1, 12)
    const createService = () => new MockInventoryService({ referenceDate, delayMs: 0 })
    const user = userEvent.setup()
    const view = render(<App inventoryService={createService()} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0003/ })

    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    await user.selectOptions(formFor('STK-0003').getByLabelText('Action'), 'Send to Auction')
    await user.type(formFor('STK-0003').getByLabelText('Note (optional)'), 'First plan')
    await user.click(screen.getByRole('button', { name: 'Save action' }))
    await waitFor(() => expect(row).toHaveTextContent('Send to Auction'))

    await user.click(within(row).getByRole('button', { name: 'Change' }))
    await user.selectOptions(formFor('STK-0003').getByLabelText('Action'), 'Under Review')
    await user.clear(formFor('STK-0003').getByLabelText('Note (optional)'))
    await user.type(formFor('STK-0003').getByLabelText('Note (optional)'), 'Second plan')
    await user.click(screen.getByRole('button', { name: 'Save action' }))
    await waitFor(() => expect(row).toHaveTextContent('Under Review'))
    expect(row).not.toHaveTextContent('Send to Auction')
    expect(row).not.toHaveTextContent('First plan')
    view.unmount()

    const stored = JSON.parse(
      window.localStorage.getItem('intelligent-inventory-dashboard:vehicle-actions') ?? '{}',
    ) as Record<string, { action: string; note?: string }>
    expect(Object.keys(stored)).toEqual(['vehicle-003'])
    expect(stored['vehicle-003']).toMatchObject({ action: 'Under Review', note: 'Second plan' })

    render(<App inventoryService={createService()} />)
    const reloadedRow = within(
      await screen.findByRole('table', { name: 'Vehicle inventory' }),
    ).getByRole('row', { name: /STK-0003/ })
    expect(reloadedRow).toHaveTextContent('Under Review')
    expect(reloadedRow).toHaveTextContent('Second plan')
    expect(reloadedRow).not.toHaveTextContent('Send to Auction')
  }, 20000)

  it('keeps an existing action unchanged when validation rejects clearing the selection', async () => {
    const updateVehicleAction = vi.fn<InventoryService['updateVehicleAction']>()
    const service: InventoryService = {
      getVehicles: vi.fn().mockResolvedValue(sampleVehicles),
      updateVehicleAction,
    }
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const row = within(table).getByRole('row', { name: /STK-0001/ })
    await user.click(within(row).getByRole('button', { name: 'Change' }))
    await user.selectOptions(formFor('STK-0001').getByLabelText('Action'), '')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Select an action before saving.')
    expect(updateVehicleAction).not.toHaveBeenCalled()
    expect(row).toHaveTextContent('Price Reduction Planned')
    expect(row).toHaveTextContent('Review this week')
  })

  it('offers no action control on a vehicle with exactly 90 days in stock', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))

    render(<App inventoryService={service} />)
    const row = within(await screen.findByRole('table', { name: 'Vehicle inventory' }))
      .getByRole('row', { name: /STK-0002/ })

    expect(row).toHaveTextContent('90')
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows an empty-inventory message when the service returns no vehicles', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue([]))

    render(<App inventoryService={service} />)

    expect(await screen.findByText('No vehicles in inventory.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Inventory summary' })
    expect(summary.querySelectorAll('.inventory-summary__card > dd > strong'))
      .toHaveLength(4)
    expect([...summary.querySelectorAll('.inventory-summary__card > dd > strong')]
      .every((value) => value.textContent === '0')).toBe(true)
    expect(within(summary).getByText('Aging stock · more than 90 days').parentElement)
      .toHaveTextContent('0%')
    expect(within(summary).getByRole('progressbar', {
      name: 'Aging vehicles with an action',
    })).toHaveAttribute('max', '1')
    expect(within(summary).getByText('/ 0')).toBeInTheDocument()
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
    expect(getCount('Aging stock · more than 90 days')).toHaveTextContent('2')
    expect(getCount('Aging vehicles with an action')).toHaveTextContent('1')

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'Civic')
    expect(within(await screen.findByRole('table', { name: 'Vehicle inventory' }))
      .getAllByRole('row')).toHaveLength(2)
    expect(getCount('Total vehicles')).toHaveTextContent('7')
    expect(getCount('Aging stock · more than 90 days')).toHaveTextContent('2')
    expect(getCount('Aging vehicles with an action')).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    const row = within(screen.getByRole('table', { name: 'Vehicle inventory' }))
      .getByRole('row', { name: /STK-0004/ })
    await user.click(within(row).getByRole('button', { name: 'Log action' }))
    const actionForm = within(
      screen.getByRole('form', { name: 'Propose an action for STK-0004' }),
    )
    await user.selectOptions(actionForm.getByLabelText('Action'), 'Price Reduction Planned')
    await user.click(screen.getByRole('button', { name: 'Save action' }))

    await waitFor(() => {
      expect(getCount('Aging vehicles with an action')).toHaveTextContent('2')
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
    const firstRefresh = new Date()
    const secondRefresh = new Date(firstRefresh.getTime() + 5 * 60 * 1000)
    const clock = vi.fn()
      .mockReturnValueOnce(firstRefresh)
      .mockReturnValueOnce(secondRefresh)
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
    const refreshedAt = new Date()
    const retriedAt = new Date(refreshedAt.getTime() + 5 * 60 * 1000)
    const getVehicles = vi
      .fn<InventoryService['getVehicles']>()
      .mockResolvedValueOnce(sampleVehicles)
      .mockRejectedValueOnce(new Error('Temporary service failure'))
      .mockResolvedValueOnce(sampleVehicles)
    const service = createInventoryService(getVehicles)
    const clock = vi.fn()
      .mockReturnValueOnce(refreshedAt)
      .mockReturnValueOnce(retriedAt)
    const user = userEvent.setup()

    render(<App inventoryService={service} clock={clock} />)
    const table = await screen.findByRole('table')

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Temporary service failure')
    expect(table).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
      .toHaveAttribute('datetime', refreshedAt.toISOString())
    await user.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Retry' }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByText('Last refreshed').parentElement?.querySelector('time'))
        .toHaveAttribute('datetime', retriedAt.toISOString())
    })
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(getVehicles).toHaveBeenCalledTimes(3)
  })

  it('shows the reference date and amber elapsed freshness after 15 minutes', async () => {
    vi.useFakeTimers()
    const refreshedAt = new Date(2026, 9, 9, 10, 0)
    const now = new Date(2026, 9, 9, 10, 25)
    vi.setSystemTime(now)
    const clock = vi.fn(() => refreshedAt)
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))

    render(<App inventoryService={service} clock={clock} />)
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(screen.getByText('Reference date').parentElement).toHaveTextContent(
      '09-Oct-2026',
    )
    expect(screen.getByText('Last refreshed').parentElement)
      .toHaveAttribute('data-freshness-level', 'amber')
    expect(screen.getByText('Last refreshed').parentElement).toHaveTextContent(
      '25 min ago',
    )
    expect(screen.queryByRole('status', { name: 'Stale inventory warning' }))
      .not.toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })
    expect(screen.getByText('Last refreshed').parentElement).toHaveTextContent(
      '26 min ago',
    )
  })

  it('shows a stale-data warning and refresh control at 60 minutes', async () => {
    vi.useFakeTimers()
    const refreshedAt = new Date(2026, 9, 9, 10, 0)
    const now = new Date(2026, 9, 9, 11, 0)
    vi.setSystemTime(now)
    const clock = vi.fn(() => refreshedAt)
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))

    render(<App inventoryService={service} clock={clock} />)
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    const warning = screen.getByRole('status', { name: 'Stale inventory warning' })
    const summary = screen.getByRole('region', { name: 'Inventory summary' })
    expect(warning).toHaveTextContent('60 min ago')
    expect(within(warning).getByRole('button', { name: 'Refresh now' }))
      .toBeInTheDocument()
    expect(warning.compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy()
    expect(screen.getByText('Last refreshed').parentElement)
      .toHaveAttribute('data-freshness-level', 'warning')
  })

  it('shows the default page and supports first, previous, numbered, next, and last-page navigation', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(createVehicles(200)))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const pager = screen.getByRole('navigation', { name: 'Inventory pagination' })
    expect(screen.getByText(showing('Showing 1-20 of 200'))).toBeInTheDocument()
    expect(within(table).getAllByRole('row')).toHaveLength(21)
    expect(screen.getByText('Page 1 / 10')).toBeInTheDocument()
    expect(within(pager).getAllByRole('option').map((option) => option.textContent))
      .toEqual(['10', '20', '50', '100'])
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-0021/ })).not.toBeInTheDocument()

    await user.click(within(pager).getByRole('button', { name: 'Next page' }))
    expect(screen.getByText(showing('Showing 21-40 of 200'))).toBeInTheDocument()
    expect(screen.getByText('Page 2 / 10')).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0021/ })).toBeInTheDocument()

    await user.click(within(pager).getByRole('button', { name: 'Page 4' }))
    expect(within(pager).getAllByText('…')).toHaveLength(2)
    expect(screen.getByText(showing('Showing 61-80 of 200'))).toBeInTheDocument()

    await user.click(within(pager).getByRole('button', { name: 'Last page' }))
    expect(screen.getByText(showing('Showing 181-200 of 200'))).toBeInTheDocument()
    expect(screen.getByText('Page 10 / 10')).toBeInTheDocument()

    await user.click(within(pager).getByRole('button', { name: 'First page' }))
    expect(screen.getByText(showing('Showing 1-20 of 200'))).toBeInTheDocument()
    await user.click(within(pager).getByRole('button', { name: 'Page 3' }))
    await user.click(within(pager).getByRole('button', { name: 'Previous page' }))
    expect(screen.getByText(showing('Showing 21-40 of 200'))).toBeInTheDocument()
  }, 15000)

  it('changes page size, resets to page one when a filter changes, and does not persist paging state', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(createVehicles(45)))
    const user = userEvent.setup()
    const view = render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const pager = screen.getByRole('navigation', { name: 'Inventory pagination' })
    await user.selectOptions(screen.getByLabelText('Rows per page'), '10')
    expect(screen.getByText(showing('Showing 1-10 of 45'))).toBeInTheDocument()
    expect(within(table).getAllByRole('row')).toHaveLength(11)
    expect(screen.getByText('Page 1 / 5')).toBeInTheDocument()

    await user.click(within(pager).getByRole('button', { name: 'Page 3' }))
    expect(screen.getByText(showing('Showing 21-30 of 45'))).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'STK-0045')

    expect(screen.getByText(showing('Showing 1-1 of 1'))).toBeInTheDocument()
    expect(screen.queryByText('Page 1 / 1')).not.toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /STK-0045/ })).toBeInTheDocument()

    view.unmount()
    render(<App inventoryService={service} />)

    await screen.findByRole('table', { name: 'Vehicle inventory' })
    expect(screen.getByLabelText('Rows per page')).toHaveValue('20')
    expect(screen.getByText(showing('Showing 1-20 of 45'))).toBeInTheDocument()
  })

  it('returns to page one when any filter changes from page three', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(createVehicles(45)))
    const user = userEvent.setup()
    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })
    await user.selectOptions(screen.getByLabelText('Rows per page'), '10')

    const changes: Array<() => Promise<void>> = [
      () => user.type(screen.getByRole('searchbox', { name: 'Search' }), 'STK'),
      () => user.selectOptions(screen.getByLabelText('Make'), 'Toyota'),
      () => user.selectOptions(screen.getByLabelText('Model'), 'Corolla'),
      () => user.selectOptions(screen.getByLabelText('Age band'), '>90'),
      () => user.selectOptions(screen.getByLabelText('Action'), 'has-action'),
      () => user.click(screen.getByRole('checkbox', { name: 'Aging only' })),
    ]

    for (const change of changes) {
      await user.click(
        within(screen.getByRole('navigation', { name: 'Inventory pagination' }))
          .getByRole('button', { name: 'Page 3' }),
      )
      expect(screen.getByText(showing('Showing 21-30 of 45'))).toBeInTheDocument()

      await change()
      expect(screen.getByRole('status')).toHaveTextContent(/Showing 1-\d+ of \d+/)

      await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    }
  }, 15000)

  it('clamps the current page when a refreshed inventory shrinks', async () => {
    const getVehicles = vi.fn()
      .mockResolvedValueOnce(createVehicles(45))
      .mockResolvedValueOnce(createVehicles(15))
    const service = createInventoryService(getVehicles)
    const user = userEvent.setup()

    render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const pager = screen.getByRole('navigation', { name: 'Inventory pagination' })
    await user.selectOptions(screen.getByLabelText('Rows per page'), '10')
    await user.click(within(pager).getByRole('button', { name: 'Page 4' }))
    expect(screen.getByText(showing('Showing 31-40 of 45'))).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    await waitFor(() => {
      expect(screen.getByText(showing('Showing 11-15 of 15'))).toBeInTheDocument()
      expect(screen.getByText('Page 2 / 2')).toBeInTheDocument()
    })
    expect(within(table).getAllByRole('row')).toHaveLength(6)
    expect(getVehicles).toHaveBeenCalledTimes(2)
  })

  it('sorts by Days in stock, reflects state in headers and the order note, and resets', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const header = within(table).getByRole('columnheader', { name: /Age \(days\)/ })
    const sortButton = within(header).getByRole('button')
    const defaultOrder = getStockOrder(table)
    expect(header).toHaveAttribute('aria-sort', 'none')
    expect(screen.getByText(/Default order/)).toBeInTheDocument()

    await user.click(sortButton)
    expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(getStockOrder(table)).toEqual([
      'STK-0001', 'STK-0004', 'STK-0002', 'STK-0005',
      'STK-0003', 'STK-0006', 'STK-0007',
    ])
    expect(screen.getByText('Age (days), oldest stock first')).toBeInTheDocument()

    await user.click(sortButton)
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    expect(getStockOrder(table)).toEqual([
      'STK-0005', 'STK-0002', 'STK-0001', 'STK-0004',
      'STK-0003', 'STK-0006', 'STK-0007',
    ])

    await user.click(sortButton)
    expect(header).toHaveAttribute('aria-sort', 'none')
    expect(getStockOrder(table)).toEqual(defaultOrder)

    await user.click(within(table).getByRole('button', { name: 'VIN' }))
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(getStockOrder(table)).toEqual(defaultOrder)
    expect(within(table).getByRole('columnheader', { name: 'VIN' })).toHaveAttribute(
      'aria-sort',
      'none',
    )
  })

  it('does not persist the sort across sessions and returns to page one when sorting', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(createVehicles(45)))
    const user = userEvent.setup()
    const view = render(<App inventoryService={service} />)

    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })
    const pager = screen.getByRole('navigation', { name: 'Inventory pagination' })
    await user.click(within(pager).getByRole('button', { name: 'Page 2' }))
    await user.click(within(table).getByRole('button', { name: 'Make' }))
    expect(screen.getByText(showing('Showing 1-20 of 45'))).toBeInTheDocument()

    view.unmount()
    render(<App inventoryService={service} />)
    const freshTable = await screen.findByRole('table', { name: 'Vehicle inventory' })
    expect(within(freshTable).getByRole('columnheader', { name: 'Make' })).toHaveAttribute(
      'aria-sort',
      'none',
    )
  })

  it('navigates pages from the compact page navigator above the table', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(createVehicles(45)))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })
    const mini = screen.getByRole('navigation', { name: 'Page navigation' })
    expect(within(mini).getByText('Page 1 / 3')).toBeInTheDocument()
    expect(within(mini).getByRole('button', { name: 'Previous page' })).toBeDisabled()

    await user.click(within(mini).getByRole('button', { name: 'Next page' }))
    expect(within(mini).getByText('Page 2 / 3')).toBeInTheDocument()
    expect(screen.getByText(showing('Showing 21-40 of 45'))).toBeInTheDocument()
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

  it('shows the action filter, updates results, count, and a removable action chip', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    const table = await screen.findByRole('table', { name: 'Vehicle inventory' })

    expect(screen.getByRole('region', { name: 'Inventory filters' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search' }))
      .toHaveAttribute('placeholder', 'Stock no., VIN, make or model')
    expect(screen.getByRole('option', { name: 'All bands' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-7 of 7')
    await user.selectOptions(screen.getByLabelText('Action'), 'no-action')

    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')
    expect(within(table).getAllByRole('row')).toHaveLength(2)
    expect(within(table).getByRole('row', { name: /STK-0004/ })).toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-0001/ })).not.toBeInTheDocument()
    expect(screen.getByText('Action: No action yet')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Action'), 'has-action')

    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')
    expect(within(table).getByRole('row', { name: /STK-0001/ })).toBeInTheDocument()
    expect(within(table).queryByRole('row', { name: /STK-0004/ })).not.toBeInTheDocument()
    expect(screen.getByText('Action: Has an action')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Action: Has an action filter' }))

    expect(screen.getByLabelText('Action')).toHaveValue('any')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-7 of 7')
    expect(within(table).getAllByRole('row')).toHaveLength(sampleVehicles.length + 1)
    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
  })

  it('shows individually removable chips for each active filter and preserves the others', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'toyota')
    await user.selectOptions(screen.getByLabelText('Make'), 'Toyota')
    await user.selectOptions(screen.getByLabelText('Model'), 'Corolla')
    await user.selectOptions(screen.getByLabelText('Age band'), '>90')
    await user.click(screen.getByRole('checkbox', { name: 'Aging only' }))

    expect(screen.getByRole('list', { name: 'Active filters' }).querySelectorAll('li'))
      .toHaveLength(5)
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')

    await user.click(screen.getByRole('button', { name: 'Remove Make: Toyota filter' }))

    expect(screen.getByLabelText('Make')).toHaveValue('')
    expect(screen.getByLabelText('Model')).toHaveValue('Corolla')
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('toyota')
    expect(screen.getByRole('checkbox', { name: 'Aging only' })).toBeChecked()
    expect(screen.getByRole('list', { name: 'Active filters' }).querySelectorAll('li'))
      .toHaveLength(4)
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')

    await user.click(screen.getByRole('button', { name: 'Remove Age band: >90 days filter' }))

    expect(screen.getByLabelText('Age band')).toHaveValue('')
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('toyota')
    expect(screen.getByLabelText('Model')).toHaveValue('Corolla')
    expect(screen.getByRole('checkbox', { name: 'Aging only' })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')

    await user.click(screen.getByRole('button', { name: 'Remove Search: toyota filter' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
    expect(screen.getByLabelText('Model')).toHaveValue('Corolla')
    expect(screen.getByRole('checkbox', { name: 'Aging only' })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-1 of 1')

    await user.click(screen.getByRole('button', { name: 'Remove Model: Corolla filter' }))

    expect(screen.getByLabelText('Model')).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: 'Aging only' })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-2 of 2')

    await user.click(screen.getByRole('button', { name: 'Remove Aging only filter' }))

    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-7 of 7')
  })

  it('shows a removable Data issues chip and a zero-result count', async () => {
    const service = createInventoryService(vi.fn().mockResolvedValue(sampleVehicles))
    const user = userEvent.setup()

    render(<App inventoryService={service} />)
    await screen.findByRole('table', { name: 'Vehicle inventory' })
    await user.click(screen.getByRole('button', {
      name: '3 with unknown age (data issue)',
    }))

    expect(screen.getByRole('status')).toHaveTextContent('Showing 1-3 of 3')
    expect(screen.getByText('Data issues', { selector: '.active-filter-chip span' }))
      .toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'no-match')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 0-0 of 0')
    expect(screen.queryByRole('navigation', { name: 'Inventory pagination' }))
      .not.toBeInTheDocument()
    expect(screen.getByRole('heading', {
      name: 'No vehicles match these filters',
    })).toBeInTheDocument()
    expect(screen.getByText(/Try changing or clearing the filters/))
      .toBeInTheDocument()
    const clearButtons = screen.getAllByRole('button', { name: 'Clear filters' })
    expect(clearButtons).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Remove Data issues filter' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('no-match')
    expect(screen.queryByText('Data issues', { selector: '.active-filter-chip span' }))
      .not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Showing 0-0 of 0')
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

    expect(await screen.findByRole('heading', {
      name: 'No vehicles match these filters',
    })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Clear filters' }))
      .toHaveLength(2)
    expect(screen.queryByText('No vehicles in inventory.')).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[1])

    expect(await screen.findByRole('table', { name: 'Vehicle inventory' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', {
      name: 'No vehicles match these filters',
    })).not.toBeInTheDocument()
  })
})
