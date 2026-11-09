# Component Inventory — ai-ci-reference-dashboard

Each heading below is a component name used verbatim in the Scope of Analysis block. Dependencies reference other components by heading name; file-level adjacency is in `code-structure.md`.

## Web (`apps/web`)

### web-App
- **Files**: `apps/web/src/main.tsx`, `apps/web/src/App.tsx`, `apps/web/index.html`
- **Responsibility**: Bootstraps React (`StrictMode`), imports the global stylesheet, renders the page shell (`<main>`, `<header>`, `<h1><a href="#/">Release Quality Dashboard</a>`), and routes by URL hash.
- **Depends on**: web-RunList, web-RunDetail, web-global-stylesheet

### web-RunList
- **Files**: `apps/web/src/RunList.tsx`
- **Responsibility**: Search box and status filter (server-side), sortable runs table (client-side), loading/empty/error+Retry states, status badges; hosts the create form.
- **Depends on**: web-api-client, web-NewRunForm, web-global-stylesheet

### web-RunDetail
- **Files**: `apps/web/src/RunDetail.tsx`
- **Responsibility**: Back link, run heading `#detail-heading`, definition list of fields with status badge, "Update status" select, load/update error alerts.
- **Depends on**: web-api-client, web-global-stylesheet

### web-NewRunForm
- **Files**: `apps/web/src/NewRunForm.tsx`
- **Responsibility**: Name/Branch/Notes form (`noValidate`), maps server `fieldErrors` to `aria-invalid` + `aria-describedby` messages, success `role="status"`, disables submit while pending.
- **Depends on**: web-api-client, web-global-stylesheet

### web-api-client
- **Files**: `apps/web/src/api.ts`
- **Responsibility**: Typed `fetch` wrapper, `Run`/`Status`/`STATUSES` types, `ApiError`.
- **Depends on**: api-app (over HTTP)

### web-global-stylesheet
- **Files**: `apps/web/src/styles.css`
- **Responsibility**: All visual styling: typography, layout width, form controls, table, status badges, error colour, sort arrows. No tokens or variables. Palette and selectors are recorded in `technology-stack.md` § Styling and Theming.
- **Depends on**: none

## API (`apps/api`)

### api-server
- **Files**: `apps/api/src/server.ts`
- **Responsibility**: Process entry. Reads env config, creates the data dir, opens and seeds the DB, starts the HTTP listener.
- **Depends on**: api-app, api-db, api-seed

### api-app
- **Files**: `apps/api/src/app.ts`
- **Responsibility**: Express app factory: health, runs CRUD subset, optional test reset, `/api` 404, static SPA hosting, JSON error handler.
- **Depends on**: api-db, api-seed, api-validation

### api-db
- **Files**: `apps/api/src/db.ts`
- **Responsibility**: SQLite connection (`node:sqlite`), `runs` schema, `Run` type, `STATUSES`, column aliasing.
- **Depends on**: none (Node built-in)

### api-seed
- **Files**: `apps/api/src/seed.ts`
- **Responsibility**: Eight deterministic seed runs, transactional reset, seed-if-empty.
- **Depends on**: api-db

### api-validation
- **Files**: `apps/api/src/validation.ts`
- **Responsibility**: `isStatus`, `validateNewRun` (trim, length, enum, defaults).
- **Depends on**: api-db

### api-tests
- **Files**: `apps/api/test/api.test.ts`, `apps/api/test/validation.test.ts`, `apps/api/.mocharc.json`
- **Responsibility**: 16 Mocha cases over HTTP (ephemeral port, in-memory DB) and the validator.
- **Depends on**: api-app, api-db, api-seed, api-validation

## End-to-end (`e2e`)

### e2e-fixtures
- **Files**: `e2e/src/fixtures/baseTest.ts`, `e2e/playwright.config.ts`
- **Responsibility**: Starts one server per worker (port 3100+index, `:memory:`, reset enabled) or targets `BASE_URL`. Resets data before each test. Projects `ui` (Desktop Chrome) and `api`. Reporters: list, html, junit.
- **Depends on**: api-server (built `apps/api/dist/server.js`)

### e2e-page-objects
- **Files**: `e2e/src/pages/base.page.ts`, `e2e/src/pages/dashboard.page.ts`, `e2e/src/pages/run-detail.page.ts`, `e2e/src/components/grid.comp.ts`
- **Responsibility**: Role, label, and text locators for every UI element the tests touch. `Grid` handles table reads, sorting, and clicks.
- **Depends on**: web-App, web-RunList, web-RunDetail, web-NewRunForm (DOM contract)

### e2e-specs
- **Files**: `e2e/tests/ui/*.spec.ts` (create-run, dashboard, error-state, post-deploy, status-filter, validation, skipped failure-demo), `e2e/tests/api/*.spec.ts` (runs, post-deploy)
- **Responsibility**: Behaviour contract for the UI and API, tagged `@smoke`, `@regression`, `@post-deploy`.
- **Depends on**: e2e-fixtures, e2e-page-objects

## Delivery

### container-packaging
- **Files**: `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `docker-compose.staging.yml`, `build.sh`
- **Responsibility**: Multi-stage image (web + API build, prod deps only), runs as `node`, HEALTHCHECK on `/health`. Compose files for local (3000) and staging (3001). `build.sh` is the task entry point.
- **Depends on**: api-server, web-App

### ci-github-actions
- **Files**: `.github/workflows/pr-quality-gate.yml`
- **Responsibility**: PR to `main` runs two parallel jobs. `e2e-smoke` runs compile, Mocha, build, then the Playwright `@smoke` suite from source. `docker-image` builds the image, health-checks it, then runs `@smoke` against the container with 1 worker.
- **Depends on**: container-packaging, e2e-specs

### ci-jenkins
- **Files**: `Jenkinsfile`, `jenkins/Dockerfile`, `jenkins/docker-compose.yml`, `jenkins/casc/jenkins.yaml`, `jenkins/plugins.txt`, `jenkins/.env.example`
- **Responsibility**: Local multibranch pipeline: install, compile, unit tests, build, container health check, full Playwright suite. On `main` it also publishes to GHCR (optional), deploys to staging, and runs the post-deploy smoke tests.
- **Depends on**: container-packaging, e2e-specs
