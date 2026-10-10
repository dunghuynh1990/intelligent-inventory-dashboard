import './ReviewerBar.css'

const scenarios = [
  { value: '', label: 'Normal (about 200 vehicles)' },
  { value: 'empty', label: 'Empty inventory' },
]

function navigateWithParams(update: (params: URLSearchParams) => void) {
  const url = new URL(window.location.href)
  update(url.searchParams)
  window.location.assign(url)
}

export function ReviewerBar() {
  const params = new URLSearchParams(window.location.search)
  const isFailureForced = params.get('forceFailure') === 'true'
  const scenario = params.get('emptyInventory') === 'true' ? 'empty' : ''

  return (
    <div className="reviewer-bar" role="region" aria-label="Reviewer controls">
      <span className="reviewer-bar__title">
        <b>Reviewer controls</b> - mock adapter switches, not part of the product UI
      </span>
      <label>
        <input
          type="checkbox"
          checked={isFailureForced}
          onChange={(event) =>
            navigateWithParams((next) => {
              if (event.target.checked) {
                next.set('forceFailure', 'true')
              } else {
                next.delete('forceFailure')
              }
            })
          }
        />
        Forced failure (mock adapter)
      </label>
      <label>
        Load scenario
        <select
          value={scenario}
          onChange={(event) =>
            navigateWithParams((next) => {
              if (event.target.value === 'empty') {
                next.set('emptyInventory', 'true')
              } else {
                next.delete('emptyInventory')
              }
            })
          }
        >
          {scenarios.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
