# Keyloop Technical Assignment WBS

## Document Control

- **Scenario:** Scenario B: Intelligent Inventory Dashboard
- **Implementation:** React + TypeScript + Vite frontend with mocked backend
- **Plan version:** v5
- **Planned effort:** 47.00 hours, excluding Dropped tasks (33.25 baseline + 13.75 CR)
- **Source:** `docs/cr/plan-v5-export.md` (export of Plan v5 workbook)
- **Purpose:** Implementation-facing WBS catalogue for GitHub Copilot in VS Code
- **Planning authority:** The Excel workbook remains authoritative for effort, schedule and reporting. This Markdown file is the repository execution catalogue.

## Execution Sequence

Requirements and scope -> initial system design -> setup and test tooling -> pure logic and AI-assisted unit tests -> service interface -> mock data -> UI -> workflow tests -> design consolidation -> README -> video -> submission.

## Global Stop Rules

1. If behind at the Core UX gate, drop CR Nice items first in this order: 4.24, 4.23, 4.22, 4.21; then CR Should items 4.18, 4.17 and 4.19. Keep 4.20. Apply the existing Core UX fallback for baseline Should work only after this CR order.
2. If WBS 4.10 is dropped, state in the system design and README that observability is design-only.
3. Add no new features after the Quality gate.
4. Documentation and submission work must not introduce new application scope.
5. GitHub Copilot may edit task-scoped files and run verification, but must not stage, commit or push.
6. The repository owner reviews the complete diff, approves the AI log, commits and pushes manually.
7. Keep 4.25-4.27 Dropped in the current plan; do not reinstate them without meeting the task-level CR Plan section 3 conditions and owner approval.
8. WBS 5.6 and 5.7 tests are written before the UI tasks they cover.
9. Do not start WBS 4.21-4.24 before the Core UX gate passes.

## Status Values

- `Not Started`
- `In Progress`
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
- CR handoff records that the Vehicle Inventory Mockup HTML and README were generated design inputs; tool name is confirmed rather than guessed.
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
- CR: review `aria-sort`, `aria-pressed`, `aria-live` for result count/toast, and focus rings for built items.

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

### Notes

CR: VIN-search and action-filter tests are in WBS 5.6. Keep this task on baseline filters.

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
- Code and CSS lifted from the mockup are reviewed and explainable; unused rules are removed.

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
- CR: reflect D30-D40, including client-side paging (C-20), freshness constants (C-24), one early-warning window (C-22), and label deferred CR items E-10 to E-15 as Future.

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
- "Assumptions and Interpretations" based on README Draft v4 items #1-#15
- Deferred CR items listed under future improvements
- Reviewer switches and browser-persisted data described
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
- If built, pagination, freshness/time ago and data-issue rows; state the A-08 real-time interpretation

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

## WBS 1.5: Triage CR and Update Planning Baseline

- **Workstream:** Requirements & Scope
- **Priority:** Must
- **Status:** In Progress
- **Planned effort:** 0.50 hour
- **CR Ref:** CR triage

### Objective

Triage every change-request item, align Requirements Baseline v4 and Plan v5, and list owner decisions.

### In Scope

- Update the authorized planning baseline, WBS, decision register, traceability and active-task snapshot.
- Record CR dispositions and unresolved owner decisions without resolving open questions.

### Owner Decisions (Pending)

The following Plan v5 recommendations remain proposals until the repository owner confirms them:

