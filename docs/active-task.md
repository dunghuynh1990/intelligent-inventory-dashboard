# Active WBS Task

## Identity

- WBS ID: 2.3
- Name: Configure testing and mock-service foundation
- Priority: Must
- Status: In Progress

## Intended outcome

Establish a working test environment for the React and TypeScript project
and prove that a minimal service boundary can be tested.

## In scope

- Vitest
- jsdom
- React Testing Library
- jest-dom matchers
- Test setup file
- npm test scripts
- One minimal application-shell test
- One minimal asynchronous mock-service test
- InventoryService boundary sufficient for setup validation

## Out of scope

- Vehicle data model
- Full mock dataset
- Aging logic
- Filters
- Proposed-action workflow
- Local-storage implementation
- Dashboard styling
- Full acceptance-test coverage

## Exit criteria

- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- At least one React test passes.
- At least one asynchronous service-boundary test passes.
- No unnecessary package is introduced.
- Every changed line can be explained.
- AI collaboration log is updated if Copilot is used.

## Expected evidence

- Test command output
- Lint command output
- Build command output
- Reviewed Git diff

## Human-only completion step

After Copilot finishes implementation and verification:

- Stop before staging, committing or pushing.
- The repository owner will review the complete diff.
- The repository owner will create the task-level commit manually.
- The repository owner will push the accepted commit.

This section describes the human workflow. It is not an instruction for
Copilot to run Git staging, commit or push commands.