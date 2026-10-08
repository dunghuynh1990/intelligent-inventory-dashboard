# Keyloop Scenario B Requirements Baseline

## Document Control

- **Scenario:** Scenario B: Intelligent Inventory Dashboard
- **Baseline version:** v3
- **Source:** `Keyloop_ScenarioB_Requirements_Baseline_v3.xlsx`
- **Purpose:** Authoritative implementation-facing requirements baseline for GitHub Copilot
- **Reference date R:** Today at runtime; fixed and injected in tests
- **Priority rule:** Must = verified by an automated test or one recorded manual check; Should = quality item
- **PROPOSED:** Not explicit in the brief or fixed decisions; justified by the linked assumption or design choice

## Authority and Usage

This file is authoritative for approved requirements, acceptance criteria, assumptions, exclusions, design choices and completion criteria.

When implementing a WBS task:

1. Read `docs/wbs.md` and `docs/active-task.md`.
2. Use only the acceptance criteria linked to that task.
3. Treat `Approved`, `Selected` and `Applied` items as implementation direction.
4. Treat open questions as unresolved production matters, not permission to expand assessment scope.
5. Do not implement recommendations marked `Not applied`.
6. If this file conflicts with the assignment brief, stop the affected work and report the conflict.

## Summary

| Group | Must | Should | Total |
|---|---:|---:|---:|
| R1 Inventory Visualization | 11 | 0 | 11 |
| R2 Aging Stock Identification | 12 | 1 | 13 |
| R3 Actionable Insights | 6 | 0 | 6 |
| R4 UX States | 5 | 0 | 5 |
| R5 Data Freshness | 2 | 0 | 2 |
| **Total** | **36** | **1** | **37** |

| Test level | All | Must |
|---|---:|---:|
| Unit | 19 | 19 |
| Component | 17 | 16 |
| Manual | 1 | 1 |

---

# 1. Acceptance Criteria

## R1: Inventory Visualization

### AC-R1-01: Display all returned vehicles

- **Given:** The service returns N vehicles and no filter is set.
- **When:** The dashboard finishes loading.
- **Then:** The list shows N vehicle rows.
- **Source:** Brief: display a filterable list of all vehicles in a dealership's inventory; Decision 4.
- **Linked assumptions:** A-09, A-11
- **Linked design choices:** C-03, C-12
- **Test level:** Component
- **Priority:** Must

### AC-R1-02: Display the required vehicle fields

- **Given:** A vehicle has a known make, model, stock number, entry date and days in stock.
- **When:** Its row is displayed.
- **Then:** The row shows each of those five values.
- **Source:** Brief list requirement; PROPOSED checkable column set for WBS 4.4.
- **Linked design choices:** C-13
- **Test level:** Component
- **Priority:** Must

### AC-R1-03: Free-text search

- **Given:** The generated vehicle list.
- **When:** Search text `civ` is applied.
- **Then:** Only vehicles whose stock number, make or model contains `civ`, case-insensitive, are returned.
- **Source:** Decision 8; PROPOSED searched fields.
- **Linked assumptions:** A-14
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-04: Make filter

- **Given:** The generated vehicle list.
- **When:** Only make `Toyota` is applied.
- **Then:** Every returned vehicle has make `Toyota`, and the count equals the number of Toyota vehicles in the data.
- **Source:** Brief make-filter example; Decision 8.
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-05: Model filter

- **Given:** The generated vehicle list.
- **When:** Only model `Corolla` is applied.
- **Then:** Every returned vehicle has model `Corolla`, and the count equals the number of Corolla vehicles in the data.
- **Source:** Brief model-filter example; Decision 8.
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-06: Age-band filter

- **Given:** The generated vehicle list and reference date R.
- **When:** Only age band `31-60` is applied.
- **Then:** Every returned vehicle has 31 to 60 days in stock, and the count equals the number of such vehicles in the data.
- **Source:** Brief age-filter example; Decisions 7 and 8.
- **Linked assumptions:** A-04
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-07: Aging-only filter

- **Given:** The generated vehicle list and reference date R.
- **When:** Aging-only is enabled.
- **Then:** Every returned vehicle has more than 90 days in stock, and the count equals the number of aging vehicles.
- **Source:** Decision 8; brief greater-than-90-days rule.
- **Linked assumptions:** A-01
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-08: Combined filters use AND

