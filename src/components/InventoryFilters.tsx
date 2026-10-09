import {
  AGE_BANDS,
  EARLY_WARNING_DAYS,
  type ActionFilter,
  type InventoryFilterCriteria,
} from '../core/aging'
import './InventoryFilters.css'

type RemovableFilter =
  | 'searchText'
  | 'make'
  | 'model'
  | 'ageBand'
  | 'agingOnly'
  | 'dataIssuesOnly'
  | 'turningAgingSoonOnly'
  | 'actionFilter'

type InventoryFiltersProps = {
  filters: InventoryFilterCriteria
  makes: string[]
  models: string[]
  onChange: (filters: InventoryFilterCriteria) => void
  onMakeChange: (make: string) => void
  onReset: () => void
}

export function InventoryFilters({
  filters,
  makes,
  models,
  onChange,
  onMakeChange,
  onReset,
}: InventoryFiltersProps) {
  return (
    <section className="inventory-filters" aria-label="Inventory filters">
      <div className="inventory-filters__controls">
        <div className="filter-control filter-control--search">
          <label htmlFor="inventory-search">Search</label>
          <div className="filter-search">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="inventory-search"
              type="search"
              value={filters.searchText}
              placeholder="Stock no., VIN, make or model"
              onChange={(event) =>
                onChange({ ...filters, searchText: event.currentTarget.value })
              }
            />
          </div>
        </div>
        <div className="filter-control">
          <label htmlFor="inventory-make">Make</label>
          <select
            id="inventory-make"
            value={filters.make}
            onChange={(event) => onMakeChange(event.currentTarget.value)}
          >
            <option value="">All makes</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label htmlFor="inventory-model">Model</label>
          <select
            id="inventory-model"
            value={filters.model}
            onChange={(event) =>
              onChange({ ...filters, model: event.currentTarget.value })
            }
          >
            <option value="">All models</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label htmlFor="inventory-age-band">Age band</label>
          <select
            id="inventory-age-band"
            value={filters.ageBand}
            onChange={(event) => {
              const ageBand =
                AGE_BANDS.find((band) => band === event.currentTarget.value) ?? ''
              onChange({ ...filters, ageBand })
            }}
          >
            <option value="">All bands</option>
            {AGE_BANDS.map((ageBand) => (
              <option key={ageBand} value={ageBand}>
                {ageBand} days
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label htmlFor="inventory-action-filter">Action</label>
          <select
            id="inventory-action-filter"
            value={filters.actionFilter ?? 'any'}
            onChange={(event) => {
              const actionFilter = event.currentTarget.value
              if (
                actionFilter === 'any' ||
                actionFilter === 'no-action' ||
                actionFilter === 'has-action'
              ) {
                onChange({ ...filters, actionFilter })
              }
            }}
          >
            <option value="any">Any</option>
            <option value="no-action">No action yet</option>
            <option value="has-action">Has an action</option>
          </select>
        </div>
        <div className="filter-control filter-control--switch">
          <input
            id="inventory-aging-only"
            type="checkbox"
            checked={filters.agingOnly}
            onChange={(event) =>
              onChange({ ...filters, agingOnly: event.currentTarget.checked })
            }
          />
          <label className="aging-switch" htmlFor="inventory-aging-only">
            <span aria-hidden="true" className="aging-switch__track" />
            <span>Aging only</span>
          </label>
        </div>
        <button className="clear-filters-button" type="button" onClick={onReset}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      </div>
    </section>
  )
}

type InventoryFilterChipsProps = Pick<
  InventoryFiltersProps,
  'filters' | 'onChange'
>

export function InventoryFilterChips({
  filters,
  onChange,
}: InventoryFilterChipsProps) {
  const activeFilters = getActiveFilters(filters)

  return activeFilters.length > 0 ? (
    <ul className="active-filter-chips" aria-label="Active filters">
      {activeFilters.map(({ key, label }) => (
        <li className="active-filter-chip" key={key}>
          <span>{label}</span>
          <button
            type="button"
            aria-label={`Remove ${label} filter`}
            onClick={() => onChange(removeFilter(filters, key))}
          >
            x
          </button>
        </li>
      ))}
    </ul>
  ) : null
}

function getActiveFilters(
  filters: InventoryFilterCriteria,
): Array<{ key: RemovableFilter; label: string }> {
  const activeFilters: Array<{ key: RemovableFilter; label: string }> = []
  if (filters.searchText.trim()) {
    activeFilters.push({ key: 'searchText', label: `Search: ${filters.searchText.trim()}` })
  }
  if (filters.make) {
    activeFilters.push({ key: 'make', label: `Make: ${filters.make}` })
  }
  if (filters.model) {
    activeFilters.push({ key: 'model', label: `Model: ${filters.model}` })
  }
  if (filters.ageBand) {
    activeFilters.push({ key: 'ageBand', label: `Age band: ${filters.ageBand} days` })
  }
  if (filters.agingOnly) {
    activeFilters.push({ key: 'agingOnly', label: 'Aging only' })
  }
  if (filters.dataIssuesOnly) {
    activeFilters.push({ key: 'dataIssuesOnly', label: 'Data issues' })
  }
  if (filters.turningAgingSoonOnly) {
    activeFilters.push({
      key: 'turningAgingSoonOnly',
      label: `Turning aging in ${EARLY_WARNING_DAYS} days`,
    })
  }
  const actionFilter = filters.actionFilter ?? 'any'
  if (actionFilter !== 'any') {
    const label = actionFilter === 'no-action' ? 'No action yet' : 'Has an action'
    activeFilters.push({ key: 'actionFilter', label: `Action: ${label}` })
  }
  return activeFilters
}

function removeFilter(
  filters: InventoryFilterCriteria,
  key: RemovableFilter,
): InventoryFilterCriteria {
  switch (key) {
    case 'searchText':
      return { ...filters, searchText: '' }
    case 'make':
      return { ...filters, make: '' }
    case 'model':
      return { ...filters, model: '' }
    case 'ageBand':
      return { ...filters, ageBand: '' }
    case 'agingOnly':
      return { ...filters, agingOnly: false }
    case 'dataIssuesOnly':
      return { ...filters, dataIssuesOnly: false }
    case 'turningAgingSoonOnly':
      return { ...filters, turningAgingSoonOnly: false }
    case 'actionFilter':
      return { ...filters, actionFilter: 'any' satisfies ActionFilter }
  }
}
