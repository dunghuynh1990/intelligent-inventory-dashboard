# Handoff: Vehicle Inventory & Aging Stock Workspace (Scenario B)

## Overview
A single-screen dealership workspace for monitoring vehicle inventory and acting on **aging stock** (vehicles in stock for more than 90 days). Users can see summary KPIs and an age profile, filter and sort the list, search by stock number / VIN / make / model, and log a "current action" for each aging vehicle, either one at a time or in bulk. The screen also covers loading, empty, error, stale-data and bad-data states.

## About the Design Files
The file in this bundle (`Vehicle Inventory Mockup.html`) is a **design reference built in HTML**. It's a working prototype that shows the intended look and behaviour; it is **not production code to copy directly**. Your job is to **rebuild this design in the target codebase's existing environment** (the brief targets React), using its established patterns, component library and state management. If there's no environment yet, choose the most suitable framework (React + TypeScript recommended) and build it there.

The HTML is written in vanilla JS so it can be read easily. Its script is split into the same layers the real build should have:
- **Core module**: pure functions (`daysInStock`, `ageBand`, `isAging`, `applyFilters`, `sortRows`, `summary`).
- **Mock adapter**: data generator, simulated latency, a forced-failure switch and localStorage persistence.
- **Logging wrapper**: one correlation ID per service call.
- **Rendering**.

The striped **demo bar** at the top (Forced failure, Load scenario, Data age, Clear saved actions, Show requirement IDs) is a reviewer tool. It is **NOT product UI**; don't build it, beyond the adapter switches it stands in for.

## Fidelity
**High-fidelity.** Colours, typography, spacing, states and interactions are final. Rebuild the UI pixel-accurately using the codebase's own components. Values marked **PROPOSED** or **placeholder** (action list, thresholds) still need product sign-off. The requirement IDs (e.g. `AC-R1-03`, `C-14`, `OQ-07`) appear in the `data-spec` attributes and the notes cards.

---

## Screens / Views
It's one screen, `max-width: 1440px`, centred. `main` padding is `24px 32px 40px`, the page background is `--canvas #F6F7F9`, and the base text is Inter 14px / 1.45, colour `#1A2230`. From top to bottom:

### 1. App header
- White bar with a 1px bottom border (`#E3E6EB`). Inner wrap padding `22px 32px 24px`; flex row, space-between, wraps.
- **Brand**: a 40×40 mark tile (radius 10, bg `#EEF3FD`, border `#C9D7F6`, car icon in `#2F5BD3`) beside two lines of text. The eyebrow "Dealership stock workspace" is 11px/600, uppercase, letter-spacing .12em, `#5F6B7A`. The H1 "Vehicle inventory" is Manrope 800, 26px, letter-spacing -.02em.
- **Meta** (gap 22px), from left to right:
  - **Reference date**: label 11px uppercase `#5F6B7A`; value IBM Plex Mono 14px/500.
  - A 1px × 34px separator.
  - **Last refreshed**: a 7px live dot (green `#12A37A`, which turns amber `#F5A524` after 15 min and red `#FF6B5E` after 60 min), then the time as HH:MM:SS (en-GB), then "· N min ago" at 12px (turns amber/red at the same thresholds).
  - A primary **Refresh** button. While loading, its icon spins (0.8s linear) and the label changes.

### 2. Banners (conditional)
- **Refresh error**: red banner (bg `#FEF2F1`, border `#F6B8B2`, text `#B42318`, radius 10, padding 12×16). The existing data stays visible.
- **Stale data warning** (after 60 min): amber variant (bg `#FFF4E6`, border `#F3C38E`, text `#B4530A`).

### 3. KPI overview
A grid of 4 columns at `1fr 1.25fr 1fr 1fr`, gap 16. Cards: white, border `#E3E6EB`, radius 12, padding 20×22, min-height 132, shadow `0 1px 2px rgba(20,33,43,.06), 0 4px 16px rgba(20,33,43,.05)`. Label 12px/600 uppercase .06em with a 16px icon. Value Manrope 800, 44px, -.03em, tabular numbers.
1. **Total vehicles**, with the sub-line "In stock at this dealership".
2. **Aging stock · more than 90 days** (emphasised): background gradient `#FFF8EF → #FFFFFF 70%`, border `#F3C38E`, a 5px left accent bar `#E07A1F`, and value + label in `#B4530A`. A percentage share pill sits on the right (mono 13px, amber-soft bg, amber border, radius 6).
3. **Turning aging in 7 days**: the whole card is a `<button>` with `aria-pressed`. Clicking it toggles the `special:'soon'` filter. Hover: border `#C9D7F6` plus a blue glow. Pressed: border `#2F5BD3` and ring `0 0 0 3px rgba(47,91,211,.15)`. The sub-line says "N turn aging tomorrow" or "Day 84-90 today; act before day 91", with the link text "Show these vehicles →".
4. **Aging vehicles with an action**: value "X /Y" (the "/Y" is 18px, `#98A2B0`), an 8px meter (track `#EEF0F3`, fill `#0E7A5C`, width animates over .5s), and a sub-line.

