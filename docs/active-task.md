# Active WBS Task

> Execution snapshot for WBS 5.3.

## Task

- WBS ID: 5.3
- Name: Action Workflow Tests
- Workstream: Testing
- Status: Complete

## Objective

Test the proposed-action workflow: successful save, validation failure, reload persistence and forced service failure.

## Linked acceptance criteria

- AC-R3-01: A proposed action can be saved for an aging vehicle.
- AC-R3-02: A saved action persists after reload.
- AC-R3-03: No action control for a vehicle at exactly 90 days.
- AC-R3-04: A missing action is rejected with a validation message.
- AC-R3-05: The previous action is preserved when a save fails.
- AC-R3-06: One current action per aging vehicle; a new save replaces it.
- AC-R4-05: Forced service failure is shown and recoverable.

## Task-scoped notes

- Existing tests already covered save, validation, reload and failure with a stubbed service. This task adds: a forced failure through the real `MockInventoryService`, replacement through two real saves with persisted-storage assertions, validation not altering an existing action, and an explicit exactly-90-days test.
- Production code is unchanged.

## Out of scope

- Production code, later WBS tasks, `docs/wbs.md`, requirements, system design, staging, committing or pushing.
- `src/components/InventoryTable.css` has an unrelated pre-existing modification.

## Files changed

- `src/App.test.tsx`
- `docs/active-task.md`
- `docs/traceability.md`
