<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-11-08T23:44:15Z — Q2 "component library" left the library unnamed; added follow-up Q5, human chose MUI. MUI theme customized toward Q1's neutral look rather than stock Material.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-11-08T23:44:15Z — Native MUI select chosen over custom popup (R-01); keeps e2e selectOption() and exact accessible names working at the cost of the custom dropdown look.
- 2026-11-08T23:44:15Z — Header renamed "Duration (s)" to "Duration" (R-02) so readable durations are consistent; RUN_COLUMNS test constant must change.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-11-08T23:44:15Z — Functional Design to settle visual token values (R-06), table-row and badge-text pass criteria (R-05), and the duration format edge cases (0s, under a minute, an hour or more).