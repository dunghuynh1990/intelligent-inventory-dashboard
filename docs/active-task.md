# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.1
- Name: Build Application Shell and Styling Foundation
- Workstream: UI Implementation
- Priority: Must
- Status: Complete
- Planned effort: 1.00 hour

## Objective

Create the dashboard's main layout and header, and establish reusable responsive styling to support later inventory, filter, and action UI work.

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

WBS 4.1 has no directly linked acceptance-criterion IDs. Its exit criteria are the main layout, header, reusable style foundation, and styling that supports later inventory, filter, and action features.

## Approved assumptions and design choices used

- Use the approved React, TypeScript, and Vite stack.
- Keep the dashboard scoped to one dealership and use the wireframe as the visual reference.
- Components present data and interactions; they do not own transport, fixture, or persistence details.
- Keep shared state minimal; this shell does not require application or service state.
- Do not introduce a UI or state-management dependency.
- Keep manual refresh behavior, inventory display, filters, actions, and summary cards for their respective WBS tasks.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The `DashboardPage` is the application shell and `DashboardHeader` presents the dashboard identity. This task establishes layout and style tokens only; it does not implement data-backed UI features.

## In scope

- Replace the Vite starter content with a semantic dashboard shell.
- Add the dashboard header and main content landmark.
- Establish reusable visual tokens, typography, responsive page sizing, and accessible focus styling.
- Update the shell component test.

## Explicitly out of scope

- Inventory retrieval, rows, summaries, refresh behavior, loading/error states, and service wiring.
- Search, filters, pagination, sorting, and action workflow.
- Changes to approved requirements or system design.
- New dependencies, authentication, backend, or global state.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `src/App.test.tsx`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- Main layout exists.
- Header exists.
- Reusable style foundation exists.
- Styling supports subsequent inventory, filter, and action features.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads src/App.test.tsx
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
