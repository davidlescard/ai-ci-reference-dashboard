# Code Generation Plan — modern-ui-refresh

## Summary

- Builds: the MUI-based modern UI for `apps/web` (indigo header bar, cards, filled status chips, readable durations and dates)
- Touches: `apps/web/src/*`, `apps/web/package.json`, root `pnpm-lock.yaml`, `e2e/src/pages/dashboard.page.ts`, `e2e/playwright.config.ts`, new tests under `e2e/tests/`
- Tests: 9 new tests (3 unit, 6 browser) plus the existing API and E2E suites kept green

## Context

- Zero-Unit refactor on existing code (brownfield). Work happens in place; no duplicate files.
- Inputs: [requirements.md](../../inception/requirements-analysis/requirements.md), [functional-spec.md](../functional-design/functional-spec.md), [rules.md](../functional-design/rules.md), [entities.md](../functional-design/entities.md), [frontend-components.md](../functional-design/frontend-components.md).
- Testing Contract: test-after, Minimal strategy, refactor scope (existing suite stays green; no extra coverage floor).
- Allowed file changes (BR8.1): `apps/web/**`, root `pnpm-lock.yaml`, `e2e/**`. No API, server, shared-type or database changes (NFR1).
- No new tooling (requirements Constraints): the new unit tests run on the Playwright runner the project already has, as a separate `unit` project. No Vitest, linters, formatters or screenshot tests.
- Every interactive element touched gets a `data-testid` (search, status filter, sort buttons, run links, retry, form fields, create button, back link, update status). Existing tests keep using roles and names.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "refactor",
  "test_strategy": "minimal",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:06c12367ad8c44802c849bfad1d351bad9312bf5dfa96742a3ea92f337cd806c",
  "contract_sha256": "sha256:be24de49065e6c54a26024b4a9117dabfa3bc2a5a7d4774a9ade02b7d86b1894"
}
```

Layers that do not apply to this frontend-only refactor: data model, repository and API (NFR1 forbids changes there). Business logic here is the pure `format.ts` and `tokens.ts` modules (Steps 3–4); frontend behavior is Steps 5–9.

## Steps

### Step 1 — Dependencies and project skeleton
- [x] Add to `apps/web/package.json`: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` (current stable MUI major, v7+), `@fontsource/inter`.
- [x] Run `pnpm install` so the root `pnpm-lock.yaml` is updated (the CI build installs with `--frozen-lockfile`).
- Traces: FR1.1, BR1.8, BR8.1

### Step 2 — Verify the test runner and record the commands
- [x] Add a `unit` project to `e2e/playwright.config.ts` (`testDir: './tests/unit'`, no browser, no server fixture). The `ui` and `api` projects are unchanged.
- [x] Confirm `pnpm --filter ai-ci-reference-e2e exec playwright test --project=unit --list` runs, and record the exact commands in [unit-test-instructions.md](./unit-test-instructions.md).
- Traces: Testing Contract (runner ready before the first test)

### Step 3 — Design tokens and theme (business logic: pure modules)
- [x] New `apps/web/src/tokens.ts`: plain color and size values from entities.md `ThemeTokens` (accent `#4F46E5`, page `#F8FAFC`, surface `#FFFFFF`, text `#0F172A`/`#475569`, border `#E2E8F0`, row hover `#F1F5F9`, header background = accent, header text `#FFFFFF`, radius 8) and `statusStyles` (queued `#475569`, running `#1D4ED8`, passed `#15803D`, failed `#B91C1C`, white text). No MUI import, so tests can load it without a browser. Small deviation from frontend-components.md, which put `statusStyles` in `theme.ts`; `theme.ts` re-exports it.
- [x] New `apps/web/src/theme.ts`: `createTheme` from the tokens. Inter typography; radius 8; flat bordered `Paper`/`Card` (no shadow); `MuiButton` no uppercase; `MuiTableRow` hover `#F1F5F9`; per-control focus ring overrides (`MuiButtonBase` `&.Mui-focusVisible`, `MuiOutlinedInput` `&.Mui-focused`, `a:focus-visible` in `CssBaseline`; white ring inside the header).
- [x] New `apps/web/src/format.ts`: `formatDuration(seconds)` (non-zero units largest first, `0s` for zero) and `formatCreated(iso)` (`Intl.DateTimeFormat` medium date + short time; raw string if it does not parse).
- Traces: FR1.2, FR1.3, FR7.1, FR7.2, NFR3, BR1.1–BR1.6, BR3.3, BR4.1, BR7.1, BR7.2

### Step 4 — Unit tests for the pure modules (write and run)
- [x] `e2e/tests/unit/format.spec.ts`:
  - U1 `formatDuration`: `0`→`0s`, `45`→`45s`, `85`→`1m 25s`, `120`→`2m`, `3903`→`1h 5m 3s` (FR7.1).
  - U2 `formatCreated`: a valid ISO string gives a readable date that is not the ISO text and contains the year; an invalid string comes back unchanged (FR7.2, BR7.2).
- [x] `e2e/tests/unit/tokens.spec.ts`:
  - U3 contrast: white on each status color, primary and secondary text on the page and surface colors, and white on the header background all reach at least 4.5:1 (FR1.3, NFR3).
- [x] Run the unit command from Step 2; all 3 pass.

### Step 5 — App shell (frontend)
- [x] `main.tsx`: wrap `<App/>` in `ThemeProvider` + `CssBaseline`; import Inter 400/500/600/700.
- [x] New `AppHeader.tsx`: `AppBar position="static" elevation={0}`, indigo background, white `Typography component="h1"` wrapping the link to `#/` named "Release Quality Dashboard".
- [x] `App.tsx`: use `AppHeader` and `Container maxWidth={false} sx={{ maxWidth: 1100 }}`; hash routing unchanged.
- Traces: FR1.1, FR2.1, FR2.2, BR2.1, BR2.2

