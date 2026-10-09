import { useState, type FormEvent } from 'react'
import { CorrelatedServiceError } from '../services/logging-inventory-service'
import type { Vehicle, VehicleAction } from '../types/vehicle'
import './ProposedActionForm.css'

type ProposedActionFormProps = {
  vehicle: Vehicle
  isSaving: boolean
  onSave: (vehicleId: string, action: VehicleAction) => Promise<void>
  onCancel: () => void
}

const actionOptions = ['Price Reduction Planned']

export function ProposedActionForm({
  vehicle,
  isSaving,
  onSave,
  onCancel,
}: ProposedActionFormProps) {
  const currentAction = vehicle.currentAction?.action
  const [selectedAction, setSelectedAction] = useState(
    currentAction === actionOptions[0] ? currentAction : '',
  )
  const [note, setNote] = useState(vehicle.currentAction?.note ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const actionId = `proposed-action-${vehicle.vehicleId}`
  const noteId = `proposed-action-note-${vehicle.vehicleId}`
  const validationErrorId = `${actionId}-error`

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

  return (
    <form
      className="proposed-action-form"
      aria-labelledby={`${actionId}-heading`}
      onSubmit={handleSubmit}
    >
      <h3 id={`${actionId}-heading`}>Propose an action for {vehicle.stockNumber}</h3>
      <div className="proposed-action-form__field">
        <label htmlFor={actionId}>Action</label>
        <select
          id={actionId}
          aria-describedby={validationError ? validationErrorId : undefined}
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
          <option value="">Select an action</option>
          {actionOptions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        {validationError && (
          <p className="proposed-action-form__error" id={validationErrorId} role="alert">
            {validationError}
          </p>
        )}
      </div>
      <div className="proposed-action-form__field">
        <label htmlFor={noteId}>Note (optional)</label>
        <textarea
          id={noteId}
          rows={2}
          value={note}
          disabled={isSaving}
          onChange={(event) => {
            setNote(event.currentTarget.value)
            setSaveError(null)
          }}
        />
      </div>
      {saveError && (
        <p className="proposed-action-form__error" role="alert">
          {saveError}
        </p>
      )}
      <div className="proposed-action-form__buttons">
        <button className="action-save-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : saveError ? 'Retry save' : 'Save action'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
