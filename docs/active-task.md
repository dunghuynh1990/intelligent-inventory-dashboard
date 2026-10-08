# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. The repository owner approved CR-02 and CR-04 for WBS 4.17 assessment scope on 2026-10-09; pagination remains assigned to WBS 4.18.

## Task

- WBS ID: 4.17
- Name: Add Action Filter and Filter Chips
- Workstream: UI Implementation
- Priority: Should
- Status: Not Started
- Planned effort: 0.50 hour
- CR Ref: CR-02, CR-04

## Objective

Expose action filtering and active-filter feedback with an accurate result count and individually removable filter chips.

## Linked acceptance criteria

- AC-R1-14: `No action yet` returns only aging vehicles without a current action.
- AC-R1-15: `Has an action` returns vehicles with a current action.
- AC-R1-17 (WBS 4.17 slice): Show the current filtered-result range/count. Page-size and pager assertions belong to WBS 4.18.

## Approved assumptions and decisions used

- The repository owner explicitly approved CR-02 and CR-04 for WBS 4.17 assessment scope on 2026-10-09.
- A-17 is approved: `No action yet` means aging and without a current action; `Has an action` means any vehicle with a current action.
- C-21's action-filter portion is approved for this task; pagination, freshness, sorting and early warning remain subject to their own scope and approval.
- Active filters combine with AND. A removable chip clears only its own criterion; Clear filters continues to reset all filters.
- Data issues filter state from WBS 4.16 is included as an active removable chip.
- AC-R1-17 includes pagination not yet implemented here. WBS 4.17 adds the `Showing X-Y of N` count for the unpaginated filtered list only; pager and page-size behavior remain WBS 4.18.

## Relevant design components

- `src/core/aging.ts`: pure action-filter composition and active criteria shape.
- `src/App.tsx`: inventory view state, result count, and filter reset callbacks.
- `src/components/InventoryFilters.tsx` and `.css`: action selector and removable chips.
- Existing filter controls, Data issues view, and no-results/Clear filters presentation.

## In scope

- Add Any / No action yet / Has an action selection.
- Display one removable chip per active search, make, model, age-band, aging-only, data-issues, and action filter.
- Display `Showing X-Y of N` for the unpaginated filtered results, including a clear zero-results count.
- Preserve the existing Clear filters behavior and AND-composition.
- Add unit and component interaction tests.
- Update this execution snapshot and factual collaboration log.

## Explicitly out of scope

- Pagination, page sizes, pager controls or page-reset behavior (WBS 4.18).
- Sorting, presets, saved views, age profile, due-soon, freshness or other later CR features.
- Changes to approved requirements beyond recording this owner approval, changes to system design, dependencies, staging, committing or pushing.

## Files expected to change

- `docs/requirements-baseline.md`
- `docs/decisions/decision-register.md`
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/InventoryFilters.tsx`
- `src/components/InventoryFilters.css`
- `src/core/aging.test.ts`

## Verification

- Focused App and core tests; full Vitest suite.
- `npm run lint` and `npm run build`.
- `git diff --check` and final diff review.

## Conflicts and gaps

- AC-R1-17 contains page-size and pager requirements while WBS 4.18 owns pagination. This task implements only the result count, as scoped and owner-approved.
- D30-D40 outside previously approved D38 remain proposed. This task-specific authorization does not approve unrelated CR items.

## Exit criteria

- Action filter semantics, removable chips, result count and Clear filters work together.
- Existing VIN/data-issue/aging behavior remains intact.
- Focused/full tests, lint, build and final diff checks are reported.

Do not stage, commit, or push.
