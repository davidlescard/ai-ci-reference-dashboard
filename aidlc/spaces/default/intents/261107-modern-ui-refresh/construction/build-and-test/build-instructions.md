# Build Instructions — modern-ui-refresh

## Prerequisites

- Node.js (the version the repo already uses) and pnpm (v12 was used here).
- Playwright's Chromium for browser tests: run `pnpm exec playwright install chromium` from `e2e/` once per machine.
- No environment variables, config files or local services are needed to build. Browser tests start their own API server per worker with an in-memory database.

## Install dependencies

Run from the repo root:

```
pnpm install --frozen-lockfile
```

The lockfile pins MUI 9.5.0, `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1 and `@fontsource/inter` 5.3.0 (versions as recorded in `code-summary.md`).

## Type-check

```
pnpm compile
```

Runs `tsc --noEmit` in `apps/web`, `apps/api` and `e2e`.

## Production build

```
pnpm build
```

Builds the web app with Vite into `apps/web/dist` (served by the API), then compiles the API with `tsc -p tsconfig.build.json`.

## Build verification

- All three commands exit with code 0.
- The Vite output lists one `index-*.js` bundle. Its gzipped size must be under 300 KB (NFR4).
- `dist/assets` contains the Inter font files (`inter-latin-*.woff2`), which shows the font is bundled.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ERR_PNPM_OUTDATED_LOCKFILE` | Someone changed `apps/web/package.json` without updating the lockfile. Run `pnpm install` and commit `pnpm-lock.yaml`. |
| `Cannot find module '@mui/icons-material/...'` | Icon names changed in MUI v9. Use the `*Outlined` names (for example `CheckCircleOutlined`). |
| Browser tests show the old UI | The test server serves the built app. Run `pnpm build` before `pnpm test:e2e`. |
| `browserType.launch: Executable doesn't exist` | Run `pnpm exec playwright install chromium` from `e2e/`. |
