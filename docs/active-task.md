# Active WBS Task

> Execution snapshot for WBS 5.2.

## Task

- WBS ID: 5.2
- Name: Filter Tests
- Workstream: Testing
- Priority: Must
- Status: Complete
- Planned effort: 1.00 hour

## Objective

Test the pure filter function directly for search, make, model, age band, aging only, combined filters, clearing filters and behavior against generated data.

## Linked acceptance criteria

- AC-R1-03: Free-text search over stock number, make, model and VIN, case-insensitive.
- AC-R1-04: Make filter returns only that make, with a matching count.
- AC-R1-05: Model filter returns only that model, with a matching count.
- AC-R1-06: Age-band filter returns only that band, with a matching count.
- AC-R1-07: Aging-only returns only vehicles over 90 days, with a matching count.
- AC-R1-08: Combined filters use AND.
- AC-R1-09: Clearing filters returns all vehicles (Component criterion; the pure-function equivalent is tested here, the UI is covered in `src/App.test.tsx`).
- AC-R1-10: Model options depend on make.
- AC-R1-11: Stable ascending vehicle-ID order.

## Approved assumptions and task-scoped interpretations

- Related design choices: C-09, C-10, C-17, C-18, C-21.
- CR note in the WBS: VIN-search and action-filter tests belong to WBS 5.6 and are not extended here.
- Existing fixture-based filter tests (from earlier tasks) already covered the single filters; this task adds the missing "behavior against generated data" and "clear filters" coverage.
- Expected values for generated data are computed independently from vehicle fields, not by calling `filterVehicles`.
- Search text `accord` is used for generated data because the seeded generator produces no Civic. The generator is unchanged (out of scope).

## Relevant design components

- `src/core/aging.ts` (`filterVehicles`, `getAvailableModels`): unchanged.
- `src/core/aging.test.ts`: new `against the generated mock inventory` group.
- `src/services/mock-vehicle-data.ts`: used as test input only.

## In scope

- Add generated-data tests for each single filter, combined AND filtering, data-issue exclusion from age filters, make-dependent model options, stable order for reversed input and clearing filters.

## Explicitly out of scope

- Production code changes, VIN and action-filter tests (WBS 5.6), component tests (WBS 5.7), changing the generator, `docs/wbs.md`, requirements, system design, staging, committing or pushing.
- `src/components/InventoryTable.css` has an unrelated modification that was already in the working tree; it is not part of this task.

## Files changed

- `src/core/aging.test.ts`
- `docs/active-task.md`
- `docs/traceability.md`

## Verification

- Focused: `npx vitest run src/core/aging.test.ts` (89 tests passed).
- Mutation check: inverting the make comparison in `filterVehicles` made 6 tests fail, including both new generated-data tests; the change was reverted.
- Full suite: `npm test -- --run` (5 files, 147 tests passed).
- `npm run lint` and `npm run build` passed (an initial build failed on a typing error in the new test and was fixed).

## Exit criteria

- Search, make, model, age band, aging only, combined filters, clear filters and generated data are covered by direct unit tests.
- No production code changed.

Do not stage, commit, or push.
