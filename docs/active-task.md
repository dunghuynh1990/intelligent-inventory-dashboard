# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 3.3
- Name: Update Component Structure After Wireframe
- Workstream: UX & Design
- Priority: Must
- Status: Complete
- Planned effort: 0.25 hour

## Objective

Reconcile the initial high-level UI component responsibilities with the WBS 3.1 wireframe, record deviations for WBS 6.4, and avoid unnecessary hooks or global state.

## Authoritative inputs

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`
- `docs/wireframes/intelligent-inventory-dashboard.svg`

## Linked acceptance criteria

WBS 3.3 has no directly linked acceptance-criterion IDs. The component map is reconciled against the approved responsibilities and wireframe, which reflect AC-R1-01/02/04/05/06/07/09/10, AC-R2-12/13, AC-R3-01/03, and AC-R5-01/02.

## Approved assumptions and design choices used

- Components present data and interactions; they do not own transport, fixture, or persistence details.
- UI depends on `InventoryService`; age and filter business rules remain in pure TypeScript.
- Shared state remains minimal and owned by the dashboard page unless later requirements justify otherwise.
- The total-inventory summary is Should-level (C-14); its component can be omitted if behind.
- No custom hooks or global-state library is introduced.
- Deviations or unresolved implementation choices are recorded for WBS 6.4, not resolved by this task.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The initial design describes broad UI, orchestration, and core responsibilities. This task records a small presentation-component map aligned to the single-dashboard wireframe without implementing it.

## In scope

- Reconcile the component list with the WBS 3.1 wireframe.
- Record component responsibilities and the minimal state/service boundary.
- Record deviations for WBS 6.4.

## Explicitly out of scope

- Implementing React components, hooks, state, styling, or application behavior.
- Changing requirements, architecture diagrams, or approved design choices.
- Introducing global state or unnecessary abstractions.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `docs/system-design.md`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`
- `docs/wireframes/intelligent-inventory-dashboard.svg`

## Exit criteria

- The initial component list is reconciled with the wireframe.
- Deviations are recorded for WBS 6.4.
- No unnecessary custom-hook or global-state layer is proposed or implemented.
- `git diff --check` passes.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
