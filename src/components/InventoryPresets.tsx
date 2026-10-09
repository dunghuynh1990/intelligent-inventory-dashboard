import type {
  InventoryPreset,
  InventoryPresetId,
} from '../core/aging'
import './InventoryPresets.css'

type InventoryPresetsProps = {
  presets: InventoryPreset[]
  selectedPresetId: InventoryPresetId | null
  onSelect: (preset: InventoryPreset) => void
}

export function InventoryPresets({
  presets,
  selectedPresetId,
  onSelect,
}: InventoryPresetsProps) {
  return (
    <section className="inventory-presets" aria-label="Inventory views">
      <span className="inventory-presets__heading">Views</span>
      <div className="inventory-presets__scroller">
        {presets.map((preset) => (
          <button
            className="inventory-presets__button"
            type="button"
            key={preset.id}
            aria-label={`${preset.label} (${preset.count})`}
            aria-pressed={selectedPresetId === preset.id}
            onClick={() => onSelect(preset)}
          >
            <span>{preset.label}</span>
            <span className="inventory-presets__count">{preset.count}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
