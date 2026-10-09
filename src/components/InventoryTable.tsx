import { Fragment, type ReactNode } from 'react'
import {
  SORT_KEYS,
  SORT_LABELS,
  formatActionLoggedAge,
  getDaysUntilAging,
  isActionStale,
  type SortKey,
  type VehicleSort,
} from '../core/aging'
import type { Vehicle, VehicleAction } from '../types/vehicle'
import { ProposedActionForm } from './ProposedActionForm'
import './InventoryTable.css'

type InventoryTableProps = {
  vehicles: Vehicle[]
  searchText: string
  sort: VehicleSort | null
  actionAgeReferenceTime: Date
  editingVehicleId: string | null
  isSaving: boolean
  onSort: (key: SortKey) => void
  onEditAction: (vehicle: Vehicle) => void
  onCancelAction: () => void
  onSaveAction: (vehicleId: string, action: VehicleAction) => Promise<void>
}

const columnClassNames: Record<SortKey, string> = {
  stockNumber: 'stock',
  vin: 'vin',
  make: 'make',
  model: 'model',
  entryDate: 'entry',
  daysInStock: 'days',
  currentAction: 'action',
}

function Svg({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function InventoryTable({
  vehicles,
  searchText,
  sort,
  actionAgeReferenceTime,
  editingVehicleId,
  isSaving,
  onSort,
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
              {SORT_KEYS.map((key) => {
                const direction = sort?.key === key ? sort.direction : null
                return (
                  <th
                    key={key}
                    scope="col"
                    className={`inventory-table__th inventory-table__th--${columnClassNames[key]}`}
                    aria-sort={
                      direction === 'asc'
                        ? 'ascending'
                        : direction === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                  >
                    <button
                      className="inventory-table__sort"
                      type="button"
                      data-direction={direction ?? undefined}
                      onClick={() => onSort(key)}
                    >
                      <span className="inventory-table__sort-label">
                        {SORT_LABELS[key]}
                      </span>
                      <span className="inventory-table__sort-icon" aria-hidden="true">
                        <i />
                        <i />
                      </span>
                    </button>
                  </th>
                )
              })}
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
              const daysOver = (vehicle.daysInStock ?? 0) - 90
              const isEditing = vehicle.vehicleId === editingVehicleId

              return (
                <Fragment key={vehicle.vehicleId}>
                <tr
                  className={[
                    vehicle.isAging ? 'inventory-table__row--aging' : '',
                    isEditing ? 'inventory-table__row--open' : '',
                  ].join(' ').trim() || undefined}
                >
                  <th scope="row" className="inventory-table__stock">
                    {vehicle.stockNumber}
                  </th>
                  <td className="inventory-table__vin" title={vehicle.vin}>
                    {renderVin(vehicle.vin, searchText)}
                  </td>
                  <td className="inventory-table__make">{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td className="inventory-table__date">
                    {formatEntryDate(vehicle.stockEntryDate)}
                  </td>
                  <td className="inventory-table__days">
                    {vehicle.entryDateIssue || vehicle.daysInStock === null ? (
                      <span className="data-issue-badge">
                        {vehicle.entryDateIssue ?? 'Unknown'}
                      </span>
                    ) : (
                      <span className="inventory-table__age">
                        <span className="inventory-table__age-number">
                          {vehicle.daysInStock}
                        </span>
                        {vehicle.isAging ? (
                          <>
                            <span className="aging-badge" aria-hidden="true">
                              <Svg size={12}>
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 2" />
                              </Svg>
                              {daysOver} over
                            </span>
                            <span className="inventory-table__sr-only">
                              , aging, {daysOver} {daysOver === 1 ? 'day' : 'days'} over
                            </span>
                          </>
                        ) : daysUntilAging !== null ? (
                          <>
                            <span className="early-warning-badge" aria-hidden="true">
                              {daysUntilAging} to go
                            </span>
                            <span className="inventory-table__sr-only">
                              , due to age in {daysUntilAging}{' '}
                              {daysUntilAging === 1 ? 'day' : 'days'}
                            </span>
                          </>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="inventory-action-cell">
                      {vehicle.currentAction ? (
                        <span className="inventory-action">
                          <span className="inventory-action__text">
                            <span className="inventory-action__dot" aria-hidden="true" />
                            {vehicle.currentAction.action}
                          </span>
                          {(actionLoggedAge || actionIsStale) && (
                            <span
                              className={`inventory-action__meta${
                                actionIsStale ? ' inventory-action__meta--stale' : ''
                              }`}
                            >
                              {actionLoggedAge && <small>{actionLoggedAge}</small>}
                              {actionIsStale && (
                                <small className="inventory-action__stale-flag">
                                  check progress
                                </small>
                              )}
                            </span>
                          )}
                          {vehicle.currentAction.note && (
                            <small
                              className="inventory-action__note"
                              title={vehicle.currentAction.note}
                            >
                              {vehicle.currentAction.note}
                            </small>
                          )}
                        </span>
                      ) : vehicle.isAging ? (
                        <span className="inventory-action__needs">
                          <Svg size={15}>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v5M12 16.5v.01" />
                          </Svg>
                          No action yet
                        </span>
                      ) : (
                        <span className="inventory-action__none">
                          <span aria-hidden="true">-</span>
                          <span className="inventory-table__sr-only">No action</span>
                        </span>
                      )}
                      {vehicle.isAging && !isEditing && (
                        <button
                          className={`action-edit-button${
                            vehicle.currentAction ? '' : ' action-edit-button--primary'
                          }`}
                          type="button"
                          disabled={isSaving}
                          onClick={() => onEditAction(vehicle)}
                        >
                          {vehicle.currentAction ? (
                            <Svg size={13}>
                              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </Svg>
                          ) : (
                            <Svg size={13}>
                              <path d="M12 5v14M5 12h14" />
                            </Svg>
                          )}
                          {vehicle.currentAction ? 'Change' : 'Log action'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {isEditing && (
                  <tr
                    className="inventory-table__editor-row"
                    aria-label="Action editor"
                  >
                    <td colSpan={SORT_KEYS.length}>
                      <ProposedActionForm
                        vehicle={vehicle}
                        isSaving={isSaving}
                        onSave={onSaveAction}
                        onCancel={onCancelAction}
                      />
                    </td>
                  </tr>
                )}
                </Fragment>
              )
            })}
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