Responsive: ≤1280px gives 2 columns with the Aging card first; ≤560px gives 1 column.

### 4. Age profile
- A white card (same style as the KPI cards) with padding 18×22. The heading "Age profile" is Manrope 700, 16px, followed by the hint "Select a band to filter the list. Exactly 90 days is not aging." On the right is a "N data issues" pill (red-soft, toggles the `special:'issue'` filter).
- **Band bar**: a 64px-high flex row with 4px gaps. Each segment is a `<button>` with `flex: <count> 1 0`, min-width 84, radius 8, padding 10×12. It shows the band label (11.5px/700 uppercase) and the count (Manrope 800, 20px) plus a percentage (mono 11px).
  - Segment colours: 0-30 `#EAF0FB`, 31-60 `#CCD9F3`, 61-90 `#8EA7DE` (white text), >90 uses diagonal amber stripes `repeating-linear-gradient(135deg,#E07A1F 0 10px,#D96F14 10px 20px)` (white text).
  - The selected segment gets a ring `0 0 0 3px #fff, 0 0 0 5px #111827`; the other segments fade to `saturate(.4) opacity(.55)`.
  - A dashed 2px threshold line marks the 90-day boundary, with the label below it in mono 10.5px.
- Clicking a segment sets or clears the age-band filter.

### 5. Views strip (preset + saved views)
- A white bar with a top-rounded card edge, padding 12×18. The label "VIEWS" is followed by a horizontally scrollable list of chips.
- Chip: 34px high, radius 8, border `#E3E6EB`, 13px/600, with a mono count pill. Count pill tones: amber, green, blue (`#EEF3FD`/`#2F5BD3`) or red. Active chip: bg `#111827` with white text.
- Presets:
  - All vehicles
  - Needs action (aging and no action)
  - Aging stock
  - Action planned
  - Turning aging this week
  - Approaching 90 days (61-90)
  - Data issues
  - New arrivals (0-30)
- **Saved views**: the user can name and save the current filter set (190px input). Saved views are stored in localStorage key `scenarioB.mockup.views` and have an × delete. If the current criteria don't match any view, a "Custom" tag shows.

### 6. Filter toolbar
- A grid with columns `minmax(200px,1.5fr) repeat(4,minmax(120px,1fr)) auto auto`, gap 12, padding 16×18.
- Field labels: 11.5px/600 uppercase. Controls: 40px high, border `#CBD6DD`, radius 8. Focus: border `#2F5BD3` plus a 3px ring.
- Fields:
  - **Search**: placeholder "Stock no., VIN, make or model", with a search icon.
  - **Make**
  - **Model**: options depend on the chosen Make. A model that doesn't belong to the newly chosen make is cleared.
  - **Age band**: All / 0-30 / 31-60 / 61-90 / >90 days.
  - **Action**: Any / No action yet / Has an action.
- **Aging only** toggle switch: a 34×20 track; when on, the track is `#E07A1F` and the whole pill turns amber-soft.
- **Clear filters**: ghost button.
- Responsive: ≤1100px gives 3 columns with Search full-width; ≤560px gives 2 columns.

### 7. Result bar
- bg `#F7F9FB`, padding 10×18. On the left: "Showing X of Y" plus removable filter chips (radius 99, each with an 18px circular × button).
- On the right:
  - A sort note: "Default order: vehicle ID", or "Sorted by …" with a "Reset" link.
  - A **Comfortable / Compact** density segmented toggle (saved to `scenarioB.mockup.prefs`).
  - **Export CSV**: exports all filtered rows across every page.
  - **Print**
  - A mini pager (‹ 1 / 10 ›).

