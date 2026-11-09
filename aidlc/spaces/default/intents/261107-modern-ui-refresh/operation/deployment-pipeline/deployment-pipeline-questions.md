# Deployment Pipeline Questions — modern-ui-refresh

Context: this repo already has a working delivery path, and this refactor only changes the web UI (no API, database or image layout changes; see [build-and-test-summary.md](../../construction/build-and-test/build-and-test-summary.md)).

- **PR gate** (`.github/workflows/pr-quality-gate.yml`): on every pull request to `main` it compiles, runs unit tests, builds, runs the `@smoke` Playwright suite, then builds the Docker image and runs `@smoke` against the container.
- **Jenkins** (`Jenkinsfile`): on `main` it builds, tests, builds the image, runs the full E2E suite, pushes `ghcr.io/davidlescard/ai-ci-reference-dashboard:<build>-<sha>` (and `:latest`), deploys to staging with `docker-compose.staging.yml` (port 3001), then runs the `@post-deploy` Playwright checks against staging.
- There is no production environment defined in the repo.

The CI and infrastructure design stages were skipped for this refactor, so these questions are grounded in the files above. Defaults are suggested where one is clearly sensible.

## Q1. [Pipeline] Changes to the existing pipeline
A. Keep both pipelines exactly as they are; just document them as the delivery path for this change
B. Keep both pipelines, and tag one of the new modern UI checks (for example "the header and status badges render") as `@post-deploy`, so staging proves the new look shipped and not just that the page loads
C. Also add the full `modern-ui.spec.ts` suite to the PR gate (it already runs in Jenkins on `main`)
X. Other (please specify)

[Answer]: B

## Q2. [Strategy] Deployment strategy for staging
A. Recreate (what Jenkins does today): `docker compose ... up -d --wait` swaps the single container; a few seconds of staging downtime is acceptable
B. Blue/green: run two staging services and switch traffic after the health check (needs a proxy that the repo doesn't have yet)
X. Other (please specify)

[Answer]: A

## Q3. [Gates] Promotion and approval
A. Staging only: `main` merge → automatic staging deploy → `@post-deploy` smoke. Production stays out of scope, since no production environment exists
B. Same as A, plus document a manual "Promote to production" approval step (tech lead and product owner sign-off) for when a production environment is added
X. Other (please specify)

[Answer]: B

## Q4. [Rollback] Rollback procedure
A. Redeploy the previous image tag: `APP_IMAGE=quality-gate-lab:<previous build>-<sha> docker compose -f docker-compose.staging.yml up -d --wait`, then rerun the `@post-deploy` checks (fast; the data volume is untouched because this change has no schema changes)
B. Revert the merge commit on `main` and let Jenkins rebuild and redeploy
C. Both: A to restore staging within minutes, then B so `main` matches what is deployed
X. Other (please specify)

[Answer]: B

## Q5. [Flags] Feature flags
A. None: the new UI ships whole, and rollback is the image swap from Q4 (the old UI code no longer exists to toggle back to)
B. Add an environment flag to show the old look (would mean restoring the old UI code; not recommended)
X. Other (please specify)

[Answer]: A

Clarification: Q4 selects reverting the merge and rebuilding, not an image swap. That selected rollback method takes precedence over the image-swap wording in Q5.

## Consolidated Summary Confirmation

- Add a modern UI check to the post-deploy suite (Q1: B).
- Retain the single-container staging replacement strategy (Q2: A).
- Keep automatic staging deployment after merging to main; document future manual production approval without creating a production environment (Q3: B).
- Roll back by reverting the release merge on main and letting Jenkins rebuild and redeploy (Q4: B).
- Ship the new UI without feature flags (Q5: A).
- No release branch is required for delivery. The user chose to tag the current main implementation as the baseline instead. Include the UI update and reviewable AI-DLC integration and workflow artifacts in the eventual PR, excluding secrets, generated output and ignored machine-local state. The baseline tag does not change deployment triggers or the selected revert-and-rebuild rollback procedure.

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
