# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 3.1
- Name: Create Low-Fidelity Wireframe
- Workstream: UX & Design
- Priority: Must
- Status: Complete
- Planned effort: 0.50 hour

## Objective

Create one low-fidelity dashboard wireframe showing the required high-level inventory layout and primary aging/action concepts.

## Authoritative inputs

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`

## Linked acceptance criteria and design choices

No WBS 3.1-specific row existed in `docs/traceability.md`; this task adds its mapping. Wireframe content reflects:

- **AC-R1-01/02:** show an inventory table and the required vehicle fields.
- **AC-R1-04/05/06/07:** represent make, model, age-band, and aging-only filters.
- **AC-R2-12:** aging is indicated by visible text, not color alone.
- **AC-R3-01/03:** show the proposed-action interaction for an aging vehicle and omit it for a 90-day vehicle.
- **AC-R5-01/02:** show last-refreshed time and a manual Refresh control.
- **C-13:** row fields include stock number, make, model, entry date, days, aging indicator, and current action.

## Approved assumptions and design choices used

- A standalone SVG is used for the visual wireframe because no design-tool or wireframe file format is prescribed.
- A small Markdown page embeds the SVG to make it previewable in the repository.
- The action control is illustrative only; it does not resolve the open fixed-list values under OQ-07.
- The diagram is a design artifact, not implemented UI.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The wireframe represents the single-dashboard React experience at a conceptual level. Service behavior, generated data, persistence, and UI implementation are not changed by this task.

## In scope

- Create one dashboard wireframe showing a header, filters, inventory table, textual aging badge, and proposed-action interaction.
- Add a concise preview page explaining that the artifact is design-only.
- Update task traceability and factual AI collaboration evidence.

## Explicitly out of scope

- Implementing or changing React components, styles, or application behavior.
- Defining action choices beyond the example already present in the requirements.
- Adding summary metrics or other unapproved features.
- Changing requirements, system design, architecture, or decisions.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `docs/wireframes/intelligent-inventory-dashboard.svg`
- `docs/wireframes/README.md`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- A single-dashboard wireframe visibly shows the header, filters, inventory table, aging badge, and proposed-action interaction.
- The design remains conceptual and introduces no implemented application behavior.
- The SVG can be previewed through the repository Markdown page.
- The final diff passes `git diff --check`.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
