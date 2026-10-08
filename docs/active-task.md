# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.5
- Name: Build Search and Filters
- Workstream: UI Implementation
- Priority: Must
- Status: Complete
- Planned effort: 1.50 hours

## Objective

Implement pure client-side inventory filtering and accessible dashboard controls for search, make, model, age band, aging-only, and clearing all criteria.

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

- AC-R1-03: Search stock number, make, and model case-insensitively.
- AC-R1-04: Filter by make.
- AC-R1-05: Filter by model.
- AC-R1-06: Filter by age band.
- AC-R1-07: Filter aging vehicles only.
- AC-R1-08: Combine active filters with AND.
- AC-R1-09: Clear all filters and show all N vehicles.
- AC-R1-10: Model options depend on the selected make and include each matching model once.
- AC-R1-11: Return displayed vehicles in ascending vehicle-ID order without adding a user sort feature.
- AC-R4-03: Show a no-results message with `Clear filters`, distinct from empty inventory.

## Approved assumptions and design choices used

- Filtering is client-side and is a pure TypeScript function in the existing non-React core module.
- Search checks stock number, make, and model case-insensitively.
- Filters combine with AND; empty values do not restrict results.
- Model options are derived from the selected make; changing make clears a model no longer available.
- Age bands use the existing `AgeBand` values; vehicles with unknown age do not match a band.
- Keep state local to the dashboard and add no dependencies, sorting control, pagination, or global state.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`DashboardPage` owns filter criteria and derives visible vehicles through pure functions in `src/core/aging.ts`. `InventoryFilters` presents controls and reports changes; the page passes filtered vehicles to `InventoryTable`. Inventory continues to be loaded through `InventoryService`.

## In scope

- Add pure filtering, unique make/model option derivation, and stable vehicle-ID ordering to the non-React core module.
- Add unit tests for search, individual filters, AND combination, model options, empty criteria, and stable order.
- Add accessible search, make, model, age-band, aging-only, and reset controls.
- Clear a selected model when it is not valid for a newly selected make.
- Show a no-results state with a working `Clear filters` button.
- Verify behavior using the generated approximately 200-vehicle inventory.
- Update the active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- Summary cards (WBS 4.6; Should-level).
- User-selectable sorting, pagination, server-side filtering, or API changes.
- Adding or editing proposed actions (WBS 4.7).
- Changes to aging calculations, data generation, service behavior, or requirements.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/core/aging.ts`
- `src/core/aging.test.ts`
- `src/App.tsx`
- `src/App.css`
- `src/components/InventoryFilters.tsx`
- `src/components/InventoryFilters.css`
- `src/App.test.tsx`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Pure filtering logic is in the same non-React core module as aging logic.
- Search, make, model, age-band, and aging-only filters work and combine correctly.
- Clear filters resets every criterion.
- Model options respond to make selection and invalid model selection is cleared.
- Results use ascending vehicle-ID order and work against approximately 200 records.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads src/core/aging.test.ts src/App.test.tsx
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
