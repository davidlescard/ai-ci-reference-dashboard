# Code Quality Assessment — ai-ci-reference-dashboard

## Quick Ratings

| Dimension | Rating | Evidence |
|---|---|---|
| Naming clarity | good | Self-describing components, functions, and test titles |
| Function size | good | Every function is short. The largest is `createApp` (~85 lines of small route handlers). |
| Error handling | good | Uniform JSON errors, a central Express error handler, `ApiError` on the client, `role="alert"` in the UI, a transactional reseed |
| Test presence | fair | API: 16 Mocha cases. E2E: 9 UI (plus 1 skipped demo) + 10 API Playwright cases. **Web components have no unit tests and no coverage config.** |
| Duplication | fair | `Run`/`Status` types repeated in web, API, and e2e (see `dependencies.md`). Status `<select>` markup repeated in `RunList` and `RunDetail`. |
| Dead code | good | Only leftovers: `e2e/playwright.config.ts.ORIG` and one commented line in `create-run.spec.ts` |

## Testing

- `apps/api/test/`: Mocha with Chai via `tsx`, run against an in-memory DB on an ephemeral port. Covers health, list, filter, search, 404, create, validation, PATCH, malformed JSON, and reset on/off.
- `e2e/tests/ui/`: dashboard render, column header contract, cell lookups, sorting, create and persist after reload, validation messages with `aria-invalid` and accessible descriptions, error-then-retry (via route mocking), status change followed by filtering, post-deploy render.
- `e2e/tests/api/`: REST contract and post-deploy checks, including that the reset endpoint is disabled on staging.
- No coverage tool or thresholds. No visual-regression or screenshot baseline (screenshots are kept only on failure).

## Linting and Formatting

No ESLint, Prettier, Stylelint, or EditorConfig. Indentation differs between packages (2 spaces in `apps/`, 4 in `e2e/`). The only static gate is `tsc --noEmit` with `strict`. `.gitattributes` forces LF line endings.

## CI/CD

- **GitHub Actions** (`pr-quality-gate.yml`) on PRs to `main`, two parallel jobs. `e2e-smoke` runs compile, Mocha, build, and Playwright `@smoke` from source. `docker-image` runs the image with a health probe, then `@smoke` against the container. Permissions are `contents: read`, and newer pushes cancel older runs.
- **Jenkins** (`Jenkinsfile`): the full pipeline, including the full Playwright suite. On `main` it also publishes, deploys to staging, and runs the post-deploy smoke tests. It publishes JUnit results and archives reports. `README.ci-cd.complete.md` describes everything.

## Documentation

Good overall. `README.md` covers run, Docker, dev, and Jenkins. `e2e/README.md` covers commands, conventions, and environment variables. `README.ci-cd.complete.md` covers the CI design with diagrams. `GITHUB.mgmt.md` is a repo-setup checklist (untracked). Source comments are few and explain intent ("Fixed values keep every test run deterministic").

## Technical Debt

| # | Signal | Location | Severity |
|---|---|---|---|
| 1 | Styling has no tokens, theme, or component styles. Hard-coded hex values, pastel palette, browser-default controls, no focus, hover, dark-mode, or responsive rules. | `apps/web/src/styles.css` | medium (**intent target**) |
| 2 | Status value doubles as the CSS class (`badge ${run.status}`) | `RunList.tsx:107`, `RunDetail.tsx:48` | low |
| 3 | Search fetches on every keystroke, with no debounce | `RunList.tsx:36-47` | low |
| 4 | Raw ISO `createdAt` and integer seconds shown to users | `RunDetail.tsx:51-54`, `RunList.tsx:109` | low (UX) |
| 5 | Error text matched by string (`'Run not found'`) | `RunDetail.tsx:16` | low |
| 6 | `request()` replaces any caller-supplied headers | `api.ts:28` | low |
| 7 | `as unknown as Run` casts on DB rows | `apps/api/src/app.ts` | low |
| 8 | Types duplicated across packages | see `dependencies.md` | low |
| 9 | No linter or formatter, no web unit tests, no coverage | repo-wide | medium |
| 10 | Leftover `playwright.config.ts.ORIG` | `e2e/` | trivial |

There are no TODO, FIXME, or HACK markers and no lint suppressions. Search uses parameterized `LIKE`, so there is no SQL injection risk.

## Security Notes

- The app has no authentication, which matches its lab and demo purpose. `POST /api/test/reset` is gated by `ENABLE_TEST_RESET`. The local `docker-compose.yml` enables it; staging does not, and a post-deploy test asserts it stays off.
- The Jenkins controller runs as root with the host Docker socket mounted. The repo documents this as lab-only. Secrets live in a git-ignored `jenkins/.env`, and `.env.example` holds placeholders only.

## UI Refactor Constraints

Everything the existing Playwright suite depends on, which a restyle must keep or change in step with `e2e/src/**`:

- **Accessible names**: link and heading `Release Quality Dashboard`; textbox `Search runs`; combobox `Status` (exact name); inputs labelled `Name`, `Branch`, `Notes` (exact); buttons `Create run` and `Retry`; combobox `Update status`; run-name links.
- **Structure**: one `<table aria-label="Test runs">` with `columnheader` cells whose text is exactly `Name | Branch | Status | Duration (s)`, and `tbody` rows of `cell`s in that column order (`td:nth-child`). Row-count assertions count the header row, so no extra `row` roles may appear in the table.
- **IDs and ARIA**: `#detail-heading`; `aria-sort` on the sorted `th`; `aria-invalid` plus `aria-describedby` that resolves to the field message; `role="status"` for "Created run …" and `role="alert"` for errors.
- **Text**: `No test runs match your filters.`, `Unable to load test runs…`, `Created run "<name>"`, and lowercase status text in the badge cells. `Grid` reads cells through `innerText`, so CSS `text-transform`, injected icons with text, or pseudo-content inside cells would change asserted values. Header `::after` arrows are safe because they are not part of `innerText`.
