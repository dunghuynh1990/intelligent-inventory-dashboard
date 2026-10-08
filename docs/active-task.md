# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 3.2
- Name: Define Data Model
- Workstream: UX & Design
- Priority: Must
- Status: Complete
- Planned effort: 0.50 hour

## Objective

Define the TypeScript `Vehicle` model, separating stored vehicle data from calculated age data and aligning its field names with the approved requirements.

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

No WBS 3.2-specific acceptance-criterion IDs are currently listed in `docs/traceability.md`. The model is informed by:

- **AC-R1-02:** vehicle display data includes make, model, stock number, entry date, and days in stock.
- **AC-R2-05 and AC-R2-06:** invalid or future entry dates yield unknown days in stock and are not aging.
- **AC-R3-01 and AC-R3-04:** the current action is selected and required to save; its note is optional.

## Approved assumptions and design choices used

- Vehicle identity uses a stable `vehicleId`; the approved design uses it for action persistence and stable display order.
- Stock entry date is represented as a string because input may be empty or invalid and validation/calculation belong to later work.
- `daysInStock` is unknown for invalid or future dates; the vehicle is not aging in those cases, and no age band is assigned.
- Action-choice values remain open; the model uses a string and does not invent the approved fixed list.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The data type is a contract between the inventory service and application layers. The approved intended service contract returns vehicles from `getVehicles`; the current service scaffold still exposes only `getInventoryCount`. This task defines the domain model only and does not alter the service contract.

## In scope

- Define `Vehicle`.
- Separate stored vehicle/action fields from calculated age fields.
- Include `daysInStock`, `isAging`, and `ageBand`.
- Align field names and nullable age values with linked requirements.

## Explicitly out of scope

- Aging, age-band, or validation calculations.
- Inventory generation or mock-service expansion.
- Changing `InventoryService`.
- Filters, UI, proposed-action workflow, or persistence behavior.
- Choosing fixed action/status values.
- Adding dependencies.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/types/vehicle.ts`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

No behavior tests are expected; the TypeScript build verifies the model declaration.

## Exit criteria

- A `Vehicle` type is defined.
- Stored fields are separate from calculated fields.
- Calculated fields include `daysInStock`, `isAging`, and `ageBand`.
- Names and types are consistent with the approved requirements and intended service contract.
- No later WBS feature is implemented.
- The TypeScript production build passes.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
