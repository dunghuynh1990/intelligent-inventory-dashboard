# AI Working Procedure

## Selected AI tool

The repository owner uses GitHub Copilot in VS Code for AI-assisted work.

## Before implementation

1. Read `.github/copilot-instructions.md`.
2. Read [project context](../project-context.md), [WBS catalogue](../wbs.md), [requirements baseline](../requirements-baseline.md), and the task-relevant [system design](../system-design.md), [architecture](../architecture/architecture.md), [decision register](../decisions/decision-register.md), and [traceability](../traceability.md).
3. Find the exact WBS ID requested by the repository owner. Do not infer, substitute, merge, or implement a later task.
4. Generate [the active-task snapshot](../active-task.md) from the selected WBS entry and linked acceptance criteria.
5. Inspect relevant source, tests, configuration, and `git status`; preserve unrelated changes.
6. Report the objective, linked acceptance criteria, assumptions, relevant design, expected files and tests, exclusions, dependencies, and conflicts before changing implementation files.
7. If authoritative requirements conflict or essential product behavior is unspecified, report the issue before changing affected files.

## Implementation

1. Implement only the selected task and its acceptance criteria.
2. Follow the approved React, TypeScript, Vite, and mocked `InventoryService` architecture.
3. Do not change the requirements baseline, system design, architecture, or decision register unless the active WBS task explicitly authorizes a documentation change.
4. Add or update focused tests for changed behavior. Never remove or weaken tests to obtain a pass.
5. Do not add dependencies without explaining why they are needed for the active task.

## Verification and handoff

1. Run relevant focused tests and the complete test suite when code or configuration changes.
2. Run `npm run lint` and `npm run build` when code or configuration changes.
3. Inspect the final diff and status; report actual commands and results.
4. Append a factual row to the canonical [AI collaboration log](./collaboration-log.md), preserving prior entries and leaving acceptance pending until the repository owner confirms it.
5. Summarize changes, verification, limitations, and a proposed commit message.
6. Stop before `git add`, `git commit`, or `git push`. These are human-only steps.
