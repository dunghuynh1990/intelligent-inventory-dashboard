import { useEffect, useMemo, useReducer, useState } from 'react'
import {
  filterVehicles,
  formatElapsedRefreshTime,
  getAvailableMakes,
  getAvailableModels,
  getFreshnessLevel,
  getInventorySummary,
  paginateItems,
  type InventoryFilterCriteria,
  type PageSize,
} from './core/aging'
import type { InventoryService } from './services/inventory-service'
import type { Vehicle, VehicleAction } from './types/vehicle'
import { InventoryTable } from './components/InventoryTable'
import { InventoryFilters } from './components/InventoryFilters'
import { InventoryPager } from './components/InventoryPager'
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
  actionFilter: 'any',
}
const noVehicles: Vehicle[] = []

type DashboardState = {
  vehicles: Vehicle[] | null
  filters: InventoryFilterCriteria
  currentPage: number
  pageSize: PageSize
}

type DashboardAction =
  | { type: 'inventoryLoaded'; vehicles: Vehicle[] }
  | { type: 'filtersChanged'; filters: InventoryFilterCriteria }
  | { type: 'pageChanged'; page: number }
  | { type: 'pageSizeChanged'; pageSize: PageSize }
  | { type: 'vehicleActionChanged'; vehicleId: string; action: VehicleAction }

const initialDashboardState: DashboardState = {
  vehicles: null,
  filters: emptyFilters,
  currentPage: 1,
  pageSize: 20,
}

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case 'inventoryLoaded':
      return clampPage({ ...state, vehicles: action.vehicles })
    case 'filtersChanged':
      return { ...state, filters: action.filters, currentPage: 1 }
    case 'pageChanged':
      return clampPage({ ...state, currentPage: action.page })
    case 'pageSizeChanged':
      return clampPage({ ...state, pageSize: action.pageSize })
    case 'vehicleActionChanged':
      if (state.vehicles === null) {
        return state
      }

      return clampPage({
        ...state,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.vehicleId === action.vehicleId
            ? { ...vehicle, currentAction: action.action }
            : vehicle,
        ),
      })
  }
}

function clampPage(state: DashboardState): DashboardState {
  const filteredVehicles = filterVehicles(state.vehicles ?? noVehicles, state.filters)
  const currentPage = paginateItems(
    filteredVehicles,
    state.currentPage,
    state.pageSize,
  ).currentPage

  return currentPage === state.currentPage ? state : { ...state, currentPage }
}

