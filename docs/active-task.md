# Active WBS Task

> Generated from `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, and `docs/traceability.md`. This execution snapshot records WBS 3.5 scope; it does not approve proposed CR decisions or change requirements.

## Task

- WBS ID: 3.5
- Name: Update Data Model and Component Structure for Adopted CR Items
- Workstream: UX & Design
- Priority: Must
- Status: In Progress
- Planned effort: 0.50 hour
- CR Ref: CR-01, CR-06, CR-07, CR-28

## Objective

Document the CR-related vehicle/action data additions, dashboard-local filter/page/sort state, and the corresponding presentation component structure. Keep the `InventoryService` contract unchanged.

## Linked acceptance criteria

- AC-R1-12/13: Display a 17-character VIN and search by VIN.
- AC-R1-14/15: Filter aging vehicles with no current action and vehicles with a current action.
- AC-R2-14/15/16: Classify missing, invalid and future entry dates; show issue information and a Data issues view; include one example of each without changing the 89/90/91-day boundary vehicles.
- AC-R3-07: Show the saved action's relative logged time.

## Assumptions and decisions used

- A-06: One current action per vehicle; a later save replaces it.
- A-12, A-17, A-20 and A-21 are marked PROPOSED in the baseline: invalid/future dates have unknown age and are not aging; action-filter semantics; action logged time; and opaque fake VIN use. Keep these distinctions visible; this task does not approve them.
- C-20 defines the proposed client-page sizes, reset/clamp behavior and non-persistence. D31 remains Proposed.
- C-28 defines the current-action shape and five placeholder values. The exact timestamp representation is not prescribed here; OQ-07 remains open.
- D32 sorting is Proposed and Nice/gated. Document optional session-only sort state only; do not implement sorting.
- The user authorized WBS 3.5's required system-design documentation update despite the generic execution instruction not to modify system-design documents.

## Relevant design components

- Vehicle and current-action data, entry-date issue classification, and dashboard-local filter/page/optional sort state.
- `DashboardPage`, `DashboardHeader`, `FreshnessIndicator`, `InventorySummary`, `InventoryFilters`, `InventoryTable`, `VehicleRow`, `AgingBadge`, `ProposedActionForm`, and `InventoryPager`.
- `InventoryService` remains `getVehicles(): Promise<Vehicle[]>` and `updateVehicleAction(vehicleId: string, action: VehicleAction): Promise<void>`.

## In scope

- Update `docs/system-design.md` to state the CR design delta, identify proposed/gated choices, and extend the component responsibilities.
- Generate this execution snapshot for WBS 3.5.
- Leave application and test code unchanged; the additions are documentation targets, not claims of implemented behavior.

## Explicitly out of scope

- Implementing VIN, `loggedAt`, data-issue handling, the action filter, paging, sorting or freshness thresholds in application code.
- Changing the `InventoryService` contract, tests, dependencies, configuration or README.
- Changing `docs/wbs.md`, `docs/requirements-baseline.md`, `docs/decisions/decision-register.md`, `docs/traceability.md`, or `docs/architecture/architecture.md`.
- Approving D30-D40, resolving OQ-07 or other owner questions, or starting later WBS tasks.
- Staging, committing or pushing.

## Files expected to change

- `docs/system-design.md`
- `docs/active-task.md`

## Tests to add or update

- None. This is a design-documentation task; validate document consistency, unchanged service signatures, changed-file scope, and the repository's existing test, lint and build commands.

## Conflicts and gaps

- The existing system design excludes pagination; WBS 3.5 requires documenting its CR addition. The user authorized this documentation update; pagination remains a proposed CR design target, not a claim of implementation or owner approval.
- WBS 3.5 requests sort state, while CR-05/D32 sorting remains Nice and gated. Only the gated state is documented; sort behavior is not implemented.
- The current source does not yet include VIN, `loggedAt`, the action filter, page state, or these new components. WBS 3.5 is documentation-only, so the source is intentionally unchanged.
- The previous active-task snapshot described WBS 1.5; this snapshot replaces it for the requested execution without changing WBS statuses.

## Exit criteria

- Vehicle/action additions and the filter/page/optional sort state are documented.
- Component responsibilities cover the linked CR surfaces and the requested summary, pager and freshness indicator.
- The `InventoryService` signatures remain unchanged.
- Focused and full tests, lint, build, and final diff/scope review are completed and reported.

## Verification commands

- Focused: `npm test -- src/App.test.tsx --pool=threads --maxWorkers=1` (single-thread retry after the default fork worker timed out)
- Full suite: `npm test -- --pool=threads --maxWorkers=1`
- Lint: `npm run lint`
- Production build: `npm run build`
- Review: `git diff --check`, `git status --short`, and `git diff`

Do not stage, commit or push.
