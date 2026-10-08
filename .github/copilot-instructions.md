# Project Guidelines

## Project Purpose

This repository implements the Keyloop Scenario B Intelligent Inventory Dashboard technical assessment.

The assessment implementation is a React, TypeScript and Vite frontend. The backend is mocked behind an `InventoryService` boundary.

The repository owner uses GitHub Copilot in VS Code for AI-assisted work. Copilot must stop before staging, committing or pushing; those are human-only operations.

The repository must clearly distinguish:

- functionality implemented for the assessment;
- optional assessment functionality;
- future production architecture that is documented but not built.

## Source-of-Truth Order

When information conflicts, use this order:

1. Assignment brief
2. `docs/requirements-baseline.md`
3. `docs/system-design.md`
4. `docs/architecture/architecture.md`
5. Applied decisions in `docs/decisions/decision-register.md`
6. `docs/wbs.md`
7. `docs/active-task.md`
8. Existing implementation
9. Copilot suggestions

If authoritative documents conflict:

- do not choose silently;
- do not modify the authoritative documents;
- report the conflict before changing affected files;
- continue only with work unaffected by the conflict.

Open questions, historical AI-log entries, templates and unapplied recommendations are not implementation authority.

## Authoritative Repository Documents

Before planning or implementing a WBS task, read the relevant content from:

1. `docs/project-context.md`
2. `docs/wbs.md`
3. `docs/requirements-baseline.md`
4. `docs/system-design.md`
5. `docs/architecture/architecture.md`
6. `docs/decisions/decision-register.md`
7. `docs/traceability.md`
8. `docs/active-task.md`

Also read relevant existing source code, configuration and tests.

### Document Responsibilities

- `docs/wbs.md` is the repository catalogue of approved WBS tasks.
- `docs/requirements-baseline.md` defines approved acceptance criteria, assumptions, exclusions, design choices, open questions and Definitions of Done.
- `docs/active-task.md` is the generated execution snapshot for the currently selected WBS task.
- `docs/system-design.md` defines the approved component responsibilities, contracts, data flow and non-functional direction.
- `docs/architecture/architecture.md` contains the assessment and future-production architecture diagrams.
- `docs/decisions/decision-register.md` records applied, deferred, rejected and future decisions.
- `docs/traceability.md` maps WBS tasks to acceptance criteria and verification.
- `docs/ai/collaboration-log.md` is historical evidence and must not be treated as a requirement.
- Files under `docs/templates/` are reference templates and must not be executed.

## Decision and Requirement Status

Implement only requirements or decisions marked as:

- Must;
- Should, when the active task includes them and the stop rules allow them;
- Approved;
- Selected;
- Applied.

Do not implement items marked as:

- Proposed, unless already accepted through a linked assumption or design choice;
- Open;
- Deferred;
- Rejected;
- Future;
- Not Applied;
- Dropped.

In particular, do not implement unapplied recommendations such as REC-05 or REC-06 unless the repository owner explicitly changes the baseline.

## WBS Execution Authority

When the user provides a WBS ID:

1. Find the exact task in `docs/wbs.md`.
2. Do not infer, substitute or merge another WBS task.
3. Read the task objective, priority, status, inputs, scope, exclusions, exit criteria, linked acceptance criteria and verification commands.
4. Read the relevant authoritative project documents.
5. Generate or replace `docs/active-task.md` with an execution snapshot of the selected task.
6. Include the exact linked acceptance criteria from `docs/requirements-baseline.md`.
7. Confirm understanding before changing implementation files.
8. Execute only the selected task.
9. Do not implement the next WBS task.
10. Run the defined verification.
11. Report actual results.
12. Stop before Git staging, commit or push.

The Excel workbooks remain authoritative for planning effort, schedule and formal status reporting. Do not change WBS scope or requirement scope silently.

## Active-Task Snapshot

When generating `docs/active-task.md`, include:

- WBS ID and title;
- workstream;
- priority and current status;
- objective;
- authoritative input documents;
- linked acceptance-criteria IDs;
- approved assumptions used;
- relevant design choices;
- relevant architecture components;
- in-scope work;
- explicitly out-of-scope work;
- expected files to inspect or change;
- tests to add or update;
- exit criteria;
- verification commands;
- human-only completion steps.

Add this notice at the top:

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Fixed Assessment Scope

- React, TypeScript and Vite frontend
- Vitest and React Testing Library
- Single-dealership demonstration
- Approximately 200 deterministic vehicles
- Mock backend behind `InventoryService`
- Pure TypeScript aging and filter rules outside React
- Local persistence for the current proposed action only
- Manual refresh and visible last-refreshed time

Do not add these unless the baseline is explicitly changed:

- real backend or production database;
- authentication or authorization;
- multi-dealership support;
- microservices;
- production deployment or CI/CD;
- action history or approval workflow;
- full end-to-end browser suite;
- production telemetry platform;
- polling, WebSocket or server-push updates.

## Fixed Business Rules

- Aging means more than 90 complete calendar days in inventory.
- Exactly 90 days is not aging.
- The reference date is today at runtime and fixed and injected in tests.
- The browser local date is used for the assessment; time of day is ignored.
- Invalid or future entry dates produce unknown age and are not aging.
- Age bands are `0-30`, `31-60`, `61-90` and `>90`.
- Filters combine with AND.
- Search covers stock number, make and model, case-insensitive.
- Model options depend on the selected make.
- Vehicles use stable ascending vehicle-ID order; user sorting is out of scope.
- Proposed actions are available only for aging vehicles.
- One current action is retained per vehicle; a new action replaces the previous action.
- An action is required; the note is optional.
- Save behavior is pessimistic: update the row only after service success.
- On save failure, preserve the previous successful action.
- Real-time means visible last-refreshed time plus manual refresh.

