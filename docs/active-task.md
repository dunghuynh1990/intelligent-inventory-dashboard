# Active WBS Task

## Task

- WBS ID: 2.3
- Name: Configure testing foundation
- Status: Active
- Priority: Must

## Objective

Establish a working automated-test environment for the React and
TypeScript application.

## In scope

- Vitest
- jsdom
- React Testing Library
- jest-dom
- Test setup file
- npm test script
- One minimal application test
- A minimal asynchronous boundary test if already included in the
  approved 2.3 plan

## Out of scope

- Full Vehicle model
- Generated 200-vehicle dataset
- Aging logic
- Filters
- Proposed-action workflow
- Local-storage persistence
- Full mock-service behavior
- Dashboard feature implementation
- Full acceptance-test coverage

## Exit criteria

- Required testing dependencies are declared.
- Vitest uses the jsdom environment.
- jest-dom matchers are available.
- `npm test` passes.
- At least one React Testing Library test passes.
- Any included asynchronous boundary test passes.
- `npm run lint` passes.
- `npm run build` passes.
- Tests do not merely assert implementation details.
- No later WBS feature was implemented.
- Every change can be explained.
- Copilot stops before staging, committing or pushing.