- **Given:** The generated vehicle list.
- **When:** Make `Toyota` and age band `>90` are applied together.
- **Then:** Only vehicles matching both conditions are returned.
- **Source:** Decision 8; PROPOSED AND combination.
- **Linked assumptions:** A-13
- **Linked design choices:** C-09, C-10
- **Test level:** Unit
- **Priority:** Must

### AC-R1-09: Clear all filters

- **Given:** Make, model, age-band and search filters are applied.
- **When:** The manager selects `Clear filters`.
- **Then:** The list shows all N vehicles again.
- **Source:** Decision 8; PROPOSED clear action for WBS 4.5.
- **Linked assumptions:** A-13
- **Test level:** Component
- **Priority:** Must

### AC-R1-10: Model options depend on make

- **Given:** The generated vehicle list and make `Toyota` is selected.
- **When:** Model options are derived.
- **Then:** Every option is a Toyota model, and every Toyota model in the data appears exactly once.
- **Source:** Decision 8; PROPOSED design-review decision.
- **Linked assumptions:** A-13
- **Linked design choices:** C-17
- **Test level:** Unit
- **Priority:** Must

### AC-R1-11: Stable display order

- **Given:** The generated vehicle list in any input order.
- **When:** The list is prepared for display, with or without filters.
- **Then:** Vehicles are returned in ascending vehicle-ID order.
- **Source:** PROPOSED stable order; not a user sorting feature.
- **Linked design choices:** C-18
- **Test level:** Unit
- **Priority:** Must

## R2: Aging Stock Identification

### AC-R2-01: 91 days is aging

- **Given:** Reference date R and a vehicle that entered stock 91 days before R.
- **When:** The aging rule is evaluated.
- **Then:** The vehicle is aging.
- **Linked assumptions:** A-01, A-03
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-02: Exactly 90 days is not aging

- **Given:** Reference date R and a vehicle that entered stock exactly 90 days before R.
- **When:** The aging rule is evaluated.
- **Then:** The vehicle is not aging.
- **Linked assumptions:** A-01
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-03: 89 days is not aging

- **Given:** Reference date R and a vehicle that entered stock 89 days before R.
- **When:** The aging rule is evaluated.
- **Then:** The vehicle is not aging.
- **Linked assumptions:** A-01
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-04: Ignore time of day

- **Given:** A vehicle entered at 23:59 on the date 91 days before R and is evaluated at 00:01 on R.
- **When:** Days in stock is calculated.
- **Then:** The result is 91 because calendar dates are compared and time of day is ignored.
- **Linked assumptions:** A-01, A-16
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-05: Invalid entry date

- **Given:** A vehicle has an empty or invalid entry date.
- **When:** The aging rule is evaluated.
- **Then:** No error is thrown, days in stock is unknown, and the vehicle is not aging.
- **Linked assumptions:** A-12
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-06: Future entry date

- **Given:** A vehicle entry date is after R.
- **When:** The aging rule is evaluated.
- **Then:** No error is thrown, days in stock is unknown, and the vehicle is not aging.
- **Linked assumptions:** A-12
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-07: 30/31 age-band boundary

- **Given:** Vehicles with 30 and 31 days in stock.
- **When:** Age band is calculated.
- **Then:** 30 maps to `0-30`; 31 maps to `31-60`.
- **Linked assumptions:** A-04
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-08: 60/61 age-band boundary

- **Given:** Vehicles with 60 and 61 days in stock.
- **When:** Age band is calculated.
- **Then:** 60 maps to `31-60`; 61 maps to `61-90`.
- **Linked assumptions:** A-04
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-09: 90/91 age-band boundary

- **Given:** Vehicles with 90 and 91 days in stock.
- **When:** Age band is calculated.
- **Then:** 90 maps to `61-90`; 91 maps to `>90`.
- **Linked assumptions:** A-01, A-04
- **Linked design choices:** C-09
- **Test level:** Unit
- **Priority:** Must

### AC-R2-10: Deterministic boundary data

- **Given:** Reference date R.
- **When:** Mock data is generated.
- **Then:** It contains about 200 vehicles, including at least one vehicle at each of 89, 90 and 91 days.
- **Linked assumptions:** A-03, A-11
- **Linked design choices:** C-06, C-07, C-15
- **Test level:** Unit
- **Priority:** Must

