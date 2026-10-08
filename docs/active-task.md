# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.11
- Name: Implement InventoryService Interface
- Workstream: Data & Service
- Priority: Must
- Status: Complete
- Planned effort: 0.25 hour

## Objective

Define the typed `InventoryService` contract with vehicle retrieval and current-action update operations, independently of mock data and persistence.

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

- **AC-R1-01:** the service returns the vehicle inventory for display.
- **C-03:** UI depends only on `InventoryService(getVehicles, updateVehicleAction)`.

## Approved assumptions and design choices used

- `getVehicles` resolves to the existing `Vehicle` domain type.
- `updateVehicleAction` accepts the stable vehicle ID and a `VehicleAction`, and resolves when the update completes.
- The interface contains no generated-data, local-storage, or transport details.
- The existing mock scaffold exposes explicit not-implemented rejections until mock-adapter behavior is delivered by its WBS.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

The UI depends on the service interface; the mock adapter implements it in a separate layer. This task defines the contract only and does not implement retrieval, persistence, or action update behavior.

## In scope

- Define `getVehicles` and `updateVehicleAction` with domain types.
- Keep the contract independent of generated data and local storage.
- Adapt the existing count-only placeholder just enough to implement the contract and fail explicitly until its adapter task.
- Test that the placeholder reports its unimplemented operations rather than returning success-shaped data.

## Explicitly out of scope

- Generating vehicles or implementing real mock retrieval.
- Persistence, simulated delay, or forced-failure behavior.
- UI integration or changing React components.
- Adding dependencies.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/services/inventory-service.ts`
- `src/services/mock-inventory-service.ts`
- `src/services/mock-inventory-service.test.ts`
- `src/types/vehicle.ts`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- `InventoryService` is defined before adapter behavior.
- Planned operations include typed `getVehicles` and `updateVehicleAction`.
- UI code can depend only on this interface.
- The interface is not coupled to local storage or generated data.
- The existing placeholder conforms to the interface and reports unimplemented behavior explicitly.
- Tests, lint, and production build pass.
- Copilot stops before staging, committing, or pushing.

## Verification commands

```bash
npm test -- --pool=threads src/services/mock-inventory-service.test.ts
npm test -- --pool=threads
npm run lint
npm run build
git diff --check
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
