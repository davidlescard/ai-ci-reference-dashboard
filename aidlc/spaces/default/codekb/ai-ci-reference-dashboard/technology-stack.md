# Technology Stack — ai-ci-reference-dashboard

Versions are manifest ranges, with the resolved `pnpm-lock.yaml` version in parentheses where it differs. `dependencies.md` gives the full per-package list.

## Languages and Runtimes

| Item | Version | Where |
|---|---|---|
| TypeScript | ^7.0.2 | all packages (`strict: true`) |
| Node.js | `engines: >=22`; image `node:24-slim`; Jenkins 24.20.0; GH Actions 24 | root `package.json`, `Dockerfile` |
| pnpm | 12.14.0 (`packageManager`) | workspace |
| HTML/CSS | plain CSS, no preprocessor | `apps/web` |
| Bash | `build.sh` | root |

## Frameworks

| Layer | Technology | Version |
|---|---|---|
| UI | React + ReactDOM | ^19.3.0 (19.3.1) |
| Bundler / dev server | Vite + @vitejs/plugin-react | ^8.3.4 / ^6.1.2 |
| HTTP server | Express | ^5.3.0 |
| Persistence | `node:sqlite` `DatabaseSync` (built-in) | Node runtime |
| Unit/API tests | Mocha, Chai, tsx (loader) | ^12.0.3, ^6.3.0, ^4.23.15 |
| E2E | @playwright/test (Chromium in CI) | ^1.64.1 |
| Containers | Docker, Docker Compose | — |
| CI | GitHub Actions; Jenkins LTS (JDK 21) with Configuration as Code and Job DSL | — |

## Styling and Theming

This is the surface the modern-ui-refresh intent will change.

- **Approach**: one global, hand-written stylesheet, `apps/web/src/styles.css` (18 rule lines), imported once in `main.tsx`. Not used: CSS modules, CSS-in-JS, Tailwind/utility CSS, Sass/Less, PostCSS config, component or UI library (MUI, Chakra, Radix, shadcn, and so on), icon library, web fonts, favicon, CSS custom properties (design tokens), dark mode / `prefers-color-scheme`, and media queries.
- **Typography**: `font-family: system-ui, sans-serif`, browser default sizes. `label` and `th` use bold weights (600 and 700).
- **Layout**: `main { max-width: 860px; margin: 0 auto; padding: 1rem }`. Filters use flex with `gap: 1rem` and wrap. Form controls are `display:block`, `min-width: 240px`, `padding: 0.4rem`. Buttons get padding only (native look).
- **Table**: full width, collapsed borders, `0.5rem` cell padding, 1px bottom border.
- **Status badges**: `.badge` is a pill (`border-radius: 999px`, `0.85rem`). The modifier class is the raw status value.

| Token (implicit) | Hex | Used by | Note |
|---|---|---|---|
| Text | `#1f2933` | `body` | dark slate |
| Divider | `#d9e2ec` | `th, td` bottom border | pale blue-grey |
| Passed | `#c6f6d5` | `.badge.passed` | pastel green |
| Failed | `#fed7d7` | `.badge.failed` | pastel pink/red |
| Running | `#bee3f8` | `.badge.running` | pastel blue |
| Queued | `#e2e8f0` | `.badge.queued` | light grey |
| Error text | `#9b2c2c` | `.error, .field-error` | dark red |

The four badge backgrounds and the error red match the Chakra UI v1 palette (`green.100`, `red.100`, `blue.100`, `gray.200`, `red.800`), which equals Tailwind v1's `green-200`, `red-200`, `blue-200`, `gray-300`, and `red-800`. The text and divider colours match the "cool grey" scale from Refactoring UI. These identifications come from the hex values themselves; nothing is imported. Badge text uses the inherited `#1f2933`. No hover, focus, or active states are defined, so focus rings are the browser defaults.

- **Interaction styling**: `.sort-button` resets the native button to plain bold text. Sort direction shows through `th[aria-sort] .sort-button::after` (▲ / ▼).
- **JSX class names in use**: `filters`, `badge`, `queued|running|passed|failed`, `error`, `field-error`, `sort-button`. There are no inline `style` props.

## Tooling

- Type checking: `tsc --noEmit` per package (`pnpm -r compile`). No ESLint, Prettier, or Stylelint.
- Build: `vite build` (web, after `tsc --noEmit`) and `tsc -p tsconfig.build.json` (API → `dist/`).
- Dev: `tsx watch src/server.ts` (API) and `vite` (web, port 5173, proxies `/api`).
