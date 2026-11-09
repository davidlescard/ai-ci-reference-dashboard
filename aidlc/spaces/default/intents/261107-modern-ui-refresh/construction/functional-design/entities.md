# Entities — modern-ui-refresh

This is a presentation-only refactor (see [requirements.md](../../inception/requirements-analysis/requirements.md), NFR1). The domain data (`Run`) is unchanged and is listed only as the read model the screens render. The other entities are the view state and design tokens this design introduces. Values come from the functional design answers ([functional-design-questions.md](./functional-design-questions.md), Q1–Q6).

```yaml
entities:
  - name: Run
    description: Existing read model returned by the API. Unchanged by this work (NFR1).
    attributes:
      - { name: id, type: integer, required: true, unique: true }
      - { name: name, type: string, required: true }
      - { name: branch, type: string, required: true }
      - { name: status, type: RunStatus, required: true }
      - { name: durationSeconds, type: integer, required: true, min: 0, constraints: "displayed via DurationText, sorted on the raw number" }
      - { name: notes, type: string, required: false, default: "", constraints: "empty shown as 'None'" }
      - { name: createdAt, type: iso-8601 timestamp string, required: true, constraints: "displayed via CreatedText" }
    relationships:
      - { to: RunStatus, cardinality: "many-to-one", direction: "Run -> RunStatus" }

  - name: RunStatus
    description: Fixed set of run statuses (enumeration).
    attributes:
      - { name: value, type: enum, required: true, allowed: [queued, running, passed, failed] }
    relationships:
      - { to: StatusStyle, cardinality: "one-to-one", direction: "RunStatus -> StatusStyle" }

  - name: StatusStyle
    description: Visual treatment for one status, defined once in the theme (FR1.3, FR4).
    attributes:
      - { name: status, type: RunStatus, required: true, unique: true }
      - { name: background, type: color hex, required: true }
      - { name: foreground, type: color hex, required: true, default: "#FFFFFF" }
      - { name: icon, type: enum, required: true, allowed: [clock, sync, check-circle, error] }
    constraints:
      - "foreground on background contrast >= 4.5:1"
      - "icon is decorative and static (no animation)"
    instances:
      - { status: queued,  background: "#475569", icon: clock }
      - { status: running, background: "#1D4ED8", icon: sync }
      - { status: passed,  background: "#15803D", icon: check-circle }
      - { status: failed,  background: "#B91C1C", icon: error }

  - name: ThemeTokens
    description: Single source of the neutral light look (FR1.2). Exactly one instance.
    attributes:
      - { name: accent, type: color hex, required: true, default: "#4F46E5" }
      - { name: pageBackground, type: color hex, required: true, default: "#F8FAFC" }
      - { name: surface, type: color hex, required: true, default: "#FFFFFF" }
      - { name: border, type: color hex, required: true, default: "#E2E8F0" }
      - { name: borderWidth, type: length, required: true, default: "1px" }
      - { name: rowHover, type: color hex, required: true, default: "#F1F5F9" }
      - { name: headerBackground, type: color hex, required: true, default: "accent" }
      - { name: headerText, type: color hex, required: true, default: "#FFFFFF" }
      - { name: textPrimary, type: color hex, required: true, default: "#0F172A" }
      - { name: textSecondary, type: color hex, required: true, default: "#475569" }
      - { name: radius, type: length, required: true, default: "8px" }
      - { name: cardShadow, type: enum, required: true, allowed: [none], default: none }
      - { name: focusRingWidth, type: length, required: true, default: "2px" }
      - { name: focusRingOffset, type: length, required: true, default: "2px" }
      - { name: focusRingColor, type: color hex, required: true, default: "accent" }
      - { name: fontFamily, type: string, required: true, default: "Inter, then the system sans-serif stack" }
      - { name: contentMaxWidth, type: length, required: true, default: "1100px" }
      - { name: narrowBreakpoint, type: length, required: true, default: "600px" }
    relationships:
      - { to: StatusStyle, cardinality: "one-to-four", direction: "ThemeTokens -> StatusStyle" }

  - name: RunListViewState
    description: Client state of the runs list screen (unchanged semantics).
    attributes:
      - { name: search, type: string, required: true, default: "" }
      - { name: statusFilter, type: "RunStatus or empty", required: true, default: "" }
      - { name: sort, type: "SortState or none", required: false, default: none }
      - { name: phase, type: enum, required: true, allowed: [loading, loaded, empty, error], default: loading }
      - { name: errorMessage, type: string, required: false }
    relationships:
      - { to: Run, cardinality: "one-to-many", direction: "RunListViewState -> Run" }

  - name: SortState
    description: Current table sort.
    attributes:
      - { name: column, type: enum, required: true, allowed: [name, branch, status, durationSeconds] }
      - { name: direction, type: enum, required: true, allowed: [ascending, descending] }

  - name: RunDetailViewState
    description: Client state of the run detail screen (unchanged semantics).
    attributes:
      - { name: runId, type: integer, required: true }
      - { name: phase, type: enum, required: true, allowed: [loading, loaded, not-found, error], default: loading }
      - { name: updateError, type: string, required: false }

  - name: NewRunFormState
    description: Client state of the create run form (unchanged semantics).
    attributes:
      - { name: name, type: string, required: true, default: "" }
      - { name: branch, type: string, required: true, default: "" }
      - { name: notes, type: string, required: false, default: "" }
      - { name: fieldErrors, type: "map field -> message", required: false }
      - { name: formError, type: string, required: false }
      - { name: successMessage, type: string, required: false }
      - { name: submitting, type: boolean, required: true, default: false }
```

## Summary

| Entity | Kind | New in this work? |
|---|---|---|
| Run, RunStatus | Domain read model | No, unchanged |
| StatusStyle (x4) | Design token | Yes, replaces the pastel badge colors |
| ThemeTokens | Design token | Yes, the single source of the look |
| RunListViewState, SortState, RunDetailViewState, NewRunFormState | View state | No, same behavior; only how it is shown changes |

All four status colors give at least 4.5:1 contrast with white text (slate-600 7.6:1, blue-700 6.7:1, green-700 5.0:1, red-700 6.5:1).
