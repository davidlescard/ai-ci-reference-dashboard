## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-11-09T01:39:54Z
**Iteration:** 1
**Verdict Dictated:** no

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | apps/web/src/StatusBadge.tsx > StatusBadge Chip `sx` | The business rules ask for an 8px corner radius on cards, inputs and chips. MUI's `Chip` sets its own pill-shaped radius and ignores the theme's `shape.borderRadius`. Neither the badge `sx` nor `MuiChip` in theme.ts overrides it, so status badges render as pills. code-summary.md does not list this as a deviation. | Add `borderRadius: tokens.radius` (8px) to the badge `sx` or to `MuiChip.styleOverrides.root`. If the pill shape is intended, record it in code-summary.md under "Deviations from the plan". | New |
| R-02 | Minor | apps/web/src/theme.ts > components.MuiLink.defaultProps (`underline: 'hover'`) | Run-name links in the runs table used to have the browser's default underline. Now they are marked only by indigo `#4F46E5` until hovered. Against body text `#0F172A` that is about 2.8:1, below the 3:1 usually expected when color alone marks a link. Each link sits alone in its own cell, so this is a borderline accessibility concern, not a clear failure. | Set `underline="always"` on the run-name links (or on links in general), or record in code-summary.md why the in-cell placement makes the links identifiable without an underline. | New |
| R-03 | Minor | e2e/tests/unit/format.spec.ts > test "shows only the non-zero hours, minutes and seconds" (U1) | code-summary.md lists a deliberate change: `formatDuration` returns a negative or non-numeric value as received instead of throwing. No test covers it. U1 covers only valid durations (0, 45, 85, 120, 3903), so this fallback could change without any test noticing. | Add cases to U1 for a negative value (for example `-5` returns `"-5"`) and a non-finite value (for example `NaN` returns `"NaN"`). | New |
| R-04 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/code-generation/traceability.json > coverage rows NFR1, BR8.1, BR8.2 | Three rows point at files that do not implement the requirement. NFR1 (no behavior or API change) points at the new `modern-ui.spec.ts`. BR8.1 (allowed set of changed files) points at `apps/web/package.json`. BR8.2 (install, type-check, build and tests pass) points at `e2e/playwright.config.ts`. These requirements are shown by the existing suite still passing and by the scope of the diff, not by those files. | Point these rows at the real evidence: the existing `e2e/tests/ui/*.spec.ts` files for NFR1, and the build and test results table in code-summary.md for BR8.1 and BR8.2. Or mark them as process-level with that justification. | New |
| R-05 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/code-generation/code-summary.md > Files > Modified | `git status` shows `.gitignore` modified. That file is outside the allowed set (`apps/web/**`, `pnpm-lock.yaml`, `e2e/**`). The change is the framework's own `# BEGIN AI-DLC:gitignore` block, not UI work, but the summary does not mention it, and it would go into the UI-refresh squash commit. | Keep the `.gitignore` change out of the UI-refresh commit, or note it in code-summary.md as a framework change outside this stage. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `pnpm --filter @qgl/web compile` | PASS, exit 0 (earlier run of this review, recorded in 1.2abebdff….review.md) | No type errors in the rebuilt web app |
| `pnpm --dir e2e compile` | PASS, exit 0 (earlier run) | Page object and spec changes type-check |
| `playwright test --project=unit` | PASS, 3 passed: U1–U3 (earlier run) | Duration, date and contrast unit tests pass |
| `pnpm --filter @qgl/web build` | PASS: 148.63 kB gzipped JS, 478.16 kB raw (earlier run) | Under the 300 KB gzipped budget; icons imported by path |
| `pnpm test:e2e` | PASS: 28 passed, 2 skipped (earlier run, against the server on :3000) | The 2 skips (`z_.failure-demo`, `post-deploy.api`) were already skipped before; no test was deleted or newly skipped |
| `git status --short` (re-run for this review, read-only) | Tracked changes: `apps/web/**`, `e2e/**`, `pnpm-lock.yaml`, plus `.gitignore` | Matches the allowed set except `.gitignore` (last finding) |

I did not re-run the build, install or tests this time, as the brief asked. The results above come from the earlier attempt and match code-summary.md. I re-read the code for this review:
- tokens.ts and theme.ts
- StatusBadge.tsx: the pill radius is confirmed, with no `borderRadius` override.
- RunList.tsx:
  - The status filter is a native select named "Status".
  - `aria-sort` is set through `sortDirection` on the sorted column only.
  - Duration sorting compares the numbers.
  - The table body renders only run rows.
  - The Retry button sits inside the error alert.
- NewRunForm.tsx: `error` is always a boolean, and no `required` marker is added.
- format.ts and format.spec.ts

### Summary

The refactor stays inside the app (no API, server or shared-type change), and type-check, build, bundle budget and the full E2E suite all passed. The five findings are all Minor:
- the badge's pill radius versus the 8px rule
- link underlines shown only on hover
- the untested fallback for bad duration values
- three loose traceability targets
- the unrecorded framework `.gitignore` change

None stops a developer or blocks release.
