# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.3
- Name: Implement Aging-Stock Business Logic
- Workstream: Core Logic
- Priority: Must
- Status: Complete
- Planned effort: 1.00 hour

## Objective

Implement pure TypeScript functions in a non-React core module that calculate calendar days in stock, aging status, and age band using an injected reference date.

## Authoritative inputs

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`

## Linked acceptance criteria

- **AC-R2-01:** 91 days is aging.
- **AC-R2-02:** exactly 90 days is not aging.
- **AC-R2-03:** 89 days is not aging.
- **AC-R2-04:** ignore time of day; compare calendar dates.
- **AC-R2-05:** invalid entry date yields unknown days and not aging without throwing.
- **AC-R2-06:** future entry date yields unknown days and not aging without throwing.
- **AC-R2-07:** 30/31 age-band boundary.
- **AC-R2-08:** 60/61 age-band boundary.
- **AC-R2-09:** 90/91 age-band boundary.

## Approved assumptions and design choices used

- Aging is strictly more than 90 complete calendar days; exactly 90 days is not aging.
- Age bands are `0-30`, `31-60`, `61-90`, and `>90`.
- Age is evaluated against the injected reference date; runtime callers supply the current date.
- Calendar days use the browser-local calendar date and local start of day; time of day is ignored.
- Stock-entry values use ISO calendar-date or date-time strings; timezone-bearing timestamps are evaluated by their browser-local date.
- Invalid or future stock-entry dates have unknown age and are not aging.
- Business rules belong in pure TypeScript outside React.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The non-React core module provides pure aging/date functions to the orchestration layer. It does not read the system clock itself; callers inject the reference date.

## In scope

- Implement pure date/day, aging, and age-band calculations.
- Accept an injected reference date.
- Define the 90-day aging threshold once.
- Safely handle invalid and future stock-entry dates.
- Add focused unit tests for linked acceptance criteria.

## Explicitly out of scope

- Generating or changing mock inventory data.
- Filtering, React UI, dashboard orchestration, or service changes.
- Persisting calculated values.
- Implementing other WBS tasks, including filtering or action workflows.
- Adding dependencies.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/core/aging.ts`
- `src/core/aging.test.ts`
- `src/types/vehicle.ts`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Pure functions live in a non-React core module.
- Functions accept an injected reference date.
- Days in stock, aging flag, and age band are calculated.
- Invalid and future entry dates are handled safely.
- The 90-day threshold is defined once.
- Unit tests cover AC-R2-01 through AC-R2-09 without weakening existing tests.
- Tests, lint, and production build pass.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
