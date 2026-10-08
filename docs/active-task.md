# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. This execution snapshot records WBS 5.6 scope; it does not approve proposed CR decisions or change requirements.

## Task

- WBS ID: 5.6
- Name: CR Core Unit Tests
- Workstream: Testing
- Priority: Should
- Status: In Progress
- Planned effort: 0.75 hour
- CR Ref: CR-01, CR-02, CR-03, CR-06, CR-17

## Objective

Verify pure CR core behavior against fixed inventory data and injected dates/times, demonstrate that deliberate changes to each tested rule fail the relevant tests, and record the work factually in the AI collaboration log.

## Linked acceptance criteria

- AC-R1-13: Search stock number, VIN, make and model case-insensitively.
- AC-R1-14/15: Filter aging vehicles without a current action and vehicles that have a current action.
- AC-R1-16: Slice and clamp requested pages.
- AC-R2-14: Distinguish missing, invalid, future and valid entry dates.
- AC-R2-16: Preserve the 89/90/91-day generated boundaries while adding data-issue cases. Existing mock-adapter tests verify the generated boundaries; generated missing/invalid/future examples remain for WBS 4.13.
- AC-R5-03: Classify fixed elapsed times of 14, 15, 59 and 60 minutes as normal, amber, amber and warning.

## Assumptions and decisions used

- A-12, A-14, A-17 and A-18 remain PROPOSED; this task verifies their assessment behavior without claiming production approval.
- C-21 assigns pure search, action filter, entry-date classification, pagination, and freshness behavior to the framework-independent core.
- C-20/D31 page sizes and C-24 freshness thresholds are proposed assessment choices; OQ-11 remains open.
- Reference dates and current times are fixed/injected in tests. The system clock is not read by the tested core functions.

## Relevant design components

- `src/core/aging.ts` pure CR helpers.
- `src/core/aging.test.ts` unit tests, shared with earlier aging/filter tests.
- `src/services/mock-vehicle-data.ts` and `src/services/mock-inventory-service.test.ts` existing 89/90/91-day fixture contract; used only for boundary mutation verification, not changed by this task.

## In scope

- Add focused fixed-date boundary coverage tying entry-date issue classification to unchanged 89/90/91-day age behavior.
- Run representative deliberate mutations for each linked core rule and confirm the corresponding tests fail.
- Record only verified implementation and test evidence in `docs/ai/collaboration-log.md`.
- Generate this execution snapshot.

## Explicitly out of scope

- Implementing the mock-layer missing/invalid/future records or VIN generation (WBS 4.13).
- Changing product/core implementation, React components, service contracts, requirements, WBS, design documents, or unrelated tests.
- Changing WBS task statuses, staging, committing or pushing.

## Files expected to change

- `src/core/aging.test.ts`
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`

## Tests to add or update

- Add focused AC-R2-16-related checks that entry-date issue classification leaves valid 89/90/91-day boundary vehicles classified as expected.
- Existing core tests cover AC-R1-13/14/15/16, AC-R2-14 and AC-R5-03.
- Existing mock-adapter tests cover the generated 89/90/91-day boundaries. CR-specific generated bad-date examples are deferred to WBS 4.13.
- Perform transient mutation checks; restore all production/mock source files after each check.

## Conflicts and gaps

- AC-R2-16 includes generated missing/invalid/future examples, but adding these to the mock generator is explicitly assigned to WBS 4.13. This task verifies the core issue-classification and existing boundary-preservation tests, not the not-yet-implemented generated examples.
- The prior active-task snapshot was for WBS 4.12; this snapshot replaces it without changing the WBS record.

## Exit criteria

- Linked pure-core behavior is tested with fixed data/date/time.
- Mutations for search, action filters, pagination, date classification/boundaries, freshness and issue summary are detected by tests.
- Generated mock boundary mutation is detected; all transient mutations are restored.
- Focused/full tests, lint, build, final diff and factual collaboration-log entry are reported.

## Verification commands

- Focused: `npm test -- src/core/aging.test.ts --pool=threads --maxWorkers=1`
- Full suite: `npm test -- --pool=threads --maxWorkers=1`
- Lint: `npm run lint`
- Production build: `npm run build`
- Review: `git diff --check`, `git status --short`, and `git diff`

Do not stage, commit or push.
