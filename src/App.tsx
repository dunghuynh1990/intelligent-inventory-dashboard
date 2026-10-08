import { useEffect, useState } from 'react'
import type { InventoryService } from './services/inventory-service'
import type { Vehicle } from './types/vehicle'
import { InventoryTable } from './components/InventoryTable'
import './App.css'

type AppProps = {
  inventoryService: InventoryService
  clock?: () => Date
}

const systemClock = () => new Date()

function App({ inventoryService, clock = systemClock }: AppProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        <section className="inventory-section" aria-labelledby="inventory-title" aria-busy={isLoading}>
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
          {vehicles !== null && vehicles.length === 0 && !isLoading && (
            <p className="inventory-empty">No vehicles in inventory.</p>
          )}
          {vehicles !== null && vehicles.length > 0 && (
            <InventoryTable vehicles={vehicles} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
