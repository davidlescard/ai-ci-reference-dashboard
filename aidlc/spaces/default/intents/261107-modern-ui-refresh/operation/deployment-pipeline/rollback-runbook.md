# Rollback Runbook

Status: summary confirmed by the user; awaiting stage approval.

## Sources

[Confirmed Q4 B](deployment-pipeline-questions.md), [CD configuration](cd-config.md), [deployment strategy](deployment-strategy.md), and the existing main-branch Jenkins deployment.

## Triggers and Authority

The release owner initiates rollback if staging health or post-deploy checks fail, or a confirmed UI regression prevents normal use. Save the failed build number, commit, image version, logs and Playwright diagnostics before starting any revert, because the rollback rebuild replaces the failed staging container. Rollback is manual, not an automatic Jenkins action.

## Revert and Rebuild

1. Inspect current remote main and identify exactly which integrated commit introduced this release. Do not select a commit solely by its branch name or baseline tag. Confirm no later changes need to be retained or separately reverted.
2. From a clean checkout based on current main, create a short-lived rollback branch. Never discard the current uncommitted UI and AI-DLC work to perform recovery.
3. Inspect the integration commit and its parents:

   ```sh
   git fetch origin
   git log --oneline origin/main
   git show --no-patch --pretty=raw <integration-commit>
   ```

4. Choose the correct revert form. For a true merge commit, verify parent 1 is the main history to retain, then use:

   ```sh
   git revert -m 1 <integration-merge-commit>
   ```

   For a squash merge or an ordinary single commit, use:

   ```sh
   git revert <integration-commit>
   ```

   These are templates: substitute inspected commit hashes. Do not run both. If the release spans several commits, review the complete set and dependency order before reverting. Resolve any conflicts explicitly; do not force-push or reset main.

5. Review the revert diff. Reverting a combined UI and AI-DLC integration commit also removes its AI-DLC files from the main tree; keep the original commit reachable and preserve diagnostics outside disposable build workspaces. Confirm the pre-refresh pipeline and tests are restored consistently.
6. Submit the rollback PR to main, let its applicable checks pass and obtain review. Merge it so Jenkins rebuilds the reverted source and deploys a new versioned image to staging.
7. Verify Jenkins succeeds, the container becomes healthy, and the post-deploy suite from the reverted source passes. The old UI should not pass the new indigo-header check; do not use that assertion as a rollback success criterion.
8. Confirm the original dashboard works and existing run data remains accessible. Record the rollback commit, image version, build result and observed health.

## Data Safety and Failure

This UI-only change needs no database reversal. Do not delete the data volume, use `docker compose down -v`, or enable/reset test data during staging verification.

If Git revert conflicts, CI is unavailable or the restored deployment fails, stop promotion, preserve failure evidence and notify the release owner. This selected recovery path depends on a working rebuild/deployment pipeline; a direct image swap is not authorized by Q4.

The source baseline tag is an investigation aid, not a database backup or proof of a deployable image. Rollback execution and timing have not been tested in this stage.
