# Date-Next Consumer Migration Plan

Scope: migrate single-date and range consumers from `form/date` to `form/date-next` in controlled slices.

## Preconditions

- `DatePickerNext` parity rows required by product surface are complete or explicitly accepted.
- `DateRangePickerNext` parity rows required by product surface are complete or explicitly accepted.
- Engineering verification is green:
  - targeted `date-next` tests pass in `@bwalkt/ui`
  - Storybook build passes for `@bwalkt/ui`
- `SCREEN_READER_CHECKLIST.md` is populated with the latest engineering evidence and the human-run AT matrix.

## Rollout Levels

### Level 1: Controlled/Internal Rollout

Allowed when:
- parity rows are `[x]` or explicitly accepted `[-]`
- Storybook scenarios exist for the consumer surface
- migration is isolated to a low-risk/internal form

This is the active readiness level for the `2026-03-22` rollout packet.

### Level 2: Broad/Public Rollout

Allowed only when:
- at least one human-run screen-reader pass has been logged in `SCREEN_READER_CHECKLIST.md`
- accepted deltas are revisited and still acceptable for the intended audience
- migrated consumers have completed manual QA signoff

## Rollout Strategy

1. Identify first low-risk consumer:
   - Internal/admin form with existing date picker tests.
   - No custom natural-language behavior beyond `enableNaturalLanguage` baseline.
2. Migrate single-date usage first:
   - Replace imports and props from legacy picker to date-next equivalents.
   - Keep submitted field names unchanged.
   - Preserve `min/max/disabledDates` constraints.
3. Validate contract parity in the consumer:
   - Hidden input values still match backend contract.
   - Keyboard open/close and segment editing behavior remains acceptable.
   - Storybook/visual review for default and constrained states.
4. Migrate range usage next:
   - Replace legacy range picker with `DateRangePickerNext`.
   - Validate hidden `${name}_from` / `${name}_to` contract.
   - Validate dual-month behavior where applicable.
   - Reuse the same manual AT scenario list from `SCREEN_READER_CHECKLIST.md` for shared calendar flows.
5. Remove legacy usage only after green verification:
   - Unit/integration tests pass for migrated surface.
   - Manual QA signoff for keyboard and screen-reader checklist items.

## Verification Checklist Per Consumer

- Form submit payload unchanged for date fields.
- `defaultValue`, controlled `value`, and `onChange` behavior unchanged.
- Disabled/bounded dates still blocked.
- Keyboard behavior: Enter, Escape, Tab sequencing, arrow key edits.
- Locale behavior validated for target locale(s).

## Backout Plan

- Keep migration in isolated PR per consumer.
- If regression appears, revert consumer import back to legacy `form/date` picker.
- Track issue with failing parity row and add targeted regression test before retry.
