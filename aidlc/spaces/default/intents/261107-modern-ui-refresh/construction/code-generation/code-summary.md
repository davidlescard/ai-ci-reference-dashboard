# Code Summary — modern-ui-refresh

## Files

**Created**
- `apps/web/src/tokens.ts`: plain design values (colors, radius, header colors) and `statusStyles`, with no MUI import.
- `apps/web/src/theme.ts`: the MUI theme built from the tokens: Inter, radius 8, flat bordered surfaces, no uppercase buttons, row hover `#F1F5F9`, and focus rings set per control.
- `apps/web/src/format.ts`: `formatDuration` and `formatCreated`.
- `apps/web/src/AppHeader.tsx`: indigo static `AppBar` with an `h1` that links home.
- `apps/web/src/StatusBadge.tsx`: filled `Chip` with a decorative icon.
- `e2e/tests/unit/format.spec.ts`: tests U1 and U2.
- `e2e/tests/unit/tokens.spec.ts`: test U3.
- `e2e/tests/ui/modern-ui.spec.ts`: tests E1–E6.

**Modified**
- `apps/web/package.json` and the root `pnpm-lock.yaml`: added MUI 9.5.0 (`@mui/material`, `@mui/icons-material`), `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1 and `@fontsource/inter` 5.3.0.
- In `apps/web/src`:
  - `main.tsx`: wraps the app in `ThemeProvider` and `CssBaseline`, and loads Inter.
  - `App.tsx`: uses `AppHeader` and a 1100px `Container`.
  - `RunList.tsx`, `RunDetail.tsx`, `NewRunForm.tsx`: rebuilt with MUI.
- `e2e/playwright.config.ts`: new `unit` project.
- `e2e/src/pages/dashboard.page.ts`: `RUN_COLUMNS` now says `'Duration'`.

**Deleted**
- `apps/web/src/styles.css` and its import. The theme covers everything it did.

## Key implementation decisions

- **Selects:** "Status" and "Update status" are native selects, so Playwright's `selectOption()` and the combobox names still work. Their labels stay raised so they don't cover the "All statuses" text.
- **Focus ring on text fields and selects:** drawn on the box around the input (`MuiOutlinedInput` `&.Mui-focused`). Buttons and sort labels use `Mui-focusVisible`, and links use `a:focus-visible`. The ring is white inside the header.
- **Sorted column header:** shown in indigo. The arrow is an icon with no text, so the header text still matches the column labels exactly.
- **Loading spinner:** none added (the design called it optional). The loading message stays text with `role="status"`.
- **Test IDs:** every new or touched control has a `data-testid`. The existing tests still find elements by role and name.

## Test coverage summary

| Check | Result |
|---|---|
| Unit tests (`--project=unit`) | 3 of 3 passed (U1–U3) |
| New browser spec `tests/ui/modern-ui.spec.ts` | 6 of 6 passed (E1–E6) |
| Full E2E suite (`pnpm test:e2e`) | 28 passed, 2 skipped (19 passed and 2 skipped before; the same 2 tests are skipped) |
| API tests (`pnpm test`) | 16 passing (unchanged) |
| `pnpm --filter @qgl/web compile` and the e2e compile | no errors |
| `pnpm build` | passed. JS is 148.63 KB gzipped (478.16 KB raw) against the 300 KB budget; it was 70.60 KB before |

## Tests written but not executed

None. Every test written in this stage was run.

## Deviations from the plan

- **Icon names:** MUI icons v9 has no `CheckCircleOutline` or `ErrorOutline`. The badge uses `CheckCircleOutlined` and `ErrorOutlined` instead, the same outline icons, still imported one by one.
- **MUI version:** "current stable, v7 or later" resolved to v9.5.0. `slotProps.select` is used as planned.
- **Bad duration values:** `formatDuration` shows a negative or non-numeric value as it came in instead of throwing. That matches how `formatCreated` handles bad dates and keeps one bad value from blanking the list.
- **`styles.css`:** deleted, because nothing was left in it. The plan allowed this.
- **`unit-test-instructions.md`:** one note added saying `pnpm test:e2e` now runs the unit project too.
