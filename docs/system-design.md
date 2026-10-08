# System Design

## Status

This is an initial design direction based on the confirmed project scope. It is not a specification of features that have already been implemented.

## Current baseline

- Frontend: React 19 with TypeScript.
- Tooling: Vite.
- Intended demonstration: a single dealership.
- Backend: mocked data exposed through a service boundary.
- Current UI: the Vite starter screen; dashboard features remain unimplemented.

## Proposed boundaries

```text
React page and components
          |
          v
Typed dashboard/inventory service interface
          |
          v
Mock implementation and fixture data
```

- Components render data and expose user interactions; they should not own transport or fixture details.
- A typed service interface separates dashboard use cases from the mock implementation.
- Keep mock fixtures deterministic and representative of the requirements once those requirements are supplied.
- Replace the mock implementation with a real adapter only when a backend contract is agreed.

## UI and state

- Keep shared state minimal; use local component state for local interactions.
- Model asynchronous loading, empty, and error states explicitly where applicable.
- Use semantic HTML and accessible controls; preserve keyboard support and responsive layouts.
- Keep styling consistent with existing project conventions and avoid adding a UI library without an approved requirement.

## Initial Non-Functional Strategy

These are initial design directions for the assessment, not measured service-level objectives or claims about implemented production capabilities.

| Concern | Assessment direction | Future production direction / limitation |
|---|---|---|
| Scalability | Keep the approximately 200-vehicle demonstration dataset in the browser and filter it client-side through pure functions. This is the agreed demonstration scale, not a capacity target. | Confirm production inventory volumes and performance needs before selecting server-side filtering, paging, or other scaling changes. |
| Performance | Keep the assessment architecture simple: deterministic local mock data, a typed service boundary, and no unnecessary global state or UI dependencies. No response-time or rendering budget is specified. | Measure representative production workloads and set targets before introducing caching, virtualization, or server-side query behavior. |
| Reliability | Keep inventory operations behind `InventoryService`; represent loading and service failures explicitly. Preserve the last successful action state when a save fails. The mock and local persistence do not provide production availability or durability. | Define availability, recovery, and durable-persistence requirements before selecting production infrastructure. |
| Maintainability | Keep business rules in pure TypeScript outside React, keep components focused, and retain the service interface as the adapter boundary. Use tests for business rules and observable component behavior. | Preserve these boundaries when replacing the mock adapter; revise them only when measured needs or approved requirements justify it. |
| Observability | Show the assessment's visible last-refreshed time and manual refresh as required. A production telemetry platform is excluded. The logging wrapper, correlation IDs, and error boundary remain optional assessment work; if omitted, they are design-only. | Choose production logging, metrics, tracing, and correlation after service and operational requirements are defined. REC-06 remains Not Applied. |
| Security (owner-added consideration) | Keep the demonstration free of credentials and real customer data. Browser-local mock persistence and client-side checks are demonstration-only, not an authorization or secure storage boundary. No authentication or authorization is implemented. | Define data classification, identity, authorization, transport, and storage controls before any production integration. |

## Open design decisions

- Dashboard modules, data fields, metrics, alerts, and user workflows.
- Mock data shape, volume, and update behavior.
- Whether routing, persistence, authentication, or role-specific views are needed.
- Backend contract and deployment environment.
- Visual design references and browser/device support.

Resolve decisions from [requirements](./requirements.md) before making architecture choices that depend on them.
