import { useEffect, useMemo, useReducer, useState } from 'react'
import {
  filterVehicles,
  formatElapsedRefreshTime,
  getAvailableMakes,
  getAvailableModels,
  getAgeBandProfile,
  getActiveInventoryPresetId,
  getFreshnessLevel,
  getInventoryPresets,
  getInventorySummary,
  getNextSort,
  getSortLabel,
  paginateItems,
  sortRows,
  type InventoryFilterCriteria,
  type InventoryPreset,
  type PageSize,
  type SortKey,
  type VehicleSort,
} from './core/aging'
import type { InventoryService } from './services/inventory-service'
import type { AgeBand, Vehicle, VehicleAction } from './types/vehicle'
import { InventoryTable } from './components/InventoryTable'
import {
  InventoryFilterChips,
  InventoryFilters,
} from './components/InventoryFilters'
import { InventoryMiniPager, InventoryPager } from './components/InventoryPager'
import { InventoryPresets } from './components/InventoryPresets'
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
  turningAgingSoonOnly: false,
  actionFilter: 'any',
}
const noVehicles: Vehicle[] = []

type DashboardState = {
  vehicles: Vehicle[] | null
  filters: InventoryFilterCriteria
  sort: VehicleSort | null
  currentPage: number
  pageSize: PageSize
}

type DashboardAction =
  | { type: 'inventoryLoaded'; vehicles: Vehicle[] }
  | { type: 'filtersChanged'; filters: InventoryFilterCriteria }
  | { type: 'sortChanged'; key: SortKey }
  | { type: 'sortReset' }
  | { type: 'pageChanged'; page: number }
  | { type: 'pageSizeChanged'; pageSize: PageSize }
  | { type: 'vehicleActionChanged'; vehicleId: string; action: VehicleAction }

const initialDashboardState: DashboardState = {
  vehicles: null,
  filters: emptyFilters,
  sort: null,
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
    case 'sortChanged':
      return { ...state, sort: getNextSort(state.sort, action.key), currentPage: 1 }
    case 'sortReset':
      return { ...state, sort: null, currentPage: 1 }
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
  const { vehicles, filters, sort, currentPage, pageSize } = dashboardState
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
  const sortedVehicles = useMemo(
    () => sortRows(filteredVehicles, sort),
    [filteredVehicles, sort],
  )
  const page = useMemo(
    () => paginateItems(sortedVehicles, currentPage, pageSize),
    [sortedVehicles, currentPage, pageSize],
  )
  const firstResult =
    page.totalItems === 0 ? 0 : (page.currentPage - 1) * page.pageSize + 1
  const lastResult =
    page.totalItems === 0
      ? 0
      : (page.currentPage - 1) * page.pageSize + page.items.length
  const summaryCounts = useMemo(
    () => getInventorySummary(allVehicles),
    [allVehicles],
  )
  const ageBandProfile = useMemo(() => getAgeBandProfile(allVehicles), [allVehicles])
  const inventoryPresets = useMemo(
    () => getInventoryPresets(allVehicles),
    [allVehicles],
  )
  const activePresetId = getActiveInventoryPresetId(filters)
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

  const handlePresetSelect = (preset: InventoryPreset) => {
    handleFiltersChange(preset.filters)
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
          <p>Dealership stock workspace</p>
          <h1>Vehicle inventory</h1>
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
          <h2 id="inventory-title" className="inventory-section__sr-only">
            Inventory
          </h2>
          {isLoading && vehicles !== null && (
            <p className="inventory-status" role="status">
              Refreshing inventory…
            </p>
          )}

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
              ageBandProfile={ageBandProfile}
              selectedAgeBand={filters.ageBand}
              isTurningAgingSoonOnly={filters.turningAgingSoonOnly}
              isDataIssuesOnly={filters.dataIssuesOnly}
              onSelectAgeBand={(ageBand: AgeBand) =>
                handleFiltersChange(
                  filters.ageBand === ageBand
                    ? emptyFilters
                    : { ...emptyFilters, ageBand },
                )
              }
              onToggleDataIssues={() =>
                handleFiltersChange(
                  filters.dataIssuesOnly
                    ? emptyFilters
                    : { ...emptyFilters, dataIssuesOnly: true },
                )
              }
              onToggleTurningAgingSoon={() =>
                handleFiltersChange({
                  ...filters,
                  turningAgingSoonOnly: !filters.turningAgingSoonOnly,
                })
              }
            />
          )}
          {vehicles !== null && (
            <div className="inventory-browser">
              <InventoryPresets
                presets={inventoryPresets}
                selectedPresetId={activePresetId}
                onSelect={handlePresetSelect}
              />
              {vehicles.length > 0 && (
                <InventoryFilters
                  filters={filters}
                  makes={makes}
                  models={models}
                  onChange={handleFiltersChange}
                  onMakeChange={handleMakeChange}
                  onReset={() => handleFiltersChange(emptyFilters)}
                />
              )}
              <div className="inventory-results">
                <div className="inventory-results__toolbar">
                  <p className="inventory-result-count" role="status">
                    Showing{' '}
                    <b>
                      {firstResult}-{lastResult}
                    </b>{' '}
                    of <b>{page.totalItems}</b> vehicles
                  </p>
                  {vehicles.length > 0 && (
                    <InventoryFilterChips
                      filters={filters}
                      onChange={handleFiltersChange}
                    />
                  )}
                  {filteredVehicles.length > 0 && (
                    <div className="inventory-results__tools">
                      <p className="inventory-order-note">
                        {sort ? (
                          <>
                            Sorted by <b>{getSortLabel(sort)}</b>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'sortReset' })}
                            >
                              Reset
                            </button>
                          </>
                        ) : (
                          'Default order: vehicle ID'
                        )}
                      </p>
                      <InventoryMiniPager
                        currentPage={page.currentPage}
                        totalPages={page.totalPages}
                        onPageChange={(nextPage) =>
                          dispatch({ type: 'pageChanged', page: nextPage })
                        }
                      />
                    </div>
                  )}
                </div>
                {vehicles.length === 0 ? (
                  <p className="inventory-empty">No vehicles in inventory.</p>
                ) : filteredVehicles.length === 0 ? (
                  <div className="inventory-no-results">
                    <span className="inventory-no-results__icon" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5M8 11h6" />
                      </svg>
                    </span>
                    <h3>No vehicles match these filters</h3>
                    <p>
                      Try changing or clearing the filters. Some combinations,
                      such as Aging only with the 0-30 band, never match.
                    </p>
                    <button
                      className="inventory-no-results__clear"
                      type="button"
                      onClick={() => handleFiltersChange(emptyFilters)}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    <InventoryTable
                      vehicles={page.items}
                      searchText={filters.searchText}
                      sort={sort}
                      onSort={(key) => dispatch({ type: 'sortChanged', key })}
                      actionAgeReferenceTime={currentTime}
                      editingVehicleId={editingVehicleId}
                      isSaving={savingVehicleId !== null}
                      onEditAction={(vehicle) => setEditingVehicleId(vehicle.vehicleId)}
                      onCancelAction={() => setEditingVehicleId(null)}
                      onSaveAction={handleSaveAction}
                    />
                    <InventoryPager
                      currentPage={page.currentPage}
                      pageSize={page.pageSize}
                      totalItems={page.totalItems}
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
              </div>
            </div>
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
