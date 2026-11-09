# Functional Design Questions — modern-ui-refresh

Context: [requirements.md](../../inception/requirements-analysis/requirements.md) settled the direction (neutral light theme, MUI, native selects, "Duration" header, readable durations) and handed a few concrete design values to this stage: the accent color, the typeface, the shape and interaction tokens (R-06), and the exact date format. Defaults are suggested where one is clearly sensible.

## Q1. [Design] Accent color
Which single strong accent should drive buttons, links, focus rings and the header?

A. Indigo (around `#4F46E5`): Linear-like, modern, distinct from the status colors
B. GitHub blue (around `#0969DA`): familiar and conservative, but close to the "running" status blue
C. Teal (around `#0D9488`): fresh, but close to the "passed" status green
D. Violet (around `#7C3AED`): bolder and more brand-like
X. Other (please specify)

[Answer]: A

## Q2. [Design] Typeface
A. Inter, bundled with the app (adds one small font dependency; consistent on every OS, the typical GitHub/Linear look)
B. The system font stack (no dependency; looks different on Windows, macOS and Linux)
X. Other (please specify)

[Answer]: A

## Q3. [Design] Shape, border and interaction tokens (R-06)
These become the checkable acceptance values for FR1.2, FR3.3 and NFR3.

A. Suggested set: 8px corner radius; 1px slate-200 (`#E2E8F0`) borders; flat cards with no shadow; table row hover slate-50 (`#F8FAFC`); focus ring 2px in the accent color with a 2px offset (at least 3:1 contrast against the background)
B. Softer: 12px radius and light card shadows instead of borders, everything else as in A
C. Compact: 4px radius and denser table rows, everything else as in A
X. Other (please specify)

[Answer]: A

## Q4. [Product] Created date format (FR7.2)
How should the run detail view show the Created timestamp?

A. Medium local date and time, e.g. `Nov 8, 2026, 6:47 PM`
B. Relative time, e.g. `3 hours ago`, with the full date in a tooltip
C. Numeric, e.g. `2026-11-08 18:47`
X. Other (please specify)

[Answer]: A

## Q5. [Design] Status colors and icons (FR1.3, FR4.2)
A. queued = gray + clock icon, running = blue + sync icon, passed = green + check-circle icon, failed = red + error icon. The icons are static.
B. Same as A, but the running icon spins (reduced motion is respected)
X. Other (please specify)

[Answer]: A

## Q6. [Design] Page layout on wide screens (FR2.2)
A. Single column of stacked cards, max width about 1100px: the runs list card, then the create-run card below it
B. Two columns on wide screens: the runs list on the left (about 2/3) and the create-run form on the right (about 1/3), stacking on narrow screens
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Accent: indigo (`#4F46E5`) for buttons, links, focus rings and the header
- Typeface: Inter, bundled with the app
- Tokens: 8px radius, 1px `#E2E8F0` borders, flat cards, row hover `#F8FAFC`, 2px accent focus ring with 2px offset (at least 3:1 contrast)
- Created date: medium local date and time, e.g. `Nov 8, 2026, 6:47 PM`
- Status: queued gray + clock, running blue + sync, passed green + check-circle, failed red + error; static icons
- Layout: single column of stacked cards, max width about 1100px

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
