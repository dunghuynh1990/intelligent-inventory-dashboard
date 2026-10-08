# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. This execution snapshot records WBS 4.12 scope; it does not approve proposed CR decisions or change requirements.

## Task

- WBS ID: 4.12
- Name: Extend Core Module for CR
- Workstream: Core Logic
- Priority: Should
- Status: In Progress
- Planned effort: 1.00 hour
- CR Ref: CR-01, CR-02, CR-03, CR-06, CR-17

## Objective

Add pure, framework-independent core functions for CR search, action filtering, entry-date issue classification, pagination, freshness levels and data-issue summary counts. Use explicit reference-date and current-time inputs.

## Linked acceptance criteria

- AC-R1-13: Search stock number, VIN, make and model case-insensitively.
- AC-R1-14: `No action yet` returns only aging vehicles without a current action.
- AC-R1-15: `Has an action` returns vehicles with a current action.
- AC-R1-16: Slice the requested page and clamp an out-of-range page.
- AC-R2-14: Classify missing, invalid and future entry dates distinctly.
- AC-R2-16: This task provides issue classification and summary support only; deterministic bad-date examples and confirming the 89/90/91-day generated fixtures remain WBS 4.13.
- AC-R5-03: Map elapsed refresh ages of 14, 15, 59 and 60 minutes to normal, amber, amber and warning.

## Assumptions and decisions used

- A-12 is PROPOSED: missing, invalid and future dates have unknown age and are not aging.
- A-14 is PROPOSED: search includes stock number, VIN, make and model, case-insensitively.
- A-17 is PROPOSED: no-action filtering also requires an aging vehicle; has-action filtering requires a current action.
- A-18 and C-24 freshness thresholds are proposed placeholders (amber from 15 minutes, warning from 60); OQ-11 remains open. They are not production service-level targets.
- C-20 defines proposed page sizes 10/20/50/100, default 20, and non-persistent page state. D31 remains Proposed.
- C-21 assigns core search, action filtering, date issue classification, pagination and freshness to pure TypeScript functions. Sorting and early-warning remain in later gated WBS tasks.
- The current Vehicle type and mock data do not yet include VIN. Core search will support an optional VIN for compatibility; the mock VIN generation is outside WBS 4.12.

## Relevant design components

- `src/core/aging.ts`: pure aging/filter functions and the new CR-related pure helpers.
- `src/types/vehicle.ts`: existing vehicle/action contract; unchanged.
- `InventoryService`: not changed; core logic remains separate from data access.

## In scope

- Extend core search to consider an optional VIN field as well as stock number, make and model.
- Add action-filter predicates and date-issue classification with an explicit reference date.
- Add generic pagination slicing and page clamping, freshness classification with an explicit current time, and a data-issue summary count.
- Add focused unit coverage for the new core behavior and boundaries.
- Replace this execution snapshot for the requested WBS task.

## Explicitly out of scope

- React filter/pager/header wiring, presentation, or changes to the service contract.
- Mock VIN generation, mock bad-date records and `loggedAt` (WBS 4.13).
- Sort and early-warning functions (WBS 4.21 and 4.24).
- Requirements, WBS, traceability, decisions and system-design changes.
- Dependencies, staging, committing or pushing.

## Files expected to change

- `src/core/aging.ts`
- `src/core/aging.test.ts`
- `docs/active-task.md`

## Tests to add or update

- Extend `src/core/aging.test.ts` with VIN and action-filter behavior, date-issue boundaries, pagination/clamping, freshness thresholds and data-issue summary cases.
- The broader unit-test workstream is WBS 5.6; this task adds only targeted tests necessary to verify these newly implemented core functions.

## Conflicts and gaps

- The current domain type has no VIN yet; WBS 4.13 owns mock VIN generation. This task supports optional VIN in core search without changing the shared vehicle type or fixtures.
- AC-R5-03 thresholds and A-12/A-14/A-17 are proposed, with OQ-11 still open. Implement them only as assessment behavior/placeholder thresholds and do not present them as confirmed production requirements.
- The previous active-task snapshot recorded WBS 3.5. This snapshot replaces it for the explicitly requested WBS 4.12 without changing WBS status records.

## Exit criteria

- Core helpers have no React imports and use explicit date/time inputs.
- Search, action filters, issue classification, pagination, freshness and data-issue summary count are implemented.
- Focused and full tests, lint, build, and final diff/scope review are reported.

## Verification commands

- Focused: `npm test -- src/core/aging.test.ts --pool=threads --maxWorkers=1`
- Full suite: `npm test -- --pool=threads --maxWorkers=1`
- Lint: `npm run lint`
- Production build: `npm run build`
- Review: `git diff --check`, `git status --short`, and `git diff`

Do not stage, commit or push.
