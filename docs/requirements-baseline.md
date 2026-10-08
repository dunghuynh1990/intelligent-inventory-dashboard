# Keyloop Scenario B Requirements Baseline

## Document Control

- **Scenario:** Scenario B: Intelligent Inventory Dashboard
- **Baseline version:** v4
- **Source:** `docs/cr/Keyloop_ScenarioB_Requirements_Baseline_v4.xlsx`
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
| R1 Inventory Visualization | 11 | 9 | 20 |
| R2 Aging Stock Identification | 12 | 7 | 19 |
| R3 Actionable Insights | 6 | 0 | 6 |
| R4 UX States | 5 | 2 | 7 |
| R5 Data Freshness | 2 | 4 | 6 |
| **Total** | **36** | **25** | **61** |

| Test level | All | Must |
|---|---:|---:|
| Unit | 28 | 19 |
| Component | 31 | 16 |
| Manual | 2 | 1 |

---

# 1. Acceptance Criteria

## R1: Inventory Visualization

### AC-R1-01: Display all returned vehicles

- **Given:** The service returns N vehicles (N not larger than the page size) and no filter is set.
- **When:** The dashboard finishes loading.
- **Then:** The list shows N vehicle rows.
- **Source:** Brief: display a filterable list of all vehicles in a dealership's inventory; Decision 4.
- **Linked assumptions:** A-09, A-11
- **Linked design choices:** C-03, C-12, C-20
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
- **Then:** Only vehicles whose stock number, make, model or VIN contains `civ`, case-insensitive, are returned.
- **Source:** Decision 8; PROPOSED searched fields.
- **Linked assumptions:** A-14
- **Linked design choices:** C-09, C-10, C-21
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
- **When:** The list is prepared for display, with or without filters, and no sort is selected.
- **Then:** Vehicles are returned in ascending vehicle-ID order.
- **Source:** PROPOSED stable order; not a user sorting feature.
- **Linked design choices:** C-18
- **Test level:** Unit
- **Priority:** Must

### AC-R1-12: Display VIN

- **Given:** A vehicle has a 17-character VIN.
- **When:** Its row is displayed.
- **Then:** The row shows the full VIN.
- **Source:** CR-01 (README s8 VIN column); PROPOSED.
- **Linked assumptions:** A-21
- **Linked design choices:** C-13
- **Test level:** Component
- **Priority:** Should

### AC-R1-13: Search VIN

- **Given:** The generated vehicle list and the VIN of vehicle V010.
- **When:** The first 8 characters of that VIN, in lower case, are used as the search text.
- **Then:** V010 is returned and every returned vehicle contains that text in its stock number, VIN, make or model.
- **Source:** CR-01; OQ-01; PROPOSED searched field: VIN.
- **Linked assumptions:** A-14, A-21
- **Linked design choices:** C-21
- **Test level:** Unit
- **Priority:** Should

### AC-R1-14: Filter by no action

- **Given:** The generated vehicle list and reference date R.
- **When:** Only the action filter `No action yet` is applied.
- **Then:** Every returned vehicle is aging and has no current action, and the count equals the number of such vehicles in the data.
- **Source:** CR-02 (README s6 Action); PROPOSED.
- **Linked assumptions:** A-05, A-17
- **Linked design choices:** C-21
- **Test level:** Unit
- **Priority:** Should

### AC-R1-15: Filter by has action

- **Given:** The generated vehicle list with some saved actions.
- **When:** Only the action filter `Has an action` is applied.
- **Then:** Every returned vehicle has a current action, and the count equals the number of such vehicles in the data.
- **Source:** CR-02; PROPOSED.
- **Linked assumptions:** A-17
- **Linked design choices:** C-21
- **Test level:** Unit
- **Priority:** Should

### AC-R1-16: Clamp requested page

- **Given:** 45 vehicles and a page size of 20.
- **When:** Pages 1, 3 and 9 are requested.
- **Then:** Page 1 has 20 vehicles, page 3 has the last 5, and page 9 is treated as page 3 (the page number is clamped).
- **Source:** CR-03 (README s8 Pager); PROPOSED; revises D19.
- **Linked assumptions:** A-11
- **Linked design choices:** C-20, C-21
- **Test level:** Unit
- **Priority:** Should

### AC-R1-17: Show page result count

- **Given:** The service returns 200 vehicles and the default page size.
- **When:** The dashboard finishes loading.
- **Then:** 20 rows are shown, the count reads `Showing 1-20 of 200` and the pager shows page 1 of 10.
- **Source:** CR-03, CR-04 (README s7-s8); PROPOSED.
- **Linked assumptions:** A-11
- **Linked design choices:** C-20
- **Test level:** Component
- **Priority:** Should

### AC-R1-18: Reset page when filters change

- **Given:** Page 3 is shown.
- **When:** Any filter is changed.
- **Then:** Page 1 is shown.
- **Source:** CR-03 (README Interactions `Filtering`); PROPOSED.
- **Linked design choices:** C-20
- **Test level:** Component
- **Priority:** Should

