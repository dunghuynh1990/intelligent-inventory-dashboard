# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 6.3
- Name: Define Initial Non-Functional Strategy
- Workstream: System Design
- Priority: Must
- Status: Not Started
- Planned effort: 0.75 hour

## Objective

Record the initial non-functional direction for scalability, performance, reliability, maintainability, observability, and security without claiming future production capabilities are implemented.

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

No product acceptance-criterion IDs are linked to WBS 6.3 in the current traceability matrix. The task exit criteria are listed below.

## Approved assumptions and design choices used

- The assessment is a single-dealership demonstration with approximately 200 deterministic vehicles; this is not a production capacity target.
- Inventory is accessed through the typed `InventoryService` boundary and mocked for the assessment.
- The UI uses client-side filtering for the demonstration dataset; server-side filtering and paging are future production options.
- REC-06 remains Not Applied: the logging wrapper and error boundary are not promoted to Must.
- Copilot must stop before staging, committing, or pushing.

## Relevant architecture

The assessment frontend, UI state/orchestration, pure TypeScript core, `InventoryService`, and mock adapter. Production API, database, telemetry platform, and push/poll freshness mechanisms remain future architecture.

## In scope

- Document initial strategy for scalability.
- Document initial strategy for performance.
- Document initial strategy for reliability.
- Document initial strategy for maintainability.
- Document initial strategy for observability.
- Document security as an owner-added consideration.
- Keep assessment capabilities distinct from future production direction.

## Explicitly out of scope

- Implementing or changing application features, runtime controls, telemetry, or production infrastructure.
- Introducing production performance, availability, or capacity guarantees without approved targets.
- Promoting optional observability work to Must or implementing unapplied REC-06.
- Changing the requirements baseline, architecture diagram, or decision register.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `docs/system-design.md`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

No application tests or dependencies are expected to change.

## Exit criteria

- Initial direction is recorded for scalability, performance, reliability, maintainability, observability, and security as an owner-added consideration.
- Future production capabilities and targets are clearly labeled as future or undecided, not implemented.
- The requirements baseline and architecture diagram remain unchanged.
- The documentation diff is reviewed and understandable.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
git status
git diff
```

No application behavior or code/configuration is changed; per the requirements baseline, tests, lint, and build are not required for this documentation-only task.

## Human-only completion

The repository owner reviews the complete diff and factual AI log, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
