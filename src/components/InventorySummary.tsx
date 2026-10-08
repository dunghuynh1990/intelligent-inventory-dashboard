import type { InventorySummaryCounts } from '../core/aging'
import './InventorySummary.css'

type InventorySummaryProps = {
  counts: InventorySummaryCounts
  onShowDataIssues: () => void
}

const summaryItems: Array<{
  label: string
  key: keyof InventorySummaryCounts
}> = [
  { label: 'Total vehicles', key: 'totalVehicles' },
  { label: 'Aging vehicles', key: 'agingVehicles' },
  { label: 'Aging with an action', key: 'agingVehiclesWithAction' },
]

export function InventorySummary({ counts, onShowDataIssues }: InventorySummaryProps) {
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
      </dl>
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
