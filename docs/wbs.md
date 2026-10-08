# Keyloop Technical Assignment WBS

## Document Control

- **Scenario:** Scenario B: Intelligent Inventory Dashboard
- **Implementation:** React + TypeScript + Vite frontend with mocked backend
- **Plan version:** v4
- **Planned effort:** 33.25 hours
- **Source:** `Keyloop_Assignment_WBS_and_Submission_Checklist_v4.xlsx`
- **Purpose:** Implementation-facing WBS catalogue for GitHub Copilot in VS Code
- **Planning authority:** The Excel workbook remains authoritative for effort, schedule and reporting. This Markdown file is the repository execution catalogue.

## Execution Sequence

Requirements and scope -> initial system design -> setup and test tooling -> pure logic and AI-assisted unit tests -> service interface -> mock data -> UI -> workflow tests -> design consolidation -> README -> video -> submission.

## Global Stop Rules

1. If the Core UX gate fails, drop Should and Nice build items first, including WBS 4.6 and 4.10, and do not add sorting.
2. If WBS 4.10 is dropped, state in the system design and README that observability is design-only.
3. Add no new features after the Quality gate.
4. Documentation and submission work must not introduce new application scope.
5. GitHub Copilot may edit task-scoped files and run verification, but must not stage, commit or push.
6. The repository owner reviews the complete diff, approves the AI log, commits and pushes manually.

## Status Values

- `Not Started`
- `Active`
- `Complete`
- `Blocked`
- `Dropped`

## Priority Values

- `Must`: required for a valid submission or explicit requirement
- `Should`: meaningful quality differentiator
- `Nice`: optional polish after Must and Should are secure

---

## WBS 1.1: Confirm Submission Conditions with Keyloop

- **Workstream:** Requirements & Scope
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 0.25 hour

### Objective

Obtain a written answer from Keyloop for submission conditions controlled by Keyloop.

### Exit Criteria

- Deadline date, time and timezone confirmed.
- Repository visibility confirmed.
- Reviewer GitHub usernames obtained if a private repository is required.
- Video-hosting expectations confirmed.
- Answers recorded in the planning baseline.

### Notes

Ask Keyloop only what Keyloop controls. The system-design location and internal submission target are owner decisions.

---

## WBS 1.2: Define Acceptance Criteria

- **Workstream:** Requirements & Scope
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 0.50 hour

### Objective

Translate Scenario B into testable acceptance criteria.

### Exit Criteria

Criteria cover:

- Inventory list
- Make filter
- Model filter
- Age-band filter
- Aging stock greater than 90 complete calendar days
- Proposed action for aging vehicles
- Action persistence after refresh
- Loading state
- Empty-inventory state
- No-result state
- Service-error state

### Authoritative Inputs

- `docs/requirements.md`
- `docs/traceability.md`

---

## WBS 1.3: Document Assumptions and Exclusions

- **Workstream:** Requirements & Scope
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 0.50 hour

### Confirmed Assumptions

- Aging means more than 90 complete calendar days.
- Exactly 90 days is not aging.
- Reference date is today at runtime and fixed in tests.
- Mock entry dates are generated as offsets from the reference date.
- Age bands are 0-30, 31-60, 61-90 and greater than 90 days.
- Proposed actions are available for aging vehicles only.
- Real-time is represented by a last-refreshed time and manual refresh.
- The assessment supports one dealership.
- Local persistence is for demonstration only.

### Exit Criteria

- Assumptions recorded.
- Exclusions recorded.
- Assumptions are carried into WBS 6.4.

---

## WBS 1.4: Define Completion Criteria

- **Workstream:** Requirements & Scope
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 0.25 hour

### Definition of Done

- Relevant tests pass.
- Lint passes.
- Production build passes.
- Work is committed with a clear task-level message.
- An AI-log entry is written if AI was used.
- The repository owner can explain every committed line.

### Notes

Commit hygiene applies from the first commit and cannot be repaired only at the end.

---

