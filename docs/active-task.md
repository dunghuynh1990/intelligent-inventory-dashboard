# Active WBS Task

> Execution snapshot for WBS 4.20. The repository owner invoked this task, authorizing its CR-17 freshness behavior for this task only. The 15/60-minute thresholds remain named assessment placeholders, not production freshness targets; A-18/OQ-11 and D37 remain proposed outside this scope.

## Task

- WBS ID: 4.20
- Name: Build Freshness Indicators
- Workstream: UI Implementation
- Priority: Should
- Status: Complete
- Planned effort: 1.00 hour
- CR Ref: CR-17

## Objective

Make inventory freshness, the reference date, and refresh outcomes visible in the dashboard header and inventory section.

## Linked acceptance criteria

- AC-R4-06: A failed manual refresh preserves loaded rows and the last successful refresh time, while showing an error and Retry.
- AC-R5-03: Classify 14, 15, 59 and 60 minutes as normal, amber, amber and warning.
- AC-R5-04: Show the last-refreshed time and elapsed time, with amber styling at 25 minutes.
- AC-R5-05: At 60 minutes, show a stale-data warning and Refresh now above the summary.
- AC-R5-06: Show the reference date as DD-MMM-YYYY.

## Approved assumptions and decisions used

- A-08: Real-time is represented by last-refreshed time plus manual refresh.
- The WBS 4.20 invocation authorizes implementing the task-specified CR-17 behavior for this assessment task.
- Use the named 15- and 60-minute placeholders as specified by AC-R5-03 and WBS 4.20; no production service-level target or push/polling mechanism is implied.
- Preserve the existing separation between first-load failure (no inventory rows) and refresh failure (previous rows remain visible).
- Keep inventory access behind the existing `InventoryService` and use the injected clock for deterministic timestamps and tests.

## Relevant design components

- `src/core/aging.ts`: pure freshness thresholds and elapsed-time display formatting.
- `src/App.tsx`: current time, successful refresh state, header and stale-warning orchestration.
- `src/App.css`: freshness-level, error and warning presentation.
- `src/App.test.tsx`: fixed-clock refresh, stale-threshold, retry and reference-date behavior.

## In scope

- Show the current reference date as DD-MMM-YYYY in the header.
- Show last-refreshed time and elapsed minutes; update the displayed elapsed time while the page remains open.
- Apply normal, amber and warning states at the existing 15/60-minute placeholder thresholds.
- At 60 minutes, show a stale-data banner above the summary with a Refresh now action.
- On refresh failure, keep the prior inventory and timestamp and expose Retry; preserve the distinct first-load failure behavior.
- Add focused pure and component tests, and update the execution snapshot, traceability and factual collaboration log.

## Explicitly out of scope

- Changing the requirements baseline, `docs/wbs.md`, system design or proposal status for A-18/D37.
- Production freshness targets, automatic data refresh, server push/polling, authentication, backend work or new dependencies.
- Features assigned to later WBS tasks, unrelated existing changes, staging, committing or pushing.

## Files changed

- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`
- `src/App.tsx`, `src/App.css`, `src/App.test.tsx`
- `src/core/aging.ts`, `src/core/aging.test.ts`

## Verification

- Focused: `npm test -- --pool=threads --maxWorkers=1 --isolate=false src/core/aging.test.ts src/App.test.tsx` (2 files, 92 tests passed).
- Full suite: `npm test -- --pool=threads --maxWorkers=1 --isolate=false` (5 files, 112 tests passed).
- `npm run lint` passed.
- `npm run build` passed.
- Browser review with `?dataAgeMinutes=25` showed the amber `25 min ago` state; `?dataAgeMinutes=60` showed the warning, `60 min ago`, and both Refresh now controls.
- `git diff --check` passed; final diff reviewed.
- An initial focused run timed out during Vitest worker startup; isolated one-worker reruns passed. An early stale-warning query had an incorrect accessible-name matcher; it was corrected before the passing run.

## Exit criteria

- Header date, elapsed refresh age, freshness colors and stale warning match the task-defined placeholders.
- Refresh errors preserve last successful inventory and timestamp, provide Retry, and do not change first-load behavior.
- Focused/full tests, lint, build, browser freshness review and final diff checks pass.

Do not stage, commit, or push.
