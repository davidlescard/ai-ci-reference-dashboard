# Cross-Unit Traceability — modern-ui-refresh

**Verdict: PASS.** All 26 requirements are covered; none are uncovered. This work has no Units, so everything is owned by the stage-level Code Generation.

Source: `aidlc engine sensor-traceability --stage build-and-test` (pass: true, uncovered: none).

| ID | Covered | Owning stage | Target file |
|---|---|---|---|
| FR1.1 | yes | code-generation | apps/web/src/theme.ts |
| FR1.2 | yes | code-generation | apps/web/src/tokens.ts |
| FR1.3 | yes | code-generation | apps/web/src/StatusBadge.tsx |
| FR1.4 | yes | code-generation | apps/web/src/main.tsx |
| FR2.1 | yes | code-generation | apps/web/src/AppHeader.tsx |
| FR2.2 | yes | code-generation | apps/web/src/App.tsx |
| FR2.3 | yes | code-generation | apps/web/src/RunList.tsx |
| FR3.1 | yes | code-generation | apps/web/src/RunList.tsx |
| FR3.2 | yes | code-generation | apps/web/src/RunList.tsx |
| FR3.3 | yes | code-generation | apps/web/src/RunList.tsx |
| FR3.4 | yes | code-generation | apps/web/src/RunList.tsx |
| FR4.1 | yes | code-generation | apps/web/src/StatusBadge.tsx |
| FR4.2 | yes | code-generation | apps/web/src/StatusBadge.tsx |
| FR5.1 | yes | code-generation | apps/web/src/RunDetail.tsx |
| FR5.2 | yes | code-generation | apps/web/src/RunDetail.tsx |
| FR5.3 | yes | code-generation | apps/web/src/RunDetail.tsx |
| FR6.1 | yes | code-generation | apps/web/src/NewRunForm.tsx |
| FR6.2 | yes | code-generation | apps/web/src/NewRunForm.tsx |
| FR7.1 | yes | code-generation | apps/web/src/format.ts |
| FR7.2 | yes | code-generation | apps/web/src/format.ts |
| FR7.3 | yes | code-generation | e2e/src/pages/dashboard.page.ts |
| NFR1 | yes | code-generation | e2e/tests/ui/modern-ui.spec.ts (verified by the full suite in real Chromium, see test-results.md) |
| NFR2 | yes | code-generation | e2e/tests/ui/modern-ui.spec.ts (verified by the full suite, see test-results.md) |
| NFR3 | yes | code-generation | e2e/tests/unit/tokens.spec.ts |
| NFR4 | yes | code-generation | apps/web/package.json (verified by `pnpm build`: 148.63 KB gzipped) |
| NFR5 | yes | code-generation | apps/web/package.json (verified by install, compile and build) |

## Uncovered elements

None.
