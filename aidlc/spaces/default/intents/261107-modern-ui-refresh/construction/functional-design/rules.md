# Business Rules — modern-ui-refresh

Rules for the UI refresh, derived from [requirements.md](../../inception/requirements-analysis/requirements.md) and the functional design answers ([functional-design-questions.md](./functional-design-questions.md)). Token values refer to `ThemeTokens` and `StatusStyle` in [entities.md](./entities.md). "Accessible name" means the name assistive technology and the Playwright suite use to find a control.

```yaml
rules:
  # BR1 — Theme and design tokens
  - id: BR1.1
    statement: The UI uses one accent color, indigo #4F46E5, for primary buttons, links, the selected sort header, the focus ring and the top header bar background (white title text).
    category: policy
    applies_to: ThemeTokens
    trigger: any interactive or emphasized element is rendered
    logic: IF an element is primary or interactive THEN its emphasis color is the accent; no second brand color is introduced
    violation: design review defect
    source: FR1.2
  - id: BR1.2
    statement: Surfaces use 8px corner radius, a 1px #E2E8F0 border and no shadow, on a #F8FAFC page background.
    category: constraint
    applies_to: ThemeTokens, cards, inputs, chips
    trigger: a card, input or panel is rendered
    logic: IF a surface is rendered THEN radius = 8px, border = 1px #E2E8F0, shadow = none
    violation: design review defect
    source: FR1.2, FR2.2
  - id: BR1.3
    statement: Text uses Inter, bundled with the app, falling back to the system sans-serif stack; primary text #0F172A, secondary #475569.
    category: constraint
    applies_to: ThemeTokens
    trigger: any text is rendered
    logic: IF text is rendered THEN font family = Inter, else system sans-serif when Inter fails to load
    violation: design review defect
    source: FR1.2
  - id: BR1.4
    statement: The four status styles are defined exactly once and every status display reads them from there.
    category: constraint
    applies_to: StatusStyle
    trigger: a status is displayed
    logic: IF a status is displayed THEN its colors and icon come from the single StatusStyle definition; no pastel or duplicated hex values remain
    violation: design review defect
    source: FR1.3
  - id: BR1.5
    statement: Every keyboard-focusable control shows a 2px accent-colored focus ring with a 2px offset when focused by keyboard, applied per control type so component styles cannot cancel it.
    category: constraint
    applies_to: links, buttons, sort headers, inputs, selects
    trigger: a control receives keyboard focus
    logic: IF a control has keyboard focus THEN a 2px #4F46E5 ring with 2px offset is visible (contrast >= 3:1 against #FFFFFF and #F8FAFC); on the indigo header bar the ring is white
    violation: accessibility defect
    source: NFR3
  - id: BR1.6
    statement: Normal text and status text meet WCAG 2.1 AA contrast of at least 4.5:1.
    category: constraint
    applies_to: all text, StatusStyle
    trigger: a color pair is chosen
    logic: IF a foreground/background pair carries text THEN its contrast ratio >= 4.5:1
    violation: accessibility defect
    source: NFR3
  - id: BR1.7
    statement: The old stylesheet keeps only global rules the component library does not cover; pastel badge, filter, sort-button and error rules are removed.
    category: policy
    applies_to: global stylesheet
    trigger: the refactor is complete
    logic: IF a stylesheet rule is now covered by the theme or a component THEN it is deleted
    violation: design review defect
    source: FR1.4
  - id: BR1.8
    statement: Library components and icons are imported one by one, and the production JavaScript stays below 300 KB gzipped.
    category: constraint
    applies_to: build output
    trigger: production build
    logic: IF the build runs THEN total gzipped JS < 300 KB AND no whole-library or wildcard icon import exists
    violation: build and test failure
    source: NFR4, FR1.1

  # BR2 — Shell and layout
  - id: BR2.1
    statement: A top header bar shows a level-1 heading "Release Quality Dashboard" that contains a link with the same name to the runs list.
    category: constraint
    applies_to: app shell
    trigger: any page renders
    logic: IF a page renders THEN exactly one h1 named "Release Quality Dashboard" exists AND it contains a link named "Release Quality Dashboard" to "#/"
    violation: E2E failure
    source: FR2.1
  - id: BR2.2
    statement: Content sits in a single centered column at most 1100px wide, as stacked cards (runs list card above the create run card; the detail view is one card).
    category: constraint
    applies_to: page layout
    trigger: any page renders
    logic: IF the viewport is wider than 1100px THEN content is centered at 1100px; cards are stacked vertically in the order list, form
    violation: design review defect
    source: FR2.2
  - id: BR2.3
    statement: Below 600px wide, filters and form fields stack vertically and the runs table scrolls horizontally inside its card.
    category: constraint
    applies_to: filters, form, runs table
    trigger: viewport width < 600px
    logic: IF viewport < 600px THEN controls take full width one per line AND the table container scrolls horizontally; the page itself never scrolls horizontally
    violation: design review defect
    source: FR2.3

  # BR3 — Runs list
  - id: BR3.1
    statement: The search field is named "Search runs"; the status filter is a native select named exactly "Status" whose first option is "All statuses" followed by the four statuses.
    category: constraint
    applies_to: list filters
    trigger: runs list renders
    logic: IF the list renders THEN a text field named "Search runs" AND a native select named "Status" exist; option values are "", queued, running, passed, failed
    violation: E2E failure
    source: FR3.1
  - id: BR3.2
    statement: The runs table is a real table named "Test runs" with headers Name, Branch, Status, Duration; each header is a button that toggles sort and the sorted header carries aria-sort.
    category: constraint
    applies_to: runs table
    trigger: runs list has at least one run
    logic: IF a header is activated THEN sort by that column ascending, or flip direction if it is already the sort column; aria-sort = ascending|descending on that header only
    violation: E2E failure
    source: FR3.2
  - id: BR3.3
    statement: Table body rows highlight with #F1F5F9 (slate-100) on hover; run names are links to "#/runs/{id}".
    category: constraint
    applies_to: runs table rows
    trigger: pointer hovers a body row
    logic: IF a body row is hovered THEN its background = #F1F5F9
    violation: design review defect
    source: FR3.3
  - id: BR3.4
    statement: List states keep their messages and roles - loading "Loading runs..." (status), empty "No test runs match your filters.", error "Unable to load test runs. Please try again." (alert) with a Retry button.
    category: constraint
    applies_to: RunListViewState
    trigger: list phase changes
    logic: IF phase = loading THEN show the status message; IF empty THEN the empty text; IF error THEN one alert with Retry; Retry re-requests the list
    violation: E2E failure
    source: FR3.4
  - id: BR3.5
    statement: Nothing but run rows is rendered in the table body - no placeholder, skeleton or progress rows - and loading indicators sit outside the table.
    category: constraint
    applies_to: runs table
    trigger: table renders
    logic: IF the table renders THEN the body row count = the number of runs shown
    violation: E2E failure (row counts)
    source: FR3.4
  - id: BR3.6
    statement: Sorting by Duration compares the raw seconds, not the displayed text.
    category: calculation
    applies_to: SortState
    trigger: sort column = durationSeconds
    logic: IF sorting by duration THEN compare durationSeconds numerically
    violation: E2E failure
    source: FR7.1

  # BR4 — Status badge
  - id: BR4.1
    statement: One status badge is used in both the runs table and the detail view.
    category: policy
    applies_to: status badge
    trigger: a status is displayed
    logic: IF a status is displayed anywhere THEN the shared badge renders it with its StatusStyle
    violation: design review defect
    source: FR4.1
  - id: BR4.2
    statement: The badge text is exactly the lowercase status value with no case transformation; the icon is hidden from assistive technology, static, and adds no text.
    category: constraint
    applies_to: status badge
    trigger: badge renders
    logic: IF a badge renders THEN its visible and accessible text = the status value (e.g. "passed") AND the icon is aria-hidden
    violation: E2E failure
    source: FR4.2

  # BR5 — Run detail
  - id: BR5.1
    statement: The detail card shows the "Back to runs" link in every detail state, the run name as an h2 heading with id detail-heading, then label/value pairs Branch, Status, Duration, Created, Notes. Existing h2 headings and aria-labelledby sections on both screens stay as they are.
    category: constraint
    applies_to: run detail
    trigger: detail view renders
    logic: IF the detail view renders THEN "Back to runs" is shown in loading, loaded, not-found and error; IF the run is loaded THEN render the heading and the five label/value pairs in that order
    violation: E2E failure
    source: FR5.1
  - id: BR5.2
    statement: The "Update status" control is a native select named exactly "Update status"; choosing a value saves it, and a failed save shows "Unable to update the status. Please try again." as an alert.
    category: constraint
    applies_to: run detail
    trigger: the user picks a status
    logic: IF a status is picked THEN request the update; on success show the returned run; on failure show the alert and keep the previous status
    violation: E2E failure
    source: FR5.2
  - id: BR5.3
    statement: Detail states keep their messages and roles - "Loading run..." (status), "Run not found." (alert), "Unable to load this run." (alert); empty notes show "None".
    category: constraint
    applies_to: RunDetailViewState
    trigger: detail phase changes
    logic: IF phase = loading|not-found|error THEN show the matching message with its role; IF notes is empty THEN show "None"
    violation: E2E failure
    source: FR5.3

  # BR6 — Create run form
  - id: BR6.1
    statement: Name, Branch and Notes keep those exact accessible names (no added required marker); every field always renders aria-invalid as "true" or "false", and invalid fields show the server's field message below the field.
    category: validation
    applies_to: NewRunFormState
    trigger: the form renders or the server returns field errors
    logic: aria-invalid = "true" IF the field has an error ELSE "false"; IF a field has an error THEN the message is shown under it and linked as its description
    violation: E2E failure
    source: FR6.1
  - id: BR6.2
    statement: The "Create run" button is the primary button, disabled while submitting; success shows 'Created run "<name>"' (status) and clears the fields; failure shows "Unable to create the run. Please try again." (alert).
    category: constraint
    applies_to: NewRunFormState
    trigger: form submitted
    logic: IF submitting THEN button disabled; IF created THEN success status, clear fields, refresh list; IF non-field failure THEN alert
    violation: E2E failure
    source: FR6.2

  # BR7 — Display formatting and tests
  - id: BR7.1
    statement: Durations show only non-zero hours, minutes and seconds, largest first, separated by single spaces; zero shows "0s".
    category: calculation
    applies_to: Run.durationSeconds display
    trigger: a duration is displayed
    logic: h = floor(s/3600), m = floor((s mod 3600)/60), r = s mod 60; output the non-zero parts as "<h>h", "<m>m", "<r>s"; IF all are zero THEN "0s". Examples 0->0s, 45->45s, 85->1m 25s, 120->2m, 3903->1h 5m 3s
    violation: E2E failure
    source: FR7.1
  - id: BR7.2
    statement: Created shows the browser-locale medium date with short time (e.g. "Nov 8, 2026, 6:47 PM"); an unparseable value is shown as received.
    category: calculation
    applies_to: Run.createdAt display
    trigger: detail view renders
    logic: IF createdAt parses as a date THEN format it as medium date + short time in the browser locale and time zone ELSE show the raw string
    violation: design review defect
    source: FR7.2
  - id: BR7.3
    statement: End-to-end tests that assert on changed text or markup are updated in the same change (including the Duration column name); no test is deleted or skipped to pass.
    category: policy
    applies_to: e2e suite
    trigger: a test fails because of an intended display change
    logic: IF a test fails due to an intended change THEN update its expectation; IF it fails otherwise THEN fix the code
    violation: build and test failure
    source: FR7.3, NFR2

  # BR8 — Parity and build health
  - id: BR8.1
    statement: Every existing flow behaves as before and no API, server or shared-type code changes. Allowed changes are apps/web/**, the root pnpm-lock.yaml, and the e2e page objects and specs updated under BR7.3.
    category: policy
    applies_to: whole change
    trigger: the change is reviewed
    logic: IF a changed file is outside apps/web/**, pnpm-lock.yaml and e2e/** THEN reject it; API, server and shared-type code are never changed
    violation: review rejection
    source: NFR1
  - id: BR8.2
    statement: Install, type-check and production build succeed with no new errors, and the full test suite passes.
    category: policy
    applies_to: build pipeline
    trigger: Build and Test
    logic: IF any of install, type-check, build or tests fails THEN the change is not done
    violation: build and test failure
    source: NFR5, NFR2
```

## Summary

| Group | Rules | What they protect |
|---|---|---|
| BR1 Theme | BR1.1–BR1.8 | Indigo accent, 8px/flat/bordered surfaces, Inter, status palette, focus ring, contrast, stylesheet cleanup, bundle size |
| BR2 Layout | BR2.1–BR2.3 | Header h1 + link, 1100px single column, mobile stacking and table scroll |
| BR3 Runs list | BR3.1–BR3.6 | Control names, table structure and sort, hover, state messages, no extra rows, numeric duration sort |
| BR4 Badge | BR4.1–BR4.2 | One shared badge, exact lowercase text, decorative static icon |
| BR5 Detail | BR5.1–BR5.3 | Layout, native Update status, state messages |
| BR6 Form | BR6.1–BR6.2 | Field names and errors, submit behavior and messages |
| BR7 Formatting | BR7.1–BR7.3 | Duration and date formats, test updates |
| BR8 Parity | BR8.1–BR8.2 | No behavior or backend change, green build and tests |
