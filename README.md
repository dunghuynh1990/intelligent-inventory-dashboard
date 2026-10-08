# Intelligent Inventory Dashboard

Technical assessment implementation for Scenario B: Intelligent Inventory Dashboard.

## Scope

- React and TypeScript frontend built with Vite
- Mocked backend behind the `InventoryService` boundary
- Single-dealership inventory with client-side filters and aging-vehicle actions
- Vitest and React Testing Library tests
- Assessment-level console logging with service-call correlation IDs and a React error boundary; no production telemetry platform

## Local setup

```bash
npm install
npm run dev
```

Mock reviewer scenarios are selected with URL query parameters:

- `?forceFailure=true` forces mock service requests to fail.
- `?emptyInventory=true` returns an empty vehicle list.
- `?dataAgeMinutes=25` sets the simulated last-refreshed time 25 minutes ago.
- `?demo=true` seeds three sample actions only when no action data is already stored.

Parameters can be combined, for example `?demo=true&dataAgeMinutes=25`. Sample actions never overwrite existing saved actions. The data-age switch currently adjusts the displayed last-refreshed timestamp; the amber freshness indicator is part of later freshness UI work.

## Verification

```bash
npm test
npm run lint
npm run build
```