### AC-R1-19: Sort rows by days in stock

- **Given:** Vehicles with days in stock 10, 40, unknown and 40 (the two 40s have different IDs).
- **When:** The rows are sorted by days in stock ascending, then descending.
- **Then:** Ascending gives 10, 40, 40, unknown and descending gives 40, 40, 10, unknown; equal values stay in vehicle ID order.
- **Source:** CR-05 (Nice; README s8 Sorting); PROPOSED.
- **Linked design choices:** C-18, C-21
- **Test level:** Unit
- **Priority:** Should

### AC-R1-20: Cycle sorting from a column header

- **Given:** No sort is selected.
- **When:** The manager selects the `Days in stock` header three times.
- **Then:** The order is descending, then ascending, then back to vehicle ID order, and `aria-sort` on the header reads descending, ascending, then none.
- **Source:** CR-05 (Nice); PROPOSED.
- **Linked design choices:** C-18
- **Test level:** Component
- **Priority:** Should

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

### AC-R2-14: Classify entry-date issues

- **Given:** Entry dates that are empty, `not-a-date`, after reference date R, and a valid past date.
- **When:** The entry date is checked.
- **Then:** The issues are `Missing entry date`, `Invalid entry date`, `Future entry date` and none, in that order.
- **Source:** CR-06 (README Interactions `Bad dates`); OQ-05; PROPOSED labels.
- **Linked assumptions:** A-12
- **Linked design choices:** C-25
- **Test level:** Unit
- **Priority:** Should

### AC-R2-15: Display data issues

- **Given:** A vehicle has an invalid entry date.
- **When:** Its row is displayed.
- **Then:** The row shows `Unknown` days in stock and the issue text, no Aging badge and no action control, and the vehicle appears when the Data issues link is selected.
- **Source:** CR-06; PROPOSED.
- **Linked assumptions:** A-12
- **Linked design choices:** C-25
- **Test level:** Component
- **Priority:** Should

### AC-R2-16: Generate data-issue examples

- **Given:** Reference date R.
- **When:** The mock data is generated.
- **Then:** It contains one vehicle each with a missing, an invalid and a future entry date, and the 89/90/91-day vehicles of AC-R2-10 are unchanged.
- **Source:** CR-06 (HTML `generate()` bad{}); PROPOSED.
- **Linked assumptions:** A-12
- **Linked design choices:** C-07, C-25
- **Test level:** Unit
- **Priority:** Should

### AC-R2-17: Apply the early-warning window

- **Given:** Vehicles with 83, 84, 90 and 91 days in stock.
- **When:** The early-warning rule is evaluated.
- **Then:** 84 and 90 are `turning aging soon`; 83 and 91 are not.
- **Source:** CR-09 (Nice; README s3); PROPOSED window of 7 days.
- **Linked assumptions:** A-19
- **Linked design choices:** C-22
- **Test level:** Unit
- **Priority:** Should

### AC-R2-18: Filter from the early-warning card

- **Given:** The `Turning aging in 7 days` card shows K.
- **When:** The manager selects the card.
- **Then:** The list shows only those K vehicles and the card is marked pressed; selecting it again clears the filter.
- **Source:** CR-09 (Nice); PROPOSED.
- **Linked assumptions:** A-19
- **Linked design choices:** C-22, C-29
- **Test level:** Component
- **Priority:** Should

### AC-R2-19: Show age profile counts and shares

- **Given:** The age band counts are known.
- **When:** The age profile is shown.
- **Then:** Each band segment shows its count and share, and selecting a band applies the age-band filter (selecting it again clears it).
- **Source:** CR-11 (Nice; README s4); PROPOSED; partly answers OQ-06.
- **Linked assumptions:** A-04
- **Linked design choices:** C-29
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

### AC-R3-07: Show action logged time

- **Given:** An action is saved on a vehicle at time T.
- **When:** The dashboard is shown on the same day, then three days later.
- **Then:** The row shows `Logged today`, then `Logged 3 days ago`.
- **Source:** CR-07 (HTML `actionAgo()`); PROPOSED.
- **Linked assumptions:** A-20
- **Linked design choices:** C-28
- **Test level:** Component
- **Priority:** Should

### AC-R3-08: Flag stale actions

- **Given:** One aging vehicle has an action logged 14 days ago and another logged 15 days ago.
- **When:** The rows are shown.
- **Then:** Only the 15-day action shows the `check progress` flag.
- **Source:** CR-08 (Nice); PROPOSED placeholder of 14 days.
- **Linked assumptions:** A-20
- **Linked design choices:** C-28
- **Test level:** Component
- **Priority:** Should

### AC-R3-09: Show a correlation reference on save failure

- **Given:** Forced failure is on.
- **When:** Saving an action fails.
- **Then:** The inline error shows a reference that matches the correlation ID logged for the failed service call.
- **Source:** CR-29 (README Logging wrapper); needs WBS 4.10; not applicable if 4.10 is dropped.
- **Linked design choices:** C-11, C-16
- **Test level:** Component
- **Priority:** Should

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

