# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. The repository owner authorized WBS 4.14 only despite broader CR dispositions remaining proposed.

## Task

- WBS ID: 4.14
- Name: Add Reviewer Switches and Demo Mode
- Workstream: Data & Service
- Priority: Should
- Status: Not Started
- Planned effort: 0.50 hour
- CR Ref: CR-22, CR-23

## Objective

Allow reviewers to select forced-failure, empty-inventory, and simulated data-age scenarios without code changes; seed representative actions only when demo mode is explicitly enabled; document the URL controls without adding product UI.

## Linked acceptance criteria

- AC-R4-05 (Manual): A reviewer can force the mock service error state without changing code.
- AC-R4-07 (Manual): A reviewer can select empty inventory or 25-minute data age without changing code and see the corresponding scenario.

## Assumptions and decisions used

- C-26 and D39 remain proposed. The repository owner explicitly authorized WBS 4.14 only; this does not approve other proposed CR items.
- Reviewer controls use URL parameters: `forceFailure=true`, `emptyInventory=true`, `dataAgeMinutes=<minutes>`, and `demo=true`.
- Sample actions are seeded only when `demo=true`, the action store is absent, and empty-inventory mode is not selected; existing persisted actions are never overwritten.
- Demo seed records use the action already supported by the current assessment UI. The fixed 15/60-minute freshness levels and amber/warning presentation remain for WBS 4.20.

## Relevant design components

- `src/services/mock-inventory-service.ts`: mock-layer scenario switches and optional sample-action seeding.
- `src/main.tsx`: pass the simulated data-age clock to the existing dashboard.
- `src/App.tsx`: existing injected clock controls the visible last-refreshed timestamp.
- `README.md`: reviewer instructions.

## In scope

- Add query-controlled empty inventory and demo action seeding while preserving forced-failure behavior.
- Simulate a selected last-refreshed age from the URL.
- Keep default app/test state unseeded.
- Document and test scenario switches, demo-only seeding, and preservation of existing action data.
- Update this execution snapshot and append factual collaboration-log evidence.

## Explicitly out of scope

- A product demo bar, dev-only panel, requirement-ID overlay, or production demo/backend behavior.
- Implementing the amber freshness indicator or stale-data banner assigned to later freshness UI work.
- Changes to the `InventoryService` interface, unrelated UI, requirements, design, decision register, or WBS catalogue.
- Changing WBS status, staging, committing, or pushing.

## Files expected to change

- `src/services/mock-inventory-service.ts`
- `src/services/mock-inventory-service.test.ts`
- `src/main.tsx`
- `README.md`
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`

## Tests to add or update

- Verify empty-inventory mode returns no vehicles while default mode remains populated and unseeded.
- Verify demo mode seeds sample actions on aging vehicles only and does not overwrite existing actions.
- Verify the data-age URL value is parsed and invalid values fail explicitly.
- Re-run existing forced-failure URL coverage.
- Run focused and complete tests, lint, and the production build.

## Conflicts and gaps

- AC-R4-07 is proposed and D39/C-26 remain proposed. The repository owner authorized this WBS only.
- The app currently displays an absolute last-refreshed time but has no freshness-level UI. The data-age switch will change that timestamp; the amber indicator remains deferred to later freshness implementation and must not be claimed as complete here.
- The previous active-task snapshot covered WBS 4.13; it is replaced without changing the WBS catalogue or task status.

## Exit criteria

- Reviewers can select failure, empty inventory, and data-age scenarios with URL parameters.
- Sample actions appear only in explicit demo mode and do not overwrite existing actions.
- Tests, lint, build, documentation, and final diff are verified.

Do not stage, commit, or push.
