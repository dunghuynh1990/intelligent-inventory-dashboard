# Requirements

## 1. Purpose

Build the frontend for Scenario B: Intelligent Inventory Dashboard.

The dashboard provides dealership managers with a filterable overview of
vehicle inventory, identifies aging stock and allows a proposed action to
be recorded for an aging vehicle.

## 2. Implementation boundary

The assessment implementation includes:

- React and TypeScript frontend
- Vite build tooling
- Pure TypeScript business rules
- InventoryService abstraction
- Mock inventory-service adapter
- Deterministic demonstration data
- Local action persistence
- Automated unit and component tests

The assessment does not include a real backend or production database.

## 3. Confirmed functional requirements

### R1: Inventory visualization

The application must:

- Display the vehicles in the demonstration inventory.
- Provide a text search.
- Filter vehicles by make.
- Filter vehicles by model.
- Filter vehicles by age band.
- Filter to aging vehicles only.
- Apply filters together.
- Allow all filters to be cleared.
- Show a no-result state when no vehicle matches active filters.

The agreed age bands are:

- 0 to 30 complete calendar days
- 31 to 60 complete calendar days
- 61 to 90 complete calendar days
- More than 90 complete calendar days

### R2: Aging-stock identification

The application must:

- Calculate days in stock from the stock-entry date.
- Use today's date as the reference date at runtime.
- Use an injected fixed reference date in automated tests.
- Treat a vehicle as aging only when it has been in inventory for more
  than 90 complete calendar days.
- Treat exactly 90 days as non-aging.
- Distinguish aging vehicles prominently in the inventory view.
- Handle invalid stock-entry dates without crashing.
- Handle future stock-entry dates without classifying them as aging.

Required aging boundary coverage includes:

- 89 days
- 90 days
- 91 days
- Invalid stock-entry date
- Future stock-entry date

### R3: Actionable insights

The application must:

- Allow a manager to record one current proposed action for an aging vehicle.
- Prevent the proposed-action workflow from being used for a non-aging vehicle.
- Validate the proposed action before saving.
- Persist the current proposed action after page refresh.
- Preserve the previous successful state if a save operation fails.
- Show a user-visible outcome for successful and failed saves.

Local persistence is demonstration-only.

Action history, approval workflow and multiple concurrent actions are not
part of the assessment implementation.

### R4: UX states

The application must represent:

- Loading state
- Inventory-loaded state
- Empty-inventory state
- No-filter-result state
- Inventory-service error state
- Action-save error state

Required service failures must be forceable for testing and demonstration.

### R5: Data freshness

For the assessment implementation, "real-time" means:

- Displaying a visible last-refreshed time
- Allowing the user to refresh the inventory manually

Polling and server-push updates are future production options and are not
implemented.

## 4. Confirmed assumptions

- The assessment represents one dealership.
- The demonstration dataset contains approximately 200 deterministic vehicles.
- Mock stock-entry dates are generated relative to the runtime reference date.
- Exactly 90 complete calendar days is not aging.
- Proposed actions are available only for aging vehicles.
- One current proposed action is retained per eligible vehicle.
- Proposed-action persistence is local to the browser demonstration.
- The demonstration dataset is not a production capacity target.
- The user is treated as an authorized dealership manager for the
  assessment workflow because authentication and authorization are excluded.

## 5. Exclusions

The following are not implemented:

- Real backend
- Production database
- Authentication and authorization
- Multi-dealership support
- Microservices
- Production deployment
- CI/CD pipeline, unless added only as optional repository validation
- Action history
- Action approval workflow
- Full end-to-end browser-test suite
- Production telemetry platform
- True push-based or polling-based real-time updates
- Integration with a dealer-management system

The system design may show these as future-production capabilities.

## 6. Quality requirements

- Use React, TypeScript and Vite.
- Use Vitest and React Testing Library.
- Keep aging and filter logic in pure TypeScript functions outside React.
- Access inventory through InventoryService.
- React components must not directly access generated data or localStorage.
- Use semantic HTML and accessible labels.
- Tests must cover required business boundaries and user-visible behavior.
- Lint, automated tests and the production build must pass before a task
  is considered complete.
- Do not introduce unnecessary dependencies.
- The repository owner must be able to explain every committed line.

## 7. Open questions

The following matters remain open for a future production design and do
not block the assessment implementation:

- What production freshness target applies?
- Would the production freshness mechanism use polling, server push or
  another integration pattern?
- At what inventory scale should filtering and paging move to the server?
- What is the authoritative production vehicle-stock source and
  synchronization method?

Open questions must not be treated as permission to expand the assessment scope.

## 8. Detailed acceptance criteria

The detailed acceptance criteria and their test mappings are maintained
in `docs/traceability.md`.

When implementing a WBS task, use only the acceptance criteria linked to
that task in `docs/active-task.md` and `docs/traceability.md`.