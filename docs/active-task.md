# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. The repository owner explicitly authorized implementation of WBS 4.13 only while the linked CR dispositions remain proposed.

## Task

- WBS ID: 4.13
- Name: Extend Mock Adapter for CR
- Workstream: Data & Service
- Priority: Should
- Status: Not Started
- Planned effort: 0.75 hour
- CR Ref: CR-01, CR-06, CR-07, CR-28

## Objective

Extend deterministic mock vehicles with fake VINs and one missing, invalid, and future stock-entry date; preserve the existing 89/90/91-day fixtures; and persist a save timestamp with each newly saved current action without changing the `InventoryService` signatures.

## Linked acceptance criteria

- AC-R1-12: Generated VIN values contain 17 characters for display.
- AC-R2-14: Entry-date issue classification distinguishes missing, invalid, future, and valid dates.
- AC-R2-15: Bad-date vehicle data supports the existing unknown-age and not-aging behavior; displaying the issue is a later UI task.
- AC-R2-16: Generated mock data contains one missing, one invalid, and one future entry date while retaining the 89/90/91-day records.
- AC-R3-07: Newly saved actions include their logged time; rendering relative-day labels is outside this task.

## Assumptions and decisions used

- A-12, A-20, A-21, and D38 remain proposed in the baseline. The repository owner authorized only the WBS 4.13 implementation scope; this does not approve other proposed CR work.
- Generated VINs are opaque fake values produced from a fixed seed using an alphabet that excludes I, O, and Q.
- A missing generated date is represented as `null`; the invalid example is `not-a-date`; the future example is one local calendar day after the injected reference date.
- Newly saved `loggedAt` values use an ISO 8601 UTC timestamp generated at save time. Existing stored actions without a timestamp remain readable.
- Existing 89/90/91-day records retain their relative dates and aging classifications.

## Relevant design components

- `src/types/vehicle.ts`: vehicle identity, nullable stock-entry date, and current-action shape.
- `src/core/aging.ts`: existing pure date-age behavior, extended to accept a missing date.
- `src/services/mock-vehicle-data.ts`: deterministic vehicle and VIN generation.
- `src/services/mock-inventory-service.ts`: current-action local persistence.
- `src/services/inventory-service.ts`: unchanged service contract.

## In scope

- Generate deterministic 17-character fake VINs without I, O, or Q.
- Generate exactly one missing, one invalid, and one future stock-entry date.
- Preserve the first three 89/90/91-day boundary vehicles and their aging behavior.
- Persist `loggedAt` for every action newly saved through the mock adapter.
- Add or update adapter/core tests and type fixtures required by these model changes.
- Refresh this execution snapshot and record factual work in the collaboration log.

## Explicitly out of scope

- VIN rendering, VIN search UI, data-issue UI, or relative logged-time labels.
- Changes to `InventoryService` method signatures or production persistence.
- Reviewer switches, demo seeding, unrelated CR work, and WBS 4.14 or later tasks.
- Requirements, system-design, decision-register, and WBS catalogue changes.
- Changing WBS or traceability status, staging, committing, or pushing.

## Files expected to change

- `src/types/vehicle.ts`
- `src/core/aging.ts`
- `src/services/mock-vehicle-data.ts`
- `src/services/mock-inventory-service.ts`
- `src/services/mock-inventory-service.test.ts`
- `src/core/aging.test.ts` and `src/App.test.tsx` for required typed fixture updates
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`

## Tests to add or update

- Verify deterministic VIN output, exact 17-character length, and exclusion of I, O, and Q.
- Verify exactly one generated example per missing/invalid/future issue and that each has unknown age and is not aging.
- Verify 89/90/91-day boundary records remain unchanged and relative to the injected reference date.
- Freeze time and verify the timestamp is persisted and returned with a saved action across service instances.
- Run focused tests, the complete suite, lint, and production build.

## Conflicts and gaps

- The baseline marks the linked CR dispositions and assumptions as proposed and pending owner confirmation. Before implementation, the repository owner explicitly authorized WBS 4.13 only. This authorization does not resolve the broader CR disposition question.
- AC-R2-15 and the display portions of AC-R1-12/AC-R3-07 require later UI work; this task adds the supporting mock data only.
- The prior active-task snapshot was WBS 5.6 and is replaced by this execution snapshot without changing the WBS catalogue or task status.

## Exit criteria

- Generated VINs meet the deterministic length/alphabet rules.
- Exactly one missing, invalid, and future date example is generated and classified as unusable.
- Existing 89/90/91-day generated records remain unchanged.
- Newly saved mock actions persist an ISO timestamp without altering service signatures.
- Focused and complete tests, lint, build, and final diff review are reported.

Do not stage, commit, or push.
