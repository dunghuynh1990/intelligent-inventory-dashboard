# Keyloop Scenario B Requirements Baseline v4

Export of `Keyloop_ScenarioB_Requirements_Baseline_v4.xlsx` (values as last calculated). Each sheet is a section. Line breaks inside cells appear as `<br>`. Rows with a single value are titles or notes; other rows are table rows (the first row of each block is its header).


## Sheet: Read Me

Keyloop Scenario B \| Requirements Baseline (Acceptance Criteria, Assumptions & Exclusions, Definition of Done)

v4. v3 plus the change request (CR) from the Vehicle Inventory Mockup and README handoff (8-Oct): 24 new acceptance criteria, A-17 to A-21, OQ-14 to OQ-18, E-10 to E-15, C-20 to C-30. v4 changes are highlighted blue; v3 changes stay green; v2 changes stay yellow. All changes are listed in Consistency Log; CR items and conflicts are on CR Impact.


| Sheet | Contents |
|---|---|
| Read Me | This sheet: contents, ID scheme, conventions |
| CR Impact | v4: 32 change-request items with disposition, tier, plan task and links; 15 conflicts and inconsistencies found |
| AC Summary | Must/Should counts by group and test level (formulas) |
| Acceptance Criteria | AC-R1-01 to AC-R5-06 with links to assumptions and design choices |
| Open Questions | OQ-01 to OQ-18 |
| Coverage | Brief phrase to AC map; Not covered = none |
| Assumptions | A-01 to A-21 |
| Exclusions | E-01 to E-15 |
| Design Choices | C-01 to C-30 with linked ACs |
| Challenge | Weakest assumption, at-risk exclusion, CR scope risk (Q3), REC-01 to REC-11 with status |
| Task DoD | T-01 to T-08 |
| Release DoD | RL-01 to RL-10 |
| DoD Example | WBS 4.3, 4.7, 5.3 |
| DoD Realism | Leaner alternatives |
| README Draft | Paste-ready README text for "Assumptions and Interpretations" (#1-#15) |
| Consistency Log | v1 merge fixes, v2 changes (REC-01, REC-02, REC-04), v3 changes (design review 7-Oct), v4 changes (CR, 8-Oct), validation checks |


| ID scheme | AC-Rn-nn acceptance criteria \| OQ-nn open questions \| A-nn assumptions \| E-nn exclusions \| C-nn design choices \| REC-nn recommendations \| T-nn task DoD \| RL-nn release DoD \| CR-nn change request items |
|---|---|
| Reference date R | Today at runtime; fixed date in tests. |
| Priority | Must = covered by a test or one manual check. Should = quality item. v4: CR items that are Nice in the plan are Should here; the plan tier is on CR Impact. |
| PROPOSED | Not in the brief or the decisions list; justified where it appears. |
| Decision n | Decisions 1-11 from the fixed decisions list. Dnn = planning workbook decision IDs. |

## Sheet: CR Impact

CR Impact: change request from the Vehicle Inventory Mockup and README handoff, compared with Baseline v3

Sources: Vehicle Inventory Mockup.html and README.md (handoff). Dispositions are proposals until the owner confirms them (OQ-14). Tier = plan priority (Must / Should / Nice); acceptance criteria use Must / Should only, so Nice items are Should here. Hours and WBS tasks: Plan v5, sheet 'CR Plan'. v4 changes are highlighted blue.


| CR ID | CR item | Where in the CR (mockup / README) | Disposition | Tier | Plan WBS ID(s) | Requirement links (this workbook) | Difference from baseline / note |
|---|---|---|---|---|---|---|---|
| CR-01 | VIN column, VIN search and match highlight | README s6 Search, s8 VIN column; HTML applyFilters(), .vin mark | Adopt | Should | 4.12, 4.13, 4.16 | AC-R1-12, AC-R1-13; A-14, A-21; OQ-01; C-13, C-21 | Baseline searched stock number, make and model only (A-14). VIN answers part of OQ-01; registration number stays open. |
| CR-02 | Action filter (Any / No action yet / Has an action) | README s6 Action; HTML #fAction, applyFilters() | Adopt | Should | 4.12, 4.17 | AC-R1-14, AC-R1-15; A-17; C-21 | 'No action yet' also requires the vehicle to be aging (A-17), consistent with A-05. |
| CR-03 | Pagination (10 / 20 / 50 / 100, pager, first / last) | README s7-s8 Pager; HTML pageList(), goToPage() | Adopt with changes | Should | 4.12, 4.18 | AC-R1-01 (changed), AC-R1-16, AC-R1-17, AC-R1-18; A-11; C-20, C-23; OQ-12 | Reverses D19 (paging rejected). Go-to-page box not built; page and page size not persisted (D34). Largest page size is 100, so 200 vehicles can no longer show on one page: AC-R1-01 restricted to N not larger than the page size. |
| CR-04 | Result bar: 'Showing X-Y of N' and removable filter chips | README s7 Result bar | Adopt | Should | 4.17 | AC-R1-17 | Chip removal reuses the existing filter state. |
| CR-05 | Column sorting (8 sortable columns, three-state, unknown last, ID tie-break) | README s8 table headers and Interactions 'Sorting'; HTML sortRows(), setSort() | Adopt, gated | Nice | 4.24 | AC-R1-11 (changed), AC-R1-19, AC-R1-20; C-18 (revised), C-21; D32 | v3 and README Draft #7 said sorting is out of scope. Kept Nice so the existing stop rule (drop sorting first) still holds. Sort is not persisted. |
| CR-06 | Data-issue handling (missing, invalid, future entry date shown as Unknown with a tag and a Data issues view) | README Interactions 'Bad dates'; HTML dateIssue(), generate() bad{} | Adopt | Should | 4.12, 4.13, 4.16 | AC-R2-14, AC-R2-15, AC-R2-16; A-12; OQ-05; C-25 | Answers OQ-05 for the assessment. Mock data gains 3 deliberate bad-data vehicles. |
| CR-07 | Action logged time ('Logged today / N days ago') | HTML actionAgo(), currentAction.loggedAt | Adopt | Should | 4.13, 4.19 | AC-R3-07; A-20; C-28 | D13 said 'record updated timestamp if feasible'. Data model gains loggedAt. |
| CR-08 | Stale-action flag (more than 14 days: 'check progress') | HTML STALE_ACTION_DAYS | Adopt, gated | Nice | 4.21 | AC-R3-08; A-20; OQ-17 | 14 days is a placeholder. |
| CR-09 | Early-warning: 'Turning aging in 7 days' card, 'Due in N days' tag | README s3, s8; HTML isSoonWeek(), isSoon() | Adopt with change | Nice | 4.21 | AC-R2-17, AC-R2-18; A-19; C-22, C-29; OQ-15 | Mockup uses two thresholds (card: days 84-90; row tag: from day 80). Plan uses one (D33). Informational only; actions stay aging-only (D28). |
| CR-10 | Summary cards upgrade (aging share %, actioned meter) | README s3 KPI overview | Adopt, gated | Nice | 4.22 | AC-R2-13 (unchanged); C-14 | Delta to completed task 4.6. |
| CR-11 | Age profile band bar (counts, share, click to filter) | README s4 Age profile; HTML renderProfile() | Adopt, gated | Nice | 4.22 | AC-R2-19; A-04; OQ-06; C-29 | D12 already rated charts and elaborate visuals as Nice. |
| CR-12 | Preset views (8 presets) | README s5 Presets; HTML PRESETS | Adopt, gated | Nice | 4.23 | C-29 | Presets apply the full filter set; saved views are not built (CR-13). |
| CR-13 | Saved views (name, store, delete) | README s5 Saved views; HTML savedViews, VIEWS_KEY | Defer | Deferred | - | E-13 | Adds a persistence surface (C-23). |
| CR-14 | Bulk select and bulk apply of actions | README s8 Select, s9 Bulk bar; HTML applyBulk() | Defer | Deferred | 4.25 (Dropped) | E-10; OQ-16; D35 | Needs per-vehicle failure injection to test partial failure. Reinstate rule on the CR Plan sheet. |
| CR-15 | Undo toast (8 seconds) | README s10 Toast; HTML undoLast() | Defer | Deferred | 4.26 (Dropped) | E-11; D35 | Needs a clear-action path (null) that the InventoryService contract does not have. |
| CR-16 | Save toast 'Action saved' | README s10 Toast | Adopt | Should | 4.19 | AC-R3-01 | Without Undo. |
| CR-17 | Freshness indicators (time ago, amber from 15 min, warning from 60 min) and refresh-failure behaviour | README s1-s2, Interactions Refresh / Freshness; HTML renderFreshness() | Adopt | Should | 4.12, 4.20 | AC-R4-06, AC-R5-03 to AC-R5-06; A-18; OQ-11; C-24; D37 | Strengthens the weakest assumption (A-08, Challenge Q1). Mockup code comment marks 'keep list or show error view' as OPEN: decided as keep list on refresh failure, error state on first load. |
| CR-18 | Export CSV (all filtered rows) | README s7 Result bar; HTML exportCsv() | Defer | Deferred | 4.27 (Dropped) | E-12; D36 | Not in the brief. |
| CR-19 | Print layout (A4 landscape) | README s7; HTML @media print | Defer | Deferred | - | E-12; D36 |  |
| CR-20 | Row density toggle (comfortable / compact) | README s7; HTML state.density | Not built | Excluded | - | E-13; D36 |  |
| CR-21 | Remembered UI preferences in localStorage (sort, page, page size, density, views) | README Interactions; HTML PAGING_KEY, SORT_KEY, PREFS_KEY, VIEWS_KEY | Adopt with change | Decision | - | C-23; E-13; OQ-18; D34 | Mockup stores four keys besides actions; C-15 allows only actions. Plan: only actions persist. |
| CR-22 | Reviewer switches (forced failure, empty inventory, data age, clear saved actions) | README 'demo bar'; HTML .demo | Adopt as switches only | Should | 4.14 | AC-R4-05, AC-R4-07; C-05, C-26; D39 | README: the demo bar is not product UI. Only the adapter switches are built. |
| CR-23 | Sample actions seeded on first visit | HTML seedSampleActions() | Adopt in demo mode only | Should | 4.14 | C-26; D39 | Seeding on first visit would break fresh-state tests and AC-R3-01 demos. |
| CR-24 | 'Updating results' overlay (320 ms) on filter change | HTML setCriteria() filtering flag | Not built | Excluded | - | E-15; D36 | Artificial delay on client-side filtering; conflicts with D19 (no performance claims). |
| CR-25 | Design tokens, typography and layout (Manrope / Inter / IBM Plex Mono, 1440 px max width) | README Design Tokens, Typography, Screens | Adopt | Should | 4.15 | C-27; D40 | Mockup has leftover cyan focus rings; README token table says blue. Follow the token table. |
| CR-26 | Tablet and mobile breakpoints (1100 / 860 / 560 px) | HTML @media | Not built | Excluded | - | E-14; C-27 | D20 scope is laptop width. Table scrolls horizontally below 1340 px. |
| CR-27 | Accessibility details (aria-sort, aria-pressed, aria-live, focus rings, screen-reader labels) | README Interactions Accessibility | Adopt within build tasks | Should | 4.15 to 4.24, 5.5 | AC-R2-12, AC-R1-20 | Reviewed in 5.5. |
| CR-28 | Action model and values (five placeholder actions incl. 'Under Review') | HTML ACTIONS | Adopt as placeholders | Should | 3.5, 4.13 | C-28; A-07; OQ-07 | Partly answers REC-03: 'Under Review' is status-like. Values still need sign-off. |
| CR-29 | Correlation ID shown in error messages ('Ref: ...') | README Logging wrapper; HTML logged() | Adopt (needs 4.10) | Should | 4.19 | AC-R3-09; C-11; REC-06 | If 4.10 is dropped, the Ref text is dropped and AC-R3-09 is not applicable. |
| CR-30 | Notes cards and requirement-ID overlay | README s11 Notes cards; HTML .notes, body.spec-on | Not built | Excluded | - | E-15 | README says reviewer documentation, do not ship. |
| CR-31 | Inline action editor row (instead of a dialog) | README s8 Inline editor | Not adopted (keep dialog) | Excluded | - | C-30 | Wireframe 3.1 and task 4.7 use a dialog. Same fields, validation and failure behaviour, so no AC changes. Owner can override. |
| CR-32 | Entry date format DD-MMM-YYYY | README s8 Entry date | Adopt | Should | 4.16 | C-13 |  |

Conflicts and inconsistencies found in the CR (mockup vs README vs baseline)


| # | Finding | Evidence | Impact |  |  | Resolution in v4 | Owner decision needed |
|---|---|---|---|---|---|---|---|
| 1 | Pagination breaks AC-R1-01 as written | README s8 Pager: page sizes 10-100; the mock has 200 vehicles; AC-R1-01 expects N rows | AC-R1-01 is a Must criterion; with a default page of 20 it would fail. |  |  | AC-R1-01 limited to N not larger than the page size; AC-R1-17 covers 200. If paging is dropped both still hold. | No |
| 2 | Sorting contradicts v3 | C-18 and README Draft #7 say sorting is out of scope; README s8 Sorting makes eight columns sortable | Two documents would disagree. |  |  | Sorting kept Nice (gated); C-18 revised; README Draft #7 has both wordings. | No |
| 3 | Two early-warning thresholds | HTML SOON_WINDOW = 7 (card counts days 84-90) and SOON_FROM = 80 (row tag 'Due in N days') | Vehicles at days 80-83 carry a tag the card does not count. |  |  | One window (C-22, A-19). | Yes (OQ-15) |
| 4 | Extra localStorage keys | HTML PAGING_KEY, SORT_KEY, PREFS_KEY, VIEWS_KEY; C-15 says only actions are stored | More state to clear, version and test; stale page numbers. |  |  | Only actions persist (C-23). | Yes (D34) |
| 5 | Sample actions seeded on first visit | HTML seedSampleActions() runs when the store is new | A fresh state would not be empty: AC-R3-01 style tests and demos would start with actions the user never saved. |  |  | Seeding only in demo mode (C-26). | No |
| 6 | Forced failure is all-or-nothing | HTML failSwitch is read by both getVehicles and updateVehicleAction | A partial bulk failure cannot be reproduced; the mockup's bulk-error message could not be tested. |  |  | Bulk deferred (E-10); REC-11 lists the precondition. | No |
| 7 | Inline editor row vs dialog | README s8 Inline editor; wireframe 3.1 and WBS 4.7 use a dialog | Rework if adopted; no behavioural difference. |  |  | Dialog kept (C-30). | Yes (CR-31) |
| 8 | Refresh failure behaviour was left open | HTML load(): comment 'OPEN: keep list or show error view'; AC-R4-04 expects no rows | First-load failure and refresh failure need different results. |  |  | AC-R4-04 limited to the first load; AC-R4-06 keeps the list on refresh failure. | No |
| 9 | Artificial 320 ms delay | HTML setCriteria(): 'Updating results' overlay | Fake latency on client-side filtering contradicts D19 and slows tests. |  |  | Not built (E-15, REC-08). | No |
| 10 | Focus ring colour | HTML .control:focus uses a cyan ring rgba(0,190,230,.25); README token table says blue #2F5BD3 with a 3px ring | Visual inconsistency inside the CR. |  |  | Follow the README token table (C-27). | No |
| 11 | Unused CSS in the mockup | HTML .gauge rules exist but daysCell() renders no gauge | Copying all CSS would bring unexplained code (T-06). |  |  | Do not copy; review in 4.15 and 5.4. | No |
| 12 | Action values are placeholders | HTML ACTIONS; README says the action list needs product sign-off | Wording may change; 'Under Review' is status-like (partly answers REC-03). |  |  | Five values adopted as placeholders (C-28); OQ-07 stays open. | Yes (OQ-07) |
| 13 | Fidelity expectation | README Fidelity: high-fidelity, pixel-accurate rebuild | Conflicts with the time-boxed plan and the deferred sections. |  |  | Tokens and CSS reused; structure rebuilt; deferred sections not built (D40). | Yes (OQ-14) |
| 14 | Quick views replace filters | HTML summary card, Data issues link and presets set {...EMPTY_CRITERIA, ...}; manual filters combine with AND | A reader may expect a card click to add to current filters. |  |  | Documented (C-29, A-13). | No |
| 15 | Mockup provenance | README describes the HTML as a design reference built in HTML | The AI Collaboration Narrative must only describe real log entries (D16). |  |  | Record the mockup and its tool in the AI log (plan 2.4); never invent examples. | Yes (tool name) |

## Sheet: AC Summary

Acceptance criteria summary



| Group | Must | Should | Total |
|---|---|---|---|
| R1 Inventory Visualization | 11 | 9 | 20 |
| R2 Aging Stock Identification | 12 | 7 | 19 |
| R3 Actionable Insights | 6 | 3 | 9 |
| R4 UX States | 5 | 2 | 7 |
| R5 Data Freshness | 2 | 4 | 6 |
| Total | 36 | 25 | 61 |


| Test level | All | Must |
|---|---|---|
| Unit | 28 | 19 |
| Component | 31 | 16 |
| Manual | 2 | 1 |

## Sheet: Acceptance Criteria

Acceptance criteria (Given / When / Then; one observable outcome each)



| ID | Given / When / Then | Source (brief phrase or decision) | Linked assumptions | Linked design choices | Test level | Priority |
|---|---|---|---|---|---|---|

R1 Inventory Visualization


| AC-R1-01 | Given the service returns N vehicles (N not larger than the page size) and no filter is set<br>When the dashboard finishes loading<br>Then the list shows N vehicle rows. | Brief: "Display a filterable list of all vehicles in a dealership's inventory"; Decision 4; v4: with paging (CR-03) AC-R1-17 covers N larger than the page size | A-09, A-11 | C-03, C-12, C-20 | Component | Must |
|---|---|---|---|---|---|---|
| AC-R1-02 | Given a vehicle with known make, model, stock number, entry date and days in stock<br>When its row is displayed<br>Then the row shows each of those five values. | Brief: "Display a ... list of all vehicles". PROPOSED column set (needed so the list is checkable; WBS 4.4) | - | C-13 | Component | Must |
| AC-R1-03 | Given the generated vehicle list<br>When the search text "civ" is applied<br>Then only vehicles whose stock number, make, model or VIN contains "civ" (case-insensitive) are returned. | Decision 8 (search). PROPOSED searched fields: stock number, make, model; v4: VIN added to the searched fields (CR-01, A-14) | A-14 | C-09, C-10, C-21 | Unit | Must |
| AC-R1-04 | Given the generated vehicle list<br>When only the make filter "Toyota" is applied<br>Then every returned vehicle has make "Toyota" and the count equals the number of Toyota vehicles in the data. | Brief: "filter by make"; Decision 8 | - | C-09, C-10 | Unit | Must |
| AC-R1-05 | Given the generated vehicle list<br>When only the model filter "Corolla" is applied<br>Then every returned vehicle has model "Corolla" and the count equals the number of Corolla vehicles in the data. | Brief: "filter by ... model"; Decision 8 | - | C-09, C-10 | Unit | Must |
| AC-R1-06 | Given the generated vehicle list and reference date R<br>When only the age-band filter "31-60" is applied<br>Then every returned vehicle has 31 to 60 days in stock and the count equals the number of such vehicles in the data. | Brief: "filter by ... age"; Decisions 7, 8 | A-04 | C-09, C-10 | Unit | Must |
| AC-R1-07 | Given the generated vehicle list and reference date R<br>When only the aging-only filter is on<br>Then every returned vehicle has more than 90 days in stock and the count equals the number of aging vehicles in the data. | Decision 8 (aging-only); Brief: "aging stock (vehicles in inventory for >90 days)" | A-01 | C-09, C-10 | Unit | Must |
| AC-R1-08 | Given the generated vehicle list<br>When make "Toyota" and age band ">90" are applied together<br>Then only vehicles that match both conditions are returned. | Decision 8. PROPOSED: filters combine with AND | A-13 | C-09, C-10 | Unit | Must |
| AC-R1-09 | Given make, model, age-band and search filters are applied<br>When the manager selects "Clear filters"<br>Then the list shows all N vehicles again. | Decision 8. PROPOSED clear-filters action (WBS 4.5) | A-13 | - | Component | Must |
| AC-R1-10 | Given the generated vehicle list and make "Toyota" selected<br>When the model options are derived<br>Then every option is a Toyota model, and every Toyota model in the data appears exactly once. | Decision 8 (model filter). PROPOSED: model options depend on the selected make (design review 7-Oct, #5) | A-13 | C-17 | Unit | Must |
| AC-R1-11 | Given the generated vehicle list in any input order<br>When the list is prepared for display, with or without filters, and no sort is selected<br>Then vehicles are returned in ascending vehicle ID order. | PROPOSED stable display order (design review 7-Oct, #9). v4: sorting is now an optional Nice feature (CR-05) applied after this step, see AC-R1-19 and AC-R1-20 | - | C-18 | Unit | Must |
| AC-R1-12 | Given a vehicle with a 17-character VIN<br>When its row is displayed<br>Then the row shows the full VIN. | CR-01 (README s8 VIN column). PROPOSED | A-21 | C-13 | Component | Should |
| AC-R1-13 | Given the generated vehicle list and the VIN of vehicle V010<br>When the first 8 characters of that VIN, in lower case, are used as the search text<br>Then V010 is returned and every returned vehicle contains that text in its stock number, VIN, make or model. | CR-01; OQ-01. PROPOSED searched field: VIN | A-14, A-21 | C-21 | Unit | Should |
| AC-R1-14 | Given the generated vehicle list and reference date R<br>When only the action filter "No action yet" is applied<br>Then every returned vehicle is aging and has no current action, and the count equals the number of such vehicles in the data. | CR-02 (README s6 Action). PROPOSED | A-05, A-17 | C-21 | Unit | Should |
| AC-R1-15 | Given the generated vehicle list with some saved actions<br>When only the action filter "Has an action" is applied<br>Then every returned vehicle has a current action, and the count equals the number of such vehicles in the data. | CR-02. PROPOSED | A-17 | C-21 | Unit | Should |
| AC-R1-16 | Given 45 vehicles and a page size of 20<br>When pages 1, 3 and 9 are requested<br>Then page 1 has 20 vehicles, page 3 has the last 5, and page 9 is treated as page 3 (the page number is clamped). | CR-03 (README s8 Pager). PROPOSED; revises D19 | A-11 | C-20, C-21 | Unit | Should |
| AC-R1-17 | Given the service returns 200 vehicles and the default page size<br>When the dashboard finishes loading<br>Then 20 rows are shown, the count reads "Showing 1-20 of 200" and the pager shows page 1 of 10. | CR-03, CR-04 (README s7-s8). PROPOSED | A-11 | C-20 | Component | Should |
| AC-R1-18 | Given page 3 is shown<br>When any filter is changed<br>Then page 1 is shown. | CR-03 (README Interactions 'Filtering'). PROPOSED | - | C-20 | Component | Should |
| AC-R1-19 | Given vehicles with days in stock 10, 40, unknown and 40 (the two 40s have different IDs)<br>When the rows are sorted by days in stock ascending, then descending<br>Then ascending gives 10, 40, 40, unknown and descending gives 40, 40, 10, unknown; equal values stay in vehicle ID order. | CR-05 (Nice; README s8 Sorting). PROPOSED | - | C-18, C-21 | Unit | Should |
| AC-R1-20 | Given no sort is selected<br>When the manager selects the "Days in stock" header three times<br>Then the order is descending, then ascending, then back to vehicle ID order, and aria-sort on the header reads descending, ascending, then none. | CR-05 (Nice). PROPOSED | - | C-18 | Component | Should |

R2 Aging Stock Identification


| AC-R2-01 | Given reference date R and a vehicle that entered stock 91 days before R<br>When the aging rule is evaluated<br>Then the vehicle is classified as aging. | Brief: ">90 days"; Decision 5 | A-01, A-03 | C-09 | Unit | Must |
|---|---|---|---|---|---|---|
| AC-R2-02 | Given reference date R and a vehicle that entered stock exactly 90 days before R<br>When the aging rule is evaluated<br>Then the vehicle is classified as not aging. | Brief: ">90 days"; Decision 5 ("Exactly 90 days is NOT aging") | A-01 | C-09 | Unit | Must |
| AC-R2-03 | Given reference date R and a vehicle that entered stock 89 days before R<br>When the aging rule is evaluated<br>Then the vehicle is classified as not aging. | Brief: ">90 days"; Decision 5 | A-01 | C-09 | Unit | Must |
| AC-R2-04 | Given a vehicle whose entry date is 23:59 on the date 91 days before R, evaluated at 00:01 on R<br>When days in stock is calculated<br>Then the result is 91 (time of day is ignored; calendar dates are compared). | Decision 5 ("complete calendar days") | A-01, A-16 | C-09 | Unit | Must |
| AC-R2-05 | Given a vehicle with an invalid entry date (empty or not a date)<br>When the aging rule is evaluated<br>Then no error is thrown, days in stock is "unknown" and the vehicle is not classified as aging. | WBS 4.3 ("handle invalid ... dates safely"). PROPOSED outcome: unknown + not aging | A-12 | C-09 | Unit | Must |
| AC-R2-06 | Given a vehicle whose entry date is after R<br>When the aging rule is evaluated<br>Then no error is thrown, days in stock is "unknown" and the vehicle is not classified as aging. | WBS 4.3 ("handle ... future dates safely"). PROPOSED outcome: treated as invalid data | A-12 | C-09 | Unit | Must |
| AC-R2-07 | Given vehicles with 30 and 31 days in stock<br>When the age band is calculated<br>Then 30 days maps to "0-30" and 31 days maps to "31-60". | Decision 7 | A-04 | C-09 | Unit | Must |
| AC-R2-08 | Given vehicles with 60 and 61 days in stock<br>When the age band is calculated<br>Then 60 days maps to "31-60" and 61 days maps to "61-90". | Decision 7 | A-04 | C-09 | Unit | Must |
| AC-R2-09 | Given vehicles with 90 and 91 days in stock<br>When the age band is calculated<br>Then 90 days maps to "61-90" and 91 days maps to ">90". | Decision 7; Decision 5 | A-01, A-04 | C-09 | Unit | Must |
| AC-R2-10 | Given reference date R<br>When the mock data is generated<br>Then it contains about 200 vehicles, including at least one vehicle each at 89, 90 and 91 days in stock. | Decisions 4, 6 | A-03, A-11 | C-06, C-07, C-15 | Unit | Must |
| AC-R2-11 | Given the 90-day vehicle from the generated data<br>When the aging rule is evaluated with reference date R + 1 day<br>Then the vehicle is classified as aging (proves the reference date is injected, not hard-coded). | Decision 6 | A-02, A-03 | C-08 | Unit | Must |
| AC-R2-12 | Given an aging vehicle in the list<br>When its row is displayed<br>Then the row shows a text "Aging" badge (not colour alone), and rows of non-aging vehicles show no badge. | Brief: "prominently display aging stock" | A-01 | C-13 | Component | Must |
| AC-R2-13 | Given the generated data contains K aging vehicles<br>When the dashboard loads with no filters<br>Then a summary shows an aging count of K above the list. | Brief: "prominently display". PROPOSED summary indicator (WBS 4.6, Should) | - | C-14 | Component | Should |
| AC-R2-14 | Given entry dates that are empty, "not-a-date", after reference date R, and a valid past date<br>When the entry date is checked<br>Then the issues are "Missing entry date", "Invalid entry date", "Future entry date" and none, in that order. | CR-06 (README Interactions 'Bad dates'); OQ-05. PROPOSED labels | A-12 | C-25 | Unit | Should |
| AC-R2-15 | Given a vehicle with an invalid entry date<br>When its row is displayed<br>Then the row shows "Unknown" days in stock and the issue text, no Aging badge and no action control, and the vehicle appears when the Data issues link is selected. | CR-06. PROPOSED | A-12 | C-25 | Component | Should |
| AC-R2-16 | Given reference date R<br>When the mock data is generated<br>Then it contains one vehicle each with a missing, an invalid and a future entry date, and the 89/90/91-day vehicles of AC-R2-10 are unchanged. | CR-06 (HTML generate() bad{}). PROPOSED | A-12 | C-07, C-25 | Unit | Should |
| AC-R2-17 | Given vehicles with 83, 84, 90 and 91 days in stock<br>When the early-warning rule is evaluated<br>Then 84 and 90 are "turning aging soon"; 83 and 91 are not. | CR-09 (Nice; README s3). PROPOSED window of 7 days | A-19 | C-22 | Unit | Should |
| AC-R2-18 | Given the "Turning aging in 7 days" card shows K<br>When the manager selects the card<br>Then the list shows only those K vehicles and the card is marked pressed; selecting it again clears the filter. | CR-09 (Nice). PROPOSED | A-19 | C-22, C-29 | Component | Should |
| AC-R2-19 | Given the age band counts are known<br>When the age profile is shown<br>Then each band segment shows its count and share, and selecting a band applies the age-band filter (selecting it again clears it). | CR-11 (Nice; README s4). PROPOSED; partly answers OQ-06 | A-04 | C-29 | Component | Should |

R3 Actionable Insights


| AC-R3-01 | Given an aging vehicle with no current action<br>When the manager selects "Price Reduction Planned", enters an optional note and saves<br>Then the vehicle row shows "Price Reduction Planned" as its current action. | Brief: "log and persist a status or proposed action for each aging vehicle"; Decision 9 | A-06, A-07 | C-16 | Component | Must |
|---|---|---|---|---|---|---|
| AC-R3-02 | Given an action was saved on an aging vehicle<br>When the dashboard is reloaded (new service instance reading the same local storage; one manual browser refresh)<br>Then the vehicle still shows the saved action and note. | Brief: "persist"; Decision 3 (local-storage persistence) | A-10 | C-04, C-15 | Component | Must |
| AC-R3-03 | Given a vehicle with exactly 90 days in stock<br>When its row is displayed<br>Then no control to add or edit an action is available for it. | Brief: "for each aging vehicle"; Decision 9 | A-05 | - | Component | Must |
| AC-R3-04 | Given the action form is open for an aging vehicle<br>When the manager saves without selecting an action<br>Then a validation message is shown and the stored action for that vehicle is unchanged. | Decision 9 (action from a fixed list). PROPOSED: action is required | A-07, A-15 | - | Component | Must |
| AC-R3-05 | Given an aging vehicle with current action A and forced failure switched on<br>When the manager saves action B<br>Then an error message is shown and the row still shows action A. | Decision 3 (forced-failure switch) | - | C-04, C-16 | Component | Must |
| AC-R3-06 | Given an aging vehicle with current action A<br>When the manager saves action B<br>Then the row shows only action B. | Decision 9 ("one current action per vehicle") | A-06 | - | Component | Must |
| AC-R3-07 | Given an action saved on a vehicle at time T<br>When the dashboard is shown on the same day, then three days later<br>Then the row shows "Logged today", then "Logged 3 days ago". | CR-07 (HTML actionAgo()). PROPOSED | A-20 | C-28 | Component | Should |
| AC-R3-08 | Given one aging vehicle with an action logged 14 days ago and another logged 15 days ago<br>When the rows are shown<br>Then only the 15-day action shows the "check progress" flag. | CR-08 (Nice). PROPOSED placeholder of 14 days | A-20 | C-28 | Component | Should |
| AC-R3-09 | Given forced failure is on<br>When saving an action fails<br>Then the inline error shows a reference that matches the correlation ID logged for the failed service call. | CR-29 (README Logging wrapper). Needs WBS 4.10; not applicable if 4.10 is dropped | - | C-11, C-16 | Component | Should |

R4 UX States


| AC-R4-01 | Given the service has not yet returned vehicles (simulated delay)<br>When the dashboard is opened<br>Then a loading indicator is shown and the list is not shown. | R4 (user scope); Decision 3 (simulated delay) | - | C-04 | Component | Must |
|---|---|---|---|---|---|---|
| AC-R4-02 | Given the service returns zero vehicles<br>When the dashboard finishes loading<br>Then an empty-inventory message is shown. | R4 (user scope) | - | - | Component | Must |
| AC-R4-03 | Given vehicles are loaded<br>When filters are applied that match no vehicle<br>Then a no-results message with a "Clear filters" option is shown, distinct from the empty-inventory message. | R4 (user scope) | - | C-19 | Component | Must |
| AC-R4-04 | Given forced failure is switched on<br>When the dashboard loads vehicles for the first time<br>Then an error message with a retry option is shown and no vehicle rows are shown. | R4 (user scope); Decision 3; v4: a failed refresh while data is shown is AC-R4-06 | - | C-04 | Component | Must |
| AC-R4-05 | Given the running app in a browser<br>When the reviewer switches forced failure on without changing code (PROPOSED: URL parameter or visible dev toggle) and refreshes<br>Then the service-error state is displayed. | R4 ("error state can be forced for tests and demo"); Decision 3 | - | C-05 | Manual | Must |
| AC-R4-06 | Given vehicles are loaded and forced failure is then switched on<br>When the manager selects "Refresh"<br>Then an error banner with Retry is shown, the existing rows stay visible and "Last refreshed" keeps the earlier time. | CR-17 (README Interactions 'Refresh'). Decision for the mockup's OPEN code comment | A-08 | C-24 | Component | Should |
| AC-R4-07 | Given the running app in a browser<br>When the reviewer switches to the empty-inventory scenario, or to a 25-minute data age, without changing code<br>Then the empty-inventory message, or the amber freshness indicator, is displayed. | CR-22 (README 'demo bar'). PROPOSED | A-18 | C-26 | Manual | Should |

R5 Data Freshness


| AC-R5-01 | Given a fixed clock and a successful load<br>When the dashboard finishes loading<br>Then a "Last refreshed" time equal to the load time is shown. | Brief: "real-time overview"; Decision 10 | A-08 | - | Component | Must |
|---|---|---|---|---|---|---|
| AC-R5-02 | Given the dashboard was loaded at time T1 and the clock is now T2<br>When the manager selects "Refresh"<br>Then vehicles are requested again and "Last refreshed" shows T2. | Brief: "real-time overview"; Decision 10 | A-08 | - | Component | Must |
| AC-R5-03 | Given last-refreshed ages of 14, 15, 59 and 60 minutes<br>When the freshness level is calculated<br>Then they map to normal, amber, amber and warning. | CR-17 (README s1). PROPOSED placeholders; OQ-11 | A-18 | C-24 | Unit | Should |
| AC-R5-04 | Given a fixed clock and a successful load 25 minutes ago<br>When the header is shown<br>Then "Last refreshed" shows the time and "25 min ago", marked amber. | CR-17. PROPOSED | A-18 | C-24 | Component | Should |
| AC-R5-05 | Given the data is 60 minutes old<br>When the dashboard is shown<br>Then a stale-data warning with "Refresh now" is shown above the summary. | CR-17 (README s2). PROPOSED | A-18 | C-24 | Component | Should |
| AC-R5-06 | Given reference date R<br>When the header is shown<br>Then "Reference date" shows R as DD-MMM-YYYY. | CR-17 (README s1). PROPOSED | A-02 | C-24 | Component | Should |

## Sheet: Open Questions

Open questions (ambiguities not covered by the decisions)



| ID | Req | Question | Why it is open / affected items |
|---|---|---|---|
| OQ-01 | R1 | Which fields does free-text search cover? AC-R1-03 assumes stock number, make and model. VIN is a candidate. | Decision 8 names "search" without fields. v4: the assessment now searches VIN as well (A-14, CR-01). Registration number and other identifiers are still open. |
| OQ-02 | R1 | Do make and model filters allow multiple selections, and does the model list narrow to the selected make? | Brief gives examples only; affects AC-R1-04/05/08. Assessment: the model list narrows to the selected make (C-17). Multiple selection is still open. |
| OQ-03 | R1 | Does "all vehicles in inventory" include sold, reserved or in-transit vehicles? | No decision on vehicle status. Mock contains in-stock vehicles only (design choice C-12) until answered. |
| OQ-04 | R2 | Which timezone defines a calendar day: dealership local time or the browser's? | Decision 5 fixes the rule, not the timezone. Assessment uses the browser's local date (A-16); production timezone is still open. Affects AC-R2-04. |
| OQ-05 | R2 | How should a vehicle with an invalid or future entry date appear to the manager (hidden, flagged as data issue, or shown as unknown)? | AC-R2-05/06 fix only the rule outcome. v4: the mockup shows these vehicles as Unknown with an issue tag and a Data issues view (C-25, CR-06). Production handling is still open. |
| OQ-06 | R2 | Is a row badge enough for "prominently display", or is a summary/aging-first view required? AC-R2-13 is Should; if it is dropped, prominence relies on the badge only. | Brief word "prominently" is not measurable. v4: the CR adds an age profile bar and richer summary cards (CR-10, CR-11, both Nice); whether the badge alone is enough is still open. |
| OQ-07 | R3 | Does "status" mean something different from "proposed action" (e.g. "Awaiting reconditioning")? What are the fixed list values? | Brief says "status or proposed action"; Decision 9 covers actions only. README states that one Action field covers both (README Draft #2); list values still open. v4: the mockup proposes five placeholder values (Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign, Under Review; C-28). Sign-off is still open. |
| OQ-08 | R3 | Does "log" require a history of actions with who/when, or only the current action? | Decision 9 keeps one current action; "log" may imply history. README states that log = save the current action (README Draft #1). |
| OQ-09 | R3 | Is there a maximum note length? | Decision 9 says optional note; no limit defined, so no criterion written. |
| OQ-10 | R5 | Is a manual refresh acceptable for "real-time", or is automatic refresh (polling/push) expected? | Decision 10 is an interpretation that a reviewer may challenge. README states the interpretation (README Draft #3). |
| OQ-11 | R5 | What freshness target applies to the dashboard (maximum acceptable data age), and does it require polling or server push? | REC-01. A-08 interprets "real-time" as manual refresh; the production path (E-09) depends on this answer. v4: the mockup adds placeholder thresholds of 15 and 60 minutes (A-18, C-24). |
| OQ-12 | R1 | What is the largest inventory per dealership and per group, and above what size must filtering and paging move to the server? | REC-04. Needed to state the threshold in the design document; no figure is assumed (A-11). v4: client-side paging up to 100 rows per page is adopted (C-20); the server threshold is still open. |
| OQ-13 | R3 | If a vehicle with a saved action stops being aging (for example, its entry date is corrected), should the action be kept, hidden or cleared? | Cannot happen in the mock: entry dates are fixed offsets from R (C-07, C-15). Can happen with real entry dates. Decision 9 allows actions only on aging vehicles. Listed in README Open Questions (README Draft #8). |
| OQ-14 | CR | Who raised the change request (the Vehicle Inventory Mockup and README handoff), and is it a Keyloop requirement or an own design input? | Decides whether the CR items are requirements (Must) or own initiative (Should / Nice). The CR Impact sheet assumes own design input. |
| OQ-15 | R2 | Is the early-warning window 7 days (days 84-90, summary card) or does the row tag start at day 80 as in the mockup? Should actions be allowed before day 91? | The mockup uses two thresholds (HTML SOON_WINDOW = 7 and SOON_FROM = 80). Plan uses one window (C-22, A-19). Actions stay aging-only (A-05). |
| OQ-16 | R3 | Are bulk actions expected? If yes, may a bulk save replace existing actions, and what happens when some vehicles fail to save? | Bulk apply is deferred (E-10). The forced-failure switch is all-or-nothing, so partial failure needs per-vehicle failure injection before any AC can be written. |
| OQ-17 | R3 | What follow-up cadence do managers use for an action (the mockup flags an action after 14 days)? | A-20 is a placeholder. Affects AC-R3-08 (Nice). |
| OQ-18 | R1 | Should sort order, page size and display density be remembered per user? | The mockup stores them in the browser; the plan does not (C-23, E-13). Production would store preferences per user on the server. |

## Sheet: Coverage

Coverage: brief phrase to acceptance criteria. Not covered: none.

Partial: "status" in R3 has no separate criterion until OQ-07 is answered (see A-07). CR items that are deferred or not built (E-10 to E-15) have no criteria. CR rows below are not part of the brief.


| Req | Brief phrase / scope | Covering criteria |
|---|---|---|
| R1 | "Display a filterable list of all vehicles in a dealership's inventory" | AC-R1-01, AC-R1-02, AC-R1-11 |
| R1 | "filter by make, model, age" | AC-R1-04, AC-R1-05, AC-R1-06, AC-R1-08, AC-R1-09, AC-R1-10 (scale threshold open: OQ-12) |
| R2 | "Automatically identify ... aging stock (vehicles in inventory for >90 days)" | AC-R2-01 to AC-R2-11 |
| R2 | "prominently display aging stock" | AC-R2-12 (Must), AC-R2-13 (Should) |
| R3 | "log ... a status or proposed action for each aging vehicle" | AC-R3-01, AC-R3-03, AC-R3-06 ("status" open: OQ-07) |
| R3 | "persist" | AC-R3-02 |
| R4 | Loading, empty, no-result, service-error states; error can be forced (user scope) | AC-R4-01 to AC-R4-05 |
| R5 | "real-time overview" | AC-R5-01, AC-R5-02 (freshness target open: OQ-11) |
| R1 | CR (not in the brief): VIN, action filter, paging, sorting | AC-R1-12 to AC-R1-20 (Should; AC-R1-19, AC-R1-20 are Nice) |
| R2 | CR (not in the brief): data issues, early warning, age profile | AC-R2-14 to AC-R2-19 (Should; AC-R2-17 to AC-R2-19 are Nice) |
| R3 | CR (not in the brief): action logged time, stale flag, error reference | AC-R3-07 to AC-R3-09 (Should; AC-R3-08 is Nice) |
| R4 | CR (not in the brief): refresh failure, reviewer switches | AC-R4-06, AC-R4-07 (Should) |
| R5 | CR (not in the brief): freshness levels, time ago, stale warning, reference date | AC-R5-03 to AC-R5-06 (Should; freshness target still open: OQ-11) |

## Sheet: Assumptions

Assumptions (interpretations of the brief). PROPOSED = from acceptance criteria, not from the decisions list.



| ID | Assumption | Why it is needed (which ambiguity it resolves) | Impact if wrong | How it would be validated in production | Linked AC IDs |
|---|---|---|---|---|---|
| A-01 | Aging stock = a vehicle in inventory for more than 90 complete calendar days. Exactly 90 days is not aging. [Decision 5] | Brief says ">90 days" but not whether the count is calendar or business days, whole days or elapsed hours, or how 90 itself is treated. | Vehicles are flagged one day early or late; aging counts and action eligibility differ from the dealership's own reports. | Confirm the rule with dealership managers and compare flags with the dealer management system's aging report for a sample of vehicles. | AC-R1-07, AC-R2-01, AC-R2-02, AC-R2-03, AC-R2-04, AC-R2-09, AC-R2-12 |
| A-02 | Age is measured against the current date when the dashboard is viewed (the reference date). [Decision 6] | Brief does not say "as of when". Options: today, last stock count, month end. | If the business measures age at month end or at stock count, daily figures will not match their reports. | Confirm the measurement point with business users; confirm whether month-end snapshots are also needed. | AC-R2-11 |
| A-03 | Days in stock is derived from the vehicle's stock entry date (date it entered the dealership's inventory). Age is not a stored value. [Decision 6] | Brief says "in inventory for" without naming a start event (purchase, delivery, ready-for-sale). | If the business counts from a different event (e.g. ready-for-sale date), every age and band shifts. | Confirm the start event and its source field in the dealer management system. | AC-R2-01, AC-R2-10, AC-R2-11 |
| A-04 | "Filter by age" means fixed age bands: 0-30, 31-60, 61-90, >90 days. [Decision 7] | Brief lists "age" as a filter example without a format (bands, range, minimum). | Bands may not match the dealership's standard buckets; managers may need a custom range. | Confirm band boundaries with managers; check existing aging reports for standard buckets. | AC-R1-06, AC-R2-07, AC-R2-08, AC-R2-09 |
| A-05 | A status or proposed action can be logged only for aging vehicles. [Decision 9] | Brief says "for each aging vehicle"; it is silent on non-aging vehicles. | Managers cannot plan action for vehicles about to reach 90 days. | Ask managers whether they act before day 91; review usage for requests on near-aging stock. | AC-R3-03 |
| A-06 | "Log" means recording the vehicle's one current action. A new save replaces the previous one; history is not kept. [Decision 9] | "Log and persist" can mean an append-only history or a current value. | No audit trail of who changed what and when; reviewer may read "log" as history. | Confirm whether audit history, ownership or approvals are required (compliance, management reporting). | AC-R3-01, AC-R3-06 |
| A-07 | "Status or proposed action" is one value chosen from a fixed list, plus an optional free-text note. [Decision 9] | Brief gives one example ("Price Reduction Planned") and does not say whether status and action are separate fields. | If status (e.g. "Awaiting reconditioning") is a separate concept, the data model needs two fields. | Workshop with managers to agree the list values and whether status and action are separate. | AC-R3-01, AC-R3-04 |
| A-08 | "Real-time overview" means the dashboard shows when data was last refreshed and offers a manual refresh. [Decision 10] | Brief says "real-time" without a freshness target or update mechanism. | If managers expect live updates, they may act on stale data (e.g. a vehicle already sold). | Agree a freshness target (maximum data age) with managers (OQ-11); measure how often source data changes. Production path: polling or server push (E-09), shown as Future on the architecture diagram. | AC-R5-01, AC-R5-02 |
| A-09 | The dashboard serves one dealership; the manager sees only that dealership's inventory. [Decision 4] | Brief says "a dealership's inventory" and "dealership managers" without saying whether a user can manage several. | Group or regional managers cannot view several sites; the assessment contract lacks a dealership parameter (future contract with dealership ID documented in the design document, E-05). | Confirm user roles and whether any role spans dealerships. | AC-R1-01 |
| A-10 | "Persist" means the saved action survives a page reload for the same user in the same browser. Sharing across users and devices is not required for the assessment. [Decision 3] | Brief says "persist" without scope (session, device, all users). | In production, other managers would not see the action; data is lost if browser storage is cleared. | Production uses server-side storage (see E-01); confirm who must see an action (same dealership, all managers). | AC-R3-02 |
| A-11 | About 200 vehicles is a representative inventory size for one dealership for demonstration. It is not a capacity target. [Decision 4] | Brief says "all vehicles" without a volume. | Larger dealerships or groups may need paging and server-side filtering; the UI is not proven at that scale. | Obtain actual stock counts per dealership and group (OQ-12); set a performance target for the largest site; move filtering and paging to the server above the agreed size (future contract, E-05). | AC-R1-01, AC-R2-10 |
| A-12 | PROPOSED: a vehicle with an invalid or future entry date has unknown age and is not treated as aging. The mockup shows such a vehicle as Unknown with an issue tag and a Data issues view [CR-06, C-25]. | Brief does not cover bad data; decisions require safe handling but do not state the outcome. | Real aging vehicles with bad data are hidden from the aging view. | Measure data quality in the source system; agree how data errors are shown to managers (OQ-05). | AC-R2-05, AC-R2-06, AC-R2-14, AC-R2-15, AC-R2-16 |
| A-13 | PROPOSED: filters combine with AND; clearing filters resets all of them. The mockup's summary card, Data issues link and preset views replace the current filters rather than add to them (C-29). | Brief says "filterable" without saying how filters combine. | Low impact; managers may expect multi-select within one filter (OQ-02). | Usability check with managers. | AC-R1-08, AC-R1-09 |
| A-14 | PROPOSED: free-text search matches stock number, VIN, make and model (case-insensitive). [v4: VIN added, CR-01] | Decision 8 names "search" without fields. | Managers may search by VIN or registration and find nothing. | Confirm the identifiers managers use day to day (OQ-01). | AC-R1-03, AC-R1-13 |
| A-15 | PROPOSED: saving requires an action to be selected; the note alone is not enough. | Decision 9 makes the note optional but does not say whether the action is required. | Low impact; managers may want to leave only a note. | Usability check with managers. | AC-R3-04 |
| A-16 | PROPOSED: a calendar day is the browser's local date. Entry date and reference date are both reduced to the local start of day before counting; time of day is ignored. | Decision 5 says "complete calendar days" but not which timezone or when a day starts (OQ-04). | A vehicle at the 90/91-day boundary can show a different aging status for a user in another timezone from the dealership. | Confirm whether dealership local time should govern (OQ-04). In production, compute age on the server in the dealership's timezone. | AC-R2-04, AC-R2-11 |
| A-17 | PROPOSED: the action filter "No action yet" returns aging vehicles that have no current action; "Has an action" returns any vehicle with a current action. [CR-02] | The brief and decisions do not define an action filter. The mockup limits "No action yet" to aging vehicles because only aging vehicles can have an action (A-05). | Managers may expect non-aging vehicles under "No action yet". | Usability check with managers. | AC-R1-14, AC-R1-15 |
| A-18 | PROPOSED: data freshness is shown as time since the last refresh: normal under 15 minutes, amber from 15, warning from 60. The values are placeholders. [CR-17] | Extends A-08. The mockup flags old data but no freshness target is agreed. | Thresholds look like requirements; managers may act on data they consider stale or fresh. | Agree a maximum data age (OQ-11); keep the values as named constants. | AC-R4-07, AC-R5-03, AC-R5-04, AC-R5-05 |
| A-19 | PROPOSED: "turning aging soon" means 7 days or fewer before the threshold (days 84-90). It is informational: actions stay limited to aging vehicles (A-05). [CR-09] | The mockup uses day 84 for its summary card and day 80 for a row tag. One window is needed. | A different window changes the card count and preset; users may expect to act before day 91. | Confirm the window and whether early action is wanted (OQ-15). | AC-R2-17, AC-R2-18 |
| A-20 | PROPOSED: a saved action carries the time it was logged. "Logged N days ago" counts calendar days like days in stock; an action older than 14 days is flagged "check progress" (placeholder). [CR-07, CR-08] | D13 allowed a timestamp "if feasible". The mockup shows it and flags old actions. | Managers may use a different review cadence; the flag may be noise or may be missed. | Ask managers for the follow-up cadence (OQ-17). | AC-R3-07, AC-R3-08 |
| A-21 | PROPOSED: a VIN is an opaque 17-character text value used for display and search only. The app does not validate or decode it. The mock VINs are fake. [CR-01] | The brief names no VIN; the mockup shows and searches it. | Real VINs may be missing or malformed; searches by partial VIN may match several vehicles. | Confirm the source field and its data quality in the dealer management system. | AC-R1-12, AC-R1-13 |

## Sheet: Exclusions

Exclusions



| ID | Excluded item | Reason | Where it would live in a future production design |
|---|---|---|---|
| E-01 | Real backend API and database | The brief allows one layer to be implemented and the other mocked; the frontend was chosen (Decision 1). | Inventory API behind the same InventoryService contract (HTTP adapter replaces the mock adapter); durable server-side database for vehicles and actions. |
| E-02 | Authentication and authorization | Not named in the brief; a mocked backend cannot enforce access control. | Identity provider sign-in in the frontend; role and dealership checks enforced by the API, not the UI. |
| E-03 | Deployment and CI/CD | Not required by the brief; the deliverable is a repository that runs locally. | Pipeline running lint, tests and build on each commit; static hosting for the frontend; separate API deployment. |
| E-04 | Microservices | One bounded capability (inventory and actions) does not justify service decomposition. | Start as one inventory service; split only if action workflow or integrations grow independently. |
| E-05 | Multi-dealership support | Single dealership assumed (A-09, Decision 4). | Future API contract documented in the design document: dealership ID, filter parameters (search, make, model, age band, aging-only) and paging on the inventory query; access scoped per dealership by the API. Shown as Future on the architecture diagram. |
| E-06 | Action history and approvals | One current action per vehicle (A-06, Decision 9). | Append-only action records (who, when, previous value) in the API; approval workflow if the business requires it. |
| E-07 | Full end-to-end test suite | Time-boxed assessment; unit and component tests plus one manual check cover the acceptance criteria. | Browser end-to-end tests for core journeys run in the pipeline against a test environment. |
| E-08 | Production telemetry (centralized logs, metrics, tracing, alerting) | No backend or hosting to send data to; the prototype has at most local logging hooks (C-11, Should). | Frontend telemetry SDK sending errors and timings to a central monitoring service; correlation ID passed from UI to API traces. |
| E-09 | True push or live real-time updates | Manual refresh used as the "real-time" interpretation (A-08, Decision 10). | API-driven polling or server push (e.g. WebSocket or server-sent events) when inventory or actions change; mechanism chosen against the freshness target (OQ-11). Shown as Future on the architecture diagram. |
| E-10 | Bulk select and bulk apply of actions (CR-14) | Not in the brief. Needs selection state, a select-all-in-list control, replace-existing warnings and partial-failure handling. Plan row 4.25 is Dropped (2.5 h). | Batch endpoint returning a result per vehicle; confirmation before replacing existing actions; one audit entry per vehicle (E-06). |
| E-11 | Undo of a saved action (CR-15) | Needs a timed toast and a clear-action path that the InventoryService contract does not have. Plan row 4.26 is Dropped (0.5 h). | Server-side action history with revert (E-06). |
| E-12 | CSV export and print layout (CR-18, CR-19) | Not required by the brief. Export of all filtered rows and an A4 print stylesheet add layout and test effort. Plan row 4.27 (CSV) is Dropped (0.5 h). | Server-generated export that applies the same filters and permission checks; reporting. |
| E-13 | Saved views, density toggle and remembered UI preferences (CR-13, CR-20, CR-21) | Only saved actions persist (C-23). Saved views and remembered sort, page and density add a persistence surface to version and test. | Per-user preferences stored by the API. |
| E-14 | Tablet and mobile layouts (CR-26) | D20 limits the responsive scope to laptop width. Below 1340 px the table scrolls horizontally (C-27). | Responsive redesign after user research. |
| E-15 | Mockup-only elements (CR-24, CR-30) | Demo bar as product UI, notes cards, requirement-ID overlay and the 320 ms 'Updating results' overlay. The README says not to ship the first three; the overlay is artificial delay on client-side filtering and conflicts with D19 (no performance claims). | None. |

## Sheet: Design Choices

Design choices that affect scope (how it is built, not what the brief means)



| ID | Design choice | Source | Linked AC IDs |
|---|---|---|---|
| C-01 | Frontend implemented in full; backend mocked. | Decision 1 | None (no behavioural AC) |
| C-02 | React + TypeScript + Vite; Vitest + React Testing Library. | Decision 2 | None (no behavioural AC) |
| C-03 | UI depends only on InventoryService (getVehicles, updateVehicleAction). | Decision 3 | AC-R1-01 |
| C-04 | Mock adapter uses local storage, simulated delay and a forced-failure switch. | Decision 3 | AC-R3-02, AC-R3-05, AC-R4-01, AC-R4-04 |
| C-05 | Forced failure can be switched on in the running app without a code change. | AC-R4-05 (PROPOSED) | AC-R4-05 |
| C-06 | About 200 deterministic generated vehicles (fixed seed for non-date attributes). | Decision 4 | AC-R2-10 |
| C-07 | Mock entry dates are generated as offsets from the reference date and include 89/90/91-day records. | Decision 6 | AC-R2-10 |
| C-08 | Reference date is injected: today at runtime, a fixed date in tests. | Decision 6 | AC-R2-11 |
| C-09 | Aging and filter logic are pure functions in a non-React core module. | Decision 11 | AC-R1-03 to AC-R1-08, AC-R2-01 to AC-R2-09 |
| C-10 | Filtering and paging run on the client over the full list returned by getVehicles. Server-side filtering and paging are documented as the future contract (E-05), not built. [v4: paging is built client-side, C-20] | D19; consequence of C-03 | AC-R1-03 to AC-R1-08 |
| C-11 | Observability hooks: logging wrapper, error boundary, service-call correlation ID (Should; design-only if dropped). v4: the correlation ID also appears in error messages (AC-R3-09, CR-29); if the hooks are dropped, the Ref text is dropped. | D17 | None (no behavioural AC) |
| C-12 | Mock data contains in-stock vehicles only; sold, reserved and in-transit vehicles are not generated. | OQ-03 (pending answer) | AC-R1-01 |
| C-13 | Each list row shows stock number, VIN, make, model, entry date (DD-MMM-YYYY), days in stock, status (aging badge, due-soon tag or data-issue tag) and current action. [v4: VIN, date format and issue tag, CR-01, CR-06, CR-32] | AC-R1-02 (PROPOSED), AC-R2-12, WBS 4.4 | AC-R1-02, AC-R1-12, AC-R2-12, AC-R2-15 |
| C-14 | Dashboard summary above the list shows total vehicles, aging count and aging vehicles with an action (Should; first item dropped if behind). v4: Nice upgrade adds aging share % and an actioned meter (CR-10). | AC-R2-13 (PROPOSED), WBS 4.6 | AC-R2-13 |
| C-15 | Mock persistence stores only actions (action and note), keyed by stable vehicle ID. Vehicles are regenerated from offsets on every load, so ages always follow the reference date. | Decisions 3, 6; design review 7-Oct (#6) | AC-R2-10, AC-R3-02 |
| C-16 | Action save is pessimistic: the row changes only after updateVehicleAction succeeds. While saving, the save control is disabled and shows a saving state. On failure, an inline error with Retry is shown and the previous action is kept. Saving state and Retry are checked manually in WBS 4.7 (no separate AC). | Decision 3 (forced failure); design review 7-Oct (#10) | AC-R3-01, AC-R3-05 |
| C-17 | Model options depend on the selected make; all models are shown when no make is selected. Changing the make clears a model that no longer fits (checked manually in WBS 4.5). | Decision 8; design review 7-Oct (#5); partly answers OQ-02 | AC-R1-05, AC-R1-10 |
| C-18 | Without a sort selected, the list is shown in a fixed order by vehicle ID, so results are stable between refreshes and tests. [v4: optional column sorting (Nice, CR-05) overrides this order for the session: unknown values last, ties by vehicle ID, not persisted. If sorting is dropped, the v3 wording applies: sorting is out of scope.] | Design review 7-Oct (#9); CR-05; D32 | AC-R1-11, AC-R1-19, AC-R1-20 |
| C-19 | Filter combinations that can never match (for example aging-only with band 0-30) are allowed. The no-results state with Clear filters is shown; options are not disabled. | Decision 8; design review 7-Oct (#4) | AC-R1-09, AC-R4-03 |
| C-20 | Pagination is client-side: page sizes 10, 20, 50 and 100 (default 20); first, previous, numbered, next and last buttons; the page resets to 1 when a filter changes and is clamped when results shrink; page and page size are not persisted. Go-to-page is not built. | CR-03; D31 (revises D19) | AC-R1-01, AC-R1-16, AC-R1-17, AC-R1-18 |
| C-21 | Core module extended with pure functions: search over stock number, VIN, make and model; action filter; entry-date issue classification; paginate; freshness level. If built: sortRows and the early-warning rule. | CR-01, CR-02, CR-03, CR-06, CR-17; Decision 11 | AC-R1-03, AC-R1-13 to AC-R1-16, AC-R1-19, AC-R2-14, AC-R2-17, AC-R5-03 |
| C-22 | One early-warning window constant (7 days, days 84-90) drives the summary card, the 'Due in N days' row tag and the preset. The mockup's separate day-80 tag is not adopted. Nice. | CR-09; D33 | AC-R2-17, AC-R2-18 |
| C-23 | Only saved actions persist (C-15). Sort, page, page size, density and saved views are not persisted. The mockup stores four more localStorage keys; they are not adopted. | CR-21; D34 | AC-R3-02 (unchanged) |
| C-24 | Freshness: named constants (15 and 60 minutes, placeholders); freshness level is a pure function; the header shows reference date, last-refreshed time and time ago; a warning banner with Refresh now appears from 60 minutes. A failed refresh keeps the last data and shows a banner with Retry; a failed first load shows the error state (AC-R4-04). | CR-17; D37 | AC-R4-06, AC-R5-03, AC-R5-04, AC-R5-05, AC-R5-06 |
| C-25 | Data issues: missing, invalid and future entry dates show 'Unknown' days and an issue tag, are not counted as aging, and appear under a Data issues link and preset. Mock data contains one of each. | CR-06; D38; answers OQ-05 for the assessment | AC-R2-14, AC-R2-15, AC-R2-16 |
| C-26 | Reviewer switches live in the mock layer: forced failure (C-05), empty inventory and data age, set by URL parameter or a dev-only panel kept out of the product UI. Sample actions are seeded only in demo mode. The requirement-ID overlay is not built. PROPOSED. | CR-22, CR-23; D39 | AC-R4-05, AC-R4-07 |
| C-27 | Visual layer: CSS variables from the CR token table, Manrope / Inter / IBM Plex Mono, maximum width 1440 px, fixed table columns with minimum width 1200 px and horizontal scroll below 1340 px, blue focus ring (the mockup's leftover cyan rings are not copied). | CR-25, CR-26; D40; E-14 | None (no behavioural AC) |
| C-28 | Action model: currentAction = { action, note?, loggedAt }; one current action per vehicle (A-06); fixed list of five placeholder values (Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign, Under Review). Partly answers OQ-07. | CR-07, CR-28; A-06, A-07 | AC-R3-01, AC-R3-06, AC-R3-07 |
| C-29 | Quick views (summary card, Data issues link, age band click, preset views) set the complete filter set and replace the current filters. Filters still combine with AND (A-13). | CR-09, CR-11, CR-12; A-13 | AC-R2-18, AC-R2-19 |
| C-30 | Action entry stays in the dialog from wireframe 3.1. The mockup's inline editor row is not adopted; fields, validation and failure behaviour are the same. | CR-31; D30 | AC-R3-01, AC-R3-04, AC-R3-05 |

## Sheet: Challenge

Challenge (registers are not changed by these recommendations)



| Question | Answer | Why | Note |
|---|---|---|---|
| Q1. Weakest assumption | A-08 ("real-time" = manual refresh) | It is the only assumption that narrows a word in the brief's task statement rather than filling a gap. With a single-user mock, a refresh returns the same data, so the demo cannot show freshness. A reviewer is likely to ask why there is no automatic update. | Runner-up: A-07. The brief says "status or proposed action"; merging them into one list is defensible but may be read as skipping "status". v4: the CR adds time-ago text, thresholds and a data-age switch (CR-17, D37), which make A-08 visible in the demo without waiting. |
| Q2. Exclusion at risk | E-05 (multi-dealership), combined with C-03/C-10 | "Build for the Future" names scalability. getVehicles() takes no dealership, filter or paging parameters, and filtering runs on the client. Excluding multi-dealership is fine; a contract that cannot add it without breaking callers looks like a scalability gap. | E-08 is second: if 4.10 is dropped, observability is design-only in the implemented layer, which the brief asks the implementation to consider. |
| Q3. Scope risk from the CR | Adopting the mockup as specified (CR Impact, 32 items) | The mockup goes beyond the brief on about a dozen items. Adopted items add 13.75 h to a 33.25 h plan and the Friday to Tuesday plan keeps about 0.25 h spare (Plan v5, CR Plan sheet). The plan's own decisions (D15, D23) say the evaluation values AI verification and communication, which the extras do not improve. | Mitigation: tiering (Should / Nice / Defer), CR Nice dropped first at the Saturday gate, deferred items kept as Dropped plan rows. Open: who raised the CR (OQ-14). |

Recommendations (not applied)


| ID | Relates to | Recommendation | Status |
|---|---|---|---|
| REC-01 | A-08 | In the design doc, state a freshness target as an open question, and show the production path (polling interval or server push, E-09) on the architecture diagram as Future. | Applied (v2) |
| REC-02 | A-08 | In the video, say plainly that real-time is interpreted as visible freshness plus manual refresh, before a reviewer asks. | Applied (v2) |
| REC-03 | A-07 | Make the fixed list contain both status-type and action-type values, or state why one list is enough (OQ-07). | Partly applied (v3): README states one Action field covers status (README Draft #2). List values still pending (OQ-07). |
| REC-04 | E-05 | Design doc: show the future API contract with dealership ID, filters and paging, and explain at what volume filtering moves to the server. | Applied (v2) |
| REC-05 | E-05 | Decision change to consider (not applied): add an optional query object to getVehicles now. Cost is low; it removes the contract gap. Your call. | Not applied: changes Decision 3, your call v4: the CR keeps paging and sorting on the client (C-20). If applied, the query object should carry page, page size and sort. |
| REC-06 | E-08 | Promote error boundary and logging wrapper from Should to Must so the implemented layer always shows observability. | Not applied: decision pending v4: the mockup shows the correlation ID in error messages (AC-R3-09), which depends on WBS 4.10. |
| REC-07 | CR Impact | Tier the CR (Adopt, Adopt gated, Defer, Not built) instead of building the mockup as specified. | Applied (v4): CR Impact sheet and Plan v5 CR Plan sheet |
| REC-08 | E-15 | Do not build the 320 ms 'Updating results' overlay: it is artificial delay that contradicts D19 and slows tests. | Applied (v4): E-15 |
| REC-09 | C-22 | Use one early-warning window (7 days) instead of the mockup's two thresholds. | Applied (v4): C-22 (Nice) |
| REC-10 | C-23 | Do not persist sort, page, page size, density or views; only actions persist. | Applied (v4): C-23 |
| REC-11 | E-10 | If bulk apply is ever reinstated, add per-vehicle failure injection to the mock adapter and write partial-failure criteria first. | Not applied: bulk is deferred (E-10) |

## Sheet: Task DoD

Task-level Definition of Done (every WBS task; scoping in DoD Realism)



| ID | Item | Check (yes / no) | Note | Evidence | Done (Y/N) |
|---|---|---|---|---|---|
| T-01 | Tests | Every test for the behaviour this task touches passes (npm test). New behaviour has at least one test, or the commit body says "No test: <reason>". | Applies to code tasks. | Test run output |  |
| T-02 | Lint | npm run lint reports 0 errors. | Warnings allowed; errors are not. | Lint output |  |
| T-03 | Build | npm run build completes without type or build errors. | Vite build includes TypeScript type check (tsc -b). | Build output |  |
| T-04 | Commit | Work is committed with a message in this format: type(scope): imperative summary, max 72 characters, WBS ID in the body.<br>Types: feat, fix, test, docs, refactor, chore.<br>Examples: feat(filters): add age-band filter \| test(aging): cover 89/90/91-day boundaries \| fix(actions): keep previous action when save fails | One WBS task per commit (a task may have several commits; a commit never spans two tasks). | git log |  |
| T-05 | AI log | If AI was used: an AI log entry exists with Task, What I asked, What AI produced, Accepted / rejected, How I verified, Correction made (or "None"). | Not applicable if AI was not used. Written at the time, not at the end. | docs/ai-log.md entry |  |
| T-06 | Ownership | I can explain every line in the diff I commit. Any line I cannot explain is rewritten or removed before committing. | Excludes lockfile and untouched scaffold files. | Self-check before commit |  |
| T-07 | Exit criteria | The WBS exit criteria for this task are met, and every linked acceptance criterion (AC ID) has been checked. | Exit criteria come from the WBS sheet of the planning workbook; AC IDs from the Acceptance Criteria sheet. | WBS Notes / Evidence column |  |
| T-08 | Clean diff | The diff contains no secrets, no leftover debug console.log, and no commented-out code. | The logging wrapper (C-11) is allowed; ad-hoc console.log is not. | Diff review |  |


| Done | 0 of 8 |
|---|---|

## Sheet: Release DoD

Release-level Definition of Done (final submission)



| ID | Deliverable | Check (yes / no) | Source | Done (Y/N) |
|---|---|---|---|---|
| RL-01 | 1. System design document | /docs/system-design.md contains all six sections the brief lists: architecture diagram, component roles, data flow, technologies with justifications, observability strategy, GenAI in the design phase. | Brief Part 1 |  |
| RL-02 | 1. System design document | The design document includes the assumptions, exclusions and open questions; every component not built is labelled Future; the diagram shows the future freshness path (polling or push, E-09) and the future API contract with dealership ID, filters and paging (E-05). CR: deferred items (E-10 to E-13) are labelled Future. | Brief: "document it in your System Design Document"; Assumptions, Exclusions, Open Questions sheets; REC-01, REC-04 |  |
| RL-03 | 2. Working code | A fresh clone installs, runs, passes tests and builds by following the README only. | WBS 7.3 |  |
| RL-04 | 2. Working code | Every Must acceptance criterion is verified: Unit and Component criteria by passing tests, the Manual criterion by one recorded check. CR Should criteria (24, of which 6 are Nice) are checked only for items that were built; criteria of dropped items are marked not applicable. | Acceptance Criteria sheet (36 Must: 19 Unit, 16 Component, 1 Manual) |  |
| RL-05 | 2. Working code | README covers overview, run, test and build commands, an "Assumptions and Interpretations" section taken from the README Draft sheet, limitations, and links to the design document. It also states the reviewer switches and what is saved in the browser. | WBS 7.1; README Draft sheet (design review 7-Oct; CR 8-Oct (#9-#15)) |  |
| RL-06 | 2. Working code | The AI Collaboration Narrative in the README uses only real AI log entries and describes at least one corrected or rejected suggestion. | WBS 7.1, D16 |  |
| RL-07 | 2. Working code | The repository is reachable by the reviewer (public, or reviewers added) and contains no secrets. | WBS 1.1, 7.2 |  |
| RL-08 | 3. Video | Video is within the required length and shows: scenario, design, filters, aging badge, saving an action, persistence after reload, and the AI collaboration story; it states that "real-time" is interpreted as last-refreshed time plus manual refresh (A-08). If built: pagination, the freshness indicator and a data-issue row are shown. | Length 5-10 min is from the plan; brief text for the video was not provided here: To be validated; REC-02 |  |
| RL-09 | 3. Video | The video link opens in a private browser window without an access request. | WBS 8.4 |  |
| RL-10 | All | The submission email with repository, design-document and video links is sent before the confirmed deadline. | WBS 9.1 |  |


| Done | 0 of 10 |
|---|---|

## Sheet: DoD Example

How DoD items apply to WBS 4.3, 4.7 and 5.3



| WBS task | DoD item | What "done" means for this task | Evidence |
|---|---|---|---|
| 4.3 Implement aging logic | T-01 Tests | Only AC-R2 unit tests that exist so far must pass. 4.3 and 5.1 run on the same day, so commit the boundary tests (89/90/91, invalid, future) with the logic or straight after it. | npm test: aging tests green with fixed reference date |
| 4.3 Implement aging logic | T-04 Commit | feat(aging): add days-in-stock, aging flag and age band<br><br>WBS 4.3 | git log |
| 4.7 Action logging workflow | T-01 Tests | Component tests are written in 5.3, so for 4.7: existing tests stay green, and AC-R3-01/02/03 are checked by hand once (save, reload, no action on a 90-day vehicle). Commit body says "No test: covered in 5.3". | Manual check noted in WBS Evidence |
| 4.7 Action logging workflow | T-05 AI log | If AI drafted the form: entry records what it produced, what was rejected (e.g. extra dependency or free-text action), how it was verified (manual save and reload), and the correction. | docs/ai-log.md |
| 5.3 Action workflow tests | T-06 Ownership | I can explain each test's setup, user action and assertion. Proof: break the save path on purpose and the AC-R3-05 test fails; restore it and the test passes. | AI log: deliberate-failure result |

## Sheet: DoD Realism

Unrealistic items for a time-boxed solo assessment, with leaner alternatives



| DoD item | Why it is unrealistic | Leaner alternative |
|---|---|---|
| T-01 Tests for UI tasks (4.4-4.8) | Component tests are scheduled in 5.3, after the UI tasks. "New behaviour has a test" cannot be met on Saturday without moving test time forward. | For 4.x UI tasks: existing tests pass + one manual check of linked AC IDs; write "No test: covered in 5.3" in the commit body. Full T-01 applies again from 5.3. |
| T-03 Build on every task | Not needed for docs-only, video and planning tasks. | Run lint and build only on commits that change code or config. |
| T-04 / T-08 for non-repo tasks | Tasks 1.1, 8.x and 9.1 produce no commit. | DoD for non-repo tasks = T-05 (if AI used) + T-07 only. |
| T-05 Full six-field AI log entry for every AI use | Writing six fields for small requests (e.g. one-line syntax help) takes longer than the request. Likely to be skipped under time pressure, which then breaks D16. | Full entry when AI output is committed, rejected or corrected. For small help, one line: task, what I asked, accepted/rejected. Never fewer than the 4.7, 5.1 and 5.3 entries the WBS requires. |
| T-06 Explain every line | Applied literally to scaffold, config files and the lockfile, this takes hours with little value. | Scope to source, tests and config I changed. Review the scaffold once during 5.4. |
| RL-04 Every Must AC verified (36) | 16 Must component criteria (17 including the Should AC-R2-13) against 2.25 h for WBS 5.3. High risk of a rushed or skipped Sunday. | Automate all Unit Musts. For Component Musts, automate R3 and R4; check the rest manually once. Any AC moved to a manual check must have its Test level changed to Manual in the Acceptance Criteria sheet, so RL-04 stays true. Decide at the Saturday gate. |
| CR Should criteria (24) | 9 Unit, 14 Component and 1 Manual criteria were added by the CR. WBS 5.6 (0.75 h) and 5.7 (0.75 h) cover them. Ten Component criteria in 0.75 h is not realistic if each needs a stateful test (clock, paging, forced failure). | Automate the pure-function Units (5.6). For Components, automate AC-R1-17, AC-R1-18, AC-R3-09 and AC-R4-06; check the rest once by hand. Change the Test level of any moved criterion to Manual. Nice criteria (AC-R1-19, AC-R1-20, AC-R2-17, AC-R2-18, AC-R2-19, AC-R3-08) are tested only if the item is built. |

## Sheet: README Draft

README Draft: "Assumptions and Interpretations" section (paste into README before submission; RL-05)

Wording only; no code impact. Change a line if the build differs (for example, Clear filters or model list behaviour). v4 (CR, 8-Oct): #2, #3 and #7 updated; #9 to #15 added.


| # | README heading | README text | Linked IDs |
|---|---|---|---|
| 1 | Interpretation of the brief | "Log" an action (R3). In this build, "log" means saving the current action for each aging vehicle. Each vehicle has one action. A new action replaces the old one. A history of past actions is out of scope (see Future). | A-06, OQ-08, E-06 |
| 2 | Interpretation of the brief | "Status or proposed action" (R3). One field, Action, covers both. The manager picks one value from a fixed list and can add an optional note. Placeholder values: Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign, Under Review. | A-07, OQ-07, REC-03 |
| 3 | Interpretation of the brief | "Real-time overview." The dashboard shows a Last refreshed time and a Refresh button. It does not push live updates. The update method (polling or server push) depends on a freshness target that is not yet agreed (see Open Questions). The header also shows how long ago the data was refreshed: amber after 15 minutes and a warning after 60. These values are placeholders. | A-08, OQ-10, OQ-11, E-09 |
| 4 | Filter behaviour | Filters combine with AND. A vehicle must match every active filter. | A-13 |
| 5 | Filter behaviour | Aging-only and age bands. These two filters can both be on. Some combinations can never match, for example Aging-only with the 0-30 band. In that case the list shows an empty state with a Clear filters option. I chose this over disabling options, to keep the filter logic simple and predictable. | C-19, AC-R4-03 |
| 6 | Filter behaviour | Make and model. The Model list shows only models for the selected Make. When no Make is selected, it shows all models. Changing the Make clears a Model that no longer fits. | C-17, AC-R1-10 |
| 7 | Display order | Vehicles appear in a fixed order by vehicle ID, so the list stays the same between refreshes and tests are repeatable. This is not a sorting feature. Sorting is out of scope. If column sorting is built, clicking a header sorts the list for the current session and a third click returns to vehicle ID order. [If sorting is dropped, use instead: "This is not a sorting feature. Sorting is out of scope."] | C-18, AC-R1-11 |
| 8 | Open Questions | An action on a vehicle that is no longer aging. Actions are allowed only on aging vehicles. In the mock, entry dates are offsets from the reference date, so a vehicle's aging status never changes and this case cannot happen. With real entry dates it could happen, for example if an entry date is corrected. The rule for it (keep, hide or clear the action) should be agreed with the business before a real backend is built. | OQ-13 |
| 9 | Search | Search. The search box matches stock number, VIN, make and model (case-insensitive). Other identifiers, such as a registration number, are not searched. | A-14, A-21, OQ-01 |
| 10 | Paging | Paging. The list shows 20 vehicles per page; the page size can be changed to 10, 50 or 100, and a filter change returns to page 1. Paging runs in the browser over about 200 demonstration vehicles. It is not a performance claim; server-side paging is a future change. | C-20, A-11, E-05, AC-R1-17 |
| 11 | Data quality | Vehicles with unusable dates. A vehicle with a missing, invalid or future entry date shows "Unknown" days in stock and an issue tag, is not counted as aging and can be listed with the Data issues link. The demo data contains three such vehicles on purpose. | A-12, C-25, OQ-05 |
| 12 | Early warning (if built) | Turning aging soon. A card and a tag show vehicles that will pass 90 days within 7 days (days 84 to 90). This is a visual cue only; actions are still limited to aging vehicles. | A-19, C-22, OQ-15 |
| 13 | Reviewer switches | Reviewer switches. Forced failure, an empty inventory and an old data age can be switched on without changing code (see the run instructions for the exact switches, to be confirmed in WBS 4.14). Sample actions are loaded only in demo mode. | C-26, AC-R4-05, AC-R4-07 |
| 14 | Saved data | What is saved. Only the saved action and note are stored in the browser. Sort order, page size and filters are not remembered after a reload. | C-23, A-10, E-13 |
| 15 | Future improvements | Not built. Bulk actions, undo, CSV export, print layout and saved views were considered and left out to keep the action model and service contract simple. They are listed under future improvements. | E-10 to E-13 |

## Sheet: Consistency Log

v1: consistency fixes applied during the merge



| # | Sheet / item | Before | After | Why |
|---|---|---|---|---|
| 1 | Assumptions A-01 | Linked ACs omitted AC-R1-07 | AC-R1-07 added | Aging-only filter applies the >90-day rule. |
| 2 | Assumptions A-11 | AC-R2-10, AC-R1-01 | AC-R1-01, AC-R2-10 | ID order made consistent with other rows. |
| 3 | Open Questions OQ-03 / Design Choices | OQ-03 said "mock assumes in-stock only" but no register entry existed | Recorded as design choice C-12; OQ-03 points to it | An open question must not hide an unregistered assumption. |
| 4 | Design Choices | AC-R2-13 PROPOSED summary indicator had no register entry | Added as C-14 | Found by the PROPOSED-trace validation check. |
| 5 | Design Choices | AC-R1-02 PROPOSED column set had no register entry | Added as C-13 | Every PROPOSED item in the AC sheet now traces to an A or C entry. |
| 6 | Design Choices | No Linked AC IDs column | Linked AC IDs column added | Two-way traceability between ACs and design choices. |
| 7 | Exclusions E-07 | "unit and component tests cover the acceptance criteria" | "... plus one manual check ..." | AC-R4-05 is Manual. |
| 8 | Exclusions E-08 | Referenced D17 (planning workbook ID) | References C-11 | Use IDs that exist in this workbook. |
| 9 | Challenge recommendations | R-01 to R-06 | REC-01 to REC-06 | "R-01" was easy to confuse with requirement groups R1-R5. |
| 10 | Task DoD T-07 / T-08 | Referred to "the AC workbook" and D17 | Refer to Acceptance Criteria sheet and C-11 | Files merged into one workbook. |
| 11 | Release DoD RL-02 / RL-04 | Sources "register A/B" and "AC workbook" | Point to sheets in this workbook, with Must breakdown | Files merged. |
| 12 | Realism Review RL-04 | "17 component criteria"; downgrade path did not update AC Test level | 16 Must component (17 incl. Should); downgrade must update Test level | Count corrected; keeps RL-04 and the AC sheet in step. |
| 13 | Acceptance Criteria | No link to assumptions or design choices | Columns "Linked assumptions" and "Linked design choices" added (derived from register links) | Two-way traceability. |

v2 changes: REC-01, REC-02, REC-04 applied


| # | Recommendation | Sheet / item | Before | After |
|---|---|---|---|---|
| 1 | REC-01 | Open Questions | OQ-01 to OQ-10 | OQ-11 added: freshness target and update mechanism |
| 2 | REC-04 | Open Questions | - | OQ-12 added: inventory size threshold for server-side filtering (no figure invented) |
| 3 | REC-01 | Assumptions A-08 | Validation did not reference an open question or the diagram | Links OQ-11 and E-09; diagram shows the path as Future |
| 4 | REC-04 | Assumptions A-09 | "the service contract lacks a dealership parameter" | Adds pointer to the future contract in the design document (E-05) |
| 5 | REC-04 | Assumptions A-11 | No threshold question or server-side path | Links OQ-12 and the future contract (E-05) |
| 6 | REC-04 | Exclusions E-05 | Dealership ID in the API contract and data model | Adds filter and paging parameters; documented in the design doc; shown as Future |
| 7 | REC-01 | Exclusions E-09 | No link to the freshness target or the diagram | Links OQ-11; shown as Future on the diagram |
| 8 | REC-04 | Design Choices C-10 | Client-side filtering only | States that server-side filtering is a documented future contract, not built |
| 9 | REC-01 / REC-04 | Release DoD RL-02 | Assumptions, exclusions, open questions, Future labels | Adds the future freshness path and future API contract as checkable content |
| 10 | REC-02 | Release DoD RL-08 | No statement of the real-time interpretation | Video must state the A-08 interpretation |
| 11 | REC-01 / REC-04 | Coverage | No pointer to new open questions | R5 row links OQ-11; filter row links OQ-12 |
| 12 | All | Challenge | Recommendations had no status | Status column added |

v3 changes: design review 7-Oct (conflicts #1-#10)


| # | Source | Sheet / item | Before | After |
|---|---|---|---|---|
| 1 | #4 aging-only overlap | Design Choices | - | C-19 added: impossible combinations allowed; no-results state shown. AC-R4-03 linked |
| 2 | #5 make/model | Design Choices; Acceptance Criteria | - | C-17 added; AC-R1-10 added (Unit, Must); OQ-02 partly answered |
| 3 | #6 persistence | Design Choices | - | C-15 added: store actions only, keyed by vehicle ID; linked to AC-R2-10, AC-R3-02 |
| 4 | #7 day start | Assumptions; Open Questions | OQ-04 open, no assessment rule | A-16 added (browser local date, start of day); OQ-04 keeps production timezone open; AC-R2-04 linked |
| 5 | #9 list order | Design Choices; Acceptance Criteria | - | C-18 added; AC-R1-11 added (Unit, Must) |
| 6 | #10 save failure | Design Choices | - | C-16 added: pessimistic save, saving state, inline error with Retry; linked to AC-R3-01, AC-R3-05 |
| 7 | #8 no-longer-aging action | Open Questions | - | OQ-13 added |
| 8 | #1-#3 README wording | Open Questions; Challenge | OQ-07, OQ-08, OQ-10 without README pointer; REC-03 not applied | Pointers to README Draft added; REC-03 partly applied |
| 9 | README wording | README Draft (new sheet); Release DoD RL-05 | RL-05: "assumptions and limitations" | README Draft sheet added; RL-05 requires the Assumptions and Interpretations section |
| 10 | Counts | AC Summary; Release DoD RL-04; DoD Realism; Coverage | 34 Must (17 Unit); 35 ACs | 36 Must (19 Unit, 16 Component, 1 Manual); 37 ACs; Coverage R1 rows include AC-R1-10, AC-R1-11 |

v4 changes: change request (Vehicle Inventory Mockup and README handoff, 8-Oct)


| # | Source (CR item) | Sheet / item | Before | After |
|---|---|---|---|---|
| 1 | CR-01 | Acceptance Criteria; Assumptions; Design Choices | Search covered stock number, make, model | AC-R1-03 updated; AC-R1-12, AC-R1-13, A-14 (edited), A-21, C-13 (edited), C-21 added |
| 2 | CR-02 | Acceptance Criteria; Assumptions | - | AC-R1-14, AC-R1-15, A-17 added |
| 3 | CR-03, CR-04 | Acceptance Criteria; Design Choices; Open Questions | No paging; AC-R1-01 expected N rows | AC-R1-01 limited to N not larger than the page size; AC-R1-16 to AC-R1-18 and C-20 added; C-10 edited; OQ-12 note added |
| 4 | CR-05 | Acceptance Criteria; Design Choices | Sorting out of scope (C-18) | C-18 revised; AC-R1-11 qualified; AC-R1-19, AC-R1-20 added (Nice) |
| 5 | CR-06 | Acceptance Criteria; Assumptions; Design Choices | Bad-date outcome only (AC-R2-05, AC-R2-06) | AC-R2-14, AC-R2-15, AC-R2-16, C-25 added; A-12 edited; OQ-05 note added |
| 6 | CR-07, CR-08 | Acceptance Criteria; Assumptions; Design Choices | No action timestamp | AC-R3-07, AC-R3-08, A-20, C-28 added; OQ-17 added |
| 7 | CR-09 | Acceptance Criteria; Assumptions; Design Choices | - | AC-R2-17, AC-R2-18, A-19, C-22 added; OQ-15 added (Nice) |
| 8 | CR-10, CR-11, CR-12 | Acceptance Criteria; Design Choices | Summary: total, aging, aging with action | AC-R2-19, C-29 added; C-14 note added; OQ-06 note added (Nice) |
| 9 | CR-13 to CR-15, CR-18 to CR-20 | Exclusions; Open Questions | Exclusions E-01 to E-09 | E-10 to E-13 added; OQ-16 added (deferred) |
| 10 | CR-16, CR-29 | Acceptance Criteria; Design Choices | - | AC-R3-09 added; C-11 note added |
| 11 | CR-17 | Acceptance Criteria; Assumptions; Design Choices | Last refreshed + manual refresh only | AC-R4-06, AC-R5-03 to AC-R5-06, A-18, C-24 added; OQ-11 note added; AC-R4-04 limited to first load |
| 12 | CR-21 | Design Choices; Exclusions; Open Questions | Mock persistence stores only actions (C-15) | C-23 added; E-13 added; OQ-18 added |
| 13 | CR-22, CR-23 | Acceptance Criteria; Design Choices | C-05: forced failure switch | AC-R4-07, C-26 added |
| 14 | CR-24, CR-26, CR-30 | Exclusions | - | E-14, E-15 added |
| 15 | CR-25, CR-32 | Design Choices | - | C-27 added; C-13 edited (date format) |
| 16 | CR-28 | Design Choices; Open Questions | - | C-28 added; OQ-07 note added |
| 17 | CR-31 | Design Choices | - | C-30 added (dialog kept) |
| 18 | Scope | Open Questions | - | OQ-14 added: who raised the CR |
| 19 | Challenge | Challenge | Q1, Q2; REC-01 to REC-06 | Q3 added; Q1 note and REC-05, REC-06 notes extended; REC-11 added (not applied) |
| 20 | REC-07 | CR Impact; Plan v5 CR Plan | - | CR tiered into Adopt, Adopt gated, Defer, Not built |
| 21 | REC-08 | Exclusions | - | E-15 added: no 'Updating results' delay overlay |
| 22 | REC-09 | Design Choices | - | C-22 added: one early-warning window |
| 23 | REC-10 | Design Choices | - | C-23 added: only actions persist |
| 24 | README | README Draft | 8 items | #2, #3, #7 updated; #9 to #15 added |
| 25 | Release DoD | Release DoD RL-02, RL-04, RL-05, RL-08 | Baseline wording | CR sentences added; still 10 items; Must counts unchanged |
| 26 | DoD Realism | DoD Realism | 6 rows | CR Should criteria row added |
| 27 | Coverage | Coverage | 8 rows | 5 CR rows added |
| 28 | Counts | AC Summary; Release DoD RL-04 | 36 Must (19 Unit); 37 ACs | Must unchanged: 36 (19 Unit, 16 Component, 1 Manual); 61 ACs (25 Should) |
| 29 | CR Impact | CR Impact (new sheet) | - | 32 CR items with disposition, tier, plan task and links; 15 conflicts and inconsistencies found in the CR |

Validation checks (re-run on v4 content)


| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Every AC ID in Assumptions exists | Pass | 21 assumptions checked; all links resolve |
| 2 | Every AC ID in Design Choices exists | Pass | 30 design choices checked; all links resolve |
| 3 | Every PROPOSED AC traces to an A or C entry | Pass | 32 PROPOSED ACs (22 new in v4) all traced |
| 4 | All 11 decisions appear in Assumptions or Design Choices | Pass | Decisions 1-11 present |
| 5 | Exclusions cover the 9 required items; new ones numbered in sequence | Pass | E-01 to E-15 (15 items; E-01 to E-09 unchanged) |
| 6 | Must breakdown matches RL-04 source | Pass | Unit 19, Component 16, Manual 1 (Must 36; Should 25) |
| 7 | Task DoD has at most 8 items | Pass | 8 items |
| 8 | Release DoD has at most 10 items | Pass | 10 items |
| 9 | AC count within 25-35 | Accepted deviation | 61 criteria. v3 accepted 37; the CR adds 24, all Should (6 of them Nice). Must is unchanged at 36, so RL-04 effort does not grow. Criteria of items that are dropped are marked not applicable. |
| 10 | OQ references resolve | Pass | OQ-01 to OQ-18 exist; every OQ mentioned in any sheet resolves |
| 11 | Every applied recommendation has change entries | Pass | REC-01, REC-02, REC-04, REC-07, REC-08, REC-09, REC-10 |
| 12 | Not-applied recommendations keep status Not applied | Pass | REC-05, REC-06, REC-11 (REC-05 and REC-06 notes extended, status unchanged; REC-03 unchanged) |
| 13 | Every new design choice (C-20 to C-30) links to existing ACs or None | Pass | All links resolve |
| 14 | Every new A/C/OQ/E entry is referenced from another sheet | Pass | 27 new entries (A-17 to A-21, C-20 to C-30, OQ-14 to OQ-18, E-10 to E-15) referenced |
| 15 | Every ID in CR Impact links resolves | Pass | 32 CR items checked |
| 16 | AC Summary formulas count every new criterion | Pass | Formulas use whole-column COUNTIFS; expected total 61 (Must 36, Should 25); verified after recalculation |
| 17 | WBS IDs on CR Impact exist in Plan v5 | Pass | 59 WBS tasks in Plan v5 |
| 18 | CR IDs match Plan v5 CR Plan | Pass | 32 CR items on both sheets |

