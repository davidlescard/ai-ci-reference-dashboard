# Unit Test Instructions — modern-ui-refresh

## Framework and setup

- Runner: Playwright Test (`@playwright/test`, already in `e2e/package.json`). No new test tooling is added.
- A new `unit` project in `e2e/playwright.config.ts` runs `e2e/tests/unit/**`. It uses no browser and no app server; the tests import the pure modules `apps/web/src/format.ts` and `apps/web/src/tokens.ts` directly.
- Browser tests for this work live in `e2e/tests/ui/modern-ui.spec.ts` and use the existing `@fixtures/baseTest` fixtures (one API server per worker with an in-memory database, reset before each test).
- Prerequisites, once per checkout:
  1. `pnpm install`
  2. `pnpm exec playwright install chromium` (from `e2e/`, if the browser is not installed)
  3. `pnpm build` from the repo root before any browser test, because the test server serves the built web app from `apps/api/dist`.

## How to run this work's tests

Run each command from the repo root, as a command of its own.

1. Unit tests (U1–U3), runnable before any UI code exists:

   ```
   pnpm --filter ai-ci-reference-e2e exec playwright test --project=unit
   ```

2. New browser tests (E1–E6), after `pnpm build`:

   ```
   pnpm --filter ai-ci-reference-e2e exec playwright test tests/ui/modern-ui.spec.ts --project=ui
   ```

3. Type-check of the web app:

   ```
   pnpm --filter @qgl/web compile
   ```

The full existing suite (`pnpm test:e2e`, `pnpm test`) is run by Build and Test; it must stay green (NFR2).

Runner check (Code Generation, Step 2): `pnpm --filter ai-ci-reference-e2e exec playwright test --project=unit --list` resolves the `unit` project and lists 3 tests in 2 files (`unit/format.spec.ts`, `unit/tokens.spec.ts`). Because the top-level `testDir` is `./tests`, `pnpm test:e2e` now also runs the `unit` project with the `ui` and `api` projects.

## Tests in scope (Minimal strategy)

| ID | File | Checks | Requirement |
|---|---|---|---|
| U1 | `e2e/tests/unit/format.spec.ts` | `formatDuration` pass examples `0s`, `45s`, `1m 25s`, `2m`, `1h 5m 3s` | FR7.1 |
| U2 | `e2e/tests/unit/format.spec.ts` | `formatCreated` readable output; invalid input returned unchanged | FR7.2 |
| U3 | `e2e/tests/unit/tokens.spec.ts` | WCAG contrast at least 4.5:1 for status chips, text and header | FR1.3, NFR3 |
| E1 | `e2e/tests/ui/modern-ui.spec.ts` | h1 + link "Release Quality Dashboard"; indigo header | FR2.1, FR1.2 |
| E2 | same | badges: lowercase text, `aria-hidden` icon, filled color | FR4.1, FR4.2 |
| E3 | same | `5m 12s` in list and detail; Created is not raw ISO | FR7.1, FR7.2, FR5.1 |
| E4 | same | not-found shows alert and "Back to runs" | FR5.3 |
| E5 | same | 375px: no page sideways scroll; table scrolls | FR2.3 |
| E6 | same | keyboard focus shows a 2px solid outline | NFR3 |

## Expected coverage targets

The refactor scope sets no coverage floor and no threshold is configured. The obligation is one test per new requirement (above) plus the existing suite staying green.

## Mocking and stubbing

- Unit tests need no mocks: both modules are pure. `formatCreated` uses `Intl`; assertions avoid locale-specific text (they check "not the ISO string" and "contains the year") so they pass in any locale and time zone.
- Browser tests use the real API with seeded data. E4 uses a run id that does not exist instead of route mocking.

## Test data

- Seed data from `apps/api/src/seed.ts`, restored before each test by the `resetData` fixture. "Checkout Regression" has `durationSeconds: 312` (`5m 12s`).
- No test creates data that another test depends on.
