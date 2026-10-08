# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.8
- Name: Implement UX States
- Workstream: UI Implementation
- Priority: Must
- Status: Complete
- Planned effort: 1.00 hour

## Objective

Verify that the dashboard presents the required loading, empty inventory, no-results, inventory-service error, retry, and action-save error states.

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

- AC-R4-01: Show a loading indicator and hide the list until retrieval completes.
- AC-R4-02: Show an empty-inventory message when retrieval returns zero vehicles.
- AC-R4-03: Show a distinct no-results state with `Clear filters`.
- AC-R4-04: Show an inventory-service error with retry and no rows on initial retrieval failure.
- AC-R4-05: Enable forced failure using the existing URL switch without changing code.
- AC-R3-05: For a failed action save, show the error and preserve the previous successful row action.

## Approved assumptions and design choices used

- Preserve existing dashboard states and service boundaries; do not add new UX or recovery behavior beyond the linked criteria.
- The existing `?forceFailure=true` switch configures the mock service for load and action-save demonstrations.
- Keep inventory-error and action-save-error outcomes distinct; a save failure preserves the last successful action.
- No dependencies, service contracts, or business rules are changed.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`App` owns inventory loading/retry and dashboard rendering states. The `MockInventoryService` URL switch supplies demonstration failures; the action form renders save errors and retries the same proposed action.

## In scope

- Verify loading, empty, no-results, and service-error/retry states.
- Add an app-level test that uses the URL switch and actual `MockInventoryService`, confirming forced load failure, absence of rows, and visible retry.
- Verify the existing action-save error behavior from WBS 4.7 remains covered.
- Update the active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- New state-management, notification, error-boundary, or logging abstractions.
- Changing the established loading, empty, filter, or action-save UI.
- Changes to the mock-service switch, service contract, requirements, or production backend behavior.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/ProposedActionForm.tsx`
- `src/services/mock-inventory-service.ts`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Required loading, empty, no-results, and service-error states are covered by observable component tests.
- The actual URL forced-failure switch displays the service error, no rows, and a retry control.
- Action-save error still shows an error and preserves the last successful action.
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
