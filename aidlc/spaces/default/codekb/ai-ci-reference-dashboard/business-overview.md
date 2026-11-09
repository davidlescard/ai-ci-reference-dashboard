# Business Overview — ai-ci-reference-dashboard

## Purpose

"Quality Gate Lab" (`quality-gate-lab`, package scope `@qgl`) ships a small web application, the **Release Quality Dashboard**, that tracks CI test runs. Per `README.md`, the app exists mainly as a realistic target for test automation and CI/CD practice: the repository's other half is a Playwright suite, a GitHub Actions PR gate, and a local Jenkins pipeline that deploys to a Docker "staging" stack.

## Business Domain

- **Entity**: a *test run*: name, branch, status, duration in seconds, notes, creation timestamp. See `api-documentation.md` for the schema.
- **Status lifecycle**: `queued`, `running`, `passed`, `failed`. Any status may be set from any other; the code enforces no transitions.
- **Seed data**: eight fixed runs (`apps/api/src/seed.ts`) make tests deterministic.

## Key Functionality (user-visible)

| Capability | Where | Notes |
|---|---|---|
| List runs, newest first | `RunList` → `GET /api/runs` | Server-side search (name contains) and status filter |
| Sort the list by column | `RunList` (client-side) | Name, Branch, Status, Duration; `aria-sort` on header |
| Create a run | `NewRunForm` → `POST /api/runs` | Server validation with per-field messages; status defaults to `queued` |
| View run details | `RunDetail` → `GET /api/runs/:id` | Hash route `#/runs/:id` |
| Change a run's status | `RunDetail` → `PATCH /api/runs/:id` | Select box applies immediately |
| Health check | `GET /health`, `GET /api/health` | Used by Docker HEALTHCHECK and CI |
| Test data reset | `POST /api/test/reset` | Only when `ENABLE_TEST_RESET=true` |

## Users

- Engineers or QA viewing release-quality status. There is no authentication or role model.
- Automation (Playwright, CI jobs) is a first-class consumer of the UI and API.

## Relevance to the active intent (modern-ui-refresh)

The UI is functional and accessible but visually minimal: one global stylesheet, browser-default controls, and pastel status badges (see `technology-stack.md` § Styling and Theming). The refactor must keep current behaviour, including the accessible names and DOM structure the Playwright suite depends on (see `code-quality-assessment.md` § UI Refactor Constraints).