### AC-R2-11: Injected reference date

- **Given:** The generated 90-day vehicle.
- **When:** The aging rule is evaluated with reference date R + 1 day.
- **Then:** The vehicle becomes aging, proving the reference date is injected rather than hard-coded.
- **Linked assumptions:** A-02, A-03
- **Linked design choices:** C-08
- **Test level:** Unit
- **Priority:** Must

### AC-R2-12: Aging badge is textual

- **Given:** An aging vehicle in the list.
- **When:** Its row is displayed.
- **Then:** The row shows a textual `Aging` badge, not colour alone; non-aging rows show no badge.
- **Linked assumptions:** A-01
- **Linked design choices:** C-13
- **Test level:** Component
- **Priority:** Must

### AC-R2-13: Aging summary count

- **Given:** Generated data contains K aging vehicles.
- **When:** The dashboard loads with no filters.
- **Then:** A summary above the list shows aging count K.
- **Source:** PROPOSED summary indicator; WBS 4.6.
- **Linked design choices:** C-14
- **Test level:** Component
- **Priority:** Should

## R3: Actionable Insights

### AC-R3-01: Save an action

- **Given:** An aging vehicle has no current action.
- **When:** The manager selects `Price Reduction Planned`, enters an optional note and saves.
- **Then:** The row shows `Price Reduction Planned` as the current action.
- **Linked assumptions:** A-06, A-07
- **Linked design choices:** C-16
- **Test level:** Component
- **Priority:** Must

### AC-R3-02: Persist after reload

- **Given:** An action was saved on an aging vehicle.
- **When:** The dashboard is reloaded using a new service instance reading the same local storage.
- **Then:** The vehicle still shows the saved action and note.
- **Linked assumptions:** A-10
- **Linked design choices:** C-04, C-15
- **Test level:** Component
- **Priority:** Must

### AC-R3-03: No action for non-aging vehicle

- **Given:** A vehicle has exactly 90 days in stock.
- **When:** Its row is displayed.
- **Then:** No control to add or edit an action is available.
- **Linked assumptions:** A-05
- **Test level:** Component
- **Priority:** Must

### AC-R3-04: Action selection is required

- **Given:** The action form is open for an aging vehicle.
- **When:** The manager saves without selecting an action.
- **Then:** A validation message is shown and stored action remains unchanged.
- **Linked assumptions:** A-07, A-15
- **Test level:** Component
- **Priority:** Must

### AC-R3-05: Preserve previous action on failure

- **Given:** An aging vehicle has action A and forced failure is enabled.
- **When:** The manager saves action B.
- **Then:** An error is shown and the row still shows action A.
- **Linked design choices:** C-04, C-16
- **Test level:** Component
- **Priority:** Must

### AC-R3-06: One current action

- **Given:** An aging vehicle has action A.
- **When:** The manager saves action B.
- **Then:** The row shows only action B.
- **Linked assumptions:** A-06
- **Test level:** Component
- **Priority:** Must

## R4: UX States

### AC-R4-01: Loading state

- **Given:** The service has not returned vehicles because of simulated delay.
- **When:** The dashboard opens.
- **Then:** A loading indicator is shown and the list is hidden.
- **Linked design choices:** C-04
- **Test level:** Component
- **Priority:** Must

### AC-R4-02: Empty inventory

- **Given:** The service returns zero vehicles.
- **When:** Loading finishes.
- **Then:** An empty-inventory message is shown.
- **Test level:** Component
- **Priority:** Must

### AC-R4-03: No filter result

- **Given:** Vehicles are loaded.
- **When:** Active filters match no vehicle.
- **Then:** A no-results message with `Clear filters` is shown, distinct from empty inventory.
- **Linked design choices:** C-19
- **Test level:** Component
- **Priority:** Must

### AC-R4-04: Service error and retry

- **Given:** Forced failure is enabled.
- **When:** The dashboard loads vehicles.
- **Then:** An error with a retry option is shown and no rows are shown.
- **Linked design choices:** C-04
- **Test level:** Component
- **Priority:** Must

### AC-R4-05: Failure can be forced without code change

- **Given:** The app is running in a browser.
- **When:** The reviewer enables forced failure without changing code and refreshes.
- **Then:** The service-error state is displayed.
- **Linked design choices:** C-05
- **Test level:** Manual
- **Priority:** Must

