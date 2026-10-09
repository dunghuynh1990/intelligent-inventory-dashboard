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
  onSelectAgeBand: (ageBand: AgeBand) => void
  onShowDataIssues: () => void
  onToggleTurningAgingSoon: () => void
}

const summaryItems: Array<{
  label: string
  key: keyof InventorySummaryCounts
}> = [
  { label: 'Total vehicles', key: 'totalVehicles' },
  { label: 'Aging vehicles', key: 'agingVehicles' },
  { label: 'Aging with an action', key: 'agingVehiclesWithAction' },
]

export function InventorySummary({
  counts,
  ageBandProfile,
  selectedAgeBand,
  isTurningAgingSoonOnly,
  onSelectAgeBand,
  onShowDataIssues,
  onToggleTurningAgingSoon,
}: InventorySummaryProps) {
  const agingShare =
    counts.totalVehicles === 0 ? 0 : counts.agingVehicles / counts.totalVehicles
  const actionedShare =
    counts.agingVehicles === 0
      ? 0
      : counts.agingVehiclesWithAction / counts.agingVehicles
  const thresholdShare = ageBandProfile.bands
    .slice(0, AGE_BANDS.length - 1)
    .reduce((total, band) => total + band.share, 0)
  const formatPercentage = (share: number) => `${(share * 100).toFixed(1)}%`

  return (
    <section className="inventory-summary" aria-labelledby="inventory-summary-title">
      <h2 id="inventory-summary-title">Inventory summary</h2>
      <dl className="inventory-summary__cards">
        {summaryItems.map(({ label, key }) => (
          <div className="inventory-summary__card" key={key}>
            <dt>{label}</dt>
            <dd>{counts[key]}</dd>
          </div>
        ))}
        <div className="inventory-summary__card">
          <dt>Aging share</dt>
          <dd>{formatPercentage(agingShare)}</dd>
        </div>
        <div className="inventory-summary__card inventory-summary__card--meter">
          <dt>Actioned aging vehicles</dt>
          <dd>
            <span>
              {counts.agingVehiclesWithAction} of {counts.agingVehicles}
            </span>
            <progress
              aria-label="Actioned aging vehicles"
              max={Math.max(1, counts.agingVehicles)}
              value={counts.agingVehiclesWithAction}
            />
            <span className="inventory-summary__meter-share">
              {formatPercentage(actionedShare)}
            </span>
          </dd>
        </div>
      </dl>
      <section className="age-profile" aria-labelledby="age-profile-title">
        <div className="age-profile__header">
          <h3 id="age-profile-title">Age profile</h3>
          <p>Select a band to filter the list. Exactly 90 days is not aging.</p>
          <span className="age-profile__unknown">
            {counts.dataIssueVehicles} with unknown age (data issue)
          </span>
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
                  <span className="age-profile__range-full">
                    {ageBand} DAYS
                  </span>
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
      <button
        className="inventory-summary__attention-card"
        type="button"
        aria-label={`Turning aging in ${EARLY_WARNING_DAYS} days (${counts.turningAgingSoonVehicles})`}
        aria-pressed={isTurningAgingSoonOnly}
        onClick={onToggleTurningAgingSoon}
      >
        <span>Turning aging in {EARLY_WARNING_DAYS} days</span>
        <strong>{counts.turningAgingSoonVehicles}</strong>
      </button>
      <a
        className="inventory-summary__data-issues"
        href="#inventory-section"
        onClick={onShowDataIssues}
      >
        Data issues ({counts.dataIssueVehicles})
      </a>
    </section>
  )
}
