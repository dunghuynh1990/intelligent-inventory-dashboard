# Active WBS Task

> Execution snapshot for WBS 4.22. The repository owner invoked this gated Nice task after the Core UX gate was verified for WBS 4.21. A-04 and the linked baseline design choices remain unchanged; this task does not change the status of proposed CRs or decisions.

## Task

- WBS ID: 4.22
- Name: Build Age Profile and Summary Upgrade
- Workstream: UI Implementation
- Priority: Nice
- Status: Complete
- Planned effort: 1.00 hour
- CR Ref: CR-10, CR-11

## Objective

Show the inventory distribution across age bands with counts, shares and a 90-day threshold marker; let managers quick-filter by band; and add aging-share and actioned-vehicle summary indicators.

## Linked acceptance criteria

- AC-R2-13: The inventory summary shows the aging count.
- AC-R2-19: Each age-band segment shows its count and share; selecting a band applies that age-band filter, and selecting it again clears it.

## Approved assumptions and task-scoped interpretations

- The WBS 4.22 invocation authorizes only this task's gated Nice behavior; it does not change the approved requirements baseline or proposed CR/decision statuses.
- Age bands use the existing boundary rules: 0-30, 31-60, 61-90 and over 90 days; exactly 90 days is not aging.
- Band shares use vehicles with a valid derived age as the denominator. Missing, invalid and future entry-date records are excluded because they do not belong to an age band.
- The visible profile ranges are themselves keyboard-accessible filter buttons, sized to their shares and labeled with range, count and share. The profile header shows the unknown-age data-issue count and clarifies that exactly 90 days is not aging.
- Aging share is aging vehicles divided by all inventory vehicles. The actioned meter is aging vehicles with an action divided by all aging vehicles; a zero denominator displays 0%.
- Age-band quick views replace the complete active filter set, as specified by C-29; selecting the currently selected band clears the filter set.
- Counts and shares are inventory-wide and remain independent of the active list filters.
- The 90-day threshold marker sits at the boundary between the 61-90 and over-90 bands.

## Relevant design components

- `src/core/aging.ts`: Pure age-band counts and valid-age share calculation.
- `src/App.tsx`: Inventory-wide summary data and complete-filter-set band selection.
- `src/components/InventorySummary.tsx` and `.css`: Age-profile bar/controls, threshold marker, aging-share card and actioned meter.
- `src/core/aging.test.ts` and `src/App.test.tsx`: Pure profile and dashboard interaction coverage.

## In scope

- Show counts and valid-age shares for all four age bands.
- Show and label the threshold between the 61-90 and over-90-day bands.
- Toggle a selected age-band filter; replace other filters on selection and clear all filters on repeated selection.
- Show aging share and an actioned meter in the inventory summary.
- Add boundary/empty/invalid-age coverage and component interaction checks; update this snapshot, traceability and factual collaboration evidence.

## Explicitly out of scope

- Changing `docs/requirements-baseline.md`, `docs/wbs.md`, system design or the proposal status of linked CRs/decisions.
- Preset views assigned to WBS 4.23, sorting assigned to WBS 4.24, CSV export, production targets or backend work.
- Changing age-band/aging rules, adding action history or dependencies, or changing the service contract.
- Unrelated worktree changes, staging, committing or pushing.

## Files changed

- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`
- `src/App.tsx`, `src/App.test.tsx`
- `src/core/aging.ts`, `src/core/aging.test.ts`
- `src/components/InventorySummary.tsx`, `src/components/InventorySummary.css`

## Verification

- The Core UX gate was reported as checked and passed before WBS 4.21 implementation.
- Focused: `npm test -- --run --pool=threads --maxWorkers=1 src/core/aging.test.ts src/App.test.tsx` (2 files, 107 tests passed).
- Full suite: `npm test -- --run --pool=threads --maxWorkers=1` (5 files, 127 tests passed).
- `npm run lint`, `npm run build` and `git diff --check` passed.
- Browser review showed the default 200-vehicle inventory and age profile; selecting 0-30 days showed 27 vehicles and selecting it again restored all 200. At a 375px viewport the age-profile section had no horizontal overflow.
- Final diff reviewed. No files are staged, committed or pushed.

## Exit criteria

- Each age band shows its count and share of vehicles with a valid age, with a labeled 90-day threshold.
- Selecting an age band replaces the full filter set; selecting it again clears the set.
- Summary shows aging share and an actioned meter, including empty/zero-denominator handling.
- Focused/full tests, lint, build, browser review and final diff checks pass.

Do not stage, commit or push.