## R5: Data Freshness

### AC-R5-01: Last-refreshed time

- **Given:** A fixed clock and a successful load.
- **When:** Loading completes.
- **Then:** `Last refreshed` equals the load time.
- **Linked assumptions:** A-08
- **Test level:** Component
- **Priority:** Must

### AC-R5-02: Manual refresh

- **Given:** The dashboard loaded at T1 and the clock is now T2.
- **When:** The manager selects `Refresh`.
- **Then:** Vehicles are requested again and `Last refreshed` shows T2.
- **Linked assumptions:** A-08
- **Test level:** Component
- **Priority:** Must

---

# 2. Assumptions

| ID | Assumption | Linked ACs |
|---|---|---|
| A-01 | Aging means more than 90 complete calendar days. Exactly 90 is not aging. | AC-R1-07, AC-R2-01/02/03/04/09/12 |
| A-02 | Age is measured against the current date when viewed. | AC-R2-11 |
| A-03 | Days in stock is derived from stock-entry date and is not stored. | AC-R2-01, AC-R2-10, AC-R2-11 |
| A-04 | Age filter uses 0-30, 31-60, 61-90 and >90 bands. | AC-R1-06, AC-R2-07/08/09 |
| A-05 | Action is available only for aging vehicles. | AC-R3-03 |
| A-06 | Log means one current action; a new save replaces the previous action. | AC-R3-01, AC-R3-06 |
| A-07 | Status or proposed action is one fixed-list value plus optional note. | AC-R3-01, AC-R3-04 |
| A-08 | Real-time means last-refreshed time plus manual refresh. | AC-R5-01, AC-R5-02 |
| A-09 | Dashboard serves a single dealership. | AC-R1-01 |
| A-10 | Persistence means same browser and user after reload. | AC-R3-02 |
| A-11 | About 200 vehicles is demonstration scale, not a capacity target. | AC-R1-01, AC-R2-10 |
| A-12 | Invalid or future date means unknown age and not aging. | AC-R2-05, AC-R2-06 |
| A-13 | Filters combine with AND and clear resets all filters. | AC-R1-08, AC-R1-09 |
| A-14 | Search matches stock number, make and model, case-insensitive. | AC-R1-03 |
| A-15 | An action must be selected; a note alone is insufficient. | AC-R3-04 |
| A-16 | Calendar day uses browser local date and local start of day; time is ignored. | AC-R2-04, AC-R2-11 |

## Production Validation Needs

- Confirm the precise aging rule and business cut-off.
- Confirm the event that starts inventory age.
- Confirm standard age bands.
- Confirm whether managers act before day 91.
- Confirm whether current status and proposed action are separate fields.
- Confirm whether action history, ownership and approval are required.
- Confirm production freshness target and update mechanism.
- Confirm roles spanning dealerships.
- Confirm cross-user/device persistence requirements.
- Obtain real inventory volumes and production performance targets.
- Confirm dealership timezone and invalid-data display behavior.

---

# 3. Exclusions

| ID | Excluded item | Assessment reason | Future production location |
|---|---|---|---|
| E-01 | Real backend API and database | Frontend selected; backend may be mocked. | HTTP adapter, Inventory API and durable database |
| E-02 | Authentication and authorization | Not named in brief; mock cannot enforce access. | Identity provider plus API role/dealership checks |
| E-03 | Deployment and CI/CD | Local repository is the required deliverable. | Pipeline for lint, tests and build; hosted frontend/API |
| E-04 | Microservices | One bounded inventory capability does not justify decomposition. | Start as one inventory service; split only if justified |
| E-05 | Multi-dealership support | Single dealership assumed. | API query with dealership ID, filters and paging |
| E-06 | Action history and approvals | One current action per vehicle. | Append-only action records and optional workflow |
| E-07 | Full end-to-end suite | Unit, component and one manual check are proportionate. | Browser E2E tests in pipeline/test environment |
| E-08 | Production telemetry platform | No production backend or host. | Frontend telemetry SDK and centralized logs/metrics/traces |
| E-09 | Push or live real-time updates | Manual refresh is assessment interpretation. | Polling, WebSocket or server-sent events after target agreed |

---

# 4. Design Choices

