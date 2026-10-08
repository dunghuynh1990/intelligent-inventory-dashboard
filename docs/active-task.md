# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.6
- Name: Build Dashboard Summary
- Workstream: UI Implementation
- Priority: Should
- Status: Complete
- Planned effort: 0.50 hour

## Objective

Display the total vehicle count, aging vehicle count, and aging vehicles with a current action above the inventory list.

## Authoritative inputs

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`
- `docs/wireframes/intelligent-inventory-dashboard.svg`

## Linked acceptance criteria

- AC-R2-13: Show the count of aging vehicles above the list when the dashboard loads with no filters.
- WBS 4.6 exit criteria: Display total vehicles, aging vehicle count, and aging vehicles with an action.
- C-14: Show total, aging, and aging-with-action summary indicators; the total card is Should-level.

## Approved assumptions and design choices used

- Summary counts use the complete loaded inventory, not the currently filtered rows.
- Aging-with-action counts only vehicles marked aging that have a non-null current action.
- Summary is hidden until the first inventory response; a successfully loaded empty inventory displays three zero values.
- Counts are derived in a pure helper in the existing core module.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`App` derives summary counts from the complete inventory and renders the presentational `InventorySummary` above filters and results. The existing inventory service and filtering behavior are unchanged.

## In scope

- Add a pure summary-count helper for total, aging, and aging-with-action vehicles.
- Add the accessible summary cards and responsive styling.
- Keep summary counts independent from search and filter state and responsive to successful action updates.
- Add unit and component tests for computed counts, empty inventory, filtering, and action-save updates.
- Update the active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- Additional metrics, charts, or user interactions.
- Changes to aging, filters, service behavior, or action workflow beyond reflecting saved actions in counts.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/core/aging.ts`
- `src/core/aging.test.ts`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/InventorySummary.tsx`
- `src/components/InventorySummary.css`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Display total vehicle count, aging vehicle count, and aging-with-action count.
- The aging count matches the loaded inventory.
- Summary counts do not change when filters narrow the visible rows.
- The aging-with-action count updates after a successful action save.
- Empty inventory displays zero counts and the empty-inventory state.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads --maxWorkers=1 src/core/aging.test.ts src/App.test.tsx
npm test -- --pool=threads --maxWorkers=1
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