### 8. Inventory table
- The card is white with radius `0 0 12 12` and `overflow: clip`, so the sticky header still works. The table uses `table-layout: fixed`, min-width **1200px**, and scrolls horizontally when the viewport is ≤1340px.
- **Column widths**: select 44, Stock no. 118, **VIN 186**, Make 110, **Model 108**, Entry date 128, **Days in stock 116**, Status 144, Current action (the rest).
- **Header**: sticky, bg `#F8F9FB`, 11px/600 uppercase .08em, `#5F6B7A`. Each sortable header is a full-cell button with a two-triangle sort icon. The active sort column shows bg `#EEF3FD`, text `#2F5BD3`, and an inset 2px bottom bar.
- **Cells**: padding 14px (6px vertical in compact mode), bottom border `#EEF0F3`. Row hover `#F5F9FB`.
  - **Select**: a checkbox shown only on aging rows; the header checkbox selects the whole page. Selected rows get bg `#EEF3FD`.
  - **Stock no.**: IBM Plex Mono 600, 13px.
  - **VIN**: mono 12.5px, letter-spacing .03em, ellipsis, full VIN in a tooltip. The part matching the search is highlighted with `<mark>` (bg `#FFF1B8`).
  - **Make**: 600 weight. **Model**: plain text.
  - **Entry date**: format **DD-MMM-YYYY** (e.g. `11-Jul-2026`), tabular numbers, `#5F6B7A`. An invalid or missing date shows in red italic, as the raw value or "Missing".
  - **Days in stock**: **centre-aligned**, both the cell and its header. Manrope 800 at 17px (15px compact); amber on aging rows. "Unknown" (italic, faint) when the age can't be calculated.
  - **Status**: one of four:
    - Aging badge (amber-soft, 11px/700 uppercase, clock icon) plus "+N days over".
    - "Due in N days" (dashed amber tag) for days 80-90.
    - A red issue tag, e.g. "Missing entry date".
    - "In range" (faint).
  - **Current action**: green dot plus the action name. Below it go the note (12.5px, ellipsis, hidden in compact mode) and "Logged today / yesterday / N days ago". After 14 days that line turns amber with " · check progress". On the right, a small **Log action** or **Change** button (aging rows only). Aging rows without an action show "Needs action" in amber.
- **Aging rows**: bg `#FFFBF5`, inset 4px left bar `#E07A1F`, hover `#FFF5E9`.
- **Inline editor**: a sub-row directly below the row, `colspan = 9`, bg `#FFF5E9`.
  - It holds a white card (border `#F3C38E`, radius 10, padding 16) with grid columns `minmax(220px,1fr) minmax(240px,1.6fr) auto`.
  - Title: "Log action · STK-xxxxx Make Model, N days in stock".
  - Contents: an Action select (required), an optional Note input, and Cancel / Save buttons.
  - Validation: an empty action gives a red ring plus a message. A failed save shows a red message with the correlation ID, and the previous value is kept.
- **Pager**: bg `#F7F9FB`, with page size 10 / 20 / 50 / 100, a range "1-20 of 200", numbered pages with ellipsis gaps (32px buttons; the current page is filled `#2F5BD3`), and "Go to page" (hidden ≤1100px). Page and size are saved to `scenarioB.mockup.paging`.

### 9. Bulk action bar
- Fixed at the bottom centre, `width: min(1080px, 100vw - 32px)`, bg `#111827`, radius 12, shadow `0 14px 40px rgba(10,20,28,.35)`. It slides up and fades in over .2s when one or more rows are selected.
- Contents: the count ("N vehicles selected") with a sub-line (amber if some already have actions), an Action select (220px), a Note input, Apply, and Clear selection. A save error shows in a full-width red message row.

### 10. Toast
- Bottom-right, dark, 13px/600, with a green check icon. After a save it reads "Action saved" and shows an **Undo** button for **8 seconds**; a 3px progress bar shrinks over that time. Undo restores the previous action.

### 11. Notes cards (mockup only)
- Dashed cards that explain the rules. These are reviewer documentation, so don't ship them.

---

## Interactions & Behavior
- **Aging rule**: `daysInStock = whole calendar days between startOfDay(entryDate) and startOfDay(referenceDate)`. Aging means `> 90`, so exactly 90 is **not** aging.
- **Bands**: 0-30, 31-60, 61-90, >90.
- **Bad dates**: a missing, invalid or future entry date gives `daysInStock = null`. That row shows "Unknown", is not counted as aging, and appears in the "Data issues" view.
- **Soon cues**: "Turning aging in 7 days" covers days 84-90 (`SOON_WINDOW = 7`). The row-level "Due in N days" tag starts at day 80 (`SOON_FROM`). Both are PROPOSED.
- **Filtering**: the criteria combine with AND. Search is a case-insensitive substring match on stock no., make, model and VIN. Any filter change, sort change or view switch resets to page 1. A brief "Updating…" overlay is shown (blurred white).
- **Sorting**:
  - Clicking a header cycles ascending → descending → back to default (vehicle ID order).
  - Days in stock and Status start with descending.
  - Ties fall back to vehicle ID; null or missing values always sort last.
  - Comparison is locale-aware and numeric.
  - Saved in `scenarioB.mockup.sort`.
