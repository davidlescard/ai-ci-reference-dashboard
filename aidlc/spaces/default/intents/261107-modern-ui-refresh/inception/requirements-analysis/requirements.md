# Requirements — modern-ui-refresh

## Intent Analysis

The Release Quality Dashboard (`apps/web`) works but looks dated: pastel status badges, browser-default controls, `system-ui` text in a narrow 860px column, all from one 18-line stylesheet. The goal is a modern, credible UI in a clean, neutral GitHub/Linear style, with no change to what the dashboard does. The work replaces the native controls with MUI, adds an app shell and card layout, and makes a few small readability improvements. The existing end-to-end suite stays the safety net.

## Functional Requirements

### FR1 — Design system foundation (MUI theme)
- **FR1.1** Add MUI (`@mui/material` and its Emotion peer dependencies) to `apps/web` and wrap the app in a single `ThemeProvider` with `CssBaseline`.
- **FR1.2** Customize the theme to a neutral light look: slate/gray background and surfaces, one strong accent as `primary`, a modern sans-serif type scale, moderate corner radius, subtle borders instead of heavy Material shadows.
- **FR1.3** Define the four status colors (queued, running, passed, failed) once in the theme, with saturated but accessible tones that replace the pastel hex values.
- **FR1.4** Retire the hand-written rules in `styles.css` that MUI now covers. Keep only global rules that are still needed.

### FR2 — App shell and layout
- **FR2.1** Add a top header bar (MUI `AppBar`/`Toolbar`) that shows the "Release Quality Dashboard" title as a link to `#/`. The title stays a level-1 heading (`h1`, e.g. `Typography component="h1"`) that contains the link. Pass: the page has a heading named "Release Quality Dashboard" and a link with the same name.
- **FR2.2** Place the runs list, the create-run form and the run detail in card-style panels (MUI `Card`/`Paper`) inside a centered, wider container.
- **FR2.3** Make the layout responsive. On narrow viewports (< 600px) the filters and form fields stack vertically and the table scrolls horizontally instead of overflowing the page.

### FR3 — Runs list view
- **FR3.1** Render the search filter with MUI `TextField` and the status filter with MUI's **native** select variant (`TextField select` with `SelectProps={{ native: true }}` or `NativeSelect`), so it remains a real `<select>`. Pass: the controls' accessible names are exactly "Search runs" and "Status", the "All statuses" option remains, and Playwright `selectOption()` works on the status filter.
- **FR3.2** Render the runs table with MUI `Table` components, keeping a real `<table>` with accessible name "Test runs", the column headers Name | Branch | Status | Duration, and sortable header buttons with `aria-sort`. The duration header is renamed from "Duration (s)" to "Duration" because FR7.1 changes the value format.
- **FR3.3** Add row hover highlighting. Run names remain links to `#/runs/{id}`.
- **FR3.4** Show loading (`role="status"`), empty ("No test runs match your filters.") and error (`role="alert"` with Retry) states styled with MUI components (e.g. `Alert`, `CircularProgress`/`LinearProgress`) and the same messages.

### FR4 — Status badges
- **FR4.1** Replace the pastel `.badge` spans with a reusable status badge component (MUI `Chip`) colored from FR1.3, used in both the list and the detail view.
- **FR4.2** Show a status icon beside the badge text (e.g. schedule, sync, check, error icons for queued, running, passed, failed). The icon is decorative (`aria-hidden`) and the badge text stays the lowercase status value.

### FR5 — Run detail view
- **FR5.1** Show the run in a card with the run name as the `#detail-heading` heading, the "Back to runs" link and the details as a clean label/value layout. The duration label is renamed from "Duration (s)" to "Duration" (see FR3.2).
- **FR5.2** Render "Update status" with MUI's **native** select variant (as in FR3.1). Pass: its accessible name is exactly "Update status" and Playwright `selectOption()` works on it. Update errors still appear as `role="alert"`.
- **FR5.3** Keep the detail view's other states, styled with MUI, with the same messages and roles:
  - Loading: "Loading run..." with `role="status"`.
  - Not found: "Run not found." with `role="alert"`.
  - Load error: "Unable to load this run." with `role="alert"`.
  - Empty notes: shown as "None".

