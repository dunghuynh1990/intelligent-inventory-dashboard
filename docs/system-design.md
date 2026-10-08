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

### CR data and view-state design delta (WBS 3.5)

The following extends the design for CR-linked acceptance criteria. These additions are design targets, not a claim that the current source implements them. CR dispositions and D30-D40 remain subject to owner confirmation under WBS 1.5; proposed choices are marked accordingly.

| Data | Design |
|---|---|
| Vehicle identity | Keep the stable `vehicleId` and stock number; add an opaque, fake 17-character VIN for display and search only. Do not validate or decode it. |
| Derived entry-date data | Keep age and age band derived. Classify a missing, invalid or future stock-entry date separately from a valid date; for an issue, age is unknown and the vehicle is not aging. Surface `Missing entry date`, `Invalid entry date` or `Future entry date`; an issue is not eligible for an action. |
| Current action | Keep one current action per vehicle. Extend its shape to `{ action, note?, loggedAt }`, where `loggedAt` records the save time used for the AC-R3-07 relative-day label. The five C-28 placeholder action values are Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign and Under Review; OQ-07 remains open. There is no action history. |
| Filter state | Extend the existing search, make, model, age-band and aging-only filters with `action: any | no action yet | has an action`. `No action yet` means aging and without a current action; `Has an action` means a current action exists. The Data issues view selects vehicles with an entry-date issue. Active filters continue to combine with AND. |
| Page state | Keep the current page and page size in dashboard-local state. Proposed page sizes are 10, 20, 50 and 100, defaulting to 20; reset to page 1 when filters change and clamp the page when results shrink. Do not persist page or page size. |
| Sort state | If column sorting passes its separate Nice-level gate, keep an optional column and a three-state direction (none, ascending or descending) in dashboard-local state for the current session only. With no sort, retain vehicle-ID order; optional sorting puts unknown values last and uses vehicle ID to break ties. D32 remains Proposed, so sorting is not part of the Must implementation. |

The mock persistence boundary continues to store only the current proposed action for a vehicle, now including its logged time. Filters, page, page size and sort are view state and are not persisted. Search, issue classification, filtering and pagination remain pure client-side operations over the full result returned by `getVehicles`.

### Wireframe-aligned assessment component structure

The initial architecture's React UI responsibilities are reconciled with the [low-fidelity dashboard wireframe](./wireframes/intelligent-inventory-dashboard.svg) as this presentation-level component list:

| Component | Responsibility |
|---|---|
| `DashboardPage` | Own dashboard-local view state, load/refresh orchestration, and compose the dashboard sections. |
| `DashboardHeader` | Show the dashboard heading, reference date, last-refreshed information, and manual refresh control; compose `FreshnessIndicator`. |
| `FreshnessIndicator` | Show the visible last-refreshed time alongside the refresh control. Any elapsed-time thresholds remain proposed placeholders, not a production freshness target. |
| `InventorySummary` | Present total vehicles, aging stock, and aging vehicles with an action; provide the Data issues entry point. The total-vehicle card is Should-level and may be omitted if behind. |
| `InventoryFilters` | Present search, make, model, age-band, aging-only, action-filter and reset controls; receive values and callbacks from the page. |
| `InventoryTable` | Present vehicle rows and required stock fields; delegate row-specific content to `VehicleRow`. |
| `VehicleRow` | Present stock number, VIN, make, model, entry date, age, status/data issue and current action with its logged-time label; expose the action entry point only when eligible. |
| `AgingBadge` | Show the textual `Aging` indicator for aging rows; color is supplemental only. Data issues use a distinct textual issue label. |
| `ProposedActionForm` | Present action and optional note inputs for an eligible vehicle and report save events to the page. |
| `InventoryPager` | Present client-side page-size and page-navigation controls; report page changes to the page. |

The page owns the minimal shared inventory, filter, page, optional gated sort, refresh, and selected-action-form state. Summary counts are calculated from the unfiltered inventory; the pager operates on filtered results. Filtering and aging calculations remain in pure core functions; inventory retrieval and updates remain behind the unchanged `InventoryService` contract: `getVehicles(): Promise<Vehicle[]>` and `updateVehicleAction(vehicleId: string, action: VehicleAction): Promise<void>`. This structure does not require a custom-hook layer or global-state library.

### Wireframe reconciliation notes for WBS 6.4

- The wireframe now includes the C-14 summary cards and the AC-R1-09 Reset filters control; the total-vehicle card remains Should-level.
- The action form is shown as a conceptual expanded interaction for an aging row; final action values remain unresolved under OQ-07.
- Client-side pagination is a proposed CR addition (C-20); do not imply that it is already implemented or a production API requirement.
- CR data additions and the Data issues entry point are design targets subject to the pending owner decision on CR dispositions.
- Forced-failure and load-scenario controls are not part of the dashboard component list; forced failure remains an adapter test/demo configuration.

## Initial Non-Functional Strategy

These are initial design directions for the assessment, not measured service-level objectives or claims about implemented production capabilities.

| Concern | Assessment direction | Future production direction / limitation |
|---|---|---|
| Scalability | Keep the approximately 200-vehicle demonstration dataset in the browser and filter it client-side through pure functions. This is the agreed demonstration scale, not a capacity target. | Confirm production inventory volumes and performance needs before selecting server-side filtering, paging, or other scaling changes. |
| Performance | Keep the assessment architecture simple: deterministic local mock data, a typed service boundary, and no unnecessary global state or UI dependencies. No response-time or rendering budget is specified. | Measure representative production workloads and set targets before introducing caching, virtualization, or server-side query behavior. |
| Reliability | Keep inventory operations behind `InventoryService`; represent loading and service failures explicitly. Preserve the last successful action state when a save fails. The mock and local persistence do not provide production availability or durability. | Define availability, recovery, and durable-persistence requirements before selecting production infrastructure. |
| Maintainability | Keep business rules in pure TypeScript outside React, keep components focused, and retain the service interface as the adapter boundary. Use tests for business rules and observable component behavior. | Preserve these boundaries when replacing the mock adapter; revise them only when measured needs or approved requirements justify it. |
| Observability | The assessment wraps mock inventory-service calls with console start/success/failure logs and a per-call correlation ID; a React error boundary logs render failures and presents a fallback. The visible last-refreshed time and manual refresh remain the freshness indicator. This is demonstration-level console logging, not a telemetry platform. | Choose production logging, metrics, tracing, and correlation after service and operational requirements are defined. REC-06 remains Not Applied. |
| Security (owner-added consideration) | Keep the demonstration free of credentials and real customer data. Browser-local mock persistence and client-side checks are demonstration-only, not an authorization or secure storage boundary. No authentication or authorization is implemented. | Define data classification, identity, authorization, transport, and storage controls before any production integration. |

## Open design decisions

- Dashboard modules, data fields, metrics, alerts, and user workflows.
- Mock data shape, volume, and update behavior.
- Whether routing, persistence, authentication, or role-specific views are needed.
- Backend contract and deployment environment.
- Visual design references and browser/device support.

Resolve decisions from [requirements](./requirements.md) before making architecture choices that depend on them.
