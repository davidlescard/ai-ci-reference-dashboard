# Test Results — modern-ui-refresh

Run on 2026-11-08 from the repo root on Windows, one command at a time.

## Build

| Command | Exit | Result |
|---|---|---|
| `pnpm install --frozen-lockfile` | 0 | Lockfile up to date |
| `pnpm compile` | 0 | `apps/web`, `apps/api` and `e2e` type-check with no errors |
| `pnpm build` | 0 | Vite built 552 modules; `index-BYYBT9vH.js` 478.16 kB raw, **148.63 kB gzipped**; CSS 8.96 kB (1.22 kB gzipped); Inter fonts bundled; API compiled |

## Tests

| Command | Exit | Total | Passed | Failed | Skipped | Where it ran |
|---|---|---|---|---|---|---|
| `pnpm test` (API, Mocha) | 0 | 16 | 16 | 0 | 0 | Node |
| `pnpm test:e2e` (Playwright: `unit`, `ui`, `api` projects) | 0 | 30 | 28 | 0 | 2 | `unit` in Node; `ui` in real Chromium driven by Playwright; `api` over HTTP from Node |

The unit-test commands in `unit-test-instructions.md` (`--project=unit` and `tests/ui/modern-ui.spec.ts --project=ui`) are both subsets of `pnpm test:e2e`, so they were run once, inside it, and not again.

**Skipped (both were already skipped before this work):**
- `[ui] tests/ui/z_.failure-demo.spec.ts` — a deliberate failure demo, skipped unless asked for.
- `[api] tests/api/post-deploy.api.spec.ts` › "does not expose the test reset endpoint" — runs only against a deployed server.

**New tests in this run:** U1, U2 (`tests/unit/format.spec.ts`), U3 (`tests/unit/tokens.spec.ts`) and E1–E6 (`tests/ui/modern-ui.spec.ts`), all passed.

**Failures:** none.

## Coverage

No coverage floor applies (refactor scope, Minimal strategy) and no coverage tool is configured, so no coverage report was produced. The obligation is one test per new requirement plus the existing suite staying green; both are met (see the matrix).

## Change scope check

`git status` outside `aidlc/` and the Playwright report shows changes only in `apps/web/**`, `e2e/**` and `pnpm-lock.yaml`. Nothing under `apps/api` or shared types changed. `.gitignore` and the `.aidlc/`, `.github/`, `.vscode/` and `AGENTS.md` entries come from the AI-DLC install, not from this work.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| NFR1 | inception/requirements-analysis/requirements.md > NFR1 | Every existing flow behaves the same; no API, server or shared-type change | All pre-existing UI and API specs pass unchanged (list, search, filter, sort, detail, status update, create, validation, error/retry); no files changed under `apps/api` or shared types | `pnpm test:e2e` (real Chromium), `pnpm test`, `git status` | build-and-test | Met |
| NFR2 | requirements.md > NFR2 | Full existing suite green | API 16/16; E2E 28 passed, 0 failed, 2 skipped (same 2 as before) | `pnpm test`, `pnpm test:e2e` | build-and-test | Met |
| NFR3 | requirements.md > NFR3; functional-design/rules.md > BR1.5, BR1.6 | Text and status contrast ≥ 4.5:1; visible 2px keyboard focus ring; accessible names unchanged | U3 passed (all pairs ≥ 4.5:1); E6 passed (2px solid accent outline on keyboard focus, in real Chromium); existing specs find every control by its old role and name | `tests/unit/tokens.spec.ts`, `tests/ui/modern-ui.spec.ts` E6, existing UI specs | build-and-test | Met |
| NFR4 | requirements.md > NFR4; rules.md > BR1.8 | Production JS < 300 KB gzipped; per-component MUI and icon imports | 148.63 KB gzipped; icons imported one by one by path | `pnpm build` output | build-and-test | Met |
| NFR5 | requirements.md > NFR5 | Install, type-check and build succeed with no new errors | All three exit 0 with no errors | `pnpm install --frozen-lockfile`, `pnpm compile`, `pnpm build` | build-and-test | Met |
| TC-STRATEGY | code-generation/code-generation-plan.md > Testing Contract > strategy_volume | One verifiable test per new requirement; a happy-path unit test per new pure component | U1–U3 cover `format.ts` and `tokens.ts`; E1–E6 cover the new header, badges, formatting, not-found, mobile layout and focus ring | `unit-test-instructions.md` > Tests in scope; `pnpm test:e2e` | build-and-test | Met |
| TC-SCOPE | code-generation-plan.md > Testing Contract > scope_floor | Existing suite stays green | Same as NFR2 | `pnpm test`, `pnpm test:e2e` | build-and-test | Met |
