# Deployment Execution Questions — modern-ui-refresh

Context: the approved delivery path is in [cd-config.md](../deployment-pipeline/cd-config.md) and [deployment-strategy.md](../deployment-pipeline/deployment-strategy.md). A pull request into `main` runs the PR gate. After the merge, Jenkins builds the image, runs E2E, pushes to GHCR, recreates the staging container (port 3001) and runs `@post-deploy`. Build and Test passed ([test-results.md](../../construction/build-and-test/test-results.md)).

Current state: branch `release/ui-refresh-aidlc`, 27 uncommitted changes (UI code, tests, AI-DLC records), no git tags yet. There is no AWS target, so no AWS credential check is needed.

## Q1. [Pre-checks] Checks before committing
A. Rerun the local checks now (`pnpm compile`, unit tests, build, `@smoke`), then commit only if all pass
B. Skip local reruns; rely on the PR gate in GitHub Actions
X. Other (please specify)

[Answer]: X — the user ran `build.sh all` locally and it passed

## Q2. [Migrations] Database migrations
A. None needed: this change touches only the web UI; the API, data and staging volume are unchanged
X. Other (please specify)

[Answer]: A

## Q3. [Baseline] Baseline tag on current `main`
A. Tag `origin/main` (963df15) as `ui-baseline-pre-refresh` and push the tag, so the old UI can always be rebuilt
B. Use a different tag name (please specify)
X. Other (please specify)

[Answer]: X — already done by the user: annotated tag `v1.0.0` on `origin` points to 963df15

## Q4. [Commit] How to commit and open the PR
A. I commit everything in two commits (1: UI code and tests, 2: AI-DLC records), push `release/ui-refresh-aidlc`, and you open the PR into `main` on GitHub (I'll give you the title and description)
B. One single commit, then the same push and PR steps
C. I commit only; you push and open the PR yourself
X. Other (please specify)

[Answer]: A

## Q5. [Services and window] Dependent services and deployment timing
A. Deploy as soon as the PR gate is green and you merge; Jenkins, GHCR and the staging host are assumed up, and you share the Jenkins result (or staging URL) so I can record the smoke and health results
[Answer]: A

## Consolidated Summary Confirmation

- Pre-checks: the user ran `build.sh all` locally and it passed
- Migrations: none; UI-only change
- Baseline: annotated tag `v1.0.0` on `origin` already marks the old UI (963df15)
- Commit: two commits (UI code and tests, then AI-DLC records), I push `release/ui-refresh-aidlc`, the user opens the PR into `main`
- Timing: deploy when the PR gate is green and the user merges; Jenkins deploys staging and the user shares the result for the smoke and health records

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
