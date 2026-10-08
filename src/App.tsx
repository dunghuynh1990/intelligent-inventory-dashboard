import { useEffect, useMemo, useState } from 'react'
import {
  filterVehicles,
  getAvailableMakes,
  getAvailableModels,
  getInventorySummary,
  type InventoryFilterCriteria,
} from './core/aging'
import type { InventoryService } from './services/inventory-service'
import type { Vehicle, VehicleAction } from './types/vehicle'
import { InventoryTable } from './components/InventoryTable'
import { InventoryFilters } from './components/InventoryFilters'
import { InventorySummary } from './components/InventorySummary'
import './App.css'

type AppProps = {
  inventoryService: InventoryService
  clock?: () => Date
}

const systemClock = () => new Date()

const emptyFilters: InventoryFilterCriteria = {
  searchText: '',
  make: '',
  model: '',
  ageBand: '',
  agingOnly: false,
  dataIssuesOnly: false,
}
const noVehicles: Vehicle[] = []

function App({ inventoryService, clock = systemClock }: AppProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<InventoryFilterCriteria>(emptyFilters)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [savingVehicleId, setSavingVehicleId] = useState<string | null>(null)
  const allVehicles = vehicles ?? noVehicles
  const makes = useMemo(() => getAvailableMakes(allVehicles), [allVehicles])
  const models = useMemo(
    () => getAvailableModels(allVehicles, filters.make),
    [allVehicles, filters.make],
  )
  const filteredVehicles = useMemo(
    () => filterVehicles(allVehicles, filters),
    [allVehicles, filters],
  )
  const summaryCounts = useMemo(
    () => getInventorySummary(allVehicles),
    [allVehicles],
  )

  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const currentVehicles = await inventoryService.getVehicles()
      setVehicles(currentVehicles)
      setLastRefreshed(clock())
    } catch (cause: unknown) {
      const message =
        cause instanceof Error ? cause.message : 'An unexpected error occurred.'
      setError(`Unable to load inventory: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    void inventoryService
      .getVehicles()
      .then((currentVehicles) => {
        if (active) {
          setVehicles(currentVehicles)
          setLastRefreshed(clock())
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          const message =
            cause instanceof Error ? cause.message : 'An unexpected error occurred.'
          setError(`Unable to load inventory: ${message}`)
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [clock, inventoryService])

  const formattedLastRefreshed = lastRefreshed
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(lastRefreshed)
    : 'Not yet'

  const handleMakeChange = (make: string) => {
    const availableModels = getAvailableModels(allVehicles, make)
    setFilters((currentFilters) => ({
      ...currentFilters,
      make,
      model: availableModels.includes(currentFilters.model) ? currentFilters.model : '',
    }))
  }

  const handleSaveAction = async (vehicleId: string, action: VehicleAction) => {
    setSavingVehicleId(vehicleId)
    try {
      await inventoryService.updateVehicleAction(vehicleId, action)
      setVehicles((currentVehicles) =>
        currentVehicles?.map((vehicle) =>
          vehicle.vehicleId === vehicleId
            ? { ...vehicle, currentAction: action }
            : vehicle,
        ) ?? null,
      )
      setEditingVehicleId(null)
    } finally {
      setSavingVehicleId(null)
    }
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-header__content">
          <h1>Intelligent Inventory</h1>
          <p>Dealership vehicle overview</p>
        </div>
        <div className="dashboard-header__refresh">
          <div className="dashboard-header__freshness">
            <span>Last refreshed</span>
            {lastRefreshed ? (
              <time dateTime={lastRefreshed.toISOString()}>{formattedLastRefreshed}</time>
            ) : (
              <span>{formattedLastRefreshed}</span>
            )}
          </div>
          <button
            className="refresh-button"
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : error ? 'Retry' : 'Refresh'}
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <section id="inventory-section" className="inventory-section" aria-labelledby="inventory-title" aria-busy={isLoading}>
          <div className="inventory-section__heading">
            <div>
              <h2 id="inventory-title">Inventory</h2>
              <p>Vehicle stock and current proposed action</p>
            </div>
            {isLoading && vehicles !== null && (
              <p className="inventory-status" role="status">
                Refreshing inventory…
              </p>
            )}
          </div>

          {vehicles === null && isLoading && (
            <p className="inventory-status" role="status">
              Loading inventory…
            </p>
          )}
          {error && (
            <p className="inventory-error" role="alert">
              {error}
            </p>
          )}
          {vehicles !== null && (
            <InventorySummary
              counts={summaryCounts}
              onShowDataIssues={() => setFilters({ ...emptyFilters, dataIssuesOnly: true })}
            />
          )}
          {vehicles !== null && vehicles.length === 0 && !isLoading && (
            <p className="inventory-empty">No vehicles in inventory.</p>
          )}
          {vehicles !== null && vehicles.length > 0 && (
            <>
              <InventoryFilters
                filters={filters}
                makes={makes}
                models={models}
                showClearButton={filteredVehicles.length > 0}
                onChange={setFilters}
                onMakeChange={handleMakeChange}
                onReset={() => setFilters(emptyFilters)}
              />
              {filteredVehicles.length === 0 ? (
                <div className="inventory-no-results">
                  <p>No vehicles match these filters.</p>
                  <button
                    className="clear-filters-button"
                    type="button"
                    onClick={() => setFilters(emptyFilters)}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <InventoryTable
                  vehicles={filteredVehicles}
                  searchText={filters.searchText}
                  editingVehicleId={editingVehicleId}
                  isSaving={savingVehicleId !== null}
                  onEditAction={(vehicle) => setEditingVehicleId(vehicle.vehicleId)}
                  onCancelAction={() => setEditingVehicleId(null)}
                  onSaveAction={handleSaveAction}
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