### AC-R4-04: First-load service error and retry

- **Given:** Forced failure is enabled.
- **When:** The dashboard loads vehicles for the first time.
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

### AC-R4-06: Preserve rows after refresh failure

- **Given:** Vehicles are loaded and forced failure is then switched on.
- **When:** The manager selects `Refresh`.
- **Then:** An error banner with Retry is shown, the existing rows stay visible and `Last refreshed` keeps the earlier time.
- **Source:** CR-17 (README Interactions `Refresh`); decision for the mockup's open code comment.
- **Linked assumptions:** A-08
- **Linked design choices:** C-24
- **Test level:** Component
- **Priority:** Should

### AC-R4-07: Demonstrate reviewer scenarios

- **Given:** The app is running in a browser.
- **When:** The reviewer switches to the empty-inventory scenario, or to a 25-minute data age, without changing code.
- **Then:** The empty-inventory message, or the amber freshness indicator, is displayed.
- **Source:** CR-22 (README `demo bar`); PROPOSED.
- **Linked assumptions:** A-18
- **Linked design choices:** C-26
- **Test level:** Manual
- **Priority:** Should

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

### AC-R5-03: Calculate freshness levels

- **Given:** Last-refreshed ages of 14, 15, 59 and 60 minutes.
- **When:** The freshness level is calculated.
- **Then:** They map to normal, amber, amber and warning.
- **Source:** CR-17 (README s1); PROPOSED placeholders; OQ-11.
- **Linked assumptions:** A-18
- **Linked design choices:** C-24
- **Test level:** Unit
- **Priority:** Should

### AC-R5-04: Show elapsed refresh time

- **Given:** A fixed clock and a successful load 25 minutes ago.
- **When:** The header is shown.
- **Then:** `Last refreshed` shows the time and `25 min ago`, marked amber.
- **Source:** CR-17; PROPOSED.
- **Linked assumptions:** A-18
- **Linked design choices:** C-24
- **Test level:** Component
- **Priority:** Should

### AC-R5-05: Warn when data is stale

- **Given:** The data is 60 minutes old.
- **When:** The dashboard is shown.
- **Then:** A stale-data warning with `Refresh now` is shown above the summary.
- **Source:** CR-17 (README s2); PROPOSED.
- **Linked assumptions:** A-18
- **Linked design choices:** C-24
- **Test level:** Component
- **Priority:** Should

### AC-R5-06: Show reference date

