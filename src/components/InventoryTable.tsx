import type { ReactNode } from 'react'
import type { Vehicle, VehicleAction } from '../types/vehicle'
import { ProposedActionForm } from './ProposedActionForm'
import './InventoryTable.css'

type InventoryTableProps = {
  vehicles: Vehicle[]
  searchText: string
  editingVehicleId: string | null
  isSaving: boolean
  onEditAction: (vehicle: Vehicle) => void
  onCancelAction: () => void
  onSaveAction: (vehicleId: string, action: VehicleAction) => Promise<void>
}

export function InventoryTable({
  vehicles,
  searchText,
  editingVehicleId,
  isSaving,
  onEditAction,
  onCancelAction,
  onSaveAction,
}: InventoryTableProps) {
  return (
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
          {vehicles.map((vehicle) => (
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
              </td>
              <td>
                {vehicle.currentAction ? (
                  <span className="inventory-action">
                    <span>{vehicle.currentAction.action}</span>
                    {vehicle.currentAction.note && (
                      <small>{vehicle.currentAction.note}</small>
                    )}
                  </span>
                ) : (
                  'No action'
                )}
                {vehicle.isAging && (
                  editingVehicleId === vehicle.vehicleId ? (
                    <ProposedActionForm
                      vehicle={vehicle}
                      isSaving={isSaving}
                      onSave={onSaveAction}
                      onCancel={onCancelAction}
                    />
                  ) : (
                    <button
                      className="action-edit-button"
                      type="button"
                      disabled={isSaving}
                      onClick={() => onEditAction(vehicle)}
                    >
                      {vehicle.currentAction ? 'Edit action' : 'Propose action'}
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