| # | Decision | Plan v5 recommendation |
|---|---|---|
| 1 | Who raised the CR, and is it a Keyloop requirement or an own design input? (OQ-14) | Treat it as an own design input unless Keyloop confirms otherwise. |
| 2 | Are the WBS statuses accurate? The repository WBS and Plan v5 workbook disagree for 16 task statuses. | Confirm the repository catalogue statuses; do not silently synchronize either source. |
| 3 | Keep the action dialog or adopt the inline editor (CR-31)? | Keep the dialog (C-30). |
| 4 | Persist page, page size and sort preferences (CR-21)? | Persist saved actions only (D34/C-23). |
| 5 | Use one 7-day early-warning window or retain the mockup's day-80 threshold? (OQ-15) | Use one informational window for days 84-90. |
| 6 | Use URL parameters or a dev-only panel for reviewer switches, and when should sample actions be seeded? | Use URL parameters and seed actions only in demo mode (D39). |
| 7 | Approve the proposed CR tiers? | Keep the Plan v5 Must/Should/Nice tiers, subject to the Core UX gate. |

### Exit Criteria

- Every CR item has a disposition (Adopt, Adopt gated, Defer or Not built).
- Requirements Baseline v4 and Plan v5 are aligned.
- Open decisions are listed for the owner.

### Linked Acceptance Criteria

None; this is a planning-baseline task.

### Notes

Mark Complete only after the owner confirms the dispositions. Record who raised the CR (OQ-14), which determines whether it is a requirement or own design input.

## WBS 3.5: Update Data Model and Component Structure for Adopted CR Items

- **Workstream:** UX & Design
- **Priority:** Must
- **Status:** Not Started
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-01, CR-06, CR-07, CR-28

### Objective

Update data-model and component-structure documentation for adopted CR items.

### In Scope

- Vehicle type adds VIN; current action adds `loggedAt`.
- Filter state adds action; paging and sort state are defined.
- Extend the component list with summary cards, pager and freshness indicator.
- Keep the InventoryService contract unchanged (`getVehicles`, `updateVehicleAction`).

### Exit Criteria

- Required data and UI state additions are documented.
- Component structure reflects the adopted CR surfaces.
- InventoryService signatures remain unchanged.

### Linked Acceptance Criteria

AC-R1-12/13, AC-R1-14/15, AC-R2-14/15/16, AC-R3-07.

### Notes

Delta to completed WBS 3.2 and 3.3. Skip items dropped at the gate.

## WBS 4.12: Extend Core Module for CR

- **Workstream:** Core Logic
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 1.00 hour
- **CR Ref:** CR-01, CR-02, CR-03, CR-06, CR-17

### Objective

Add framework-independent core functions needed by adopted CR behavior.

### In Scope

- Search stock number, VIN, make and model; action filtering; entry-date issue classification; pagination with slicing and clamping; freshness level; summary data-issue count.
- Inject reference date and clock. Early-warning and sort functions belong to WBS 4.21 and 4.24.

### Exit Criteria

- Core functions are pure and contain no React imports.
- Search, action filter, date-issue classification, pagination, freshness and issue summary are implemented.
- Reference date and clock are injected.

### Linked Acceptance Criteria

AC-R1-13/14/15/16, AC-R2-14/16, AC-R5-03.

### Notes

Delta to completed WBS 4.3 and 4.5. Unit tests are WBS 5.6.

## WBS 4.13: Extend Mock Adapter for CR

- **Workstream:** Data & Service
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-01, CR-06, CR-07, CR-28

### Objective

Extend generated mock vehicles and saved actions for CR data.

### In Scope

- Generate fake 17-character VINs using a fixed seed and excluding I, O and Q.
- Include three bad-data vehicles: missing, invalid and future entry dates.
- Keep 89/90/91-day records unchanged.
- Store `loggedAt` with saved actions; do not change InventoryService signatures.

### Exit Criteria

- Generated vehicles meet the VIN and bad-date requirements.
- Existing aging boundary records remain unchanged.
- Saved actions include `loggedAt`.
- InventoryService signatures remain unchanged.

### Linked Acceptance Criteria

AC-R1-12, AC-R2-14/15/16, AC-R3-07.

### Notes

Delta to completed WBS 4.2 and 4.11. C-28 action values are placeholders; OQ-07 remains open.

## WBS 4.14: Add Reviewer Switches and Demo Mode

- **Workstream:** Data & Service
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-22, CR-23

### Objective

