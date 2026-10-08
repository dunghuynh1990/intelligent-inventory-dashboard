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

Use `?forceFailure=true` in the URL to demonstrate the mock service error state.

## Verification

```bash
npm test
npm run lint
npm run build
```