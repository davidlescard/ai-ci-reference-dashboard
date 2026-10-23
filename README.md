# Quality Gate Lab (@qgl)

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

`./build.sh [install|compile|test|test-junit|build|start|e2e|docker|all]`. The default is `all`; `test` runs the Mocha unit and API tests.

## Jenkins (local)

The `Jenkinsfile` runs on a local Jenkins controller that is defined as code under `jenkins/`. It is a lab setup: the container runs as root and uses the host Docker socket.

1. Copy `jenkins/.env.example` to `jenkins/.env` and set `JENKINS_ADMIN_PASSWORD` and a read-only GitHub `GITHUB_TOKEN`. The file is git-ignored.
2. `docker compose -f jenkins/docker-compose.yml up --build -d` (Docker Desktop must be running).
3. Open http://localhost:8080 and sign in with the admin user. The `quality-gate-lab` multibranch job is created automatically and scans GitHub every 5 minutes for branches and pull requests.
4. Each build installs, compiles, runs the Mocha tests, builds the app, builds and health-checks the container image, and runs the full Playwright suite. JUnit results are published, and the Playwright report, traces and container log are archived.

Stop it with `docker compose -f jenkins/docker-compose.yml down` (add `-v` to delete the Jenkins data).

### Delivery to staging (`main` only)

After the tests pass on `main`, the pipeline tags the image `quality-gate-lab:<build>-<commit>`, pushes it to `ghcr.io` if `GHCR_TOKEN` is set in `jenkins/.env` (a classic token with `write:packages`; otherwise the push is skipped), deploys it with `docker-compose.staging.yml`, and runs the `@post-deploy` Playwright tests against it. The deployment record (`deployment.txt`) and the post-deploy reports are archived with the build.

- Staging runs at http://localhost:3001 with its own persistent volume. The test reset endpoint is disabled there, and the post-deploy tests assert that.
- Run the same checks by hand against any environment: `BASE_URL=http://localhost:3001 pnpm --filter ai-ci-reference-e2e test:post-deploy`.
- Tear down staging with `docker compose -p qgl-staging -f docker-compose.staging.yml down` (the `APP_IMAGE` variable must be set; any value works for `down`).

## Test support

`POST /api/test/reset` restores the seed data. It exists only when `ENABLE_TEST_RESET=true` (set in `docker-compose.yml`, never in deployed environments).
