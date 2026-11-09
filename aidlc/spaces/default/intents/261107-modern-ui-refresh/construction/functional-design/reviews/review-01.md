**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-11-09
**Iteration:** 1
**Verdict Dictated:** no

### Assessment

The design is internally consistent and traces fully to requirements.md. All 21 FR sub-IDs map to rules in traceability.json, the NFR-derived rules are listed in reverse, and every BR ID cited in functional-spec.md and frontend-components.md exists in rules.md. The entity values match the confirmed Q&A answers. The contrast figures check out: #475569 is about 7.6:1, #1D4ED8 about 6.7:1, #15803D about 5.0:1, #B91C1C about 6.5:1, and #4F46E5 is above 3:1 against both backgrounds.

I traced every UI spec in `e2e/tests/ui/` against the design, using the `dashboard.page.ts`, `run-detail.page.ts`, `base.page.ts` and `grid.comp.ts` locators. The design keeps everything those tests depend on:
- row counts (no extra rows in the table body)
- exact header text (`verifyColumns`, with the visually-hidden "sorted ascending" text from the MUI docs example excluded)
- `aria-sort` on the `th`
- comboboxes named `Status` and `Update status` that still work with `selectOption()`
- accessible descriptions from `helperText` (validation.spec)
- a single `role="alert"` with Retry, and no table, in the error state (error-state.spec)
- the `Created run` status message
- badge text exactly equal to the status
- `#detail-heading`
- the header link name

The only intended test change is the `RUN_COLUMNS` rename, and the design names it.

Two issues will produce wrong output if left alone:
- The focus-ring mechanism does not work against MUI's own styles.
- The parity rule BR8.1 forbids file changes that this work has to make.

Neither one breaks the Playwright suite. The rest are minor precision gaps.

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/frontend-components.md > Interaction and accessibility notes > Focus (BR1.5) | The design gets the focus ring (BR1.5) from one global `:focus-visible { outline: 2px solid #4F46E5; outline-offset: 2px }` rule in the CssBaseline overrides. MUI's own component styles cancel that rule. `ButtonBase` (which Button, TableSortLabel and the Retry button are built on) sets `outline: 0` on a class selector with the same specificity, and it is injected after CssBaseline, so it wins. `InputBase` sets `&:focus { outline: 0 }` on the input, which is more specific, so it wins too. As a result, buttons, sort headers, text fields and native selects would not show the 2px accent ring with a 2px offset that the spec (§ Visual acceptance values) uses as the NFR3 pass criterion. | State where the ring lives so it is not overridden. For example: theme `styleOverrides` on `MuiButtonBase` (`&.Mui-focusVisible`), on `MuiInputBase`/`MuiOutlinedInput` (`&.Mui-focused` or `:focus-within` on the root), and on `MuiNativeSelect`/`MuiSelect`, with links handled by the global rule. Alternatively, accept MUI's focused-border style for inputs and update BR1.5 and the acceptance table to match. | New |
| R-02 | Major | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/rules.md > BR8.1 logic | BR8.1 rejects any changed file "outside the web app's UI source (and its tests/package manifest)". This work has to change two files outside that boundary: the root `pnpm-lock.yaml`, because FR1.1 adds MUI, Emotion, icons and `@fontsource/inter`, and `e2e/src/pages/dashboard.page.ts`, which needs the `RUN_COLUMNS` change that BR7.3/FR7.3 require. `build.sh` and the `Dockerfile` both run `pnpm install --frozen-lockfile`, so a change that follows BR8.1 to the letter and skips the lockfile fails the build. A reviewer applying BR8.1 as written would also reject the required changes. | Rewrite the BR8.1 allowed set so it explicitly covers `apps/web/**`, the root `pnpm-lock.yaml`, and the `e2e/` page objects and specs changed under BR7.3. Keep API, server and shared-type code forbidden. | New |
| R-03 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/rules.md > BR1.1 statement | The confirmed Q1 answer and the consolidated summary say the accent drives "buttons, links, focus rings and the header". BR1.1 turns "the header" into "the selected sort header", and frontend-components.md makes `AppHeader` a white surface. Code Generation will build a white header, which differs from what the person confirmed. | Confirm which header was meant. Then either color the AppBar (or its title) with the accent, or reword BR1.1 and note that "header" in Q1 meant the sort header. | New |
| R-04 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/frontend-components.md > New modules > AppHeader.tsx; Changed modules > App.tsx | Several MUI specifics are left to guesswork. (1) `AppBar` is `position="fixed"` by default, so without a spacer it covers the top of the first card. (2) `Container maxWidth` only accepts breakpoint keys or `false`, so "maxWidth of 1100px" needs `maxWidth={false}` plus `sx={{ maxWidth: 1100 }}`. (3) `TableCell sortDirection` takes `'asc'`/`'desc'`, while `SortState.direction` is `ascending`/`descending`, so a mapping is needed. (4) `SelectProps` is deprecated in newer MUI majors in favor of `slotProps.select`, and no MUI version is pinned. | State `position="static"` (or `sticky`) for the AppBar, the exact Container props, the direction mapping, and the MUI major version with the matching native-select prop. | New |
| R-05 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/functional-spec.md > WF2 and Screens table | Today `RunDetail` always shows "Back to runs" and uses an `h2` for `#detail-heading`. The list screen uses `h2` headings "Test runs" and "Create test run" inside labelled sections. The spec only places "Back to runs" in the loaded card, does not say whether it shows in the loading, not-found and error states, and does not keep the heading levels or section landmarks. That leaves the parity required by NFR1 to the implementer. | State that "Back to runs" shows in every detail state, and that the existing `h2` headings and `aria-labelledby` sections stay the same. | New |
| R-06 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/rules.md > BR3.3 | The row hover color `#F8FAFC` on a white card is only about 1.04:1 against the row, and it is the same color as the page background. The FR3.3 hover highlight would be close to invisible. | Confirm the value with the person, or use a slightly darker token such as slate-100 `#F1F5F9`. | New |
| R-07 | Minor | aidlc/spaces/default/intents/261107-modern-ui-refresh/construction/functional-design/rules.md > BR6.1 | validation.spec asserts that the valid Branch field has `aria-invalid="false"`. BR6.1 only says invalid fields set `aria-invalid`. A field that renders no attribute when valid (for example `error={undefined}` combined with an explicit `inputProps`) would fail that assertion. | Add to BR6.1 that every field always renders `aria-invalid` as `"true"` or `"false"` (MUI `error={!!fieldErrors.x}` does this). | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| sensors (required-sections, upstream-coverage, linter, type-check, traceability) | Not run (the brief made them optional) | I checked by hand instead: every FR1.1–FR7.3 entry in traceability.json resolves to an existing BR ID, and every BR reference in the spec and components files resolves |

### Summary

The design is sound and keeps everything the Playwright suite asserts on. Two Majors need fixing before or during Code Generation: the global focus-ring rule loses to MUI's `outline: 0`, and BR8.1 forbids the lockfile and e2e page-object changes this work needs.

**Verdict:** READY
