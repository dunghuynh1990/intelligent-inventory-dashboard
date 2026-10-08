# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. The repository owner approved the WBS 4.16 assessment scope on 2026-10-09; unrelated CR dispositions and production-policy questions remain open.

## Task

- WBS ID: 4.16
- Name: Show VIN, Entry-Date Format and Data-Issue Rows
- Workstream: UI Implementation
- Priority: Should
- Status: Not Started
- Planned effort: 0.75 hour
- CR Ref: CR-01, CR-06, CR-27, CR-32

## Objective

Display vehicle VIN and formatted entry-date details, visibly identify missing/invalid/future entry-date issues, and provide a Data issues entry point that replaces current filters with the issue-only view.

## Linked acceptance criteria

- AC-R1-12: Show the full 17-character VIN in each vehicle row.
- AC-R2-15: Show Unknown days and the entry-date issue, omit Aging and action controls for an invalid-date vehicle, and include it in the Data issues view.
- AC-R1-13 supports VIN search; highlighting is limited to matching VIN text and does not change search behavior.
- AC-R2-14/16 support the missing/invalid/future labels and generated issue examples already covered by the pure core and mock generator.
- CR-32 / C-13: Format valid entry dates as DD-MMM-YYYY.

## Approved assumptions and decisions used

- CR-01, CR-06 and CR-32 assessment scope was explicitly approved by the repository owner on 2026-10-09.
- A-12 and A-21 are approved for assessment behavior; A-14 confirms case-insensitive search across stock number, VIN, make and model. Production policy and additional identifiers remain open (OQ-01/OQ-05).
- D38 is Selected for assessment data-quality visibility. Missing, invalid and future dates have unknown age, are not aging, show issue labels, and are discoverable in the Data issues view.
- C-13 is approved for VIN, date format and data-issue row details in this WBS. The due-soon tag remains assigned to WBS 4.21.
- The Data issues quick view replaces the current filter set (A-13); it does not combine with existing search/make/model/age filters.
- Existing core logic already searches VIN, classifies issues, and provides issue counts; preserve its pure-function/service boundaries and aging calculations.

## Relevant design components

- `src/core/aging.ts`: pure vehicle filtering and derived entry-date state.
- `src/types/vehicle.ts`: stored and calculated vehicle data.
- `src/App.tsx`: dashboard filters, summary callback and list composition.
- `src/components/InventorySummary.tsx`: Data issues entry point.
- `src/components/InventoryTable.tsx`: VIN, formatted date, match highlight, issue text and aging/action visibility.
- Related CSS files: `src/components/InventorySummary.css`, `src/components/InventoryTable.css`, and `src/components/InventoryFilters.css`.

## In scope

- Display full VINs and highlight matched VIN text when search matches them.
- Format valid stock-entry dates as DD-MMM-YYYY.
- Display the appropriate missing/invalid/future issue label and Unknown days, without Aging status or action controls.
- Add an accessible Data issues link that replaces existing filters with the data-issue-only view.
- Add component tests for VIN/date/issue rendering and Data issues filtering.
- Update this execution snapshot and the factual AI collaboration log.

## Explicitly out of scope

- New search fields or changes to search matching rules; the already-approved stock number/VIN/make/model search remains unchanged.
- Action filters/chips, pagination, result counts, sorting/`aria-sort`, due-soon status, freshness UI or later CR components.
- Production data-quality policy, VIN validation/decoding, new dependencies, requirements or system-design changes.
- Changes to `docs/wbs.md`, staging, committing or pushing.

## Files expected to change

- `src/types/vehicle.ts`
- `src/core/aging.ts`
- `src/core/aging.test.ts`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/InventoryFilters.tsx`
- `src/components/InventorySummary.tsx`
- `src/components/InventorySummary.css`
- `src/components/InventoryTable.tsx`
- `src/components/InventoryTable.css`
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`

## Verification

- Focused App and core tests; complete Vitest suite.
- `npm run lint` and `npm run build`.
- `git diff --check` and final diff review.

## Conflicts and gaps

- The confirmed approvals are limited to CR-01, CR-06 and CR-32 as scoped above. Other D30-D40 decisions remain Proposed.
- AC-R2-15 states an invalid-date example; this task applies its row behavior consistently to all three approved issue classes.
- Production treatment of bad dates and search over other identifiers remains open and is not inferred from the assessment approval.

## Exit criteria

- VIN, formatted dates and textual data-issue states are visible and accessible.
- Data issues selection replaces other filters and returns all issue rows.
- Issue rows show Unknown age and no Aging badge or action controls.
- Existing aging badge text and action eligibility for valid aging vehicles are unchanged.
- Focused/full tests, lint, build and final diff checks are reported.

Do not stage, commit, or push.