## WBS 6.1: Create Initial Architecture and Scope Boundary

- **Workstream:** System Design
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 1.00 hour

### Exit Criteria

- Initial diagram separates `Implemented for assessment` from `Future production`.
- Mock components are clearly labelled.
- Assessment components are not presented as production services.

### Authoritative Input

- `docs/architecture/architecture.md`

---

## WBS 6.2: Define Components, Contracts and Data Flow

- **Workstream:** System Design
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 1.00 hour

### Exit Criteria

- Component roles documented.
- `InventoryService` contract drafted with `getVehicles` and `updateVehicleAction`.
- Primary data flow documented before coding.

---

## WBS 2.1: Refresh Essential Tools

- **Workstream:** Setup
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 1.00 hour

### Exit Criteria

- React hooks refreshed sufficiently to begin.
- TypeScript type basics refreshed.
- Git basics refreshed.
- Test-runner basics refreshed.
- Node, npm and Git versions verified.
- VS Code and GitHub Copilot sign-in verified.

---

## WBS 2.2: Create Project and Repository

- **Workstream:** Setup
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 0.75 hour

### Exit Criteria

- Vite + React + TypeScript application runs.
- Lint is configured and runs.
- Production build passes.
- Initial commit is pushed.
- Repository remote and upstream branch are configured.
- `node_modules`, `dist` and environment files are not tracked.
- Human confidentiality review is complete.

### Verification

```bash
npm install
npm run dev
npm run lint
npm run build
git status
git log --oneline -5
git remote -v
git branch -vv
```

### Evidence

- Repository: `https://github.com/dunghuynh1990/intelligent-inventory-dashboard`

---

## WBS 2.3: Configure Test Tooling

- **Workstream:** Setup
- **Priority:** Must
- **Status:** Complete
- **Planned effort:** 1.75 hours

### In Scope

- Vitest
- jsdom
- React Testing Library
- jest-dom
- TypeScript test types
- Test setup
- One React sample test
- One asynchronous test-foundation example

### Out of Scope

- Vehicle model
- Aging logic
- Filters
- Full mock dataset
- Proposed-action workflow
- Local-storage implementation

### Exit Criteria

- Testing dependencies are declared.
- Vitest uses jsdom.
- jest-dom matchers are available.
- At least one React Testing Library test passes.
- At least one asynchronous test-foundation example passes.
- Full test suite passes.
- Lint passes.
- Production build passes.
- No later feature is implemented.
- Documentation changes are reviewed and understood.

### Verification

```bash
npm test
npm run lint
npm run build
git status
git diff
```

---

## WBS 2.4: Establish AI Working Procedure and AI Log

- **Workstream:** Setup
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.25 hours

### Objective

Establish a controlled GitHub Copilot workflow with repository context, WBS-level execution, human review, verification and factual AI evidence.

### Inputs

- `.github/copilot-instructions.md`
- `.github/instructions/`
- `.github/prompts/`
- `docs/project-context.md`
- `docs/requirements.md`
- `docs/system-design.md`
- `docs/architecture/architecture.md`
- `docs/decisions/decision-register.md`
- `docs/traceability.md`
- `docs/ai/working-procedure.md`
- `docs/ai/collaboration-log.md`

### In Scope

- Repository Copilot instructions
- Non-conflicting path-specific instructions
- WBS execution prompt
- WBS verification prompt
- AI-log update prompt
- AI working procedure
- First genuine AI-log entry
- Human-only commit boundary

### Out of Scope

- Application features
- Aging rules
- Filters
- Inventory data
- Action workflow
- Fabricated AI corrections or rejections

### Exit Criteria

- AI coding tool is selected and installed.
- Repository-wide instructions exist.
- Path-specific instructions are non-conflicting.
- `docs/wbs.md` is the WBS execution catalogue.
- `docs/active-task.md` is generated from a selected WBS item.
- AI log records task, AI output, decision, verification and correction.
- First genuine entry is written.
- Every AI claim intended for the README or video is supported by the log.
- Corrections and rejections are recorded when they happen.
- Copilot stops before staging, committing or pushing.
- Tests, lint and build continue to pass.