function App({ inventoryService, clock = systemClock }: AppProps) {
  const [dashboardState, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  )
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(systemClock)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionSaveConfirmation, setActionSaveConfirmation] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [savingVehicleId, setSavingVehicleId] = useState<string | null>(null)
  const { vehicles, filters, currentPage, pageSize } = dashboardState
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
  const page = useMemo(
    () => paginateItems(filteredVehicles, currentPage, pageSize),
    [filteredVehicles, currentPage, pageSize],
  )
  const resultCount =
    page.totalItems === 0
      ? 'Showing 0 of 0'
      : `Showing ${(page.currentPage - 1) * page.pageSize + 1}-${(page.currentPage - 1) * page.pageSize + page.items.length} of ${page.totalItems}`
  const summaryCounts = useMemo(
    () => getInventorySummary(allVehicles),
    [allVehicles],
  )
  const freshnessLevel = lastRefreshed
    ? getFreshnessLevel(lastRefreshed, currentTime)
    : 'normal'

  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const currentVehicles = await inventoryService.getVehicles()
      dispatch({ type: 'inventoryLoaded', vehicles: currentVehicles })
      const refreshedAt = clock()
      setLastRefreshed(refreshedAt)
      setCurrentTime(systemClock())
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
          dispatch({ type: 'inventoryLoaded', vehicles: currentVehicles })
          const refreshedAt = clock()
          setLastRefreshed(refreshedAt)
          setCurrentTime(systemClock())
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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(systemClock())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  const formattedLastRefreshed = lastRefreshed
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastRefreshed)
    : 'Not yet'
  const formattedElapsedRefreshTime = lastRefreshed
    ? formatElapsedRefreshTime(lastRefreshed, currentTime)
    : null

  const handleMakeChange = (make: string) => {
    const availableModels = getAvailableModels(allVehicles, make)
    dispatch({
      type: 'filtersChanged',
      filters: {
        ...filters,
        make,
        model: availableModels.includes(filters.model) ? filters.model : '',
      },
    })
  }

  const handleFiltersChange = (nextFilters: InventoryFilterCriteria) => {
    dispatch({ type: 'filtersChanged', filters: nextFilters })
  }

  const handleSaveAction = async (vehicleId: string, action: VehicleAction) => {
    setSavingVehicleId(vehicleId)
    setActionSaveConfirmation(false)
    try {
      const loggedAt = clock()
      const actionLoggedAt = loggedAt.toISOString()
      await inventoryService.updateVehicleAction(vehicleId, action)
      const savedAction = { ...action, loggedAt: actionLoggedAt }
      dispatch({ type: 'vehicleActionChanged', vehicleId, action: savedAction })
      setCurrentTime(systemClock())
      setEditingVehicleId(null)
      setActionSaveConfirmation(true)
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
          <div className="dashboard-header__reference-date">
            <span>Reference date</span>
            <time dateTime={formatLocalDateISO(currentTime)}>
              {formatReferenceDate(currentTime)}
            </time>
          </div>
          <div
            className={`dashboard-header__freshness dashboard-header__freshness--${freshnessLevel}`}
            data-freshness-level={freshnessLevel}
            data-has-refresh={lastRefreshed !== null}
          >
            <span className="dashboard-header__freshness-label">Last refreshed</span>
            {lastRefreshed ? (
              <span className="dashboard-header__freshness-value">
                <time dateTime={lastRefreshed.toISOString()}>
                  {formattedLastRefreshed}
                </time>
                <span>{formattedElapsedRefreshTime}</span>
              </span>
            ) : (
              <span className="dashboard-header__freshness-value">
                {formattedLastRefreshed}
              </span>
            )}
          </div>
          <button
            className="refresh-button"
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading
              ? 'Refreshing…'
              : freshnessLevel === 'warning'
                ? 'Refresh now'
                : 'Refresh'}
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
            <div className="inventory-error" role="alert">
              {error}
              <button
                className="inventory-error__retry"
                type="button"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                Retry
              </button>
            </div>
          )}
          {actionSaveConfirmation && (
            <p className="action-save-toast" role="status">
              Action saved
            </p>
          )}
          {vehicles !== null && freshnessLevel === 'warning' && (
            <div
              className="stale-data-warning"
              role="status"
              aria-label="Stale inventory warning"
            >
              <span>
                Inventory data is stale. Last refreshed{' '}
                {formattedElapsedRefreshTime}.
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                Refresh now
              </button>
            </div>
          )}
          {vehicles !== null && (
            <InventorySummary
              counts={summaryCounts}
              onShowDataIssues={() =>
                handleFiltersChange({ ...emptyFilters, dataIssuesOnly: true })
              }
            />
          )}
          {vehicles !== null && (
            <p className="inventory-result-count" role="status">
              {resultCount}
            </p>
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
                onChange={handleFiltersChange}
                onMakeChange={handleMakeChange}
                onReset={() => handleFiltersChange(emptyFilters)}
              />
              {filteredVehicles.length === 0 ? (
                <div className="inventory-no-results">
                  <p>No vehicles match these filters.</p>
                </div>
              ) : (
                <InventoryTable
                  vehicles={page.items}
                  searchText={filters.searchText}
                  actionAgeReferenceTime={currentTime}
                  editingVehicleId={editingVehicleId}
                  isSaving={savingVehicleId !== null}
                  onEditAction={(vehicle) => setEditingVehicleId(vehicle.vehicleId)}
                  onCancelAction={() => setEditingVehicleId(null)}
                  onSaveAction={handleSaveAction}
                />
              )}
              <InventoryPager
                currentPage={page.currentPage}
                pageSize={page.pageSize}
                totalPages={page.totalPages}
                onPageChange={(nextPage) =>
                  dispatch({ type: 'pageChanged', page: nextPage })
                }
                onPageSizeChange={(nextPageSize) =>
                  dispatch({ type: 'pageSizeChanged', pageSize: nextPageSize })
                }
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatReferenceDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  return `${day}-${monthNames[date.getMonth()]}-${date.getFullYear()}`
}

function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default App
