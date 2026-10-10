# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 5.3
- Name: Action Workflow Tests
- Workstream: Testing
- Priority: Must
- Status: In Progress
- Planned effort: 2.25 hours

## Objective

Verify the aging-vehicle proposed-action workflow through component and service tests: successful save, required-action validation, persistence after reload, forced failure preserving the previous action, replacement of the current action, and exclusion at exactly 90 days. Review and challenge the existing AI-assisted validation test with a temporary mutation, restore the implementation, and record factual evidence.

## Authoritative input documents

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`
- `.github/instructions/tests.instructions.md`
- Relevant workflow source, service code and tests

## Linked acceptance criteria

- **AC-R3-01: Save an action.** Given an aging vehicle has no current action, when the manager selects `Price Reduction Planned`, enters an optional note and saves, then the row shows `Price Reduction Planned` as the current action.
- **AC-R3-02: Persist after reload.** Given an action was saved on an aging vehicle, when the dashboard is reloaded using a new service instance reading the same local storage, then the vehicle still shows the saved action and note.
- **AC-R3-03: No action for non-aging vehicle.** Given a vehicle has exactly 90 days in stock, when its row is displayed, then no control to add or edit an action is available.
- **AC-R3-04: Action selection is required.** Given the action form is open for an aging vehicle, when the manager saves without selecting an action, then a validation message is shown and stored action remains unchanged.
- **AC-R3-05: Preserve previous action on failure.** Given an aging vehicle has action A and forced failure is enabled, when the manager saves action B, then an error is shown and the row still shows action A.
- **AC-R3-06: One current action.** Given an aging vehicle has action A, when the manager saves action B, then the row shows only action B.
- **AC-R4-05: Failure can be forced without code change.** Given the app is running in a browser, when the reviewer enables forced failure without changing code and refreshes, then the service-error state is displayed. This criterion is Manual; automated tests supplement, not replace, its manual check.

## Approved assumptions used

- **A-05:** Action is available only for aging vehicles.
- **A-06:** Log means one current action; a new save replaces the previous action.
- **A-07:** A proposed action is one fixed-list value plus an optional note.
- **A-10:** Persistence means the same browser and user after reload.
- **A-15:** An action must be selected; a note alone is insufficient.
- A failed save does not replace the last successful action; save is pessimistic.
- Exactly 90 complete calendar days is not aging.

## Relevant design choices and components

- C-04: Service-backed reads and writes with explicit failure handling.
- C-05: Reviewer can force service failure without changing code.
- C-15: Persist the current proposed action locally for the assessment.
- C-16: Preserve the previous action when a save fails.
- `ProposedActionForm`, `App`, inventory row/action controls, `InventoryService`, and `MockInventoryService`.
- Vitest and React Testing Library; mock storage is browser `localStorage`.

## In scope

- Review existing component and service tests against all linked criteria and task exit criteria.
- Add or correct only directly relevant action-workflow test coverage if a gap is found.
- Demonstrate that the required-action validation test detects a temporary validation defect, restore the implementation, and rerun tests.
- Record the actual review, mutation result, verification and any correction in `docs/ai/collaboration-log.md`.
- Run focused tests, full tests, lint and production build.

## Explicitly out of scope

- Changing application behavior unless a test exposes a task-relevant defect.
- Changing requirements, assumptions, system design, decision statuses, WBS catalogue status or traceability status.
- Implementing later WBS tasks, new features, dependencies, or production persistence.
- Reclassifying the conflicting WBS/traceability status without owner approval.
- Staging, committing or pushing.

## Expected files to inspect or change

- Inspect: `src/App.tsx`, `src/components/ProposedActionForm.tsx`, `src/services/mock-inventory-service.ts`, `src/App.test.tsx`, and `src/services/mock-inventory-service.test.ts`.
- Change if needed: `src/App.test.tsx` and/or `src/services/mock-inventory-service.test.ts`.
- Change: `docs/active-task.md` and `docs/ai/collaboration-log.md`.
- Do not change `docs/wbs.md`, `docs/requirements-baseline.md`, or `docs/traceability.md` while their status conflict remains unresolved.

## Tests and verification

- Focused: `npx vitest run src/App.test.tsx src/services/mock-inventory-service.test.ts --pool=threads --maxWorkers=1 --no-file-parallelism`
- Mutation challenge: temporarily remove the validation-message update from the action select's `onInvalid` handler, run only the missing-action validation test and confirm it fails because the alert is absent, restore the source, then rerun the focused tests.
- Full suite: `npm test -- --pool=threads --maxWorkers=1 --no-file-parallelism`
- Lint: `npm run lint`
- Production build/typecheck: `npm run build`
- Inspect `git diff --check`, `git status`, and final task diff; ensure the temporary mutation is fully restored.

## Exit criteria

- Tests demonstrate successful save, validation failure, reload persistence, forced service failure, replacement of the current action, and no action control at exactly 90 days.
- The validation test is reviewed and shown to detect the deliberate temporary defect; correct implementation is restored and tests pass.
- AC-R4-05's manual verification remains distinct from automated tests.
- The factual AI collaboration entry is written.
- Focused/full tests, lint and build pass; no test is weakened.
- The conflicting status in `docs/wbs.md` (Not Started) and `docs/traceability.md` (Complete) is reported and neither source status is silently changed.

## Human-only completion steps

- Review the full diff and confirm every changed test and AI-log statement is understood and factual.
- Stage, commit and push only after owner review.