| ID | Design choice | Status / linked behavior |
|---|---|---|
| C-01 | Frontend implemented; backend mocked. | Approved |
| C-02 | React + TypeScript + Vite; Vitest + React Testing Library. | Approved |
| C-03 | UI depends only on `InventoryService(getVehicles, updateVehicleAction)`. | AC-R1-01 |
| C-04 | Mock adapter uses local storage, delay and forced failure. | AC-R3-02/05, AC-R4-01/04 |
| C-05 | Forced failure can be enabled without a code change. | AC-R4-05 |
| C-06 | About 200 deterministic vehicles with fixed seed for non-date fields. | AC-R2-10 |
| C-07 | Entry dates are offsets from R, including 89/90/91. | AC-R2-10 |
| C-08 | Reference date is injected: today at runtime, fixed in tests. | AC-R2-11 |
| C-09 | Aging and filter rules are pure functions in a non-React module. | R1 filter and R2 rule ACs |
| C-10 | Filtering is client-side; server filtering/paging is future. | AC-R1-03 to AC-R1-08 |
| C-11 | Logging wrapper, error boundary and service-call correlation ID are Should; design-only if dropped. | Optional |
| C-12 | Mock contains in-stock vehicles only. | AC-R1-01 |
| C-13 | Row fields include stock number, make, model, entry date, days, aging badge and current action. | AC-R1-02, AC-R2-12 |
| C-14 | Summary shows total, aging count and aging-with-action. First item dropped if behind. | AC-R2-13, Should |
| C-15 | Only actions and notes are persisted, keyed by stable vehicle ID. | AC-R2-10, AC-R3-02 |
| C-16 | Save is pessimistic; disabled saving state; inline Retry; previous action retained on failure. | AC-R3-01, AC-R3-05 |
| C-17 | Model options depend on selected make; changing make clears invalid model. | AC-R1-05, AC-R1-10 |
| C-18 | Display order is fixed by vehicle ID; sorting is out of scope. | AC-R1-11 |
| C-19 | Impossible filter combinations are allowed and show no-results with Clear filters. | AC-R1-09, AC-R4-03 |

---

# 5. Open Questions

| ID | Area | Question / current assessment position |
|---|---|---|
| OQ-01 | Search | Should search include VIN or registration beyond stock number, make and model? |
| OQ-02 | Filters | Are make/model multi-select? Assessment narrows models by make; multi-select remains open. |
| OQ-03 | Inventory | Does all inventory include sold, reserved or in-transit? Mock uses in-stock only. |
| OQ-04 | Timezone | Should dealership timezone replace browser local date in production? |
| OQ-05 | Data quality | How should invalid/future entry dates appear to the manager? |
| OQ-06 | Prominence | Is a badge enough, or is a summary/aging-first view required? |
| OQ-07 | Action model | Are status and proposed action distinct, and what are fixed-list values? |
| OQ-08 | History | Does log mean an audit history or only current action? Assessment uses current action. |
| OQ-09 | Note | Is there a maximum note length? |
| OQ-10 | Freshness | Is manual refresh acceptable for real-time? |
| OQ-11 | Freshness target | What maximum data age applies, and is polling or push required? |
| OQ-12 | Scale | At what inventory size should filtering and paging move server-side? |
| OQ-13 | Eligibility change | If corrected data makes a vehicle non-aging, should its saved action be kept, hidden or cleared? |

Open questions do not block the assessment unless an active WBS task explicitly depends on an unanswered production decision.

---

# 6. Coverage

| Requirement phrase | Acceptance criteria |
|---|---|
| Display a filterable list of all vehicles | AC-R1-01, AC-R1-02, AC-R1-11 |
| Filter by make, model and age | AC-R1-04/05/06/08/09/10 |
| Identify aging stock greater than 90 days | AC-R2-01 to AC-R2-11 |
| Prominently display aging stock | AC-R2-12 Must; AC-R2-13 Should |
| Log status or proposed action for aging vehicles | AC-R3-01, AC-R3-03, AC-R3-06; status details remain OQ-07 |
| Persist action | AC-R3-02 |
| Loading, empty, no-result and service-error states | AC-R4-01 to AC-R4-05 |
| Real-time overview | AC-R5-01, AC-R5-02; production target remains OQ-11 |

**Not covered:** None. The separate meaning of status remains partially open under OQ-07.

---

# 7. Recommendations and Status

