# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 7.2
- Name: Clean Repository
- Workstream: README & Repo
- Priority: Must
- Status: In Progress
- Planned effort: 0.25 hour

## Objective

Review repository hygiene and remove only confirmed-unused files, ensuring there is no ad-hoc debug output or committed secret material, generated folders are not tracked, and the repository structure remains intentional.

## Authoritative input documents

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`
- `.github/copilot-instructions.md`
- `README.md`
- Relevant tracked source, configuration, assets, and ignore rules

## Linked acceptance criteria

WBS 7.2 lists no linked acceptance-criteria IDs, and `docs/traceability.md` has no WBS 7.2 row. This task is verified against its own exit criteria only; no requirements or traceability links are inferred.

## Approved assumptions used

- Preserve the established React, TypeScript, and Vite implementation and its intended assets.
- Remove only tracked files with no references in application code, HTML, configuration, or maintained documentation.
- Preserve supplied project context, assignment-reference material, templates, and CR source exports unless independently shown to be out of scope.
- Existing logging-wrapper `console.info`/`console.error` events are intentional assessment observability, not ad-hoc debug output.
- Keep generated build and dependency folders ignored and untracked.

## Relevant design choices and components

- Repository structure separates React UI, pure TypeScript core rules, typed services/mock adapter, tests, documentation, and reviewer-only controls.
- `InventoryService` and assessment observability are intentional design boundaries; do not remove their implementation.
- Source assets must remain only when referenced or otherwise serving a documented project purpose.

## In scope

- Inspect tracked files for confirmed-unused starter or other application assets.
- Check for ad-hoc debug output and likely committed credential material without exposing any matches.
- Check whether generated folders or environment files are tracked and whether ignore rules cover generated output.
- Remove only clearly unused tracked files and retain intentional repository documentation/assets.
- Record the actual cleanup and verification in the AI collaboration log.

## Explicitly out of scope

- Changing requirements, acceptance criteria, design decisions, README content, WBS catalogue, or traceability status.
- Removing the supplied assignment/context image, CR source exports, documentation templates, or any other file without proving it unused.
- Changing application behavior, dependencies, tests, or build configuration unless required to correct a task-scoped hygiene defect.
- Staging, committing, or pushing.

## Expected files to inspect or change

- Inspect: tracked file list, source and public assets, references, `.gitignore`, and relevant documentation.
- Change: `docs/active-task.md` and `docs/ai/collaboration-log.md`.
- Delete: only assets demonstrated to have no active or documentary references.
- Preserve unrelated pre-existing uncommitted changes from the prior WBS task.
- Do not change `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/system-design.md`, or `docs/traceability.md`.

## Tests and verification

- Review references to every removed file and verify no application, HTML, configuration, or maintained documentation references remain.
- Confirm there are no ad-hoc debug statements or tracked environment/generated files.
- Run the complete test suite, `npm run lint`, `npm run build`, and `git diff --check`.
- Inspect final status/diff; do not stage or commit.

## Exit criteria

- Unused files removed.
- Debug output removed.
- Secrets and credentials removed.
- Generated folders are not tracked.
- Repository structure is intentional.

## Human-only completion steps

- Review the complete diff and confirm all removals and cleanup evidence.
- Stage and commit only after owner review.
