# Requirements Analysis Questions — modern-ui-refresh

Context: the Release Quality Dashboard's look comes from one 18-line stylesheet (`apps/web/src/styles.css`). It has hard-coded pastel status badges, browser-default controls and no theme tokens. The Playwright suite relies on accessible names, table structure and visible cell text, so the restyle must keep those intact (see `aidlc/spaces/default/codekb/ai-ci-reference-dashboard/code-quality-assessment.md` § UI Refactor Constraints).

## Q1. [Design] Visual direction
What overall look should the modernized dashboard have? This sets the palette, contrast and mood every later design decision follows.

A. Clean, neutral light theme (slate/gray surfaces with one strong accent color, similar to GitHub or Linear)
B. Dark-first developer dashboard (dark surfaces, bright status colors)
C. Light and dark themes, following the operating system's preference automatically
D. Bold, vibrant brand look (saturated accent color, gradients)
X. Other (please specify)

[Answer]: A

## Q2. [Developer] Styling approach
How should the new styles be built? Today there is no CSS library, so this decides whether we add dependencies.

A. Plain CSS with design tokens (CSS custom properties for colors, spacing, radii, typography), with no new dependencies
B. Tailwind CSS utility classes
C. A component library (e.g. Mantine, Chakra UI, MUI) replacing the native controls
D. CSS Modules per component plus shared design tokens
X. Other (please specify)

[Answer]: C

## Q3. [Product] How far the refresh goes
How much should change beyond colors? Anything that changes the page structure or the visible text means updating the end-to-end tests at the same time.

A. Visual only: colors, typography, spacing, styled buttons/inputs/selects, status badges, hover and focus states. No markup or text changes, so the tests stay untouched.
B. Visual plus layout: everything in A plus a header bar, card-style panels and a responsive layout, keeping every element the tests rely on
C. Everything in B plus small UX polish (readable dates and durations, status icons beside badges), updating the tests where needed
X. Other (please specify)

[Answer]: C

## Q4. [Quality] Protecting the new look
Today nothing automated would catch a visual regression. What, if anything, should this work add?

A. Nothing new: the existing tests must stay green
B. Playwright screenshot comparison tests for the main views
C. A CSS linter/formatter (Stylelint + Prettier)
D. Both B and C
X. Other (please specify)

[Answer]: X. Nothing new, but if the tests regress we will just fix them

## Q5. [Developer] Which component library (follow-up to Q2)
Q2 picked a component library. Which one? It decides the look out of the box, bundle size and how the tests find elements.

A. Mantine (modern neutral look out of the box, matches the Q1 GitHub/Linear direction, CSS-variable theming)
B. MUI (Material Design look, largest ecosystem, heavier bundle)
C. Chakra UI (simple theming, accessible defaults)
D. shadcn/ui on Radix + Tailwind (copy-in components, closest to the Linear look, adds Tailwind)
X. Other (please specify)

[Answer]: B MUI

## Consolidated Summary Confirmation

- Visual direction: clean, neutral light theme (slate/gray surfaces, one strong accent), GitHub/Linear style [Q1]
- Styling: MUI (Material UI) replaces the native controls; its theme is customized toward the neutral Q1 look rather than stock Material Design [Q2, Q5]
- Scope: visual plus layout (header bar, card panels, responsive layout) plus small UX polish (readable dates/durations, status icons beside badges) [Q3]
- End-to-end tests may be updated where the UX polish changes markup or text [Q3]
- No new tooling (no screenshot tests, no linter); existing tests stay green, and any regressions get fixed [Q4]
- Backend/API, data model and dashboard behavior are unchanged

Does this all look correct before I generate the requirements artifact?

A. Looks correct
B. Request changes
X. Other (please specify)

[Answer]: Looks correct