- **Given:** Reference date R.
- **When:** The header is shown.
- **Then:** `Reference date` shows R as DD-MMM-YYYY.
- **Source:** CR-17 (README s1); PROPOSED.
- **Linked assumptions:** A-02
- **Linked design choices:** C-24
- **Test level:** Component
- **Priority:** Should

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
| A-12 | PROPOSED: an invalid or future entry date has unknown age and is not aging; it shows Unknown with an issue tag and is available in the Data issues view. | AC-R2-05/06/14/15/16 |
| A-13 | Filters combine with AND and Clear resets all filters; summary, Data issues and preset views replace the current filters. | AC-R1-08/09 |
| A-14 | PROPOSED: Search matches stock number, VIN, make and model, case-insensitive. | AC-R1-03/13 |
| A-15 | An action must be selected; a note alone is insufficient. | AC-R3-04 |
| A-16 | Calendar day uses browser local date and local start of day; time is ignored. | AC-R2-04, AC-R2-11 |
| A-17 | PROPOSED: `No action yet` returns aging vehicles without a current action; `Has an action` returns vehicles with a current action. | AC-R1-14/15 |
| A-18 | PROPOSED: Freshness is normal under 15 minutes, amber from 15, and warning from 60; these are placeholders. | AC-R4-07, AC-R5-03/04/05 |
| A-19 | PROPOSED: Turning aging soon means 7 or fewer days to threshold (days 84-90); it is informational and actions remain aging-only. | AC-R2-17/18 |
| A-20 | PROPOSED: Saved actions carry their logged time; calendar days are counted; actions older than 14 days get a check-progress flag (placeholder). | AC-R3-07/08 |
| A-21 | PROPOSED: VIN is fake, opaque 17-character text for display and search only; it is not validated or decoded. | AC-R1-12/13 |

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
| E-10 | Bulk select and bulk apply of actions (CR-14) | Not in the brief; needs selection state, replace-existing warnings and partial-failure handling. Plan row 4.25 is Dropped (2.5 h). | Batch endpoint with per-vehicle results, replacement confirmation and audit entries |
| E-11 | Undo of a saved action (CR-15) | Needs a timed toast and a clear-action path absent from InventoryService. Plan row 4.26 is Dropped (0.5 h). | Server-side action history with revert |
| E-12 | CSV export and print layout (CR-18, CR-19) | Not required; exporting all filtered rows and print layout add implementation/test effort. Plan row 4.27 (CSV) is Dropped (0.5 h). | Server-generated filtered export with permission checks; reporting |
| E-13 | Saved views, density toggle and remembered UI preferences (CR-13, CR-20, CR-21) | Only saved actions persist (C-23); these add a persistence surface to version and test. | Per-user preferences stored by the API |
| E-14 | Tablet and mobile layouts (CR-26) | D20 limits responsive scope to laptop width; below 1340 px the table scrolls horizontally (C-27). | Responsive redesign after user research |
| E-15 | Mockup-only elements (CR-24, CR-30) | Demo bar as product UI, notes cards, requirement-ID overlay and artificial 320 ms filter delay are not built. The delay conflicts with D19. | None |

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
| C-10 | Filtering and paging run on the client over the full list returned by `getVehicles`. Server-side filtering and paging are documented as the future contract (E-05), not built. | AC-R1-03 to AC-R1-08 |
| C-11 | Observability hooks: logging wrapper, error boundary and service-call correlation ID (Should; design-only if dropped). The correlation ID also appears in error messages (AC-R3-09, CR-29); if the hooks are dropped, the Ref text is dropped. | Optional |
| C-12 | Mock contains in-stock vehicles only. | AC-R1-01 |
| C-13 | Each list row shows stock number, VIN, make, model, entry date (DD-MMM-YYYY), days in stock, status (aging badge, due-soon tag or data-issue tag) and current action. | AC-R1-02, AC-R1-12, AC-R2-12/15 |
| C-14 | Dashboard summary above the list shows total vehicles, aging count and aging vehicles with an action (Should; first item dropped if behind). Nice upgrade adds aging share and an actioned meter (CR-10). | AC-R2-13, Should |
| C-15 | Only actions and notes are persisted, keyed by stable vehicle ID. | AC-R2-10, AC-R3-02 |
| C-16 | Save is pessimistic; disabled saving state; inline Retry; previous action retained on failure. | AC-R3-01, AC-R3-05 |
| C-17 | Model options depend on selected make; changing make clears invalid model. | AC-R1-05, AC-R1-10 |
| C-18 | Without a selected sort, display order is fixed by vehicle ID. Optional column sorting (Nice, CR-05) overrides it for the session: unknown values last, ties by vehicle ID, not persisted. If dropped, sorting is out of scope. | AC-R1-11, AC-R1-19/20 |
| C-19 | Impossible filter combinations are allowed and show no-results with Clear filters. | AC-R1-09, AC-R4-03 |
| C-20 | Client-side pagination uses page sizes 10, 20, 50 and 100 (default 20), first/previous/numbered/next/last controls, resets to page 1 when a filter changes, clamps when results shrink, and does not persist page or page size. Go-to-page is not built. | AC-R1-01, AC-R1-16/17/18 |
| C-21 | Core module adds pure functions for search over stock number, VIN, make and model; action filter; entry-date issue classification; pagination; and freshness level. If built: `sortRows` and early-warning rule. | AC-R1-03, AC-R1-13 to AC-R1-16, AC-R1-19, AC-R2-14/17, AC-R5-03 |
| C-22 | One early-warning window constant (7 days, days 84-90) drives the summary card, `Due in N days` row tag and preset; the mockup's separate day-80 tag is not adopted. Nice. | AC-R2-17/18 |
| C-23 | Only saved actions persist (C-15). Sort, page, page size, density and saved views are not persisted. | AC-R3-02 |
| C-24 | Freshness uses named placeholder constants (15 and 60 minutes) and a pure level function. Header shows reference date, last-refreshed time and time ago; a warning banner with Refresh now appears from 60 minutes. Failed refresh keeps last data with a Retry banner; failed first load shows AC-R4-04. | AC-R4-06, AC-R5-03/04/05/06 |
| C-25 | Missing, invalid and future entry dates show `Unknown` days and an issue tag, are not aging, and appear under a Data issues link and preset. Mock data contains one of each. | AC-R2-14/15/16 |
| C-26 | Reviewer switches are in the mock layer: forced failure (C-05), empty inventory and data age, set by URL parameter or dev-only panel outside product UI. Sample actions are seeded only in demo mode; requirement-ID overlay is not built. PROPOSED. | AC-R4-05/07 |
| C-27 | Visual layer uses CSS variables from the CR token table, Manrope / Inter / IBM Plex Mono, maximum width 1440 px, fixed table columns with minimum width 1200 px and horizontal scroll below 1340 px, and a blue focus ring. | None (no behavioural AC) |
| C-28 | `currentAction = { action, note?, loggedAt }`; one current action per vehicle (A-06); fixed list of five placeholder values (Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign, Under Review). Partly answers OQ-07. | AC-R3-01/06/07 |
| C-29 | Quick views (summary card, Data issues link, age-band click and preset views) set the complete filter set and replace current filters. Filters still combine with AND (A-13). | AC-R2-18/19 |
| C-30 | Action entry stays in the dialog from wireframe 3.1. The mockup's inline editor row is not adopted; fields, validation and failure behavior are the same. | AC-R3-01/04/05 |

