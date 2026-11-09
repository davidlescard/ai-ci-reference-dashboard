# API Documentation — ai-ci-reference-dashboard

All endpoints are defined in `apps/api/src/app.ts` (`createApp`). JSON in/out (`express.json()`). No authentication, authorization, rate limiting or CORS configuration (same-origin by design: SPA is served by the same process or proxied by Vite).

## Data Model

`runs` table (`apps/api/src/db.ts`), exposed as `Run`:

| Field (JSON) | Column | Type | Rules |
|---|---|---|---|
| `id` | `id` | integer | PK autoincrement |
| `name` | `name` | string | required, trimmed, 3–80 chars |
| `branch` | `branch` | string | required, trimmed, ≤ 80 chars |
| `status` | `status` | `queued \| running \| passed \| failed` | DB `CHECK`; default `queued` on create |
| `durationSeconds` | `duration_seconds` | integer | default 0; not settable through the API |
| `notes` | `notes` | string | trimmed, ≤ 500 chars, default `''` |
| `createdAt` | `created_at` | ISO-8601 string | set by server on insert |

## REST Endpoints

| Method & path | Request | Success | Errors |
|---|---|---|---|
| `GET /health`, `GET /api/health` | — | `200 {"status":"ok"}` (runs `SELECT 1`) | 500 |
| `GET /api/runs` | query `search` (name contains, trimmed), `status` (enum) | `200 Run[]` ordered `created_at DESC, id DESC` | `400 {"errors":{"status":"Invalid status filter"}}` |
| `GET /api/runs/:id` | path `id` | `200 Run` | `404 {"error":"Run not found"}` |
| `POST /api/runs` | body `{name, branch, status?, notes?}` | `201 Run` | `400 {"errors":{field: message}}`; `400 {"error":"Invalid JSON body"}` |
| `PATCH /api/runs/:id` | body `{status}` | `200 Run` | `400 {"errors":{"status":...}}`; `404 {"error":"Run not found"}` |
| `POST /api/test/reset` | — (only if `enableTestReset`) | `204` (reseeds 8 runs, resets ids) | 404 when disabled |
| `ANY /api/*` (unmatched) | — | — | `404 {"error":"Not found"}` |
| `GET /*` (non-API) | — | static files from `WEB_DIST` when `index.html` exists | — |

Error handler: body-parse failures → `400 Invalid JSON body`; anything else → `500 Internal server error`.

Validation messages (contracted by tests): `Name is required`, `Name must be at least 3 characters`, `Name must be at most 80 characters`, `Branch is required`, `Branch must be at most 80 characters`, `Status must be one of: queued, running, passed, failed`, `Notes must be at most 500 characters`.

## Internal Client API (`apps/web/src/api.ts`)

| Function | Calls | Returns |
|---|---|---|
| `api.listRuns(search, status)` | `GET /api/runs?…` | `Promise<Run[]>` |
| `api.getRun(id)` | `GET /api/runs/:id` | `Promise<Run>` |
| `api.createRun({name, branch, notes})` | `POST /api/runs` | `Promise<Run>` |
| `api.updateStatus(id, status)` | `PATCH /api/runs/:id` | `Promise<Run>` |

Non-2xx responses throw `ApiError(message = body.error ?? "Request failed (<status>)", fieldErrors = body.errors)`; network failure throws `ApiError("Network error")`.

## Client Routes (`apps/web/src/App.tsx`)

| Hash | View |
|---|---|
| anything not matching below (e.g. `#/`, empty) | `RunList` (+ `NewRunForm`) |
| `#/runs/<digits>` | `RunDetail` |

## Runtime Configuration (`apps/api/src/server.ts`)

| Env var | Default | Effect |
|---|---|---|
| `PORT` | `3000` | Listen port |
| `DB_PATH` | `apps/api/data/app.db` | SQLite file or `:memory:` |
| `WEB_DIST` | `apps/web/dist` | Static SPA directory |
| `ENABLE_TEST_RESET` | unset | `'true'` enables `POST /api/test/reset` |
