import './InventoryStatePanel.css'

interface InventoryStatePanelProps {
  variant: 'error' | 'empty'
  isRetrying?: boolean
  onRetry?: () => void
}

export function InventoryStatePanel({ variant, isRetrying = false, onRetry }: InventoryStatePanelProps) {
  if (variant === 'error') {
    return (
      <div className="inventory-state-panel inventory-state-panel--error" role="alert">
        <span className="inventory-state-panel__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.1 4.5 4.5 0 0 0 7 19z" />
            <path d="M12 9v4M12 16h.01" />
          </svg>
        </span>
        <h3>We could not load the inventory</h3>
        <p>
          The inventory service did not respond. Your saved actions are not
          affected. Try again.
        </p>
        <button type="button" onClick={onRetry} disabled={isRetrying}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="inventory-state-panel" role="status">
      <span className="inventory-state-panel__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      </span>
      <h3>No vehicles in inventory</h3>
      <p>
        This dealership has no vehicles in stock. Vehicles appear here when
        they are added to stock.
      </p>
    </div>
  )
}
