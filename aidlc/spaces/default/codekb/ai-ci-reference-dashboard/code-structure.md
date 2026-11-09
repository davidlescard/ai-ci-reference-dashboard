# Code Structure — ai-ci-reference-dashboard

## Repository Layout

```
./
├─ package.json, pnpm-workspace.yaml, pnpm-lock.yaml   workspace root (packages: apps/*, e2e)
├─ build.sh                                            single task entry point (install|compile|test|test-junit|build|start|e2e|docker|all)
├─ Dockerfile, .dockerignore                           multi-stage image (build → runtime on node:24-slim)
├─ docker-compose.yml, docker-compose.staging.yml      local app (3000, reset on) / staging (3001)
├─ Jenkinsfile, jenkins/                               Jenkins pipeline + controller-as-code
├─ .github/workflows/pr-quality-gate.yml               PR gate (e2e-smoke, docker-image)
├─ README.md, README.ci-cd.complete.md, GITHUB.mgmt.md docs
├─ apps/
│  ├─ web/   index.html, vite.config.ts, tsconfig.json, src/{main,App,RunList,RunDetail,NewRunForm}.tsx, src/api.ts, src/styles.css
│  └─ api/   src/{server,app,db,seed,validation}.ts, test/{api,validation}.test.ts, .mocharc.json, tsconfig*.json
└─ e2e/      playwright.config.ts, src/{fixtures,pages,components}/, tests/{ui,api}/, README.md
```

## File Classification

| File | Category | Notes |
|---|---|---|
| `apps/web/src/main.tsx` | Configuration (bootstrap) | `createRoot`, `StrictMode`, imports `styles.css` |
| `apps/web/src/App.tsx` | Controller (routing) | Hash parser `#/runs/:id`, page shell (header/h1) |
| `apps/web/src/RunList.tsx` | UI view | Filters, sortable table, empty/error/loading states, hosts `NewRunForm` |
| `apps/web/src/RunDetail.tsx` | UI view | `<dl>` of fields, status select |
| `apps/web/src/NewRunForm.tsx` | UI view | Controlled form, server-side field errors |
| `apps/web/src/api.ts` | Service (HTTP client) + Model | `Run`, `Status`, `STATUSES`, `ApiError`, `api.*` |
| `apps/web/src/styles.css` | Static/Asset | **Only stylesheet** (18 rules) |
| `apps/web/index.html` | Static/Asset | `#root`, title, viewport; no favicon/fonts |
| `apps/web/vite.config.ts` | Configuration | React plugin, port 5173, `/api` proxy → 3000 |
| `apps/api/src/server.ts` | Configuration (entry) | Env: `PORT`, `DB_PATH`, `WEB_DIST`, `ENABLE_TEST_RESET` |
| `apps/api/src/app.ts` | Controller | All routes, static hosting, error handler (`createApp`) |
| `apps/api/src/db.ts` | Model + Repository | Schema DDL, `Run`, `STATUSES`, `RUN_COLUMNS`, `openDb` |
| `apps/api/src/seed.ts` | Migration/fixture | `SEED_RUNS`, `resetAndSeed`, `seedIfEmpty` |
| `apps/api/src/validation.ts` | Utility (validator) | `isStatus`, `validateNewRun` |
| `apps/api/test/*.test.ts` | Test | Mocha + Chai; in-memory DB |
| `e2e/src/fixtures/baseTest.ts` | Test fixture | Per-worker server spawn, auto reset |
| `e2e/src/pages/*.page.ts`, `e2e/src/components/grid.comp.ts` | Test (page objects) | Role/label locators; `Grid` table helper |
| `e2e/tests/**` | Test | `@smoke`, `@regression`, `@post-deploy` tags |

## Code Patterns

- **Web**: function components + hooks only; local `useState`; effect-with-`cancelled` flag to ignore stale responses; `reloadKey` counter to force refetch; uncontrolled→controlled form via state; semantic HTML (`section aria-labelledby`, `table aria-label`, `th scope`, `dl`, `role="status"/"alert"`).
- **Styling**: global element selectors (`body`, `main`, `label`, `input`, `table`, `th`, `td`, `button`) and five class names (`filters`, `badge` + status modifier, `error`, `field-error`, `sort-button`); attribute selector `th[aria-sort]` drives sort arrows via `::after`. No CSS modules, no `className` composition helpers, no inline styles. Details in `technology-stack.md` § Styling and Theming.
- **API**: factory `createApp(db, options)` for testability; prepared statements with named params; camelCase aliasing in SQL; validation returns `{ value } | { errors }`; uniform error body `{ error }` or `{ errors: {field: msg} }`.
- **E2E**: Page Object Model with role-based locators, worker-scoped server fixture, `auto` reset fixture, path aliases `@fixtures/*`, `@pages/*`, `@components/*`.

## Module Dependency Adjacency

```
web:  main.tsx → App.tsx, styles.css
      App.tsx → RunList.tsx, RunDetail.tsx
      RunList.tsx → api.ts, NewRunForm.tsx
      RunDetail.tsx → api.ts
      NewRunForm.tsx → api.ts
api:  server.ts → app.ts, db.ts, seed.ts
      app.ts → db.ts, seed.ts, validation.ts
      seed.ts → db.ts (types)
      validation.ts → db.ts
e2e:  tests/* → fixtures/baseTest.ts, pages/*
      baseTest.ts → pages/dashboard.page.ts
      dashboard.page.ts → components/grid.comp.ts, pages/base.page.ts
      run-detail.page.ts → pages/base.page.ts, pages/dashboard.page.ts (type)
```

No circular references.