Enable deterministic reviewer scenarios without adding a demo bar to product UI.

### In Scope

- Switch forced failure, empty inventory and data age without code changes.
- Seed sample actions only in demo mode; keep tests unseeded.
- Do not build the requirement-ID overlay.

### Exit Criteria

- Scenarios can be switched by URL parameters or a dev-only panel outside product UI.
- Tests run without sample-action seeding.
- README describes the switches.

### Linked Acceptance Criteria

AC-R4-05/07.

### Notes

Extends forced failure from completed WBS 4.2 (C-05).

## WBS 4.15: Apply CR Design Tokens and Typography

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-25, CR-27

### Objective

Apply the agreed CR visual tokens, typography and accessibility details.

### In Scope

- CSS variables for colors, radius and shadow; Manrope, Inter and IBM Plex Mono.
- Reuse suitable header, card and table styles.
- Use the blue focus ring; do not copy demo bar, notes cards or unused `.gauge` CSS.

### Exit Criteria

- CR tokens, typography and layout styles are applied.
- Mockup CSS retained is reviewed and explainable.
- Accessibility details are applied to built CR items.

### Linked Acceptance Criteria

AC-R2-12, AC-R1-20.

### Notes

Delta to WBS 4.1. Review lifted CSS during WBS 5.4.

## WBS 4.16: Show VIN, Entry-Date Format and Data-Issue Rows

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-01, CR-06, CR-27, CR-32

### Objective

Display CR vehicle details and data-quality states in the inventory list.

### In Scope

- VIN column in monospace with searched-match highlight.
- Entry date in DD-MMM-YYYY format.
- Unknown days and issue tag for missing, invalid or future dates.
- Data issues link filters the list; aging-badge text remains unchanged.

### Exit Criteria

- Required row details and data-issue states are visible.
- Data issues link applies its list filter.
- Existing aging badge text is unchanged.

### Linked Acceptance Criteria

AC-R1-12, AC-R2-15.

### Notes

Delta to completed WBS 4.4.

## WBS 4.17: Add Action Filter and Filter Chips

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-02, CR-04

### Objective

Expose action filtering and active-filter feedback.

### In Scope

- Any / No action yet / Has an action filter.
- Removable chip for each active filter.
- “Showing X-Y of N” count and unchanged Clear filters behavior.

### Exit Criteria

- Action filter, chips, result count and Clear filters work together.

### Linked Acceptance Criteria

AC-R1-14/15/17.

### Notes

Delta to completed WBS 4.5. Pure filter logic is in 4.12.

## WBS 4.18: Build Pagination

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 1.25 hours
- **CR Ref:** CR-03

### Objective

Build client-side pagination for the demonstration inventory.

### In Scope

- Page sizes 10/20/50/100 (default 20).
- First, previous, numbered, next and last controls with ellipsis.
- Reset page to 1 on filter change; clamp page when results shrink.
- Do not persist page or page size; do not build go-to-page.

### Exit Criteria

- Pagination controls and page sizes behave as specified.
- Filter changes reset to first page and shrinking results clamp the page.
- Page state is not persisted.

### Linked Acceptance Criteria

AC-R1-01/16/17/18.

### Notes

Revises D19. If dropped at the Core UX gate, AC-R1-01 holds as written (all rows shown).

## WBS 4.19: Show Action Logged Time, Save Feedback and Error Reference

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-07, CR-16, CR-29

### Objective

Show action age, save confirmation and correlated failure reference.

### In Scope

- Show Logged today/yesterday/N days ago and No action yet for aging rows.
- Show Action saved toast without Undo.
- Show correlation ID in failed-save message; depends on WBS 4.10.
- Keep action entry in the dialog (C-30).

### Exit Criteria

- Action age, success feedback and error reference are presented as specified.

### Linked Acceptance Criteria

AC-R3-01/07/09.

### Notes

Delta to completed WBS 4.7. If 4.10 is dropped, omit Ref text and AC-R3-09 does not apply.

