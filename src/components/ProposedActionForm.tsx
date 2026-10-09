import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CorrelatedServiceError } from '../services/logging-inventory-service'
import type { Vehicle, VehicleAction } from '../types/vehicle'
import './ProposedActionForm.css'

type ProposedActionFormProps = {
  vehicle: Vehicle
  isSaving: boolean
  onSave: (vehicleId: string, action: VehicleAction) => Promise<void>
  onCancel: () => void
}

const actionOptions = [
  'Price Reduction Planned',
  'Transfer to Another Site',
  'Send to Auction',
  'Promote in Campaign',
  'Under Review',
]

export function ProposedActionForm({
  vehicle,
  isSaving,
  onSave,
  onCancel,
}: ProposedActionFormProps) {
  const currentAction = vehicle.currentAction?.action
  const [selectedAction, setSelectedAction] = useState(
    currentAction && actionOptions.includes(currentAction) ? currentAction : '',
  )
  const [note, setNote] = useState(vehicle.currentAction?.note ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const actionId = `proposed-action-${vehicle.vehicleId}`
  const noteId = `proposed-action-note-${vehicle.vehicleId}`
  const validationErrorId = `${actionId}-error`

  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAction.trim()) {
      setValidationError('Select an action before saving.')
      return
    }

    setValidationError(null)
    setSaveError(null)
    const action: VehicleAction = {
      action: selectedAction,
      ...(note.trim() ? { note: note.trim() } : {}),
    }

    try {
      await onSave(vehicle.vehicleId, action)
    } catch (cause: unknown) {
      const message =
        cause instanceof Error ? cause.message : 'An unexpected error occurred.'
      const reference =
        cause instanceof CorrelatedServiceError
          ? ` (Ref: ${cause.correlationId})`
          : ''
      setSaveError(`Unable to save action: ${message}${reference}`)
    }
  }

  const daysText =
    vehicle.daysInStock === null ? '' : `, ${vehicle.daysInStock} days in stock`

  return (
    <form
      className="proposed-action-form"
      aria-label={`Propose an action for ${vehicle.stockNumber}`}
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !isSaving) {
          onCancel()
        }
      }}
    >
      <div className="proposed-action-form__title">
        <span>
          <b>{vehicle.currentAction ? 'Change action' : 'Log action'}</b>
          <span aria-hidden="true">&nbsp;·&nbsp;</span>
          {vehicle.stockNumber} {vehicle.make} {vehicle.model}
          {daysText}
        </span>
        {vehicle.currentAction && (
          <span>
            Current: <b>{vehicle.currentAction.action}</b>
          </span>
        )}
      </div>
      <div className="proposed-action-form__field">
        <label htmlFor={actionId}>Action</label>
        <select
          ref={selectRef}
          id={actionId}
          aria-describedby={validationError ? validationErrorId : undefined}
          aria-invalid={validationError ? true : undefined}
          value={selectedAction}
          required
          disabled={isSaving}
          onInvalid={(event) => {
            event.preventDefault()
            setValidationError('Select an action before saving.')
          }}
          onChange={(event) => {
            setSelectedAction(event.currentTarget.value)
            setValidationError(null)
            setSaveError(null)
          }}
        >
          <option value="">Choose an action...</option>
          {actionOptions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>
      <div className="proposed-action-form__field">
        <label htmlFor={noteId}>
          Note <span className="proposed-action-form__optional">(optional)</span>
        </label>
        <input
          id={noteId}
          type="text"
          placeholder="For example: reduce by 5% on Friday"
          value={note}
          disabled={isSaving}
          onChange={(event) => {
            setNote(event.currentTarget.value)
            setSaveError(null)
          }}
        />
      </div>
      <div className="proposed-action-form__buttons">
        <button className="action-save-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : saveError ? 'Retry save' : 'Save action'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
      {validationError && (
        <p className="proposed-action-form__error" id={validationErrorId} role="alert">
          {validationError}
        </p>
      )}
      {saveError && (
        <p className="proposed-action-form__error" role="alert">
          {saveError}
        </p>
      )}
    </form>
  )
}