### Verification

```bash
npm test
npm run lint
npm run build
git status
git diff
```

### Human-Only Completion

- Review the complete diff.
- Confirm the AI log is factual.
- Stage accepted changes.
- Commit with a task-level message.
- Push the accepted commit.

---

## WBS 6.3: Define Initial Non-Functional Strategy

- **Workstream:** System Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.75 hour

### Exit Criteria

Record initial direction for:

- Scalability
- Performance
- Reliability
- Maintainability
- Observability
- Security as an owner-added consideration

### Scope Rule

Document design direction without claiming that future production capabilities are implemented.

---

## WBS 3.2: Define Data Model

- **Workstream:** UX & Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

- `Vehicle` type is defined.
- Stored fields are separated from calculated fields.
- Calculated fields include `daysInStock`, `isAging` and `ageBand`.
- Type names and fields align with requirements and service contracts.

---

## WBS 4.3: Implement Aging-Stock Business Logic

- **Workstream:** Core Logic
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

- Pure functions live in a non-React core module.
- Functions accept an injected reference date.
- Days in stock are calculated.
- Aging flag is calculated.
- Age band is calculated.
- Invalid dates are handled safely.
- Future dates are handled safely.
- The threshold is defined once.

### Linked Requirements

- Aging greater than 90 complete calendar days
- Exactly 90 days is not aging
- Age bands 0-30, 31-60, 61-90 and greater than 90

---

## WBS 5.1: Write Aging-Rule Unit Tests

- **Workstream:** Testing
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.25 hours

### Exit Criteria

Tests use a fixed reference date and cover:

- 89 days
- 90 days
- 91 days
- Invalid date
- Future date
- All age-band boundaries
- At least one deliberate mutation or broken rule that causes the relevant test to fail
- AI-log entry for AI-assisted test work

---

## WBS 4.11: Implement InventoryService Interface

- **Workstream:** Data & Service
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.25 hour

### Exit Criteria

- `InventoryService` is defined before its adapter.
- Planned operations include `getVehicles` and `updateVehicleAction`.
- UI code will depend only on the interface.
- The contract is not coupled to local storage or generated data.

---

## WBS 4.2: Build Mock Inventory Adapter and Generated Data

- **Workstream:** Data & Service
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.50 hours

### Exit Criteria

- Mock adapter implements `InventoryService`.
- Approximately 200 deterministic vehicles are generated.
- Entry dates are generated relative to the reference date.
- Deliberate 89, 90 and 91-day records exist.
- Simulated delay exists.
- Forced-failure switch exists.
- Proposed actions use local-storage persistence.
- Relative dates keep boundary records correct whenever the application is run.

---

## WBS 3.1: Create Low-Fidelity Wireframe

- **Workstream:** UX & Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

A single-dashboard wireframe shows:

- Header
- Filters
- Inventory table
- Aging badge
- Proposed-action interaction

---

## WBS 3.3: Update Component Structure After Wireframe

- **Workstream:** UX & Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.25 hour

### Exit Criteria

- Component list from the initial design is reconciled with the wireframe.
- Deviations are recorded for WBS 6.4.
- No unnecessary custom-hook or global-state layer is introduced.

---

## WBS 4.1: Build Application Shell and Styling Foundation

- **Workstream:** UI Implementation
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

- Main layout exists.
- Header exists.
- Reusable style foundation exists.
- Styling supports subsequent inventory, filter and action features.

---

## WBS 4.4: Build Inventory Display

- **Workstream:** UI Implementation
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.75 hours

### Exit Criteria

The table shows:

- Vehicle identity
- Entry date
- Days in stock
- Aging badge
- Current action
- Last-refreshed time
- Manual refresh action

---

## WBS 4.5: Build Search and Filters

- **Workstream:** UI Implementation
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.50 hours