---

# 5. Open Questions

| ID | Area | Question / current assessment position |
|---|---|---|
| OQ-01 | Search | Which fields does free-text search cover? The assessment now searches VIN as well; registration number and other identifiers remain open. |
| OQ-02 | Filters | Are make/model multi-select? Assessment narrows models by make; multi-select remains open. |
| OQ-03 | Inventory | Does all inventory include sold, reserved or in-transit? Mock uses in-stock only. |
| OQ-04 | Timezone | Should dealership timezone replace browser local date in production? |
| OQ-05 | Data quality | How should invalid/future entry dates appear to the manager? The assessment shows Unknown with an issue tag and a Data issues view; production handling remains open. |
| OQ-06 | Prominence | Is a badge enough, or is a summary/aging-first view required? The CR adds an age profile and richer summary cards (both Nice); whether the badge alone is enough remains open. |
| OQ-07 | Action model | Are status and proposed action distinct, and what are the fixed-list values? The mockup proposes five placeholders; sign-off remains open. |
| OQ-08 | History | Does log mean an audit history or only current action? Assessment uses current action. |
| OQ-09 | Note | Is there a maximum note length? |
| OQ-10 | Freshness | Is manual refresh acceptable for real-time? |
| OQ-11 | Freshness target | What maximum data age applies, and is polling or push required? The 15- and 60-minute thresholds are placeholders. |
| OQ-12 | Scale | At what inventory size should filtering and paging move server-side? Client-side paging up to 100 rows per page is adopted; the server threshold remains open. |
| OQ-13 | Eligibility change | If corrected data makes a vehicle non-aging, should its saved action be kept, hidden or cleared? |
| OQ-14 | CR | Who raised the change request, and is it a Keyloop requirement or an own design input? |
| OQ-15 | Early warning | Is the early-warning window 7 days (days 84-90), or should the row tag start at day 80 as in the mockup? Should actions be allowed before day 91? |
| OQ-16 | Bulk actions | Are bulk actions expected? If so, may bulk save replace existing actions, and what happens when some vehicles fail? |
| OQ-17 | Action follow-up | What follow-up cadence do managers use for an action flagged after 14 days? |
| OQ-18 | UI preferences | Should sort order, page size and display density be remembered per user? |

Open questions do not block the assessment unless an active WBS task explicitly depends on an unanswered production decision.

---

# 6. Coverage

Coverage: brief phrase to acceptance criteria. Not covered: none.

Partial: “status” in R3 has no separate criterion until OQ-07 is answered (see A-07). Deferred or unbuilt CR items (E-10 to E-15) have no criteria. CR rows below are not part of the brief.

| Requirement | Brief phrase / scope | Covering criteria |
|---|---|---|
| R1 | “Display a filterable list of all vehicles in a dealership's inventory” | AC-R1-01, AC-R1-02, AC-R1-11 |
| R1 | “filter by make, model, age” | AC-R1-04, AC-R1-05, AC-R1-06, AC-R1-08, AC-R1-09, AC-R1-10 (scale threshold open: OQ-12) |
| R2 | “Automatically identify ... aging stock (vehicles in inventory for >90 days)” | AC-R2-01 to AC-R2-11 |
| R2 | “prominently display aging stock” | AC-R2-12 (Must), AC-R2-13 (Should) |
| R3 | “log ... a status or proposed action for each aging vehicle” | AC-R3-01, AC-R3-03, AC-R3-06 (“status” open: OQ-07) |
| R3 | “persist” | AC-R3-02 |
| R4 | Loading, empty, no-result, service-error states; error can be forced (user scope) | AC-R4-01 to AC-R4-05 |
| R5 | “real-time overview” | AC-R5-01, AC-R5-02 (freshness target open: OQ-11) |
| R1 | CR (not in the brief): VIN, action filter, paging, sorting | AC-R1-12 to AC-R1-20 (Should; AC-R1-19/20 are Nice) |
| R2 | CR (not in the brief): data issues, early warning, age profile | AC-R2-14 to AC-R2-19 (Should; AC-R2-17 to AC-R2-19 are Nice) |
| R3 | CR (not in the brief): action logged time, stale flag, error reference | AC-R3-07 to AC-R3-09 (Should; AC-R3-08 is Nice) |
| R4 | CR (not in the brief): refresh failure, reviewer switches | AC-R4-06/07 (Should) |
| R5 | CR (not in the brief): freshness levels, time ago, stale warning, reference date | AC-R5-03 to AC-R5-06 (Should; freshness target remains open: OQ-11) |

**Not covered:** None. “Status” remains partially open under OQ-07.

---

# 7. Challenge and Recommendations

