# Frontend Components — modern-ui-refresh

Component hierarchy and responsibilities for `apps/web` after the refresh. The library (MUI) is fixed by [requirements.md](../../inception/requirements-analysis/requirements.md) (Constraints, FR1.1), so the building blocks are named here. Behavior and values come from [functional-spec.md](./functional-spec.md) and [rules.md](./rules.md).

## Hierarchy

```
main.tsx
└─ ThemeProvider (theme) + CssBaseline            BR1.1–BR1.6
   └─ App (hash routing, unchanged)
      ├─ AppHeader                                BR2.1
      └─ PageContainer (max 1100px, centered)     BR2.2
         ├─ RunList                (route #/)
         │  ├─ Card "Test runs"
         │  │  ├─ RunFilters                      BR3.1, BR2.3
         │  │  ├─ ListStateMessage                BR3.4
         │  │  └─ RunsTable                       BR3.2, BR3.3, BR3.5, BR3.6
         │  │     └─ StatusBadge, DurationText    BR4, BR7.1
         │  └─ Card "Create test run"
         │     └─ NewRunForm                      BR6.1, BR6.2, BR2.3
         └─ RunDetail              (route #/runs/{id})
            └─ Card
               ├─ "Back to runs" link, heading #detail-heading
               ├─ DetailList (label/value pairs)  BR5.1
               │  └─ StatusBadge, DurationText, CreatedText
               ├─ UpdateStatusSelect              BR5.2
               └─ DetailStateMessage              BR5.3
```

## New modules

| Module | Responsibility | Props / API | Rules |
|---|---|---|---|
| `theme.ts` | Builds the one theme: palette (primary `#4F46E5`, background `#F8FAFC`/`#FFFFFF`, text `#0F172A`/`#475569`, divider `#E2E8F0`), the four status colors, shape radius 8, Inter typography, component overrides (flat bordered `Paper`/`Card`, no button uppercase, row hover, focus-visible ring) | exports `theme` and `statusStyles` | BR1.1–BR1.6 |
| `StatusBadge.tsx` | Filled `Chip` with the status color, white text and a decorative static icon (`ScheduleOutlined`, `Sync`, `CheckCircleOutline`, `ErrorOutline`) | `{ status: Status }` | BR4.1, BR4.2, BR1.4 |
| `format.ts` | `formatDuration(seconds)` and `formatCreated(iso)` pure functions | `(n: number) => string`, `(s: string) => string` | BR7.1, BR7.2 |
| `AppHeader.tsx` | `AppBar position="static"` (no spacer needed, nothing covered) with the indigo `#4F46E5` background and white text, `elevation={0}`; `Typography component="h1"` wrapping a link to `#/` | none | BR2.1, BR1.1 |

## Changed modules

| Module | Change | Must keep |
|---|---|---|
| `main.tsx` | Wrap `<App/>` in `ThemeProvider` + `CssBaseline`; import the Inter font weights 400/500/600/700 | Mount point |
| `App.tsx` | Use `AppHeader` and `Container maxWidth={false} sx={{ maxWidth: 1100 }}` instead of the bare `<header>` | Hash routing logic |
| `RunList.tsx` | `TextField type="search"` for "Search runs"; `TextField select` with native select for "Status"; MUI `Table` with `TableSortLabel` headers (map `ascending`/`descending` to MUI `asc`/`desc` for `sortDirection` and `direction`); `Alert` for the error with a Retry `Button`; status/empty text as `Typography`; table in a horizontally scrolling `TableContainer`; header label "Duration" | All state logic, labels, messages, roles, `aria-label="Test runs"`, sort semantics, the `h2` "Test runs" and its labelled section |
| `RunDetail.tsx` | `Card` layout; label/value grid; native select "Update status"; `Alert` for errors; "Back to runs" rendered outside the state branches so it shows in every state | Messages, roles, `h2#detail-heading`, labelled section, update logic |
| `NewRunForm.tsx` | `TextField` for Name, Branch, Notes (multiline) with `error={!!errors.x}` (renders `aria-invalid` as `"true"` or `"false"` on every field) and `helperText`; contained primary `Button` | Submit logic, messages, roles, `noValidate`, no required asterisk, the `h2` "Create test run" and its labelled section |
| `styles.css` | Delete the badge, filter, sort-button, error and layout rules; keep only what the theme does not cover (expected: nothing or a minimal body rule) | — |

## Interaction and accessibility notes

- **Native selects (BR3.1, BR5.2):** use `TextField select` with `slotProps={{ select: { native: true } }}` (MUI v6+; `SelectProps` is deprecated) and an explicit `id` so the label is associated. The control stays a real `<select>` with role combobox and works with `selectOption()`.
- **Accessible names (BR6.1):** do not set `required` on the TextFields, because MUI adds " *" to the label and would change the name. Field errors use `helperText`, which MUI links with `aria-describedby`.
- **Single alert (BR3.4):** use `Alert` (it has role alert) for the error and do not wrap it in another `role="alert"`. Only one alert is visible in each error state.
- **Status messages (BR3.4, BR5.3, BR6.2):** keep loading and success messages as text with `role="status"`. An optional spinner sits beside the text, outside the table, and is `aria-hidden`.
- **Sort headers (BR3.2):** `TableCell sortDirection` produces `aria-sort` on the `th`; `TableSortLabel` provides the button. Its arrow icon adds no text. The header text must be exactly the column label.
- **Badge text (BR4.2):** the Chip label is the raw status; no `textTransform`. Icons come from `@mui/icons-material/<Name>` path imports (BR1.8).
- **Focus (BR1.5):** MUI cancels a single global rule (`ButtonBase` sets `outline: 0`, `InputBase` sets `:focus { outline: 0 }`), so set the ring per control type in theme `styleOverrides`:
  - `MuiButtonBase` root `&.Mui-focusVisible`: `outline: 2px solid #4F46E5; outline-offset: 2px` (covers Button, Retry, TableSortLabel).
  - `MuiOutlinedInput` root `&.Mui-focused`: the same outline on the input root (covers text fields and native selects), in place of MUI's focused border color change.
  - `MuiLink` and plain anchors: a global `a:focus-visible` rule in `CssBaseline` overrides.
  - Inside the header bar, the title link's ring is white (`#FFFFFF`) for contrast against indigo.
- **Hover (BR3.3):** body rows use `TableRow hover` with the hover color overridden to `#F1F5F9`.

## API integration points

Unchanged (BR8.1): `api.listRuns(search, status)`, `api.getRun(id)`, `api.createRun(input)`, `api.updateStatus(id, status)` in `api.ts`. No new calls, and no changes to request or response shapes.

## Form validation

Unchanged: validation is server-side. The form sends the values and shows the returned `fieldErrors` per field (BR6.1). No new client-side validation is added (NFR1).

## New dependencies (FR1.1, BR1.8)

`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material` (per-icon path imports only), all on the current stable MUI major (v7 or later; pinned by the lockfile at install), and `@fontsource/inter` (CSS font files, not counted in the JS budget). The root `pnpm-lock.yaml` is updated and committed with them (BR8.1).