## WBS 4.20: Build Freshness Indicators

- **Workstream:** UI Implementation
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 1.00 hour
- **CR Ref:** CR-17

### Objective

Make data freshness and refresh outcomes visible.

### In Scope

- Header shows reference date, last-refreshed time and time ago.
- Normal under 15 minutes, amber from 15, red from 60; warning with Refresh now from 60.
- Refresh failure preserves data and shows Retry; first-load failure stays AC-R4-04.

### Exit Criteria

- Header thresholds and stale-data warning match the named placeholder constants.
- Failed refresh preserves last data and provides Retry.
- First-load error remains distinct.

### Linked Acceptance Criteria

AC-R4-06, AC-R5-03/04/05/06.

### Notes

Delta to WBS 4.4. Thresholds are named placeholders pending OQ-11.

## WBS 4.21: Build Attention Cues

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-08, CR-09

### Objective

Add gated cues for vehicles nearing aging and stale actions.

### In Scope

- “Turning aging in 7 days” card for days 84-90 toggles a list filter.
- “Due in N days” tag uses the same window.
- Flag actions older than 14 days; actions remain aging-only.
- Unit test early-warning rule.

### Exit Criteria

- One threshold drives card and tag.
- Stale-action flag follows the 14-day placeholder.
- Early-warning boundary test exists.

### Linked Acceptance Criteria

AC-R2-17/18, AC-R3-08.

### Notes

Do not start before Core UX gate passes. Drop if behind; one threshold only (D33).

## WBS 4.22: Build Age Profile and Summary Upgrade

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Not Started
- **Planned effort:** 1.00 hour
- **CR Ref:** CR-10, CR-11

### Objective

Add the gated age-profile bar and richer summary.

### In Scope

- Band bar with counts and share; clicking a band toggles age-band filter.
- Show 90-day threshold marker.
- Summary adds aging share and actioned meter.

### Exit Criteria

- Age-profile counts, shares, marker and filter interaction work.
- Summary cards show the additional values.

### Linked Acceptance Criteria

AC-R2-13/19.

### Notes

Do not start before Core UX gate passes. Delta to WBS 4.6; drop if behind.

## WBS 4.23: Build Preset Views

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-12

### Objective

Add gated preset filters over the full filter set.

### In Scope

- All vehicles, Needs action, Aging stock, Action planned, Turning aging this week, Approaching 90 days, Data issues and New arrivals.
- Each preset applies all filters and shows a count; show Custom filters when none match.
- Do not build saved views.

### Exit Criteria

- Presets apply complete filter sets and display counts.
- Saved views remain unbuilt.

### Linked Acceptance Criteria

AC-R2-18/19; C-29.

### Notes

Do not start before Core UX gate passes. Preset for Turning aging depends on WBS 4.21; drop if behind.

## WBS 4.24: Build Column Sorting

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Not Started
- **Planned effort:** 1.25 hours
- **CR Ref:** CR-05

### Objective

Add gated three-state sorting to inventory columns.

### In Scope

- Pure `sortRows`; sortable headers cycle descending, ascending and vehicle-ID order.
- Days in stock and Status start descending; unknown values last; ties by vehicle ID.
- Set `aria-sort`; do not persist sorting; unit-test `sortRows`.

### Exit Criteria

- Sorting order and unknown/tie behavior match the rule.
- Sort state is session-only and accessible.
- Core sorting unit tests pass.

### Linked Acceptance Criteria

AC-R1-11/19/20.

### Notes

Do not start before Core UX gate passes. First CR item to drop if behind.

## WBS 4.25: Bulk Select and Bulk Apply of Actions

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Dropped
- **Planned effort:** 2.50 hours
- **CR Ref:** CR-14

### Objective

Deferred scope only; do not implement under this plan.

### Scope

Row selection on aging rows, select-page and select-all-in-list, replace-existing warning, partial-failure handling and per-vehicle failure injection.

### Exit Criteria

