# Quality Gate Lab

Release Quality Dashboard: a small React + Express + SQLite app used as a target for test automation and CI/CD.

## Run

Requires Node 22+ (24 recommended), pnpm (`npm i -g pnpm`; the version is pinned in `package.json`), and optionally Docker. On Windows, run the script from Git Bash or WSL.

### View the app in a browser

1. `./build.sh` to install, check, test and build (first time only).
2. `./build.sh start` to serve the app.
3. Open http://localhost:3000. The dashboard shows eight seeded test runs. Check http://localhost:3000/health for `{"status":"ok"}`.

Data is stored in `apps/api/data/app.db` and seeded automatically on first start. Delete that file to start fresh.

### With Docker

`./build.sh docker`, then open http://localhost:3000. Requires Docker Desktop to be running.

### Development with hot reload

Run `pnpm dev:api` (http://localhost:3000) and `pnpm dev:web` in two terminals, then open http://localhost:5173. The web dev server proxies `/api` to the API.

### Other tasks

`./build.sh [install|compile|test|build|start|docker|all]`. The default is `all`; `test` runs the Mocha unit and API tests.

## Test support

`POST /api/test/reset` restores the seed data. It exists only when `ENABLE_TEST_RESET=true` (set in `docker-compose.yml`, never in deployed environments).