- **Saving an action**:
  - The row only updates after the save succeeds (no optimistic update).
  - The Save button shows a spinner while saving.
  - On failure, the previous value is kept, an inline error shows the correlation ID, and Retry is available.
  - Undo is available for 8s.
- **Bulk save**: applies to all selected aging rows, with the same success and failure rules.
- **Refresh**: manual only (there's no live push). On failure, the last data stays visible under the error banner.
- **Freshness**: data turns amber after 15 min and shows a warning after 60 min (placeholders, OQ-11).
- **States**:
  - Loading: skeleton rows with a shimmer (1.4s).
  - Empty inventory: centred icon tile plus copy.
  - No filter results: copy plus Clear filters.
  - Load error: red state with Retry.
- **Export CSV** columns: Stock no., VIN, Make, Model, Entry date, Days in stock, Age band, Status, Current action, Note, Action logged.
- **Print**: A4 landscape. Shows the summary plus all filtered rows; controls are hidden.
- **Motion**: transitions are .15–.25s ease. All animation is disabled under `prefers-reduced-motion`.
- **Accessibility**:
  - `aria-sort` on headers, `aria-pressed` on toggles and views.
  - `aria-live` on the count and the toast.
  - Visible focus rings: `3px rgba(47,91,211,.4)`.
  - A screen-reader label for days and band.

## State Management
```
status: 'loading' | 'ready' | 'error' | 'empty'
vehicles: Vehicle[]          // { id, stockNumber, vin, make, model, entryDate (ISO), currentAction: {action, note?, loggedAt} | null }
lastRefreshed: Date, refreshing: bool, refreshError: bool
criteria: { search, make, model, ageBand, agingOnly, action: 'none'|'has'|null, special: 'soon'|'issue'|null }
sort: { key, dir } | null
page, pageSize (10|20|50|100)
density: 'comfortable' | 'compact'
selected: Set<id>, bulk: { action, note, saving, error, invalid }
openForm: id | null, draft, saving, saveError, validation
savedViews: { id, name, criteria }[]
```
Derived values (from the core module): `daysInStock`, `ageBand`, `isAging` and `issue` for each vehicle, plus the summary counts.

Service interface:
- `getVehicles(): Promise<Vehicle[]>`
- `updateVehicleAction(id, action | null): Promise<void>`

Both are wrapped with correlation-ID logging.

## Design Tokens
| Token | Value |
|---|---|
| ink | `#111827` |
| ink-2 | `#1F2937` |
| text | `#1A2230` |
| muted | `#5F6B7A` |
| faint | `#98A2B0` |
| primary (slate) | `#2F5BD3`, hover `#2449B3` |
| blue-soft / blue-line | `#EEF3FD` / `#C9D7F6` |
| canvas / surface | `#F6F7F9` / `#FFFFFF` |
| line / line-2 | `#E3E6EB` / `#EEF0F3` |
| control border | `#CBD6DD` (hover `#AEBDC7`) |
| amber / amber-2 | `#B4530A` / `#E07A1F` |
| amber-soft / amber-line | `#FFF4E6` / `#F3C38E` |
| green / green-soft | `#0E7A5C` / `#E5F4EE` |
| red / red-soft / red-line | `#B42318` / `#FEF2F1` / `#F6B8B2` |
| radius | card 12, banner/editor 10, control/button 8, small button 7, tag 6, pill 99 |
| shadow | `0 1px 2px rgba(20,33,43,.06), 0 4px 16px rgba(20,33,43,.05)` |

**Typography**:
- Display: **Manrope** 600/700/800, for headings and numbers.
- Body: **Inter** 400–700.
- Mono: **IBM Plex Mono** 500/600, for stock no., VIN, times and counts.

Type sizes in use: 10.5, 11, 11.5, 12, 12.5, 13, 14 (base), 15, 16, 17, 20, 26, 44.

**Spacing**: mostly 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 24 / 32.

**Buttons**:
- Default: padding 9×14, 13px/600, white with a line border.
- Primary: filled `#2F5BD3`.
- Ghost: transparent with `#2F5BD3` text.
- Small: 6×10, 12px.

## Assets
- No images. All icons are inline stroke SVGs (Lucide-style, stroke-width 2–2.6), and can be swapped for the codebase's icon set.
- Fonts come from Google Fonts: Manrope, Inter, IBM Plex Mono.
- The data is mock: 200 vehicles generated with a fixed seed. The makes and models are common in Malaysia (Toyota, Honda, Proton, Perodua, Mazda, BMW), and the VINs are fake 17-character values.

## Files
- `Vehicle Inventory Mockup.html`: the complete, self-contained prototype (CSS, mock data and logic in one file). Open it in a browser to try every state, using the demo bar to force failures, show the empty inventory or simulate stale data.
