# date-next

Current status of the `packages/ui/src/form/date-next` migration.

## What Is Already On `date-next`

- Filter calendar rendering in [`packages/ui/src/elements/filter/Filter.tsx`](../../packages/ui/src/elements/filter/Filter.tsx)
  - Uses `DateNextCalendarPanel`
  - Uses `MiniCalendarNext`
- Core next surfaces exist:
  - `DatePickerNext`
  - `DateRangePickerNext`
  - `DateTimePickerNext`
  - `MiniCalendarNext`
  - `CalendarWithPresetsNext`
  - `CalendarWithPricingNext`
  - `AppointmentPickerNext`

## Current State

- Legacy [`packages/ui/src/form/date`](../../packages/ui/src/form/date) has been removed.
- Public [`packages/ui/src/form/index.ts`](../../packages/ui/src/form/index.ts) exports now point at the `date-next` implementation.
- Known live consumers such as [`packages/ui/src/blocks/crud/todos/TodosBlock.tsx`](../../packages/ui/src/blocks/crud/todos/TodosBlock.tsx) are already on [`DateNextCalendarPanel`](../../packages/ui/src/form/date/DateNextCalendarPanel.tsx).

## Remaining Gaps

### 1. Parity Evidence Is Uneven

Strong parity evidence exists for:

- `DatePickerNext`
- `DateRangePickerNext`
- `MiniCalendarNext`
- `CalendarWithPricingNext`
- `CalendarWithPresetsNext`

Parity/test coverage appears thinner for:

- [`packages/ui/src/form/date/DateTimePickerNext.tsx`](../../packages/ui/src/form/date/DateTimePickerNext.tsx)
- [`packages/ui/src/form/date/AppointmentPickerNext.tsx`](../../packages/ui/src/form/date/AppointmentPickerNext.tsx)

Implication:
- these may be usable
- but they do not have the same migration confidence as the better-covered `next` pickers

### 2. Accessibility Verification Is Still Pending

- Manual screen-reader verification is still tracked in [`docs/date-next/SCREEN_READER_CHECKLIST.md`](./SCREEN_READER_CHECKLIST.md).
- Broad rollout confidence should come from logged VoiceOver, NVDA, and JAWS runs rather than migration plumbing, which is already complete.

## Suggested Order

1. Complete the screen-reader checklist
2. Add parity coverage where still thin, especially `DateTimePickerNext` and `AppointmentPickerNext`
3. Leave the `date-next` path in place temporarily for branch stability, then rename it to `date` in a dedicated cleanup pass
