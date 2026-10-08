# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.7
- Name: Build Action Logging Workflow
- Workstream: UI Implementation
- Priority: Must
- Status: Complete
- Planned effort: 2.00 hours

## Objective

Implement the aging-vehicle action form and save workflow through `InventoryService`, including validation, persistence, and visible save-failure handling.

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

- AC-R3-01: Save `Price Reduction Planned` and an optional note for an aging vehicle.
- AC-R3-02: Keep a saved action and note after reload with the same browser storage.
- AC-R3-03: Do not offer action controls for a vehicle that is not aging.
- AC-R3-04: Require an action; a note alone does not save.
- AC-R3-05: Show save errors and retain the last successful row action.
- AC-R3-06: A newly saved action replaces the previous current action.

## Approved assumptions and design choices used

- Only aging vehicles get controls to add or edit an action.
- The selected fixed-list action is the explicitly required `Price Reduction Planned`; no other values were invented while OQ-07 remains open.
- The note is optional; no maximum length was introduced.
- One current action is stored per vehicle; a successful save replaces it.
- Save is pessimistic: the row changes only after the service succeeds, while saving controls are disabled.
- Mock persistence remains local to the same browser and is demonstration-only.
- Keep state local to the dashboard and use the existing `InventoryService`.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`App` owns the selected vehicle and save lifecycle. `InventoryTable` presents row eligibility and composes `ProposedActionForm`; successful updates go through `InventoryService`, and action input state remains in the form component.

## In scope

- Add an accessible action form and add/edit controls for aging rows only.
- Require the fixed-list action and accept an optional note.
- Save through `InventoryService.updateVehicleAction`.
- Keep prior row data visible during saving and on failure; provide an inline retry.
- Update the row only after a successful service response.
- Verify action persistence after a reload with a new mock service instance.
- Cover validation, eligibility, replacement, save failure, pending state, and persistence.
- Update the active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- Inventing or expanding action values beyond `Price Reduction Planned` while OQ-07 remains open.
- Action history, approvals, authentication, a real backend, or production persistence.
- Changes to aging rules, generated inventory, service contracts, or requirements.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/InventoryTable.tsx`
- `src/components/InventoryTable.css`
- `src/components/ProposedActionForm.tsx`
- `src/components/ProposedActionForm.css`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Action controls are available only for aging rows.
- A missing action is validated and does not call the service.
- A successful save replaces the current row action and persists after reload.
- A failed save shows an error and preserves the previous row state.
- Saving controls are disabled while the request is pending; retry is available after failure.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads --maxWorkers=1 src/App.test.tsx
npm test -- --pool=threads --maxWorkers=1
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
