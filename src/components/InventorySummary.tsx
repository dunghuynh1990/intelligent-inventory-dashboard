import {
  AGE_BANDS,
  EARLY_WARNING_DAYS,
  type AgeBandProfile,
  type InventorySummaryCounts,
} from '../core/aging'
import type { AgeBand } from '../types/vehicle'
import './InventorySummary.css'

type InventorySummaryProps = {
  counts: InventorySummaryCounts
  ageBandProfile: AgeBandProfile
  selectedAgeBand: AgeBand | ''
  isTurningAgingSoonOnly: boolean
  isDataIssuesOnly: boolean
  onSelectAgeBand: (ageBand: AgeBand) => void
  onToggleDataIssues: () => void
  onToggleTurningAgingSoon: () => void
}

function SummaryIcon({ kind }: { kind: 'inventory' | 'aging' | 'turning' | 'action' }) {
  if (kind === 'inventory') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 5v14M4 10h16" />
      </svg>
    )
  }

  if (kind === 'aging') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l3 2M9 2h6" />
      </svg>
    )
  }

  if (kind === 'turning') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export function InventorySummary({
  counts,
  ageBandProfile,
  selectedAgeBand,
  isTurningAgingSoonOnly,
  isDataIssuesOnly,
  onSelectAgeBand,
  onToggleDataIssues,
  onToggleTurningAgingSoon,
}: InventorySummaryProps) {
  const actionedShare =
    counts.agingVehicles === 0
      ? 0
      : counts.agingVehiclesWithAction / counts.agingVehicles
  const agingShare =
    counts.totalVehicles === 0 ? 0 : counts.agingVehicles / counts.totalVehicles
  const thresholdShare = ageBandProfile.bands
    .slice(0, AGE_BANDS.length - 1)
    .reduce((total, band) => total + band.share, 0)
  const missingActions = counts.agingVehicles - counts.agingVehiclesWithAction
  const formatPercentage = (share: number) => `${(share * 100).toFixed(0)}%`

  return (
    <section className="inventory-summary" aria-labelledby="inventory-summary-title">
      <h2 id="inventory-summary-title" className="inventory-summary__sr-only">
        Inventory summary
      </h2>
      <dl className="inventory-summary__cards">
        <div className="inventory-summary__card">
          <dt>
            <SummaryIcon kind="inventory" />
            Total vehicles
          </dt>
          <dd>
            <strong>{counts.totalVehicles}</strong>
            <span className="inventory-summary__support">
              In stock at this dealership
            </span>
          </dd>
        </div>

        <div className="inventory-summary__card inventory-summary__card--aging">
          <dt>
            <SummaryIcon kind="aging" />
            Aging stock · more than 90 days
          </dt>
          <dd>
            <strong>{counts.agingVehicles}</strong>
            <span className="inventory-summary__share">
              {formatPercentage(agingShare)} of stock
            </span>
            <span className="inventory-summary__support">
              {missingActions}{' '}
              {missingActions === 1 ? 'still needs' : 'still need'} an action
            </span>
          </dd>
        </div>

        <div className="inventory-summary__card inventory-summary__card--turning">
          <dt>
            <SummaryIcon kind="turning" />
            Turning aging in {EARLY_WARNING_DAYS} days
          </dt>
          <dd>
            <strong>{counts.turningAgingSoonVehicles}</strong>
            <span className="inventory-summary__support">
              Vehicles entering the aging window
            </span>
            <button
              className="inventory-summary__link"
              type="button"
              aria-pressed={isTurningAgingSoonOnly}
              onClick={onToggleTurningAgingSoon}
            >
              Show these vehicles <span aria-hidden="true">→</span>
            </button>
          </dd>
        </div>

        <div className="inventory-summary__card inventory-summary__card--actioned">
          <dt>
            <SummaryIcon kind="action" />
            Aging vehicles with an action
          </dt>
          <dd>
            <strong>{counts.agingVehiclesWithAction}</strong>
            <span className="inventory-summary__denominator">
              / {counts.agingVehicles}
            </span>
            <progress
              aria-label="Aging vehicles with an action"
              max={Math.max(1, counts.agingVehicles)}
              value={counts.agingVehiclesWithAction}
            />
            <span className="inventory-summary__support">
              {formatPercentage(actionedShare)} of aging stock has a plan
            </span>
          </dd>
        </div>
      </dl>

      <section className="age-profile" aria-labelledby="age-profile-title">
        <div className="age-profile__header">
          <h3 id="age-profile-title">Age profile</h3>
          <p>Select a band to filter the list. Exactly 90 days is not aging.</p>
          <button
            className="age-profile__unknown"
            type="button"
            aria-pressed={isDataIssuesOnly}
            onClick={onToggleDataIssues}
          >
            {counts.dataIssueVehicles} with unknown age (data issue)
          </button>
        </div>
        <div
          className="age-profile__chart"
          role="group"
          aria-label="Vehicle distribution by age band"
        >
          <div className="age-profile__bar">
            {ageBandProfile.bands.map(({ ageBand, count, share }) => (
              <button
                className={`age-profile__segment age-profile__segment--${ageBand.replace('>', 'over-')}`}
                key={ageBand}
                type="button"
                style={{ width: `${share * 100}%` }}
                aria-label={`${ageBand} days, ${count} ${
                  count === 1 ? 'vehicle' : 'vehicles'
                }, ${formatPercentage(share)}`}
                aria-pressed={selectedAgeBand === ageBand}
                onClick={() => onSelectAgeBand(ageBand)}
              >
                <span className="age-profile__range">
                  <span className="age-profile__range-full">{ageBand} DAYS</span>
                  <span className="age-profile__range-compact">{ageBand}</span>
                </span>
                <span className="age-profile__values">
                  <strong>{count}</strong>
                  <span>{formatPercentage(share)}</span>
                </span>
              </button>
            ))}
          </div>
          <span
            className="age-profile__threshold"
            style={{ left: `${thresholdShare * 100}%` }}
            aria-hidden="true"
          />
          <span
            className="age-profile__threshold-label"
            style={{ left: `${thresholdShare * 100}%` }}
          >
            90-day threshold
          </span>
        </div>
      </section>
    </section>
  )
}
