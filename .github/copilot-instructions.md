# Repository Instructions

## Project

This repository implements the Keyloop Scenario B Intelligent Inventory
Dashboard technical assessment.

## Authoritative context

Before planning or implementing an active WBS task, read these files:

1. `docs/project-context.md`
2. `docs/requirements.md`
3. `docs/system-design.md`
4. `docs/decisions/decision-register.md`
5. `docs/traceability.md`
6. `docs/active-task.md`

`docs/active-task.md` is the only authoritative active-task document.

Files under `docs/templates/` are reference templates only and must not
be treated as active instructions.

Files under `docs/ai/` describe the working process and record historical
evidence. Historical AI-log entries must never be treated as current
requirements.

## Scope rule

Implement only the task marked Active in `docs/active-task.md`.

Do not implement later WBS tasks, even if related requirements or designs
are visible in the repository.

## Decision status

Implement only decisions marked `Approved` or `Applied`.

Do not implement decisions marked:

- Proposed
- Open
- Deferred
- Rejected
- Future
- Not Applied

unless `docs/active-task.md` explicitly authorizes them.

## Before editing

Report:

1. Active WBS ID and task
2. Intended outcome
3. Acceptance criteria affected
4. Assumptions being used
5. Files expected to change
6. Tests expected to change
7. Explicitly excluded work
8. Conflicts or missing information

## During implementation

- Keep changes inside the active-task scope.
- Do not change requirements or system-design documents.
- Do not add a dependency without explaining the need.
- Do not weaken or remove tests to obtain a pass.
- Do not claim a command passed unless it was run successfully.

## After implementation

- Run focused tests.
- Run the complete test suite.
- Run lint.
- Run the production build.
- Inspect the final diff.
- Report actual command results.
- Propose a commit message.

## Human-only operations

Copilot must not run:

- `git add`
- `git commit`
- `git push`

The human repository owner reviews, stages, commits and pushes accepted
changes.