- Remains Dropped. Reinstate only if the Core UX gate passes, all CR Should items are complete and at least 2.5 hours remain on Saturday; OQ-16 is answered, per-vehicle failure injection exists, and new criteria cover selection, replacement warning and partial failure.

### Linked Acceptance Criteria

None; deferred pending OQ-16 and new criteria.

### Notes

Do not reinstate; CR-14 deferred (E-10).

## WBS 4.26: Undo Toast for a Saved Action

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Dropped
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-15

### Objective

Deferred scope only; do not implement under this plan.

### Scope

An 8-second Undo would restore the previous action and needs a clear-action path in InventoryService.

### Exit Criteria

- Remains Dropped.

### Linked Acceptance Criteria

None; deferred (E-11).

### Notes

Undo changes the service contract (`updateVehicleAction` accepting null). Reinstate only if bulk is not reinstated and 0.5 hour remains; first decide how to restore a prior action.

## WBS 4.27: Export Filtered List as CSV

- **Workstream:** UI Implementation
- **Priority:** Nice
- **Status:** Dropped
- **Planned effort:** 0.50 hour
- **CR Ref:** CR-18

### Objective

Deferred scope only; do not implement under this plan.

### Scope

Export all filtered rows across pages with the 11 README columns.

### Exit Criteria

- Remains Dropped. Reinstate only on Saturday, after the Core UX gate, with 0.5 hour spare; features freeze from Sunday.

### Linked Acceptance Criteria

None; deferred (E-12).

### Notes

Deferred (E-12). If reinstated, use the README column list and add one criterion for exported row count.

## WBS 5.6: CR Core Unit Tests

- **Workstream:** Testing
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR-01, CR-02, CR-03, CR-06, CR-17

### Objective

Test pure CR core functions against fixed inputs and time.

### In Scope

Tests cover AC-R1-13 to AC-R1-16, AC-R2-14, AC-R2-16 and AC-R5-03; deliberately break each rule to show its test fails; record AI-log entry.

### Exit Criteria

- Fixed-reference-date tests cover the linked criteria.
- Deliberate-failure evidence and factual AI-log entry are recorded.

### Linked Acceptance Criteria

AC-R1-13/14/15/16, AC-R2-14/16, AC-R5-03.

### Notes

Share one test file with WBS 5.1 and 5.2. Write these tests before the UI tasks they cover.

## WBS 5.7: CR Component Tests

- **Workstream:** Testing
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.75 hour
- **CR Ref:** CR Should criteria

### Objective

Verify observable CR component behavior.

### In Scope

Component tests cover AC-R1-12/17/18, AC-R2-15, AC-R3-07/09, AC-R4-06 and AC-R5-04/05/06. Test Nice criteria alongside their task or check them manually once; change Test level when moving a criterion to manual.

### Exit Criteria

- Listed component criteria have test coverage.
- Built Nice criteria are tested or manually checked once.
- Test-level metadata is updated for any manual check.

### Linked Acceptance Criteria

AC-R1-12/17/18, AC-R2-15, AC-R3-07/09, AC-R4-06, AC-R5-04/05/06.

### Notes

Ten component criteria in 0.75 hour is tight; follow DoD realism guidance. Write tests before the UI tasks they cover.

## WBS 7.4: Draft README Wording for CR Decisions

- **Workstream:** README & Repo
- **Priority:** Should
- **Status:** Not Started
- **Planned effort:** 0.50 hour
- **CR Ref:** CR docs

### Objective

Prepare README wording for CR assumptions, reviewer controls and deferred items.

### In Scope

Check README Draft v4 items #1-#15 against the build, list deferred CR items as future improvements and describe reviewer switches.

### Exit Criteria

- Draft text matches the delivered build.
- Deferred items and reviewer switches are described accurately.

### Linked Acceptance Criteria

None; documentation task.

### Notes

Prepare wording early so WBS 7.1 only needs to re-check it against the delivered build.

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