## Engineering Constraints

- Prefer the simplest viable implementation.
- Keep business rules in pure non-React functions.
- React components must not directly access generated data or `localStorage`.
- Access inventory through `InventoryService`.
- Define the service interface before its adapter.
- Avoid `any`; justify any unavoidable use.
- Do not add a dependency without explaining why it is required for the active task.
- Do not introduce global-state or server-state libraries unless the approved design changes.
- Use semantic HTML and accessible labels.
- Keep components and tests understandable enough for the repository owner to explain.
- Do not present mock or future components as implemented production services.

## Test Rules

- Use Vitest.
- Use React Testing Library for component behavior.
- Prefer accessible queries such as `getByRole` and `getByLabelText`.
- Test observable behavior rather than implementation details.
- Keep pure business-rule tests separate from React component tests.
- Use a fixed injected reference date for date-sensitive tests.
- Cover linked acceptance-criteria boundaries and failure cases.
- Do not remove, weaken or rewrite a test merely to make the suite pass.
- For deliberate-failure verification, restore the correct implementation after proving that the test detects the defect.
- Do not claim that a test, lint command or build passed unless the command was run successfully.

## Before Editing

Before changing files, report:

1. Active WBS ID and title
2. Objective
3. Linked acceptance criteria
4. Approved assumptions and design choices being used
5. Relevant architecture components
6. Files expected to change
7. Tests expected to change
8. Explicitly excluded work
9. Dependencies to add, if any, with justification
10. Conflicts, gaps or missing information

Stop only when a material conflict prevents safe implementation.

Do not stop for a human-only completion instruction. A requirement to create a task-level commit means the repository owner commits after Copilot finishes.

## During Implementation

- Work only within `docs/active-task.md`.
- Do not implement later WBS tasks.
- Do not modify the requirements baseline, system design, architecture or decision register unless the active task explicitly authorizes documentation changes.
- Do not turn an open question into an implementation decision.
- Do not implement an unapplied recommendation.
- Keep changes focused and reviewable.
- Run focused tests during implementation where relevant.
- Correct only failures caused by or relevant to the active task.

## Build, Test and Verification

After implementation:

1. Run task-relevant focused tests.
2. Run the complete test suite when code or configuration changed.
3. Run lint when code or configuration changed.
4. Run the production build when code or configuration changed.
5. Inspect `git status` and the final diff.
6. Check WBS exit criteria.
7. Check every linked acceptance criterion.
8. Check the task-level Definition of Done in `docs/requirements-baseline.md`.

Review the diff for:

- unrelated changes;
- invented requirements;
- unnecessary dependencies;
- weakened tests;
- ad-hoc `console.log` statements;
- commented-out code;
- secrets or credentials;
- generated folders or environment files;
- implementation of later WBS tasks.

## Final Report

After verification, report:

- WBS task activated;
- files changed;
- behavior implemented;
- tests added or changed;
- commands actually run;
- actual command results;
- PASS or FAIL for each exit criterion;
- linked acceptance criteria verified;
- assumptions used;
- suggestions accepted;
- suggestions rejected or deferred;
- actual corrections made, or `None`;
- remaining limitations;
- factual notes for the AI collaboration log;
- proposed commit message.

Do not state that the task is complete if any Must exit criterion remains unresolved.

## AI Collaboration Evidence

When AI materially contributes to a task, draft factual notes for `docs/ai/collaboration-log.md` containing:

- WBS task;
- what the repository owner asked;
- context supplied;
- what Copilot produced;
- what was accepted;
- what was rejected or deferred;
- how the output was verified;
- actual correction made, or `None`;
- files affected;
- commands and results;
- proposed commit reference;
- learning or design impact.

Never invent a correction, rejection, test result or command result.

Historical AI-log entries are evidence only and must not change current requirements.

## Human-Only Git Operations

Copilot must not run:

- `git add`
- `git commit`
- `git push`

Copilot may run read-only Git commands such as:

- `git status`
- `git diff`
- `git log`
- `git remote -v`
- `git branch -vv`

The repository owner will:

1. Review the complete diff.
2. Confirm every changed source, test and configuration line is understood.
3. Confirm the AI log is factual.
4. Stage accepted changes.
5. Create the task-level commit.
6. Push the accepted commit.
7. Update the Excel tracker and repository WBS status.

## Commit Convention

Propose, but do not create, a commit message using:

```text
type(scope): imperative summary
```

Rules:

- Maximum 72 characters for the subject.
- Use `feat`, `fix`, `test`, `docs`, `refactor` or `chore`.
- Put the WBS ID in the commit body.
- One commit must not span multiple WBS tasks.

## Stop and Fallback Rules

- If the Core UX gate fails, drop Should and Nice items before Must items.
- WBS 4.6 is the first build item to drop if behind.
- WBS 4.10 may be dropped; if dropped, observability must be documented as design-only.
- Do not add sorting before the Core UX gate passes.
- Add no new features after the Quality gate.
- If manual walkthrough work overruns, drop WBS 5.5 before weakening WBS 5.4.
