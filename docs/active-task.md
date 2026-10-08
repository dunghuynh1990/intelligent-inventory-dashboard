# Active WBS Task

> Generated from `docs/wbs.md`, Plan v5 and `docs/requirements-baseline.md`. This is an execution snapshot, not a new requirement.

## Task

- WBS ID: 1.5
- Name: Triage CR and update planning baseline
- Workstream: Requirements & Scope
- Priority: Must
- Status: In Progress
- Planned effort: 0.50 hour
- CR Ref: CR triage

## Objective

Triage every change-request item, align Requirements Baseline v4 and Plan v5, and list owner decisions.

## Authoritative inputs

- `docs/cr/requirements-baseline-v4-export.md` (v4 export)
- `docs/cr/plan-v5-export.md` (Plan v5 export)
- Original `.xlsx` workbooks, authoritative originals
- `docs/cr/README.md` and `docs/cr/Vehicle Inventory Mockup.html` (reference only)
- `docs/requirements-baseline.md`
- `docs/wbs.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`

## Linked acceptance criteria

- None; WBS 1.5 is a planning-baseline task, not a product-behavior task.

## Approved assumptions and design choices used

- Plan v5 triages the change request into Adopt, Adopt gated, Defer and Not built; dispositions remain proposals until the owner confirms them.
- OQ-14 remains open: who raised the CR and whether it is a Keyloop requirement or own design input.
- OQ-15 to OQ-18 remain open; no open question is answered by this task.
- D30-D40 are Proposed only.
- Preserve the repository WBS statuses; do not synchronize them to the Plan v5 workbook without owner confirmation.
- No application, test, configuration or dependency change is in scope.

## Owner decisions still required

Plan v5 lists seven recommendations for owner confirmation; none is resolved by this task:

1. CR provenance and whether it represents a Keyloop requirement or an own design input (OQ-14).
2. Whether the repository's WBS statuses or the Plan v5 workbook's statuses are authoritative; 16 task statuses differ.
3. Whether to retain the action dialog or use the inline editor (CR-31; proposed: retain the dialog).
4. Whether to persist page, page size and sort (CR-21; proposed: persist saved actions only under D34/C-23).
5. Whether to use one seven-day early-warning window or also retain the mockup's day-80 threshold (OQ-15; proposed: days 84-90 only).
6. How reviewer switches are exposed and when sample actions are seeded (D39; proposed: URL parameters and demo mode only).
7. Whether to approve the proposed Must/Should/Nice CR tiers.

## Relevant design components

- Requirements baseline, WBS, decision register and traceability records only.
- System design and architecture are read-only in this task; CR-driven reconciliation is deferred to WBS 3.5 and 6.4.

## In scope

- Update only `docs/requirements-baseline.md`, `docs/wbs.md`, `docs/decisions/decision-register.md`, `docs/traceability.md` and this snapshot.
- Record CR impact, plan tasks, proposed decisions, open questions, conflicts and verification results based on workbook content.
- Preserve existing task statuses, Task DoD and existing DoD Example content if present.

## Explicitly out of scope

- Any application source, tests, config or dependency.
- `docs/system-design.md`, `docs/architecture/architecture.md`, `docs/project-context.md`, instructions/prompts and all `docs/cr/` inputs.
- Answering open questions or changing D30-D40 from Proposed.
- Staging, committing or pushing.
- Starting WBS 3.5.

## Files expected to change

- `docs/requirements-baseline.md`
- `docs/wbs.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`

## Tests to add or update

- None; this is documentation-only.
- Validate acceptance-criteria totals, ID references, task counts/statuses/hours, decision statuses, scope of changed files and Git state.

## Known conflicts and gaps

- Plan v5 refers to legacy D19 and D27, but the register has D-001 to D-005 and D30-D40; do not invent missing D19/D27 records.
- The repository WBS and Plan v5 each contain the same 59 task IDs and total 47 planned hours, but 16 statuses differ: 2.4, 6.3, 3.2, 4.3, 5.1, 4.11, 4.2, 3.1, 3.3, 4.1, 4.4, 4.5, 4.7, 4.8, 4.6 and 4.10. Preserve repository statuses pending owner review.
- The v4 workbook includes a DoD Example sheet that is not present in the Markdown baseline; this CR task does not recreate or revise that unrelated example content.
- Existing system design, architecture and project context contain CR-related gaps; report them without editing those files.

## Exit criteria

- Every CR item has its documented disposition.
- Requirements Baseline v4 and Plan v5 are aligned in authorized records.
- Open owner decisions and source/repository conflicts are listed.
- Required consistency checks and Git scope checks are reported.
- Owner confirms the dispositions before WBS 1.5 is marked Complete.

## Verification commands

Focused CR-triage consistency checks, `npm test`, `npm run lint`, `npm run build`, and Git status/diff inspection. No test files are required for this documentation-only task.

## Human-only completion

The repository owner reviews the complete diff, confirms dispositions and decides whether to stage, commit or push.
