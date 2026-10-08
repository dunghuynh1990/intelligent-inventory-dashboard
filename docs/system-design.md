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

## Open design decisions

- Dashboard modules, data fields, metrics, alerts, and user workflows.
- Mock data shape, volume, and update behavior.
- Whether routing, persistence, authentication, or role-specific views are needed.
- Backend contract and deployment environment.
- Visual design references and browser/device support.

Resolve decisions from [requirements](./requirements.md) before making architecture choices that depend on them.
