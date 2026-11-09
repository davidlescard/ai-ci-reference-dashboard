# CD Configuration

Status: summary confirmed by the user; awaiting stage approval.

## Sources

- [Confirmed answers](deployment-pipeline-questions.md): Q1 B, Q2 A, Q3 B, Q4 B, Q5 A; baseline tagging replaces the release-branch requirement.
- [Build and Test summary](../../construction/build-and-test/build-and-test-summary.md).
- Existing repository configuration: [Jenkinsfile](../../../../../../../Jenkinsfile), [PR gate](../../../../../../../.github/workflows/pr-quality-gate.yml), [Dockerfile](../../../../../../../Dockerfile), [staging Compose](../../../../../../../docker-compose.staging.yml).
- CI Pipeline and Infrastructure Design were skipped for this refactor; no artifacts from those stages are assumed.

## Configuration

Retain the existing pipelines and their triggers. No release branch or tag-triggered deployment is required. A baseline Git tag identifies source history, not a built image or a deployment.

The PR workflow targeting main compiles, tests, builds and runs smoke tests, including container smoke checks. Jenkins builds and tests branch changes; its publication, staging deployment and post-deployment stages run only for main.

Jenkins identifies images with `<build-number>-<short-commit>`, pushes versioned and latest tags to GHCR when credentials are configured, and deploys the locally built versioned image with:

```sh
APP_IMAGE="quality-gate-lab:${VERSION}" docker compose -f docker-compose.staging.yml up -d --wait
```

Staging exposes port 3001 and retains its named data volume. Compose's `--wait` option waits for the image health check; the subsequent post-deployment smoke tests are a separate verification step. Health failure or smoke failure fails the pipeline; neither automatically restores the previous version.

## Modern UI Verification

The existing header regression test in [modern-ui.spec.ts](../../../../../../../e2e/tests/ui/modern-ui.spec.ts) now also carries `@post-deploy`. It checks the visible level-one title, home link, unique home navigation and indigo banner without depending on seeded run names or modifying staging data.

The existing Jenkins selector picks it up without a Jenkinsfile change:

```sh
BASE_URL="${STAGING_URL}" pnpm --filter ai-ci-reference-e2e exec playwright test --grep @post-deploy
```

On external staging, do not set `ALLOW_TEST_RESET`; do not enable `ENABLE_TEST_RESET` in the deployed container. Existing post-deploy checks also verify health, run listing and absence of the reset endpoint.

## Promotion Matrix

| Target | Trigger | Gate | Outcome |
|---|---|---|---|
| PR validation | Pull request targeting main | Existing Actions jobs pass | Candidate ready for review; no deployment |
| Staging | Main branch Jenkins build | Compile, unit tests, build, container health, E2E | Replace container; post-deploy checks must pass |
| Production | Not configured | Future explicit tech lead and product owner approval | Documentation only; no production job or environment is added |

## Security and Verification Limits

No credential, network, authorization or infrastructure changes are introduced. GHCR credentials remain in Jenkins credentials storage. The UI check is read-only. Registry access, Jenkins configuration and real staging deployment are not verified by local test execution; those are Deployment Execution evidence.

Rollback is the human-approved revert-and-rebuild procedure in [rollback-runbook.md](rollback-runbook.md).

## Local Validation

- `pnpm compile`: passed for API, web and E2E packages.
- `pnpm --filter ai-ci-reference-e2e exec playwright test --grep @post-deploy`: 4 passed, 1 skipped. Both Chromium UI checks passed, including the newly tagged header check.
- The reset-endpoint absence test deliberately skips on local fixture servers because they enable reset for isolation. It must run against real staging with `BASE_URL` set and test reset disabled; local success does not prove that staging is deployed or secured.
