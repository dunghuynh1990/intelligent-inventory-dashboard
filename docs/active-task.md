# Active WBS Task

> Generated from `docs/wbs.md` and `docs/requirements-baseline.md`. This file is an execution snapshot and does not create new requirements.

## Task

- WBS ID: 4.10
- Name: Implement Minimum Observability
- Workstream: UI Implementation
- Priority: Should
- Status: Complete
- Planned effort: 0.50 hour

## Objective

Add assessment-level service-call logging with correlation IDs and a React error boundary.

## Authoritative inputs

- `docs/project-context.md`
- `docs/wbs.md`
- `docs/requirements-baseline.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/active-task.md`

## Linked design choice

- C-11: A logging wrapper, error boundary, and service-call correlation IDs are Should-level assessment work; REC-06 remains Not Applied.

## Approved assumptions and design choices used

- Wrap the existing mock `InventoryService` at the application composition root without changing its contract or behavior.
- Generate a unique ID per service call and include it in structured start/success/failure console log details.
- Log and rethrow service failures; do not convert failures into success-shaped results.
- Catch React render errors at the application boundary, log the error, and display an accessible fallback.
- This is demonstration observability only; it does not add production telemetry, metrics, or tracing infrastructure.
- Copilot stops before staging, committing, or pushing.

## Relevant architecture

`main.tsx` composes the mock service with a logging decorator and wraps the dashboard in `AppErrorBoundary`. `InventoryService` remains the UI contract; logger and correlation ID generation are injected into the wrapper for testability.

## In scope

- Add a typed logger and service logging decorator.
- Generate a per-call correlation ID for each mock service operation.
- Log successful and failed calls with operation name and correlation ID; preserve original errors.
- Add an application-level React error boundary with a fallback message.
- Add tests for correlated success/failure logs and render-error capture.
- Update system design, README, active-task snapshot, traceability, and factual AI collaboration log.

## Explicitly out of scope

- Production observability vendor, remote log shipping, metrics, tracing, or dashboards.
- Changing the inventory service contract or mock behavior.
- Applying REC-06 or introducing features beyond the WBS exit criteria.
- Staging, committing, or pushing.

## Expected files to inspect or change

- `src/observability/logger.ts`
- `src/services/logging-inventory-service.ts`
- `src/services/logging-inventory-service.test.ts`
- `src/components/AppErrorBoundary.tsx`
- `src/components/AppErrorBoundary.test.tsx`
- `src/main.tsx`
- `src/App.css`
- `docs/system-design.md`
- `README.md`
- `docs/active-task.md`
- `docs/traceability.md`
- `docs/ai/collaboration-log.md`

## Exit criteria

- A logging wrapper surrounds mock service calls.
- Each service call has a correlation ID in its log records.
- An application-level error boundary logs render errors and displays a fallback.
- Focused and complete tests, lint, and production build pass.

## Verification commands

```bash
npm test -- --pool=threads --maxWorkers=1 src/services/logging-inventory-service.test.ts src/components/AppErrorBoundary.test.tsx
npm test -- --pool=threads --maxWorkers=1
npm run lint
npm run build
git diff --check
git status
git diff
```

## Human-only completion

The repository owner reviews the complete diff, then stages, commits, and pushes accepted changes. Copilot must stop before those operations.
