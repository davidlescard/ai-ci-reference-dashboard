# Deployment Strategy

Status: summary confirmed by the user; awaiting stage approval.

## Sources

Use the [confirmed answers](deployment-pipeline-questions.md), [CD configuration](cd-config.md), [Build and Test summary](../../construction/build-and-test/build-and-test-summary.md), and existing Jenkins and Docker Compose configuration. No new CI or infrastructure design is assumed.

## Release and Baseline

No dedicated release branch is required. The user chose a tag of the current main implementation as a source baseline. Record the chosen tag and commit during Deployment Execution; do not assume that a tag exists locally, is pushed, or represents the currently deployed image.

The implementation and reviewable AI-DLC integration and decision artifacts can travel in the same PR into main. Exclude credentials, generated output and ignored machine-local state. Existing branch names are not deployment requirements, and no branches are renamed or deleted here.

## Strategy and Tradeoffs

Retain single-container replacement through staging Compose. This avoids adding a proxy, duplicate services or routing changes for a UI-only refactor. Downtime during replacement is acceptable, but no measured downtime guarantee is made.

Blue/green was rejected for this change because it adds a second service and traffic switching not present in the repository. Compose `--wait` detects health failure; it is not zero-downtime delivery or automatic rollback.

## Promotion and Feature Flags

Follow the [promotion matrix](cd-config.md#promotion-matrix): existing PR validation, then main-branch Jenkins deployment to staging and post-deploy smoke checks. The new UI ships as a whole, with no feature flags and no retained alternate UI.

There is no production target. Before adding one, require explicit tech lead and product owner approval for the specific candidate, a configured production environment, health checks and a validated rollback path. This document does not implement a production approval job.

## Acceptance and Recovery

Success requires a healthy staging container, both health endpoints responding successfully, readable runs, a rendered dashboard, the indigo header check passing, and the reset endpoint remaining unavailable. Failure blocks release acceptance; preserve Jenkins logs and diagnostics and follow [rollback-runbook.md](rollback-runbook.md).

No API or database schema changes are part of this release. Keep the staging volume intact. Rollback uses source reversion and rebuild, so it requires working CI and is slower than switching to an existing image.

Local post-deploy selection passed four checks with one expected local-only skip; type-checking passed. Actual staging acceptance remains pending Deployment Execution.