| Question | Answer | Why | Note |
|---|---|---|---|
| Q1. Weakest assumption | A-08 ("real-time" = manual refresh) | It is the only assumption that narrows a word in the brief's task statement rather than filling a gap. With a single-user mock, a refresh returns the same data, so the demo cannot show freshness; a reviewer may ask why there is no automatic update. | Runner-up: A-07. The brief says "status or proposed action"; one list is defensible but may be read as skipping "status". The CR adds time-ago text, thresholds and a data-age switch (CR-17, D37), making A-08 visible without waiting. |
| Q2. Exclusion at risk | E-05 (multi-dealership), combined with C-03/C-10 | “Build for the Future” names scalability. `getVehicles()` takes no dealership, filter or paging parameters, and filtering runs on the client. Excluding multi-dealership is fine; a contract that cannot add it without breaking callers looks like a scalability gap. | E-08 is second: if 4.10 is dropped, observability is design-only in the implemented layer. |
| Q3. Scope risk from the CR | Adopting the mockup as specified (CR Impact, 32 items) | The mockup goes beyond the brief on about a dozen items. Adopted items add 13.75 h to a 33.25 h plan, leaving about 0.25 h spare Friday to Tuesday. D15 and D23 prioritize evaluation values that extras do not improve. | Mitigation: tiering (Should / Nice / Defer), drop CR Nice first at the Saturday gate, and keep deferred items as Dropped rows. Who raised the CR remains open (OQ-14). |

Recommendations (not applied)

| ID | Recommendation | Status |
|---|---|---|
| REC-01 | Record freshness target as open and show polling/push as Future. | Applied in v2 |
| REC-02 | State manual-refresh interpretation plainly in video. | Applied in v2 |
| REC-03 | Include status-type and action-type values, or justify one list. | Partly applied in v3; values remain open |
| REC-04 | Show future API with dealership ID, filters and paging. | Applied in v2 |
| REC-05 | Add an optional query object to `getVehicles` now. | Not applied: changes Decision 3. The CR keeps paging and sorting on the client (C-20); if applied, the query should carry page, page size and sort. |
| REC-06 | Promote logging wrapper and error boundary from Should to Must. | Not applied: the mockup shows the correlation ID in error messages (AC-R3-09), which depends on WBS 4.10. |
| REC-07 | Tier the CR (Adopt, Adopt gated, Defer, Not built) instead of building the mockup as specified. | Applied (v4): CR Impact sheet and Plan v5 CR Plan sheet |
| REC-08 | Do not build the 320 ms `Updating results` overlay: it is artificial delay that contradicts D19 and slows tests. | Applied (v4): E-15 |
| REC-09 | Use one early-warning window (7 days) instead of the mockup's two thresholds. | Applied (v4): C-22 (Nice) |
| REC-10 | Do not persist sort, page, page size, density or views; only actions persist. | Applied (v4): C-23 |
| REC-11 | If bulk apply is ever reinstated, add per-vehicle failure injection to the mock adapter and write partial-failure criteria first. | Not applied: bulk is deferred (E-10) |

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
- CR Should criteria (24, including six Nice criteria) are verified only when built. WBS 5.6 covers pure-function Unit criteria; WBS 5.7 covers Component criteria. Automate AC-R1-17, AC-R1-18, AC-R3-09 and AC-R4-06; manually check other built Component criteria once. If a criterion moves to manual verification, update its Test level. Nice criteria AC-R1-19/20, AC-R2-17/18/19 and AC-R3-08 are checked only if their feature is built.

---

# 9. Release-Level Definition of Done

| ID | Deliverable | Check |
|---|---|---|
| RL-01 | System design | `docs/system-design.md` contains diagram, roles, data flow, technologies/justifications, observability and GenAI design usage. |
| RL-02 | System design | Assumptions, exclusions and open questions are included; unbuilt components are labelled Future; the diagram shows the future freshness path and future API contract with dealership ID, filters and paging. Deferred CR items (E-10 to E-13) are labelled Future. |
| RL-03 | Working code | Fresh clone installs, runs, tests and builds using README only. |
| RL-04 | Working code | Every Must criterion is verified: Unit and Component criteria by passing tests and the Manual criterion by one recorded check. CR Should criteria (24, including six Nice) are checked only for items built; criteria for dropped items are not applicable. |
| RL-05 | Working code | README covers overview, run/test/build, an Assumptions and Interpretations section based on the README Draft, limitations and system-design link; it states reviewer switches and what is saved in the browser. |
| RL-06 | Working code | AI narrative uses real log entries and at least one real corrected or rejected suggestion. |
| RL-07 | Working code | Repository is accessible and contains no secrets. |
| RL-08 | Video | Within required length; shows scenario, design, filters, aging badge, saving an action, persistence after reload and AI collaboration; states that real-time means last-refreshed time plus manual refresh. If built, also shows pagination, freshness and a data-issue row. |
| RL-09 | Video | Link opens in private browser without access request. |
| RL-10 | All | Submission email with repository, design and video links is sent before the confirmed deadline. |

---

# 10. README Assumptions and Interpretations

Use these statements only if the delivered build still matches them:

1. **Log an action:** Logging means saving the current action for an aging vehicle. A new action replaces the old one; history is future scope.
2. **Status or proposed action:** One `Action` field covers both. The manager selects from the five placeholder values (Price Reduction Planned, Transfer to Another Site, Send to Auction, Promote in Campaign, Under Review) and may add an optional note. Values still need sign-off (OQ-07).
3. **Real-time overview:** The dashboard shows last-refreshed time and a Refresh button; it does not push live updates. The header also shows elapsed time, amber after 15 minutes and warning after 60; both thresholds are placeholders pending an agreed freshness target (OQ-11).
4. **Filter combination:** Filters combine with AND.
5. **Aging-only plus age band:** Both may be active; impossible combinations show no results with Clear filters.
6. **Make and model:** Models narrow to the selected make; invalid selected model is cleared when make changes.
7. **Display order:** Without a selected sort, vehicles use fixed vehicle-ID order. If column sorting is built, it applies for the current session, unknown values sort last, ties use vehicle ID, and a third click restores vehicle-ID order. Sorting is not persisted; if dropped, sorting remains out of scope.
8. **No-longer-aging action:** Production behavior remains open if corrected source data removes aging eligibility.
9. **Search:** Search matches stock number, VIN, make and model, case-insensitive. Other identifiers, such as registration number, are not searched.
10. **Paging:** The list shows 20 vehicles per page by default; page size can be changed to 10, 50 or 100. A filter change returns to page 1. Paging runs in the browser over about 200 demonstration vehicles; server-side paging is future scope, not a performance claim.
11. **Data quality:** Missing, invalid or future entry dates show `Unknown` and an issue tag, are not counted as aging, and can be listed with the Data issues link. Demo data contains three such vehicles.
12. **Early warning (if built):** A card and tag show vehicles that will pass 90 days within 7 days (days 84-90). This is informational; actions remain limited to aging vehicles.
13. **Reviewer switches:** Forced failure, empty inventory and old data age can be switched on without changing code. Sample actions are loaded only in demo mode; the demo bar is not product UI.
14. **Saved data:** Only the saved action and note are stored in the browser. Sort order, page size, filters and display density are not remembered after reload.
15. **Future improvements:** Bulk actions, undo, CSV export, print layout and saved views were considered and left out; they are listed as future scope.

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

---

# 12. Change Request Impact (v4)

The following triage records the 32 change-request items against Baseline v3. Dispositions remain proposals pending owner confirmation (OQ-14). Plan tiers are Must, Should and Nice; acceptance-criteria priority uses Must and Should, so Nice plan items are Should in the AC register. Dropped rows refer to Plan v5.

| CR ID | Change | Disposition / tier | Plan WBS | Requirement links |
|---|---|---|---|---|
| CR-01 | VIN column, VIN search and match highlight | Adopt / Should | 4.12, 4.13, 4.16 | AC-R1-12/13; A-14/21; OQ-01; C-13/21 |
| CR-02 | Action filter: Any / No action yet / Has an action | Adopt / Should | 4.12, 4.17 | AC-R1-14/15; A-17; C-21 |
| CR-03 | Client pagination and page-size controls | Adopt with changes / Should | 4.12, 4.18 | AC-R1-01/16/17/18; A-11; C-20/23; OQ-12 |
| CR-04 | Result count and removable filter chips | Adopt / Should | 4.17 | AC-R1-17 |
| CR-05 | Eight-column sorting, three-state, unknown-last, ID tie-break | Adopt, gated / Nice | 4.24 | AC-R1-11/19/20; C-18/21; D32 |
| CR-06 | Missing/invalid/future date issue treatment and Data issues view | Adopt / Should | 4.12, 4.13, 4.16 | AC-R2-14/15/16; A-12; OQ-05; C-25 |
| CR-07 | Action logged time | Adopt / Should | 4.13, 4.19 | AC-R3-07; A-20; C-28 |
| CR-08 | Stale-action flag after 14 days | Adopt, gated / Nice | 4.21 | AC-R3-08; A-20; OQ-17 |
| CR-09 | One early-warning window and due-soon tag | Adopt with change / Nice | 4.21 | AC-R2-17/18; A-19; C-22/29; OQ-15 |
| CR-10 | Summary cards: aging share and actioned meter | Adopt, gated / Nice | 4.22 | AC-R2-13; C-14 |
| CR-11 | Age-profile band bar with click-to-filter | Adopt, gated / Nice | 4.22 | AC-R2-19; A-04; OQ-06; C-29 |
| CR-12 | Eight preset views | Adopt, gated / Nice | 4.23 | C-29 |
| CR-13 | Saved views | Defer | - | E-13 |
| CR-14 | Bulk select and bulk action | Defer | 4.25 (Dropped) | E-10; OQ-16; D35 |
| CR-15 | Undo toast | Defer | 4.26 (Dropped) | E-11; D35 |
| CR-16 | Action-saved toast | Adopt / Should | 4.19 | AC-R3-01 |
| CR-17 | Freshness indicators and refresh-failure behavior | Adopt / Should | 4.12, 4.20 | AC-R4-06, AC-R5-03 to AC-R5-06; A-18; OQ-11; C-24; D37 |
| CR-18 | CSV export of filtered rows | Defer | 4.27 (Dropped) | E-12; D36 |
| CR-19 | Print layout | Defer | - | E-12; D36 |
| CR-20 | Row-density toggle | Not built / Excluded | - | E-13; D36 |
| CR-21 | Remembered UI preferences | Adopt with change / Decision | - | C-23; E-13; OQ-18; D34 |
| CR-22 | Reviewer switches for failure, empty data and data age | Adopt as switches only / Should | 4.14 | AC-R4-05/07; C-05/26; D39 |
| CR-23 | Sample actions seeded on first visit | Adopt in demo mode only / Should | 4.14 | C-26; D39 |
| CR-24 | 320 ms “Updating results” overlay | Not built / Excluded | - | E-15; D36 |
| CR-25 | Design tokens, typography and 1440 px maximum width | Adopt / Should | 4.15 | C-27; D40 |
| CR-26 | Tablet and mobile breakpoints | Not built / Excluded | - | E-14; C-27 |
| CR-27 | Accessibility details | Adopt within build tasks / Should | 4.15 to 4.24, 5.5 | AC-R2-12, AC-R1-20 |
| CR-28 | Five placeholder action values | Adopt as placeholders / Should | 3.5, 4.13 | C-28; A-07; OQ-07 |
| CR-29 | Correlation ID in error messages | Adopt, requires 4.10 / Should | 4.19 | AC-R3-09; C-11; REC-06 |
| CR-30 | Notes cards and requirement-ID overlay | Not built / Excluded | - | E-15 |
| CR-31 | Inline action editor instead of dialog | Not adopted; keep dialog / Excluded | - | C-30 |
| CR-32 | Entry-date format DD-MMM-YYYY | Adopt / Should | 4.16 | C-13 |

