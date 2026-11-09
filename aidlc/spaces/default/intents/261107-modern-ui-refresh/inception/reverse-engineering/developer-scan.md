# Developer Code Scan — ai-ci-reference-dashboard

Intent: `modern-ui-refresh` (refactor scope). Breadth: full scan of `./`. Depth: Minimal. Snapshot head commit: `6ede5ed837da7e6827e4a5ea4b92d117b0b4d84e`. Read-only scan: no tests, builds or programs were run.

## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `./` (whole repository, minus the left-out folders below), concretely:
  - `apps/web/` — `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/RunList.tsx`, `src/RunDetail.tsx`, `src/NewRunForm.tsx`, `src/api.ts`, `src/styles.css`
  - `apps/api/` — `package.json`, `tsconfig.json`, `tsconfig.build.json`, `.mocharc.json`, `src/app.ts`, `src/server.ts`, `src/db.ts`, `src/seed.ts`, `src/validation.ts`, `test/api.test.ts`, `test/validation.test.ts`
  - `e2e/` — `package.json`, `tsconfig.json`, `playwright.config.ts`, `playwright.config.ts.ORIG`, `README.md`, `src/components/grid.comp.ts`, `src/fixtures/baseTest.ts`, `src/pages/*.ts`, `tests/ui/*.spec.ts`, `tests/api/*.spec.ts`
  - `jenkins/` — `Dockerfile`, `docker-compose.yml`, `plugins.txt`, `.env.example`, `casc/jenkins.yaml`
  - `.github/workflows/pr-quality-gate.yml`
  - Root: `package.json`, `pnpm-workspace.yaml`, `Dockerfile`, `docker-compose.yml`, `docker-compose.staging.yml`, `build.sh`, `Jenkinsfile`, `.dockerignore`, `.gitattributes`, `.gitignore` (project part), `README.md`, `README.ci-cd.complete.md`, `GITHUB.mgmt.md`
- **Skimmed only**:
  - `pnpm-lock.yaml` (generated; consulted only for resolved versions of direct dependencies)
- **Left out**:
  - `node_modules/`, `apps/web/node_modules/`, `apps/api/node_modules/`, `e2e/node_modules/` (dependencies)
  - `apps/web/dist/`, `apps/api/dist/` (build output, git-ignored)
  - `apps/api/data/` (SQLite runtime data, git-ignored)
  - `apps/api/test-results/`, `e2e/test-results/`, `e2e/playwright-report/` (generated reports, git-ignored)
  - AI-DLC install, not project code: `.aidlc/`, `aidlc/`, `.github/agents/aidlc-*`, `.github/hooks/aidlc.json`, `.github/skills/aidlc*`, `.vscode/settings.json` (whole-file AI-DLC integration), `AGENTS.md` (entirely inside the `AI-DLC:agents` marked block), the AI-DLC block of `.gitignore`, `AIDLC.notes.md`

### Packages Found
- `quality-gate-lab` (root) — pnpm workspace root — n/a — script aggregator (`dev:*`, `build`, `compile`, `test`, `test:e2e`)
- `@qgl/web` (`apps/web`) — SPA — TypeScript/React — Release Quality Dashboard UI
- `@qgl/api` (`apps/api`) — HTTP service — TypeScript/Express on Node — REST API over SQLite, also serves the built SPA
- `ai-ci-reference-e2e` (`e2e`) — test package — TypeScript/Playwright — UI + API end-to-end suites

### Build System
- **Type**: pnpm 12.14.0 workspace (`packageManager`), Vite 8 for web, `tsc` for API, `build.sh` as single task entry point, Docker multi-stage image
- **Config Files**: `package.json` ×4, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `apps/web/vite.config.ts`, three `tsconfig*.json` + `e2e/tsconfig.json`, `apps/api/.mocharc.json`, `Dockerfile`, `docker-compose*.yml`, `build.sh`
- **Build Dependencies**: no workspace-protocol links between packages. Runtime coupling only: `@qgl/api` serves `apps/web/dist` (`WEB_DIST`); `e2e` spawns `apps/api/dist/server.js`. Root `build` = web build then API build.

### APIs Discovered
- REST/JSON — `apps/api/src/app.ts` — 7 routes (`GET /health`, `GET /api/health`, `GET /api/runs`, `GET /api/runs/:id`, `POST /api/runs`, `PATCH /api/runs/:id`, conditional `POST /api/test/reset`) plus `/api` 404 catch-all and static SPA hosting
- Client wrapper — `apps/web/src/api.ts` — 4 methods (`listRuns`, `getRun`, `createRun`, `updateStatus`)
- Client-side hash routing — `apps/web/src/App.tsx` — `#/` (list) and `#/runs/:id` (detail)

