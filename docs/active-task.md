# Active WBS Task

> Execution snapshot for WBS 5.7.

## Task

- WBS ID: 5.7
- Name: CR Component Tests
- Workstream: Testing
- Priority: Should
- Status: Complete
- Planned effort: 0.75 hour
- CR Ref: CR Should criteria

## Objective

Verify observable CR component behavior with component tests.

## Linked acceptance criteria

- AC-R1-12: Row shows the full VIN.
- AC-R1-17: 200 vehicles show 20 rows, `Showing 1-20 of 200` and page 1 of 10.
- AC-R1-18: Changing any filter from page 3 returns to page 1.
- AC-R2-15: Data-issue rows show the issue, no Aging badge and no action control; the vehicle appears in the Data issues view.
- AC-R3-07: Saved action shows `Logged today`, then `Logged 3 days ago`.
- AC-R3-09: Save failure shows a reference matching the logged correlation ID.
- AC-R4-06: Refresh failure keeps rows and the earlier Last refreshed time and shows a Retry banner.
- AC-R5-04: 25 minutes after load, the header shows `25 min ago`, marked amber.
- AC-R5-05: A 60-minute-old load shows a stale warning with `Refresh now` above the summary.
- AC-R5-06: Header shows the reference date as DD-MMM-YYYY.

## Approved assumptions and task-scoped interpretations

- Related design choices: C-13, C-20, C-24, C-28.
- Most criteria were already covered by component tests added with WBS 4.16-4.20; this task audits them against each criterion and fills gaps.
- Owner decision for this task: AC-R2-15 is tested against the built behavior, where the Days cell shows the issue text instead of the literal `Unknown`. This deviation from the AC wording is reported, not changed.
- No criterion was moved to manual verification, so no Test-level metadata changed.

## Relevant design components

- `src/App.test.tsx`: component tests for the listed criteria.
- No production code is changed.

## In scope

- Confirm each listed criterion has component coverage.
- Add a test for AC-R1-18 covering every filter (search, make, model, age band, action, aging only).

## Explicitly out of scope

- Changing production code, `docs/requirements-baseline.md`, `docs/wbs.md` or system design.
- Making the table show the literal `Unknown` for data-issue rows.
- Unit-level CR criteria (WBS 5.6), README (WBS 7.4), staging, committing or pushing.

## Coverage map (`src/App.test.tsx`)

- AC-R1-12: "shows all returned vehicle details ..." and "highlights the matching VIN substring ...".
- AC-R1-17: "shows the default page and supports first, previous, numbered, next, and last-page navigation".
- AC-R1-18: "changes page size, resets to page one ..." (search) and new "returns to page one when any filter changes from page three".
- AC-R2-15: "formats missing and future dates ...", "shows all returned vehicle details ..." and "replaces active filters with the Data issues view".
- AC-R3-07: "confirms a successful save and displays its logged age from the injected clock".
- AC-R3-09: "keeps the previous action on save failure and retries the replacement".
- AC-R4-06: "keeps the last successful inventory and timestamp when refresh fails".
- AC-R5-04 and AC-R5-06: "shows the reference date and amber elapsed freshness after 15 minutes".
- AC-R5-05: "shows a stale-data warning and refresh control at 60 minutes".

## Files changed

- `src/App.test.tsx`
- `docs/active-task.md`
- `docs/traceability.md`

## Verification

- Focused: `npx vitest run src/App.test.tsx -t "returns to page one"` (1 file passed, 2 tests matched and passed).
- Full suite: `npm test -- --run` (5 files, 141 tests passed).
- `npm run lint` and `npm run build` passed.

## Exit criteria

- Listed component criteria have test coverage.
- No Nice criterion needed a manual check for this task.
- Test-level metadata is unchanged because nothing moved to manual.

Do not stage, commit, or push.
