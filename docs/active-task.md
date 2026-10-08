# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. The repository owner authorized WBS 4.15 only while the broader CR disposition remains proposed.

## Task

- WBS ID: 4.15
- Name: Apply CR Design Tokens and Typography
- Workstream: UI Implementation
- Priority: Should
- Status: Not Started
- Planned effort: 0.75 hour
- CR Ref: CR-25, CR-27

## Objective

Apply the selected assessment visual direction to existing dashboard surfaces using CSS tokens, the named font families, reusable header/card/table styling, a blue visible-focus ring, and accessibility details already relevant to built controls.

## Linked acceptance criteria

- AC-R2-12: Aging status remains textually labeled `Aging`, not indicated by color alone.
- AC-R1-20: Sortable column controls expose the required accessible sort state if implemented. Sorting controls are not built in this task; their implementation remains assigned to later WBS 4.24.

## Assumptions and decisions used

- C-27 and D40 remain proposed. The repository owner explicitly authorized WBS 4.15 only; this does not approve other proposed CR items.
- The baseline specifies Manrope, Inter and IBM Plex Mono, a 1440px content maximum, a 1200px table minimum, horizontal table scrolling, and a blue focus ring, but it does not list exact color hex values. Existing assessment colors are retained/refined into named accessible CSS tokens rather than importing an unapproved third-party palette.
- Font families are declared with local/system fallbacks; no font package, download, or dependency is added.
- Existing semantic labels and controls are retained. Sorting, aria-sort behavior, and later CR components remain out of scope.

## Relevant design components

- `src/index.css`: shared typography, colors, radius, shadow, and focus tokens.
- `src/App.css`: dashboard header, section surfaces, refresh control, and page layout.
- `src/components/InventorySummary.css`: summary-card surfaces.
- `src/components/InventoryFilters.css`: filter surface and visible focus.
- `src/components/InventoryTable.css`: fixed-layout, scrollable table and textual status.
- `src/components/ProposedActionForm.css`: action-form surface and button styling.
- Existing presentation markup in `InventoryTable`, `InventoryFilters`, and `InventorySummary`.

## In scope

- Define/reuse CSS variables for color, radius, shadow and font families.
- Apply a 90rem/1440px maximum content width, 75rem/1200px minimum fixed-layout table, and horizontal table scrolling.
- Apply the blue visible-focus treatment and coherent header, card, table and form styling.
- Preserve text-based aging status and current semantic labels.
- Review visual rendering in the browser and retain no mockup-only UI/CSS.
- Refresh this execution snapshot and append factual collaboration-log evidence.

## Explicitly out of scope

- Sort behavior or sortable headers (WBS 4.24), and the AC-R1-20 sort-state cycle.
- VIN/data-issue rendering, freshness UI, reviewer/demo UI, or other later CR items.
- Demo bar, notes cards, unused `.gauge` CSS, external font packages, and production/mobile redesign.
- Requirements, system design, decision register, WBS catalogue/status, staging, committing, or pushing.

## Files expected to change

- `src/index.css`
- `src/App.css`
- `src/components/InventoryFilters.css`
- `src/components/InventorySummary.css`
- `src/components/InventoryTable.css`
- `src/components/ProposedActionForm.css`
- `docs/active-task.md`
- `docs/ai/collaboration-log.md`

## Tests and review

- Existing App component test verifies the Aging label appears as text; no behavior change is intended.
- Manually inspect desktop/laptop layout, table horizontal scrolling, and keyboard-visible focus in the browser.
- Run the focused App tests, complete suite, lint, production build, and final diff checks.

## Conflicts and gaps

- D40 and C-27 are proposed, with exact CR palette values absent from the approved baseline. The owner authorized this task; colors remain a restrained extension of the existing project tokens.
- AC-R1-20 is linked, but sortable headers are not implemented and are assigned to later WBS 4.24. This task does not implement sorting.
- The prior active-task snapshot covered WBS 4.14; it is replaced without changing the WBS catalogue or task status.

## Exit criteria

- Named visual tokens, typography stack, layout widths, reusable surfaces and blue focus styling are applied to existing UI.
- Built accessibility behavior remains textual and keyboard-visible.
- No deferred mockup-only CSS/UI is introduced.
- Tests, lint, build, browser review, collaboration-log entry, and final diff are reported.

Do not stage, commit, or push.