### Exit Criteria

- Filter logic is a pure function in the same non-React core module as aging logic.
- Search works.
- Make filter works.
- Model filter works.
- Age-band filter works.
- Aging-only filter works.
- Filters combine correctly.
- Clear-filters action works.
- Behavior works against approximately 200 records.

### Scope Rule

Sorting is Nice and may be added only after the Core UX gate passes.

---

## WBS 4.7: Build Action Logging Workflow

- **Workstream:** UI Implementation
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 2.00 hours

### Exit Criteria

- Proposed action is available for aging vehicles only.
- Validation works.
- Save works.
- Saved action survives refresh.
- Save failure is handled.
- Previous successful state is preserved on failure.
- AI-log entry is written for AI-assisted work.

---

## WBS 4.8: Implement UX States

- **Workstream:** UI Implementation
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

These states are demonstrable:

- Loading
- Empty inventory
- No filter result
- Inventory-service error
- Action-save error where relevant

The forced-failure switch is used for tests and demonstration.

---

## WBS 4.6: Build Dashboard Summary

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

Display:

- Total vehicles
- Aging vehicle count
- Aging vehicles with an action

### Stop Rule

This is the first build item to drop if behind.

---

## WBS 4.10: Implement Minimum Observability

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

- Logging wrapper exists.
- Error boundary exists.
- Service-call correlation ID exists for mock service calls.

### Fallback

If dropped, the system design and README must state that observability is design-only.

---

## WBS 5.5: Accessibility and Responsive Review

- **Workstream:** Testing
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.25 hour

### Exit Criteria

Review only, without adding unrelated features:

- Labels
- Keyboard access
- Visible focus
- Common laptop-width layout

---

## WBS 5.2: Filter Tests

- **Workstream:** Testing
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

The pure filter function is tested directly for:

- Search
- Make
- Model
- Age band
- Aging only
- Combined filters
- Clear filters
- Behavior against generated data

---

## WBS 5.3: Action Workflow Tests

- **Workstream:** Testing
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 2.25 hours

### Exit Criteria

Component or workflow tests cover:

- Successful save
- Validation failure
- Reload persistence
- Forced service failure
- AI-generated tests reviewed and challenged
- AI-log entry written

---

## WBS 5.4: Manual Verification, Code Walkthrough and Defect Correction

- **Workstream:** Testing
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.25 hours

### Exit Criteria

- Full user journey passes.
- All tests pass.
- Lint passes.
- Production build passes.
- Every file is walked through.
- Anything that cannot be explained is rewritten or noted in the AI log.

### Stop Rule

If this overruns, drop WBS 5.5 before weakening WBS 5.4.

---

## WBS 6.4: Consolidate System Design and AI Usage

- **Workstream:** System Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.75 hour

### Exit Criteria

- Design matches the delivered implementation.
- Assumptions and trade-offs from WBS 1.3 are included.
- Observability is stated as design-only if WBS 4.10 was dropped.
- Architecture diagram is committed as Mermaid or PNG.
- Final document is at `docs/system-design.md`.
- README links to the system design.
- GenAI design usage is explained using factual evidence.

---

## WBS 7.1: Complete README

- **Workstream:** README & Repo
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

README includes:

- Overview
- Prerequisites
- Installation
- Run instructions
- Test instructions
- Build instructions
- Assumptions
- Limitations
- AI Collaboration Narrative using real AI-log cases only
- System-design link
- Screenshot

---

## WBS 7.2: Clean Repository

- **Workstream:** README & Repo
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.25 hour

### Exit Criteria

- Unused files removed.
- Debug output removed.
- Secrets and credentials removed.
- Generated folders are not tracked.
- Repository structure is intentional.

---

## WBS 7.3: Perform Clean-Clone Test

- **Workstream:** README & Repo
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

A fresh clone can:

- Install dependencies
- Run the application
- Run tests
- Run lint
- Build successfully

The tester follows the README only.

---

