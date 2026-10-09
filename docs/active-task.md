# Active WBS Task

> Execution snapshot for WBS 4.23. The Core UX gate was reported as passed for WBS 4.21. CR-12 is gated Nice scope; saved views remain deferred.

## Task

- WBS ID: 4.23
- Name: Build Preset Views
- Workstream: UI Implementation
- Priority: Nice
- Status: Complete
- Planned effort: 0.75 hour
- CR Ref: CR-12

## Objective

Add eight inventory preset filters. Each preset applies a complete filter set and displays its matching count; display Custom filters when no preset exactly matches the current filters.

## Linked acceptance criteria

- AC-R2-18: Given the `Turning aging in 7 days` card shows K, selecting it shows only those K vehicles and marks the card pressed; selecting it again clears the filter.
- AC-R2-19: Each age-band segment shows its count and share; selecting a band applies the age-band filter, and selecting it again clears it.
- C-29: Quick views, including preset views, replace the complete active filter set; filters combine with AND.

## Approved assumptions and task-scoped interpretations

- The WBS 4.23 invocation authorizes CR-12's eight gated presets only; it does not change approved requirements or proposed CR/decision statuses.
- Preset counts are calculated from the full loaded inventory, independent of active filters, using the existing pure `filterVehicles` rule.
- The existing complete filter set is used for every preset. The eight views map as follows:
  - All vehicles: no filters.
  - Needs action: `actionFilter: no-action` (aging vehicles without a current action).
  - Aging stock: age band `>90`.
  - Action planned: `actionFilter: has-action`.
  - Turning aging this week: existing seven-day early-warning filter (days 84-90).
  - Approaching 90 days: existing age band `61-90`.
  - Data issues: entry-date issues only.
  - New arrivals (0-30): existing age band `0-30`.
- A preset is active only when the complete current filter set matches its filter set; any unmatched filter combination is shown as Custom filters.
- Preset selection replaces all current filters. Selecting All vehicles applies the empty filter set.
- View selection and filters remain session-only and are not persisted.
- The supplied view-strip reference informs presentation. The `Save as a view` control represents CR-13 saved views, explicitly deferred and not implemented by this task.

## Relevant design components

- `src/core/aging.ts`: Pure complete filter definitions, preset counts, and active-preset matching.
- `src/App.tsx`: Inventory-wide counts and preset selection state/filter dispatch.
- `src/components/InventoryPresets.tsx` and `.css`: Counted horizontal view strip with active/custom state.
- `src/core/aging.test.ts`, `src/App.test.tsx`: Preset-definition, count, replacement, selection, and custom-filter coverage.

## In scope

- Show all eight named preset views with dynamic counts.
- Apply each preset as a complete replacement filter set.
- Show active preset state and Custom filters when no preset exactly matches.
- Follow the supplied horizontal view-strip design without adding saved-view behavior.
- Update this snapshot, traceability, and factual collaboration evidence.

## Explicitly out of scope

- Saved views or `Save as a view` (CR-13 is Deferred).
- Changing `docs/requirements-baseline.md`, `docs/wbs.md`, system design, CR-12 status, or the proposal status of related decisions.
- Later WBS tasks such as sorting, exporting, print layout, or row density.
- Persisting filters or presets, changing existing filter rules, backend work, or adding dependencies.
- Unrelated worktree changes, staging, committing, or pushing.

## Files changed

- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`
- `src/App.tsx`, `src/App.test.tsx`
- `src/core/aging.ts`, `src/core/aging.test.ts`
- `src/components/InventoryPresets.tsx`, `src/components/InventoryPresets.css`

## Verification

- The Core UX gate was reported as passed before WBS 4.21.
- Focused tests: `npm test -- --run --pool=forks --maxWorkers=1 src/core/aging.test.ts src/App.test.tsx` (2 files, 110 tests passed).
- Full suite: `npm test -- --run --pool=forks --maxWorkers=1` (5 files, 130 tests passed).
- `npm run lint`, `npm run build`, and `git diff --check` passed.
- Browser review showed eight count-bearing preset buttons and a horizontally scrollable row; selecting Aging stock applied `>90` as the only filter and displayed 116 matching vehicles. At 375px the view row remained within the viewport while its items scrolled horizontally.
- Final diff reviewed. No files are staged, committed, or pushed.

## Exit criteria

- The eight presets appear with counts computed from the full inventory.
- Selecting any preset applies its complete filter set and the active state is visible.
- Custom filters appears when no preset exactly matches.
- Saved views remain unbuilt.
- Focused/full tests, lint, build, browser review, and final diff checks pass.

Do not stage, commit, or push.
