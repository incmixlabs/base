## Summary
We currently have two parallel color-variable systems in `packages/ui`:
1. Legacy globals in `packages/ui/src/globals.css` (`--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, etc.)
2. Semantic token system in `packages/ui/src/theme/design-tokens.css` (`--color-*-*`)

The legacy vars are still actively referenced, so they cannot be safely removed yet.

## Why this matters
- Increases theme drift risk (two sources of truth)
- Makes component migration harder
- Prevents cleanup of `globals.css` color layer

## Current active references (examples)
- `packages/config/tailwind.config.js` maps Tailwind colors to `var(--primary)`, `var(--muted)`, etc.
- `packages/ui/src/theme/sprinkles.css.ts` references `var(--primary)`, `var(--accent)`, `var(--muted)`.
- Date components reference these vars directly:
  - `packages/ui/src/form/date/Calendar.tsx`
  - `packages/ui/src/form/date/MiniCalendar.tsx`
  - `packages/ui/src/form/date/calendar.css`

## Scope
- Migrate active usage of legacy vars to semantic `--color-*` tokens (or an explicit alias layer in one place).
- Update Tailwind color config and sprinkles mappings accordingly.
- Remove dead legacy color var definitions from `packages/ui/src/globals.css`.

## Acceptance Criteria
- No runtime usage of:
  - `var(--primary)`, `var(--primary-foreground)`
  - `var(--secondary)`, `var(--secondary-foreground)`
  - `var(--muted)`, `var(--muted-foreground)`
  - `var(--accent)`, `var(--accent-foreground)`
  - `var(--destructive)`
- Tailwind classes (`bg-primary`, `text-muted-foreground`, etc.) still render correctly via new mappings.
- `design-tokens.css` remains the single source of truth for semantic colors.
- Typecheck/tests/stories continue to pass for touched areas.

## Suggested implementation order
1. Add/confirm canonical alias mapping from legacy names to `--color-*` tokens (temporary bridge if needed).
2. Migrate `tailwind.config.js` color entries to semantic tokens.
3. Migrate `sprinkles.css.ts` color entries.
4. Migrate date components (`Calendar`, `MiniCalendar`, `calendar.css`).
5. Remove legacy color var definitions from `globals.css`.
6. Run regression checks for stories and date controls.

## Next batch

As of March 30, 2026, the next migration batch should stay focused on the legacy date stack rather than broad primitive cleanup.

### Prioritize together
- `packages/ui/src/form/date/Calendar.tsx`
- `packages/ui/src/form/date/MiniCalendar.tsx`
- `packages/ui/src/form/date/calendar.css`
- `packages/ui/src/form/date/DatePicker.tsx`
- `packages/ui/src/form/date/DateRangePicker.tsx`
- `packages/ui/src/form/date/DateTimePicker.tsx`
- `packages/ui/src/form/date/AppointmentPicker.tsx`
- `packages/ui/src/form/date/CalendarWithPresets.tsx`
- `packages/ui/src/form/date/CalendarWithPricing.tsx`

### Why this batch
- These surfaces still carry direct legacy color-var usage and are the clearest blocker to making semantic tokens the single source of truth.
- The batch aligns with the CSS runtime contract direction tracked in `docs/css.md` and issue `#419`.
- The date surfaces are a coherent family, so migration work can be reviewed and regression-tested as one stream instead of scattering across unrelated primitives.

### Deferred
- `DataList` is intentionally deferred from this migration stream.
- Within this repo it appears unused outside its export/docs surface, but it remains part of the public `@bwalkt/ui` API, so it should not be deleted as incidental cleanup in this effort.
