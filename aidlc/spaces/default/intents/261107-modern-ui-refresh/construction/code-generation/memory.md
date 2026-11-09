<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-11-09T00:55:00Z — "current stable MUI major, v7+" resolved to MUI 9.5.0 (`@mui/material`, `@mui/icons-material`), `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1, `@fontsource/inter` 5.3.0; the lockfile pins them.
- 2026-11-09T00:55:00Z — Brownfield baseline taken on the unchanged tree before any edit: `pnpm build` OK (JS 70.60 KB gz), `pnpm test:e2e` 19 passed / 2 skipped, `pnpm test` 16 passing.
- 2026-11-09T00:55:00Z — Focus ring on text fields and native selects is drawn on the `MuiOutlinedInput` root (`&.Mui-focused`), so E6 reads the outline from that root, not from the inner `<input>`; the focused notched-outline border keeps the 1px `#E2E8F0` border, so the ring replaces MUI's focus color change.
- 2026-11-09T00:55:00Z — Native selects ("Status", "Update status") use `slotProps.inputLabel.shrink: true` so the label does not overlap the "All statuses" text when the value is empty.
- 2026-11-09T00:55:00Z — Selected sort header uses the accent color (BR1.1) through a `MuiTableSortLabel` `&.Mui-active` override; the sort icon is an SVG and adds no header text, so `verifyColumns` still matches exactly.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-11-09T00:55:00Z — Step 6 named the icons `CheckCircleOutline` and `ErrorOutline`; MUI icons v9 no longer ships those names, so StatusBadge uses `CheckCircleOutlined` and `ErrorOutlined` (same outline glyphs, path imports). `ScheduleOutlined` and `Sync` as planned.
- 2026-11-09T00:55:00Z — `formatDuration` returns the raw value as a string for input outside the API contract (negative or non-finite) instead of throwing, mirroring `formatCreated`'s raw fallback; a throw inside render would blank the whole runs list over one bad value.
- 2026-11-09T00:55:00Z — `styles.css` was deleted (plan's "delete the file and its import if nothing remains" branch): CssBaseline + theme cover the body font, colors and background.
- 2026-11-09T00:55:00Z — The file tool could not create the missing `e2e/tests/unit/` folder, so it was created with one `New-Item -ItemType Directory` (the folder the plan names). A scratch file `apps/web/src/main.tsx.new` written by mistake was removed; `main.tsx` was edited in place.
- 2026-11-09T00:55:00Z — Added a short runner-check note to unit-test-instructions.md (Step 2 "record"): the commands were already recorded verbatim; the note records the `--list` result and that `pnpm test:e2e` now also runs the `unit` project.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-11-09T00:55:00Z — No loading spinner was added beside "Loading runs..." (frontend-components.md calls it optional); keeps the bundle and the status semantics simple.
- 2026-11-09T00:55:00Z — JS grew from 70.60 KB to 148.63 KB gz (one chunk), well under the 300 KB NFR4 budget; Inter ships every subset as separate font files (not JS), which the browser fetches only per unicode-range.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
