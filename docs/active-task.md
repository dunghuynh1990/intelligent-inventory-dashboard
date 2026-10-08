# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.2
- Name: Build Mock Inventory Adapter and Generated Data
- Workstream: Data & Service
- Priority: Must
- Status: Complete
- Planned effort: 1.50 hours

## Objective

Implement the assessment mock adapter, deterministic vehicle data, relative stock-entry dates, simulated delay, forced-failure configuration, and current-action local persistence behind `InventoryService`.

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

- **AC-R2-10:** approximately 200 vehicles include at least one each at 89, 90, and 91 days.
- **AC-R2-11:** injected reference date changes age evaluation.
- **AC-R3-02:** saved action and note persist across service instances using the same local storage.
- **AC-R4-01:** simulated delay supports a loading state.
- **AC-R4-04:** forced retrieval failure rejects the service request for UI error handling.
- **AC-R4-05:** a reviewer can enable failure without code changes.
- **C-04:** mock adapter uses local storage, delay, and forced failure.
- **C-05:** forced failure can be enabled without a code change.
- **C-06/C-07/C-08:** deterministic data, relative boundary dates, and injected reference date.
- **C-12/C-15:** in-stock vehicles only; persist current actions and notes keyed by stable vehicle ID.

## Approved assumptions and design choices used

- Generate 200 vehicles, within the approved approximate demonstration scale.
- Use a fixed-seed deterministic sequence for non-date fields and relative local-calendar stock dates.
- `?forceFailure=true` in the browser URL enables forced retrieval and update failures; it is not persisted.
- A modest default simulated delay is configurable for deterministic fast tests.
- Persist only the current action and optional note, keyed by vehicle ID, in browser local storage.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`MockInventoryService` implements `InventoryService`; fixture generation is isolated from the adapter, aging calculations remain in the pure core module, and persistence stays within the mock adapter. UI orchestration and visible loading/error components remain separate work.

## In scope

- Generate deterministic in-stock vehicles with relative entry dates and the required 89/90/91-day records.
- Calculate derived vehicle age fields using the existing pure core functions and an injectable reference date.
- Implement vehicle retrieval and current-action updates behind the service contract.
- Add simulated delay and URL-configurable forced failure.
- Persist and restore only current actions and notes in local storage.
- Test determinism, count, date boundaries, persistence, delay, and forced failures.

## Explicitly out of scope

- Dashboard UI, loading/error presentation, retry controls, or manual refresh.
- Filters, summaries, action eligibility UI, or form validation.
- Backend, authentication, multi-dealership behavior, or action history.
- Adding dependencies.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/services/mock-vehicle-data.ts`
- `src/services/mock-inventory-service.ts`
- `src/services/mock-inventory-service.test.ts`
- `src/services/inventory-service.ts`
- `src/core/aging.ts`
- `src/types/vehicle.ts`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- The mock adapter implements `InventoryService`.
- Approximately 200 deterministic vehicles are generated.
- Entry dates are relative to an injected reference date and include 89/90/91-day boundaries.
- Simulated delay and browser-configurable forced failures work.
- Current actions and notes persist across service instances via local storage.
- Existing tests, focused adapter tests, lint, and production build pass.
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
