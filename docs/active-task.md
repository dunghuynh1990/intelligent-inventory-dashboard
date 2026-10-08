# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.4
- Name: Build Inventory Display
- Workstream: UI Implementation
- Priority: Must
- Status: Complete
- Planned effort: 1.75 hours

## Objective

Build the service-backed inventory table with vehicle identity and required stock details, current action, textual aging indicator, last-refreshed time, and manual refresh.

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

- AC-R1-01: Show all returned vehicles when no filter is set.
- AC-R1-02: Show stock number, make, model, entry date, and days in stock.
- AC-R2-12: Show a textual `Aging` badge only for aging vehicles.
- AC-R4-01: Show loading while retrieval is pending and hide the list.
- AC-R4-02: Show an empty-inventory message when the service returns no vehicles.
- AC-R4-04: Show a service error and retry option when retrieval fails.
- AC-R5-01: Show the successful load time as `Last refreshed`.
- AC-R5-02: Refresh requests vehicles again and updates the timestamp.

## Approved assumptions and design choices used

- The UI depends on `InventoryService`; it does not access the mock adapter's fixtures or local storage directly.
- The inventory is for one dealership; service retrieval returns the current full list.
- Aging is represented by the existing `isAging` value and only by a textual badge.
- The runtime clock is used for refresh timestamps and can be fixed in component tests.
- The current action is displayed read-only; editing and saving actions are WBS 4.7.
- Keep page state local, style the table responsively, and add no dependencies.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`DashboardPage` owns service-load and refresh state. `InventoryTable`, `VehicleRow`, and `AgingBadge` present the returned vehicles. The service contract remains `InventoryService`; the running application supplies `MockInventoryService` at the composition root.

## In scope

- Fetch vehicles through the `InventoryService` interface.
- Show vehicle identity, make, model, stock-entry date, days in stock, aging badge, and current action.
- Show last-refreshed time and a manual refresh/retry action.
- Cover loading, empty-inventory, and service-error states needed by the display.
- Add observable component tests for successful display, refresh, and service states.
- Update the active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- Search, filters, pagination, and sorting (WBS 4.5 and later scope).
- Summary cards (WBS 4.6; Should-level).
- Adding or editing actions (WBS 4.7).
- Broader UX-state polish beyond the loading, empty, and retrieval-error behavior required for this display.
- Service contract, mock data, or business-rule changes.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/App.tsx`
- `src/App.css`
- `src/main.tsx`
- `src/components/InventoryTable.tsx`
- `src/components/InventoryTable.css`
- `src/App.test.tsx`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- The table shows vehicle identity, entry date, days in stock, aging badge, and current action.
- Last-refreshed time and manual refresh action are present.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads src/App.test.tsx
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
