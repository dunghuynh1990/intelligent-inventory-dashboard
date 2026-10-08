# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 5.1
- Name: Write Aging-Rule Unit Tests
- Workstream: Testing
- Priority: Must
- Status: Complete
- Planned effort: 1.25 hours

## Objective

Verify the aging business rules with deterministic unit tests using a fixed reference date, covering threshold boundaries, invalid and future dates, and all age-band boundaries.

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

WBS 5.1 had no prior row in the traceability table; its mapping is added as part of this task. The test cases cover:

- **AC-R2-01:** 91 days is aging.
- **AC-R2-02:** exactly 90 days is not aging.
- **AC-R2-03:** 89 days is not aging.
- **AC-R2-04:** time of day is ignored when comparing calendar dates.
- **AC-R2-05:** invalid entry date yields unknown days and not aging without throwing.
- **AC-R2-06:** future entry date yields unknown days and not aging without throwing.
- **AC-R2-07:** 30/31 age-band boundary.
- **AC-R2-08:** 60/61 age-band boundary.
- **AC-R2-09:** 90/91 age-band boundary.
- **AC-R2-11:** injected reference date affects age evaluation.

## Approved assumptions and design choices used

- Aging is strictly more than 90 complete calendar days; exactly 90 days is not aging.
- Age bands are `0-30`, `31-60`, `61-90`, and `>90`.
- Age is evaluated against a fixed injected reference date in tests; runtime callers provide the current date.
- Calendar-day calculation uses local calendar dates and ignores time of day.
- Invalid or future stock-entry dates have unknown age and are not aging.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The aging rules are pure TypeScript functions outside React. The unit tests exercise those functions with fixed reference dates and do not depend on UI or service behavior.

## In scope

- Verify fixed-date aging tests cover 89, 90, and 91 days.
- Verify invalid and future dates and all age-band boundaries.
- Demonstrate that a deliberate mutation to an aging rule causes the relevant test to fail.
- Record factual AI-assisted testing evidence.

## Explicitly out of scope

- Changing aging-rule behavior or its approved threshold.
- Mock data generation, filtering, React UI, dashboard orchestration, or service changes.
- Adding dependencies.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/core/aging.test.ts`
- `src/core/aging.ts` (temporary mutation for test-sensitivity verification only; restore afterward)
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

The existing aging tests already appear to cover the stated cases; preserve their assertions and add tests only if verification shows a gap.

## Exit criteria

- Tests use a fixed reference date and cover 89, 90, and 91 days.
- Tests cover invalid and future dates and all age-band boundaries.
- At least one deliberate mutation causes its relevant test to fail.
- An AI-log entry records the actual test work and results.
- The full test suite, lint, and production build pass after restoring the original rule.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
npm test -- --pool=threads src/core/aging.test.ts -t "classifies 90 days"
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
