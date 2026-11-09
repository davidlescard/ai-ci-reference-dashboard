<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->

- 2026-11-09T00:09:53Z — refactor plan has no unit-of-work or components; treated the existing apps/web screens as the domain design and modelled only view state and design tokens as new entities

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-11-09T00:09:53Z — frontend-components.md names MUI building blocks despite the stage's technology-agnostic default, because requirements fix MUI as a constraint and Code Generation needs the mapping

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-11-09T00:09:53Z — filled status chips with white text (700-shade colors) instead of tinted chips; guarantees 4.5:1 contrast at the cost of louder badges
- 2026-11-09T00:09:53Z — no required asterisk on form fields; MUI would change the accessible names the E2E suite relies on

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
