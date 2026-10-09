import { useEffect, useRef, type ReactNode } from 'react'
import {
  formatActionLoggedAge,
  getDaysUntilAging,
  isActionStale,
} from '../core/aging'
import type { Vehicle, VehicleAction } from '../types/vehicle'
import { ProposedActionForm } from './ProposedActionForm'
import './InventoryTable.css'

type InventoryTableProps = {
  vehicles: Vehicle[]
  searchText: string
  actionAgeReferenceTime: Date
  editingVehicleId: string | null
  isSaving: boolean
  onEditAction: (vehicle: Vehicle) => void
  onCancelAction: () => void
  onSaveAction: (vehicleId: string, action: VehicleAction) => Promise<void>
}

export function InventoryTable({
  vehicles,
  searchText,
  actionAgeReferenceTime,
  editingVehicleId,
  isSaving,
  onEditAction,
  onCancelAction,
  onSaveAction,
}: InventoryTableProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const editingVehicle = vehicles.find(
    (vehicle) => vehicle.vehicleId === editingVehicleId,
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
    }
  }, [editingVehicle])

  return (
    <>
      <div className="inventory-table-scroll">
        <table className="inventory-table">
          <caption>Vehicle inventory</caption>
          <thead>
            <tr>
              <th scope="col">Stock number</th>
              <th scope="col">VIN</th>
              <th scope="col">Make</th>
              <th scope="col">Model</th>
              <th scope="col">Entry date</th>
              <th scope="col">Days in stock</th>
              <th scope="col">Status</th>
              <th scope="col">Current action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => {
              const daysUntilAging = getDaysUntilAging(vehicle.daysInStock)
              const actionLoggedAge = vehicle.currentAction
                ? formatActionLoggedAge(
                    vehicle.currentAction.loggedAt,
                    actionAgeReferenceTime,
                  )
                : null
              const actionIsStale =
                vehicle.isAging &&
                vehicle.currentAction !== null &&
                isActionStale(vehicle.currentAction.loggedAt, actionAgeReferenceTime)

              return (
                <tr key={vehicle.vehicleId}>
                  <th scope="row">{vehicle.stockNumber}</th>
                  <td>{renderVin(vehicle.vin, searchText)}</td>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td>{formatEntryDate(vehicle.stockEntryDate)}</td>
                  <td>{vehicle.daysInStock ?? 'Unknown'}</td>
                  <td>
                    {vehicle.entryDateIssue ? (
                      <span className="data-issue-badge">{vehicle.entryDateIssue}</span>
                    ) : vehicle.isAging ? (
                      <span className="aging-badge">Aging</span>
                    ) : (
                      <span aria-label="Not aging">—</span>
                    )}
                    {daysUntilAging !== null && (
                      <span className="early-warning-badge">
                        Due in {daysUntilAging}{' '}
                        {daysUntilAging === 1 ? 'day' : 'days'}
                      </span>
                    )}
                  </td>
                  <td>
                    {vehicle.currentAction ? (
                      <span className="inventory-action">
                        <span>{vehicle.currentAction.action}</span>
                        {vehicle.currentAction.note && (
                          <small>{vehicle.currentAction.note}</small>
                        )}
                        {actionLoggedAge && <small>{actionLoggedAge}</small>}
                        {actionIsStale && (
                          <small className="inventory-action__stale-flag">
                            check progress
                          </small>
                        )}
                      </span>
                    ) : vehicle.isAging ? (
                      'No action yet'
                    ) : (
                      'No action'
                    )}
                    {vehicle.isAging && (
                      <button
                        className="action-edit-button"
                        type="button"
                        disabled={isSaving}
                        onClick={() => onEditAction(vehicle)}
                      >
                        {vehicle.currentAction ? 'Edit action' : 'Propose action'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {editingVehicle && (
        <dialog
          ref={dialogRef}
          className="proposed-action-dialog"
          aria-modal="true"
          aria-labelledby={`proposed-action-${editingVehicle.vehicleId}-heading`}
          onCancel={onCancelAction}
          onKeyDown={(event) => {
            if (
              event.key === 'Escape' &&
              typeof event.currentTarget.showModal !== 'function'
            ) {
              onCancelAction()
            }
          }}
        >
          <ProposedActionForm
            vehicle={editingVehicle}
            isSaving={isSaving}
            onSave={onSaveAction}
            onCancel={onCancelAction}
          />
        </dialog>
      )}
    </>
  )
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatEntryDate(stockEntryDate: string | null): string {
  if (stockEntryDate === null || stockEntryDate.trim() === '') {
    return '—'
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|[Tt ])/.exec(stockEntryDate.trim())
  if (!match) {
    return stockEntryDate
  }

  const [, year, month, day] = match
  const monthIndex = Number(month) - 1
  const parsedDate = new Date(0)
  parsedDate.setUTCFullYear(Number(year), monthIndex, Number(day))
  if (
    parsedDate.getUTCFullYear() !== Number(year) ||
    parsedDate.getUTCMonth() !== monthIndex ||
    parsedDate.getUTCDate() !== Number(day)
  ) {
    return stockEntryDate
  }

  return `${day}-${monthNames[monthIndex]}-${year}`
}

function renderVin(vin: string, searchText: string): ReactNode {
  const query = searchText.trim()
  const matchIndex = vin.toLowerCase().indexOf(query.toLowerCase())
  if (!query || matchIndex === -1) {
    return vin
  }

  return (
    <>
      {vin.slice(0, matchIndex)}
      <mark className="inventory-table__match">
        {vin.slice(matchIndex, matchIndex + query.length)}
      </mark>
      {vin.slice(matchIndex + query.length)}
    </>
  )
}