## WBS 8.1: Prepare Video Script and Demo Flow

- **Workstream:** Video
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

A 5-10 minute outline covers:

- Introduction and chosen scenario
- System design
- Implementation highlights
- AI collaboration story
- Application demo
- Lessons and challenges

---

## WBS 8.2: Rehearse and Record Rough Take

- **Workstream:** Video
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

- One complete rough take exists before deadline day.
- Rough take can be used as fallback if the final take fails.

---

## WBS 8.3: Record Final Take

- **Workstream:** Video
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

- Duration is 5-10 minutes.
- Audio is clear.
- Screen text is readable.
- Demo covers filters, aging, action and persistence.
- AI collaboration is covered concisely and factually.
- Lessons and challenges are covered.

---

## WBS 8.4: Verify and Upload Video

- **Workstream:** Video
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour

### Exit Criteria

- Video is uploaded through a personal, non-employer-managed account.
- Audio is verified.
- Readability is verified.
- Link permissions are verified in a private browser.

---

## WBS 9.1: Final Quality Gate and Submission

- **Workstream:** Final Review
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 1.00 hour

### Exit Criteria

- Latest code is pushed.
- Repository link opens in a private browser.
- Video link opens in a private browser.
- System-design location is clear.
- Submission links are tested.
- Submission email is sent by the internal target.
- Submission remains before the confirmed external deadline.

---

# Daily Gates

## Design-First Gate

All must be true:

- Acceptance criteria exist, including age-band filtering.
- Assumptions include the reference-date rule.
- Initial diagram separates implemented and future architecture.
- Component and data-flow draft exists.
- Confirmation request has been sent to Keyloop.

## Tooling Gate

All must be true:

- Application runs locally.
- Repository is pushed.
- Lint runs.
- At least one Vitest + jsdom sample test passes.
- AI log has its first genuine entry.
- Initial NFR notes exist.

## Logic and Data Gate

All must be true:

- Aging tests pass for 89, 90 and 91 days, invalid date and future date.
- At least one test is proven to fail when the rule is deliberately broken.
- `InventoryService` exists before its adapter.
- Service returns approximately 200 vehicles with relative dates.
- Boundary records are present.
- Forced-failure switch works.

## Core UX Gate

All must be true:

- Inventory list renders.
- Make, model, age-band and aging-only filters work through the pure filter function.
- Aging badge is visible.
- Action saved on an aging vehicle survives refresh.
- Loading and error states display.

If not passed:

- Drop WBS 4.6.
- Drop WBS 4.10.
- Do not add sorting.
- Record observability as design-only if WBS 4.10 is dropped.

## Quality Gate

All must be true:

- All tests pass.
- Lint passes.
- Production build succeeds.
- Full manual journey passes.
- Every file is reviewed and explainable.
- No new feature is added during the quality phase.

## Documentation Gate

All must be true:

- Final design document is in `docs/`.
- Diagram and assumptions are included.
- README is complete with screenshot.
- AI narrative uses real AI-log entries.
- Clean clone works.
- Rough video take exists.

## Submission Gate

All must be true:

- Final video is 5-10 minutes.
- Video is uploaded using a personal account.
- Repository and video links work in a private browser.
- Submission is sent before the confirmed deadline.

# GitHub Copilot Execution Protocol

When the user requests a WBS ID:

1. Find the exact task in this file.
2. Do not infer or substitute a missing ID.
3. Read the objective, scope, exclusions, exit criteria and linked authoritative documents.
4. Generate `docs/active-task.md` as an execution snapshot.
5. Confirm understanding before implementation.
6. Implement only the selected task.
7. Run the task's focused tests and complete verification.
8. Report actual command results.
9. Draft factual AI-log notes.
10. Stop before `git add`, `git commit` or `git push`.

Use this invocation pattern in GitHub Copilot Chat:

```text
/execute-wbs

WBS ID: 2.4
```

The repository owner must review the diff, update the authoritative Excel tracker, approve the AI log, commit and push.
