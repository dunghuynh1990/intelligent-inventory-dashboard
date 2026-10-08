import { AGE_BANDS, type InventoryFilterCriteria } from '../core/aging'
import './InventoryFilters.css'

type InventoryFiltersProps = {
  filters: InventoryFilterCriteria
  makes: string[]
  models: string[]
  showClearButton: boolean
  onChange: (filters: InventoryFilterCriteria) => void
  onMakeChange: (make: string) => void
  onReset: () => void
}

export function InventoryFilters({
  filters,
  makes,
  models,
  showClearButton,
  onChange,
  onMakeChange,
  onReset,
}: InventoryFiltersProps) {
  return (
    <section className="inventory-filters" aria-labelledby="filters-title">
      <div className="inventory-filters__heading">
        <h2 id="filters-title">Filters</h2>
        {showClearButton && (
          <button className="clear-filters-button" type="button" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>
      <div className="inventory-filters__controls">
        <div className="filter-control filter-control--search">
          <label htmlFor="inventory-search">Search</label>
          <input
            id="inventory-search"
            type="search"
            value={filters.searchText}
            placeholder="Stock number, VIN, make, or model"
            onChange={(event) =>
              onChange({ ...filters, searchText: event.currentTarget.value })
            }
          />
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
            <option value="">All age bands</option>
            {AGE_BANDS.map((ageBand) => (
              <option key={ageBand} value={ageBand}>
                {ageBand} days
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control filter-control--checkbox">
          <input
            id="inventory-aging-only"
            type="checkbox"
            checked={filters.agingOnly}
            onChange={(event) =>
              onChange({ ...filters, agingOnly: event.currentTarget.checked })
            }
          />
          <label htmlFor="inventory-aging-only">Aging only</label>
        </div>
      </div>
    </section>
  )
}
