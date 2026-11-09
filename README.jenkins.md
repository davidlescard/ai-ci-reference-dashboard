# Quality Gate Lab - Jenkins deploy to staging

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
