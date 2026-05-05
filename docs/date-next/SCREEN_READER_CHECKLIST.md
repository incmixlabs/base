# Date-Next Screen Reader Verification Checklist

Scope: `DatePickerNext` + `DateRangePickerNext` + `MiniCalendarNext` + shared calendar-surface consumers (`CalendarWithPricingNext`, `CalendarWithPresetsNext`).

Status legend:
- `[ ]` not run
- `[x]` verified
- `[-]` partially verified / needs follow-up

## Current Readiness Snapshot

- Automated engineering evidence captured on `2026-03-22`.
- Shared `date-next` tests pass in `@bwalkt/ui` (`775` tests total in the package run, including all `date-next` suites).
- Storybook build succeeds for the `@bwalkt/ui` package and includes the full date-next story set.
- No screen-reader results are recorded in this file yet because VoiceOver/NVDA/JAWS execution requires an interactive assistive-technology operator and cannot be completed from this terminal session alone.
- Current rollout interpretation:
  - Controlled/internal rollout may proceed with the accepted delta recorded in `PARITY_CHECKLIST.md`.
  - Broad/public rollout should wait for at least one human-run screen-reader pass to be logged here.

## Engineering Evidence Captured On 2026-03-22

- Branch: `chore/date-next-rollout-readiness`
- Test command:
  - `pnpm --filter @bwalkt/ui test -- --run packages/ui/src/form/date-next`
- Result:
  - Pass. Package test run completed successfully with `41` test files and `775` tests passing, including:
  - `src/form/date/DatePickerNext.test.tsx`
  - `src/form/date/DatePickerNext.integration.test.tsx`
  - `src/form/date/DateRangePickerNext.test.tsx`
  - `src/form/date/DateRangePickerNext.integration.test.tsx`
  - `src/form/date/MiniCalendarNext.test.tsx`
  - `src/form/date/CalendarWithPricingNext.test.tsx`
  - `src/form/date/CalendarWithPresetsNext.test.tsx`
- Storybook command:
  - `pnpm --filter @bwalkt/ui build-storybook`
- Result:
  - Pass. Storybook static build emitted successfully to `packages/ui/storybook-static`.
- Storybook scenarios to use for manual AT runs:
  - `DatePickerNext`: `Default`, `WithBounds`, `WithDisabledDates`, `KeyboardParity`, `NaturalLanguage`, `LocaleArabicEgypt`, `LocalePersianGregorian`
  - `DateRangePickerNext`: `Default`, `BoundsAndDisabledDates`, `MultiMonth`, `KeyboardParity`, `LocaleArabicEgypt`
  - `MiniCalendarNext`: `Default`, `Bounds`
  - `CalendarWithPricingNext`: `Default`, `WithUnavailableDates`, `WithMinMaxDate`
  - `CalendarWithPresetsNext`: `Default`, `TwoMonths`, `WithMinMaxDate`

## Human-Run Test Setup

- Components:
  - `DatePickerNext` baseline value: `2026-01-16`
  - `DateRangePickerNext` baseline value: `from=2026-01-15`, `to=2026-01-20`
  - `MiniCalendarNext` baseline value: `2026-01-15`
- Browser + version:
- OS + version:
- Tester:
- Date:
- Build/branch:

## Expected Core Behaviors

- Label is announced for the field group and segments.
- Segment role is announced as editable spinbutton.
- Enter opens calendar popover.
- Escape closes calendar popover.
- Arrow keys adjust active segment values.
- Tab sequence leaves the control in logical order.
- Unavailable dates are announced as unavailable/non-selectable.
- Range start/end context is announced distinctly in range mode.

## Verification Matrix

| Platform | Single-Date Status | Range Status | Mini Status | Shared Calendar Status | Evidence Notes |
| --- | --- | --- | --- | --- | --- |
| VoiceOver (macOS + Safari) | [ ] | [ ] | [ ] | [ ] | Human run required |
| NVDA (Windows + Firefox) | [ ] | [ ] | [ ] | [ ] | Human run required |
| JAWS (Windows + Chrome) | [ ] | [ ] | [ ] | [ ] | Human run required |

## Detailed Checks

### 1) Initial focus and labeling

- [ ] Focus lands on first date segment.
- [ ] Accessible name includes provided `ariaLabel` value.
- [ ] Month/day/year segments are each announced correctly.

Notes:

### 2) Keyboard open/close announcements

- [ ] Press Enter on trigger: calendar opens and announcement changes appropriately.
- [ ] Press Escape while open: calendar closes and focus behavior is announced clearly.

Notes:

### 3) Segment editing announcements

- [ ] ArrowUp/ArrowDown updates are announced for the active segment.
- [ ] ArrowLeft/ArrowRight segment changes are announced.

Notes:

### 4) Constraint announcements

- [ ] Disabled/unavailable day cells are announced as unavailable.
- [ ] Attempting to select unavailable day does not change value announcement.

Notes:

### 5) Range flow announcements (`DateRangePickerNext`)

- [ ] Start segment is announced distinctly from end segment.
- [ ] After selecting start date, pending end-date context is announced.
- [ ] Completing end date announces final range value.
- [ ] Dual-month mode announces active month context during keyboard navigation.

Notes:

### 6) Mini flow announcements (`MiniCalendarNext`)

- [ ] Header month/year and week-day labels are announced clearly.
- [ ] Prev/next week navigation buttons are announced with intent.
- [ ] Selected day state is announced after keyboard and click selection.
- [ ] Disabled/min/max constrained days are announced as unavailable.

Notes:

### 7) Shared calendar-surface announcements

- [ ] `CalendarWithPricingNext` announces unavailable dates as unavailable.
- [ ] `CalendarWithPricingNext` announces selected day state after keyboard and click selection.
- [ ] `CalendarWithPresetsNext` announces preset buttons with distinct labels.
- [ ] `CalendarWithPresetsNext` announces active month context in two-month mode.

Notes:

## Evidence Log

| Platform | Scenario | Result | Notes |
| --- | --- | --- | --- |
| VO + Safari | Single: open/close + segment edit | [ ] | |
| VO + Safari | Range: start/end + dual-month nav | [ ] | |
| VO + Safari | Mini: week nav + day selection | [ ] | |
| VO + Safari | Shared calendars: pricing + presets | [ ] | |
| NVDA + Firefox | Single: open/close + segment edit | [ ] | |
| NVDA + Firefox | Range: start/end + dual-month nav | [ ] | |
| NVDA + Firefox | Mini: week nav + day selection | [ ] | |
| NVDA + Firefox | Shared calendars: pricing + presets | [ ] | |
| JAWS + Chrome | Single: open/close + segment edit | [ ] | |
| JAWS + Chrome | Range: start/end + dual-month nav | [ ] | |
| JAWS + Chrome | Mini: week nav + day selection | [ ] | |
| JAWS + Chrome | Shared calendars: pricing + presets | [ ] | |

## Follow-up

- Linked issue (if any): `#179`
- Gaps to resolve:
  - Log at least one interactive screen-reader run before broad/public rollout.
  - Convert accepted rollout delta to `[x]` once human AT notes are recorded above.
- Re-test required on:
  - VoiceOver + Safari
  - NVDA + Firefox
  - JAWS + Chrome
