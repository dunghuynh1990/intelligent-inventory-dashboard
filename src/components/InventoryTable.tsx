import type { Vehicle } from '../types/vehicle'
import './InventoryTable.css'

type InventoryTableProps = {
  vehicles: Vehicle[]
}

export function InventoryTable({ vehicles }: InventoryTableProps) {
  return (
    <div className="inventory-table-scroll">
      <table className="inventory-table">
        <caption>Vehicle inventory</caption>
        <thead>
          <tr>
            <th scope="col">Stock number</th>
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
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.stockEntryDate}</td>
              <td>{vehicle.daysInStock ?? 'Unknown'}</td>
              <td>
                {vehicle.isAging ? (
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