### FR6 — Create run form
- **FR6.1** Render Name, Branch and Notes with MUI `TextField` (Notes multiline), keeping their accessible names, `aria-invalid` and field error messages.
- **FR6.2** Render "Create run" as a primary MUI `Button`, disabled while submitting. Success (`role="status"`) and failure (`role="alert"`) messages keep their wording.

### FR7 — UX polish
- **FR7.1** Show durations in readable form wherever `durationSeconds` is displayed. Sorting by duration stays numeric. Format rules:
  - Show only the non-zero units, largest first (hours, then minutes, then seconds), separated by single spaces.
  - Zero seconds shows `0s`.
  - Pass examples: `0` gives `0s`, `45` gives `45s`, `85` gives `1m 25s`, `120` gives `2m`, and `3903` gives `1h 5m 3s`.
- **FR7.2** Show the detail view's Created timestamp as a readable local date and time instead of the raw ISO string.
- **FR7.3** Update the Playwright tests that assert on raw duration or date text, or on markup changed by FR3–FR6, so they assert the new output. This includes the expected column list (`RUN_COLUMNS` in `e2e/src/pages/dashboard.page.ts`) for the "Duration" header rename. No test is deleted to make the suite pass.

## Non-Functional Requirements

- **NFR1 (Behavior parity)** Every existing user flow (list, search, filter, sort, view detail, update status, create run, error/retry) works the same, and no API, server or shared-type code changes.
- **NFR2 (Test suite green)** The full existing test suite (API tests and Playwright E2E) passes after the change. Any regression is fixed in this work, per FR7.3.
- **NFR3 (Accessibility)** Text and status colors meet WCAG 2.1 AA contrast (4.5:1 for normal text). Every control keeps a visible keyboard focus indicator and its current accessible name.
- **NFR4 (Bundle size)** The production build of `apps/web` stays below 300 KB gzipped JavaScript. MUI is imported per component (no wildcard icon imports).
- **NFR5 (Build health)** `pnpm` install, TypeScript type-check and the Vite production build succeed with no new errors.

## Constraints

- Styling library is MUI (Q2/Q5). Its theme is customized toward the neutral look rather than stock Material Design (Q1).
- Frontend-only change, confined to `apps/web`. No backend, API or data-model changes.
- The Playwright suite locates elements by accessible names, roles, table structure and visible text (see codekb `code-quality-assessment.md` § UI Refactor Constraints). Where FR7 changes visible text, tests are updated in the same change.
- No new tooling: no screenshot tests and no linters or formatters (Q4).
- Refactor plan testing posture: the existing suite must stay green, with no extra coverage floor.

## Assumptions

- [assumption] "Neutral GitHub/Linear style" means a light theme only. Dark mode is not required (Q1 chose A over C).
- [assumption] `@mui/icons-material` is acceptable for the status icons (FR4.2) as long as the icons are imported one by one (NFR4).
- [assumption] The 300 KB gzipped budget (NFR4) is enough for MUI core plus the few components used. It is a ceiling to check in Build and Test, not a measured baseline.
- [assumption] Readable dates use the browser's locale (`Intl.DateTimeFormat`), so no date library is added.

## Out of Scope

- Dark mode and theme switching.
- Screenshot or visual regression tests, Stylelint and Prettier.
- New features, new pages, routing changes, or changes to the API, server or database.
- Branding work (logo, custom illustrations).

## Open Questions

- The exact accent color and type face (e.g. Inter vs the system font stack) are left for Functional Design.
- Functional Design sets concrete, checkable values for corner radius, border, row hover background and keyboard focus indicator (width and contrast). These values become the acceptance reference for FR1.2, FR3.3 and NFR3.
- Functional Design states explicit pass criteria for two test-sensitive rules:
  - Nothing extra is rendered inside the runs table: no placeholder or progress rows, so row counts stay the same.
  - Status badge text stays exactly the lowercase status value, with no `text-transform` and no text added by the icon.

## Sources

- Initial description: modernize the dated, pastel-colored UI [desc]
- Workflow-selected scope: refactor [scope]
- Visual direction A, neutral light theme [Q1]
- Styling approach: component library [Q2]
- Refresh depth C: visual, layout and UX polish, tests updated where needed [Q3]
- Protection: nothing new, fix regressions [Q4]
- Component library: MUI [Q5]
- Codebase facts from codekb `code-quality-assessment.md`, `component-inventory.md` and source review of `apps/web/src`