| ID | Recommendation | Status |
|---|---|---|
| REC-01 | Record freshness target as open and show polling/push as Future. | Applied in v2 |
| REC-02 | State manual-refresh interpretation plainly in video. | Applied in v2 |
| REC-03 | Include status-type and action-type values, or justify one list. | Partly applied in v3; values remain open |
| REC-04 | Show future API with dealership ID, filters and paging. | Applied in v2 |
| REC-05 | Add an optional query object to `getVehicles` now. | Not applied; would change Decision 3 |
| REC-06 | Promote logging wrapper and error boundary from Should to Must. | Not applied |

Copilot must not implement REC-05 or REC-06 unless the repository owner explicitly changes the baseline.

---

# 8. Task-Level Definition of Done

| ID | Check |
|---|---|
| T-01 | Tests for touched behavior pass. New behavior has a test, or commit body records `No test: <reason>`. |
| T-02 | `npm run lint` has zero errors. |
| T-03 | `npm run build` completes without type or build errors. |
| T-04 | Commit uses `type(scope): imperative summary`, maximum 72 characters, with WBS ID in body. One commit does not span tasks. |
| T-05 | If AI was used, factual log records task, ask, output, accepted/rejected, verification and correction or `None`. |
| T-06 | Repository owner can explain every changed source, test and config line. |
| T-07 | WBS exit criteria and linked AC IDs are checked. |
| T-08 | Diff has no secrets, ad-hoc debug logging or commented-out code. |

## Practical Interpretation

- For UI tasks before WBS 5.3, existing tests plus one manual linked-AC check are acceptable when the commit states that automated coverage is scheduled in 5.3.
- Run lint and build for code/config changes, not purely planning or video tasks.
- Non-repository tasks use relevant DoD items only.
- Full AI-log entry is required when AI output is committed, rejected or corrected. Small syntax help may use a concise factual line.
- Ownership review applies to changed source, tests and config; lockfiles and untouched scaffold are excluded.

---

# 9. Release-Level Definition of Done

| ID | Deliverable | Check |
|---|---|---|
| RL-01 | System design | `docs/system-design.md` contains diagram, roles, data flow, technologies/justifications, observability and GenAI design usage. |
| RL-02 | System design | Assumptions, exclusions and open questions are included; unbuilt components are Future; future freshness and API contract are shown. |
| RL-03 | Working code | Fresh clone installs, runs, tests and builds using README only. |
| RL-04 | Working code | All 36 Must ACs are verified: 19 Unit, 16 Component and 1 Manual. |
| RL-05 | Working code | README covers overview, run/test/build, assumptions/interpretations, limitations and system-design link. |
| RL-06 | Working code | AI narrative uses real log entries and at least one real corrected or rejected suggestion. |
| RL-07 | Working code | Repository is accessible and contains no secrets. |
| RL-08 | Video | Required flow is shown and manual-refresh interpretation is stated. |
| RL-09 | Video | Link opens in private browser without access request. |
| RL-10 | All | Submission email with repository, design and video links is sent before the confirmed deadline. |

---

# 10. README Assumptions and Interpretations

Use these statements only if the delivered build still matches them:

1. **Log an action:** Logging means saving the current action for an aging vehicle. A new action replaces the old one; history is future scope.
2. **Status or proposed action:** One `Action` field covers both, selected from a fixed list with an optional note.
3. **Real-time overview:** The dashboard shows last-refreshed time and a Refresh button. It does not push live updates.
4. **Filter combination:** Filters combine with AND.
5. **Aging-only plus age band:** Both may be active; impossible combinations show no results with Clear filters.
6. **Make and model:** Models narrow to the selected make; invalid selected model is cleared when make changes.
7. **Display order:** Vehicles use fixed vehicle-ID order; user sorting is out of scope.
8. **No-longer-aging action:** Production behavior remains open if corrected source data removes aging eligibility.

---

# 11. GitHub Copilot Rules for This Baseline

Before implementing a WBS task, GitHub Copilot must:

1. Read this file.
2. Read `docs/wbs.md`.
3. Read `docs/active-task.md`.
4. Read `docs/system-design.md` and `docs/architecture/architecture.md` when architecture is relevant.
5. Identify the exact linked AC IDs.
6. Report any conflict before changing affected files.
7. Implement only active-task scope.
8. Avoid turning open questions or unapplied recommendations into features.
9. Run the defined verification.
10. Stop before staging, committing or pushing.