### Frameworks & Libraries
- react / react-dom — ^19.3.0 (lock 19.3.1) — UI
- vite — ^8.3.4 + @vitejs/plugin-react ^6.1.2 — dev server / bundler
- typescript — ^7.0.2 — all packages
- express — ^5.3.0 — API
- node:sqlite (`DatabaseSync`, Node built-in) — persistence
- mocha ^12.0.3, chai ^6.3.0, tsx ^4.23.15 — API tests
- @playwright/test ^1.64.1, find-up-simple ^1.0.1 — E2E
- **No UI/component library, no CSS framework, no CSS-in-JS, no preprocessor, no icon set, no web fonts.**

### Test Coverage
- **Test Directories**: `apps/api/test/` (Mocha: 16 cases), `e2e/tests/ui/` (7 files: 9 active cases + 1 skipped demo), `e2e/tests/api/` (2 files: 10 cases)
- **Test Frameworks**: Mocha + Chai (API unit/integration), Playwright (UI on Desktop Chrome + API request project)
- **Coverage Config**: absent (no c8/nyc/istanbul; no coverage thresholds). No unit/component tests for `apps/web`; no visual-regression snapshots.

### Code Quality Indicators
- **Linting**: none — no ESLint, Prettier, Stylelint or EditorConfig configuration; type checking via `tsc --noEmit` (`strict: true`) is the only static gate
- **CI/CD**: `.github/workflows/pr-quality-gate.yml` (jobs `e2e-smoke`, `docker-image`), `Jenkinsfile` (multibranch; staging deploy on `main`), `jenkins/` controller-as-code
- **Documentation**: good — `README.md`, `e2e/README.md`, `README.ci-cd.complete.md`, `GITHUB.mgmt.md`; sparse but purposeful code comments

### Technical Debt Signals
- Styling: one 18-line global stylesheet `apps/web/src/styles.css` with raw hex values, element selectors and no design tokens/custom properties; pastel status-badge palette (`#c6f6d5`, `#fed7d7`, `#bee3f8`, `#e2e8f0`) — the target of this intent
- Badge CSS class is the raw status value (`badge ${run.status}`) in `RunList.tsx:107` and `RunDetail.tsx:48` — data enum is coupled to CSS class names
- `Run`/`Status`/`STATUSES` duplicated between `apps/web/src/api.ts` and `apps/api/src/db.ts`
- `RunList` fetches on every keystroke of the search box (no debounce) — `RunList.tsx:36-47`
- Raw values rendered: ISO `createdAt`, integer `durationSeconds` — `RunDetail.tsx:51-54`
- `RunDetail` maps errors by comparing `err.message === 'Run not found'` — `RunDetail.tsx:16`
- `request()` overwrites any caller-supplied headers — `api.ts:28`
- Leftover `e2e/playwright.config.ts.ORIG`; `as unknown as` casts on DB rows in `app.ts`
- No linter/formatter, no web tests, no coverage config
- No TODO/FIXME/HACK markers, no lint suppressions, no inline `style={}` in source

## Handoff Summary
- **Intent-relevant finding**: The entire visual layer is `apps/web/src/styles.css` (18 lines, imported once in `apps/web/src/main.tsx:4`). It has no theme tokens or CSS custom properties, relies on browser-default native controls and `system-ui` font, a fixed `max-width: 860px` column, and a pastel palette whose hexes match the Chakra UI v1 `*.100` tints (= Tailwind v1 `*-200`) (`.badge.passed #c6f6d5`, `.badge.failed #fed7d7`, `.badge.running #bee3f8`, `.badge.queued #e2e8f0`, borders `#d9e2ec`, text `#1f2933`, errors `#9b2c2c`). JSX uses only five class names (`filters`, `badge <status>`, `error`, `field-error`, `sort-button`) plus `aria-sort` for the sort arrow.
- **Risks / follow-up**: The Playwright suite is the behaviour contract for the refactor and is tightly bound to DOM semantics: accessible names (`Release Quality Dashboard` link/heading, `Search runs`, `Status` combobox, `Name`/`Branch`/`Notes` labels, `Create run`, `Retry`, `Update status`), a real `<table aria-label="Test runs">` with `tbody` rows and `td:nth-child` columns, row counts that include the header row, `#detail-heading`, `role="status"`/`role="alert"`, `aria-invalid`/`aria-describedby`, and exact text such as `No test runs match your filters.` and lowercase status text. `Grid.getColumnValues`/`getRowValues` read `innerText`, so a CSS `text-transform` or extra visible text inside cells changes test results. A restyle must keep these or update e2e page objects in the same change. No linter or web unit tests exist to catch regressions, and there is no visual-regression baseline.
