# Active WBS Task

> Execution snapshot for WBS 4.19. The repository owner approved CR-07, CR-16 and CR-29, plus retaining the dialog action-entry design, for this task only. This scoped approval does not change the requirements baseline or the broader Proposed status of these CRs.

## Task

- WBS ID: 4.19
- Name: Show Action Logged Time, Save Feedback and Error Reference
- Workstream: UI Implementation
- Priority: Should
- Status: Complete
- Planned effort: 0.50 hour
- CR Ref: CR-07, CR-16, CR-29

## Objective

Show relative action age, successful-save confirmation, and the matching correlation reference when an action save fails. Keep action entry in the approved dialog design.

## Linked acceptance criteria

- AC-R3-01: Permit an action only for an eligible aging vehicle and save it through `InventoryService`.
- AC-R3-07: Show `Logged today` or the elapsed calendar-day label for a saved action.
- AC-R3-09: Include the correlation ID from the failed service-call log in the inline save error.

## Approved assumptions and decisions used

- The repository owner explicitly approved CR-07, CR-16 and CR-29 for WBS 4.19 and confirmed that the action form should follow the dialog design.
- Approval is scoped to this task; no proposed requirement, assumption or design choice was changed in the baseline.
- Use an injected runtime clock for deterministic action timestamps and relative-day rendering.
- Continue to store only one current action per eligible vehicle; no action history or Undo behavior is added.
- WBS 4.10 is complete, so the existing service logging decorator provides the correlation ID to expose on failed saves.
- Keep the `InventoryService` method signatures unchanged.

## Relevant design components

- `src/core/aging.ts`: pure action-age label formatting.
- `src/App.tsx`: dashboard action-save orchestration, injected clock and success feedback.
- `src/components/InventoryTable.tsx` and `.css`: aging-row action-age display and modal dialog presentation.
- `src/components/ProposedActionForm.tsx`: validation, service error and correlation reference.
- `src/services/logging-inventory-service.ts`: existing service logging boundary and correlated save errors.

## In scope

- Show action logged age as `Logged today`, `Logged yesterday`, or `Logged N days ago`; omit the age label for missing, invalid or future timestamps.
- Show `No action yet` for aging vehicles without a current action.
- Show an accessible action-entry dialog for eligible rows.
- Show `Action saved` after successful service completion; preserve the previous current action and expose the correlated reference on failure.
- Add fixed-clock pure and component tests plus logging-correlation assertions.

## Explicitly out of scope

- Action-history, Undo, bulk actions, stale-action flags, new action values or action changes for non-aging vehicles.
- Changes to `docs/wbs.md`, the requirements baseline, system design, dependencies, unrelated task files, or mock service persistence policy.
- Staging, committing or pushing.

## Files changed

- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`
- `src/App.tsx`, `src/App.css`, `src/App.test.tsx`
- `src/components/InventoryTable.tsx`, `src/components/InventoryTable.css`
- `src/components/ProposedActionForm.tsx`
- `src/core/aging.ts`, `src/core/aging.test.ts`
- `src/services/logging-inventory-service.ts`, `src/services/logging-inventory-service.test.ts`

## Verification

- Focused: `npm test -- --pool=threads --maxWorkers=1 --isolate=false src/core/aging.test.ts src/services/logging-inventory-service.test.ts src/App.test.tsx` (3 files, 89 tests passed).
- Full suite: `npm test -- --pool=threads --maxWorkers=1 --isolate=false` (5 files, 106 tests passed).
- `npm run lint` passed.
- `npm run build` passed.
- The first focused run hit a Vitest worker-startup timeout; the isolated, single-worker rerun passed. A subsequent focused run exposed an ambiguous Action label in the new test; the query was scoped to its dialog before the passing run.
- `git diff --check` passed; the final diff was reviewed.

## Exit criteria

- Existing current action remains visible if save fails; on success the updated action and success feedback appear.
- Action age and failed-save correlation ID are presented as specified.
- Full tests, lint, build and final diff checks pass.

Do not stage, commit, or push.