## Conflicts and inconsistencies recorded in the CR

| # | Finding | v4 resolution | Owner decision |
|---|---|---|---|
| 1 | Pagination conflicts with AC-R1-01 expecting all N rows. | Limit AC-R1-01 to N not larger than page size; AC-R1-17 covers 200 rows. | No |
| 2 | Sorting conflicts with the prior “sorting out of scope” wording. | Sorting remains gated Nice; C-18 is revised and README wording is conditional. | No |
| 3 | Mockup uses different early-warning thresholds for card and row. | Use one 7-day window (C-22, A-19). | Yes: OQ-15 |
| 4 | Mockup adds persistence keys beyond actions. | Persist only actions (C-23). | Yes: D34 |
| 5 | Sample actions seeded on first visit break fresh-state behavior. | Seed only in demo mode (C-26). | No |
| 6 | All-or-nothing forced failure cannot test partial bulk failures. | Defer bulk (E-10); REC-11 records the reinstatement precondition. | No |
| 7 | Inline editor row conflicts with dialog in wireframe 3.1 and WBS 4.7. | Keep the dialog (C-30). | Yes: CR-31 |
| 8 | Refresh-failure behavior was left open, while first-load error expects no rows. | Separate first-load behavior (AC-R4-04) from refresh failure (AC-R4-06). | No |
| 9 | Artificial 320 ms filter delay conflicts with D19 and slows tests. | Do not build it (E-15, REC-08). | No |
| 10 | Mockup focus-ring cyan conflicts with README blue token. | Follow README token table (C-27). | No |
| 11 | Unused mockup gauge CSS has no rendered counterpart. | Do not copy; review in 4.15 and 5.4. | No |
| 12 | Action values are placeholders and “Under Review” is status-like. | Use five placeholder values; keep OQ-07 open (C-28). | Yes: OQ-07 |
| 13 | Pixel-accurate fidelity request conflicts with time-boxed plan and deferred mockup sections. | Reuse tokens/CSS, rebuild structure, defer listed sections (D40). | Yes: OQ-14 |
| 14 | Quick views replace existing filters rather than add to them. | Document replacement behavior (C-29, A-13). | No |
| 15 | Mockup provenance must not be confused with actual AI collaboration evidence. | Log the mockup/tool factually under Plan 2.4; do not invent examples (D16). | Yes: tool name |

---

# 13. Change Log

## v4 — Change request triage

- Added 24 Should acceptance criteria, A-17 to A-21, OQ-14 to OQ-18, E-10 to E-15 and C-20 to C-30; revised linked v3 criteria and register wording as listed in the v4 Consistency Log.
- Added the 32-item CR Impact triage and 15 recorded conflicts; added Q3 and REC-07 to REC-11.
- Updated Coverage, Release DoD RL-02/RL-04/RL-05/RL-08, the CR Should realism guidance and README interpretation items #2/#3/#7/#9-#15.
- Kept Task DoD T-01 to T-08 unchanged. The current baseline has no DoD Example section; no example content was synthesized.