### Step 6 — Status badge and runs list (frontend)
- [x] New `StatusBadge.tsx`: filled `Chip`, color from `statusStyles`, white lowercase label, static `aria-hidden` icon (`ScheduleOutlined`, `Sync`, `CheckCircleOutline`, `ErrorOutline`) imported by path.
- [x] `RunList.tsx`: card layout; `TextField type="search"` "Search runs"; native `TextField select` "Status" via `slotProps.select.native` with "All statuses"; MUI `Table` in a horizontally scrolling `TableContainer` with `aria-label="Test runs"`; `TableSortLabel` headers with `ascending`/`descending` mapped to `asc`/`desc`; header label "Duration"; durations via `formatDuration` (sorting stays numeric); `TableRow hover`; loading `role="status"`, empty text, one `Alert` with Retry. Filters stack under 600px. `h2` "Test runs" section kept.
- Traces: FR3.1–FR3.4, FR4.1, FR4.2, FR2.3, FR7.1, BR3.1–BR3.6, BR4.1, BR4.2

### Step 7 — Run detail and create form (frontend)
- [x] `RunDetail.tsx`: card; "Back to runs" outside the state branches (every state); `h2#detail-heading`; label/value grid with `StatusBadge`, "Duration" via `formatDuration`, Created via `formatCreated`, Notes "None" when empty; native select "Update status"; `Alert` for update and load errors; same messages and roles.
- [x] `NewRunForm.tsx`: `TextField` Name, Branch, Notes (multiline) with `error={!!errors.x}` and `helperText`; no `required`; `noValidate` kept; contained primary "Create run" button disabled while submitting; same success/failure messages and roles. Fields stack under 600px.
- [x] `styles.css`: remove the rules MUI now covers; keep at most a minimal body rule, or delete the file and its import if nothing remains.
- Traces: FR2.3, FR5.1–FR5.3, FR6.1, FR6.2, FR7.2, FR1.4, BR5.1–BR5.3, BR6.1, BR6.2

### Step 8 — Update the existing E2E tests for changed text
- [x] `e2e/src/pages/dashboard.page.ts`: `RUN_COLUMNS` `'Duration (s)'` → `'Duration'`.
- [x] Fix any other locator the new markup breaks, without deleting a test (FR7.3).
- Traces: FR7.3, BR7.3

### Step 9 — Browser tests for the new UI (write and run)
- [x] New `e2e/tests/ui/modern-ui.spec.ts` (uses the existing fixtures):
  - E1 header: a level-1 heading and a link both named "Release Quality Dashboard"; header background is `rgb(79, 70, 229)` (FR2.1, FR1.2).
  - E2 status badges: each badge shows the lowercase status, has an `aria-hidden` icon, and uses its filled status color (FR4.1, FR4.2, FR1.3).
  - E3 readable values: "Checkout Regression" shows `5m 12s` in the list; its detail page shows `5m 12s` and a Created value that is not the raw ISO string (FR7.1, FR7.2, FR5.1).
  - E4 detail not-found: `#/runs/999999` shows "Run not found." as an alert and the "Back to runs" link (FR5.3, BR5.1).
  - E5 narrow screen: at 375px wide the page does not scroll sideways and the table container does (FR2.3).
  - E6 keyboard focus: tabbing to "Search runs" and to "Create run" shows a 2px solid outline (NFR3, BR1.5).
- [x] Run the new spec, then the full existing suite.
- Traces: FR1.2, FR1.3, FR2.1, FR2.3, FR4.1, FR4.2, FR5.1, FR5.3, FR7.1, FR7.2, NFR2, NFR3

### Step 10 — Build checks and documentation
- [x] `pnpm --filter @qgl/web compile` and `pnpm build` succeed with no new errors (NFR5).
- [x] Note the gzipped JS size from the Vite build output for Build and Test (NFR4, budget 300 KB).
- [x] Write `code-summary.md` and generate `traceability.json`.
- Traces: NFR4, NFR5

## Requirement coverage

| Requirement | Steps | Tests |
|---|---|---|
| FR1.1 | 1, 5 | build (Step 10) |
| FR1.2 | 3, 5 | E1 |
| FR1.3 | 3, 6 | U3, E2 |
| FR1.4 | 7 | existing suite |
| FR2.1 | 5 | E1, existing `base.page` locator |
| FR2.2 | 5 | existing suite |
| FR2.3 | 6, 7 | E5 |
| FR3.1 | 6 | existing status-filter and dashboard specs |
| FR3.2 | 6, 8 | existing dashboard spec (columns, sort) |
| FR3.3 | 3, 6 | existing dashboard spec (run links) |
| FR3.4 | 6 | existing error-state spec |
| FR4.1 | 6 | E2 |
| FR4.2 | 6 | E2 |
| FR5.1 | 7 | E3 |
| FR5.2 | 7 | existing status-filter spec (updates a status on the detail page) |
| FR5.3 | 7 | E4 |
| FR6.1 | 7 | existing validation spec |
| FR6.2 | 7 | existing create-run spec |
| FR7.1 | 3, 6, 7 | U1, E3 |
| FR7.2 | 3, 7 | U2, E3 |
| FR7.3 | 8 | full E2E suite |
| NFR1 | all | existing API + E2E suites |
| NFR2 | 9 | full suite |
| NFR3 | 3 | U3, E6 |
| NFR4 | 1, 10 | Build and Test measures |
| NFR5 | 10 | compile + build |

## Out of scope

No changes to `apps/api`, shared types, the database, CI files or project docs. No dark mode.
