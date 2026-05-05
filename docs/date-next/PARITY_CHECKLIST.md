# DatePickerNext Parity Checklist (Issue #179)

Scope: single-date picker parity against legacy [`DatePicker`](../date/DatePicker.tsx).  
Out of scope in this checklist: range/date-time features and domain workflow machines.

## Status Legend

- `[x]` parity complete for this scope
- `[-]` partial parity (known gap remains)
- `[ ]` not started / gap

## Single-Date Behavior

- [x] Controlled value (`value` + `onChange`)
- [x] Uncontrolled default (`defaultValue`)
- [x] Hidden input mapping and form `name` forwarding
- [x] Min/max date constraints (`minValue`/`maxValue`)
- [x] Disabled state (`isDisabled`)
- [x] Trigger keyboard open via Enter
- [x] Locale-safe segment assertions in tests
- [x] Invalid `Date` guard at boundary conversion (`toDateValue`)

## API Parity With Legacy DatePicker

- [x] Core value API available (`value`, `onChange`, `name`, min/max, disabled)
- [x] Legacy natural-language parsing (`enableNaturalLanguage` + chrono parsing) — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.tsx`, `DatePickerNext.test.tsx`
- [x] Legacy custom display format prop (`dateFormat`) — Owner: Implemented, Tracking: #179
- [x] Legacy `disabledDates` matcher parity — Owner: Implemented, Tracking: #179
- [-] Legacy style prop parity (`size`, `variant`, `color`, `radius`) — Owner: In progress, Tracking: #179, Evidence: neutral input-chrome contract locked in `DatePickerNext`/`DateRangePickerNext`; calendar-surface variant behavior still pending
- [x] FieldGroup-context-driven sizing/variant behavior — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.test.tsx`, `DateRangePickerNext.test.tsx`

## UX / A11y Parity

- [x] Popover calendar open/close interaction basics
- [x] Segment-based keyboard editing baseline (React Aria primitives)
- [x] Expanded keyboard matrix parity (arrow navigation, escape behaviors, tab sequencing) — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.test.tsx` (Enter/Escape/Tab/ArrowUp/ArrowDown coverage), `DateRangePickerNext.test.tsx` (Enter/Escape, dual-panel ArrowRight focus traversal)
- [-] Screen-reader announcement parity checklist documented with engineering evidence and human-run execution packet — Owner: Engineering complete / AT operator pending, Platforms: VoiceOver/NVDA/JAWS, Tracking: #179, Evidence: `SCREEN_READER_CHECKLIST.md` (`2026-03-22` evidence snapshot, Storybook scenario list, human-run matrix)

## Stories Parity

- [x] Default controlled example
- [x] Bounds example
- [x] Uncontrolled default-value example
- [x] Boundary debug example (local-date formatting)
- [x] Legacy variants/colors/sizes story parity — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.stories.tsx` (`AllVariants`, `AllColorsByVariant`, `AllSizesByVariant`)
- [x] Single/range playground stories with live controls for radius verification — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.stories.tsx` (`Playground`), `DateRangePickerNext.stories.tsx` (`Playground`)
- [x] Natural-language story parity — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.stories.tsx` (`NaturalLanguage`)

## Test Parity

- [x] `DatePickerNext.test.tsx` core API/interaction coverage
- [x] `date-value-boundary.test.ts` conversion and invalid-date coverage
- [x] Integration-level parity tests against legacy `DatePicker` flows — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.integration.test.tsx`
- [x] Locale matrix test coverage across non-Latin numeral systems (beyond current assertions) — Owner: Implemented, Tracking: #179, Evidence: `DatePickerNext.test.tsx` (`ar-EG`, `fa-IR-u-ca-gregory`, `bn-BD`, `mr-IN`)

## Maintainability Parity

- [x] Extract shared DatePickerNext calendar panel renderer to remove duplicated month-header/week-grid/day-grid logic across NL/non-NL paths — Tracking: #216, Evidence: `DatePickerNext.tsx` (single shared calendar panel)
- [x] Consolidate CalendarWithPricingNext and CalendarWithPresetsNext to use shared `DateNextCalendarPanel` with `renderDay` render prop — Tracking: #179, Evidence: `DateNextCalendarPanel.tsx` (`renderDay`, MonthYearPicker, keyboard nav), `CalendarWithPricingNext.tsx`, `CalendarWithPresetsNext.tsx`
- [x] Migrate DateRangePickerNext (single + dual month) to shared `DateNextCalendarPanel` with `renderDay` render prop — Tracking: #232, Evidence: `DateRangePickerNext.tsx` (both modes use panel), `DateRangePickerNext.test.tsx` (22/22 pass), `DateRangePickerNext.css.ts` (removed unused grid/weekday/heading CSS)
- [x] Extract shared keyboard arrow navigation constants into `date-next-keyboard.ts` — Tracking: #179, Evidence: `date-next-keyboard.ts`, `DateNextCalendarPanel.tsx`

## Exit Criteria For Single-Date Migration

- [x] No remaining `[ ]` items in single-date API/UX parity rows required by consuming product surface — Tracking: #179, Evidence: all single-date API/UX rows above are `[x]` or accepted `[-]`
- [x] Required `[-]` items converted to `[x]` or explicitly accepted with issue-linked rationale — Tracking: #179, Evidence: accepted deltas listed below
- [x] Storybook parity scenarios defined and build successfully for single-date use — Tracking: #179, Evidence: `DatePickerNext.stories.tsx`, `SCREEN_READER_CHECKLIST.md` (scenario list), `pnpm --filter @bwalkt/ui build-storybook`
- [x] Migration plan for consumers documented (even if rollout remains private) — Tracking: #179, Evidence: `MIGRATION_PLAN.md`

## DateRangePickerNext Parity Track (Issue #179)

- [x] Core range value API wired (`value`, `defaultValue`, `onChange`, `name`) — Evidence: `DateRangePickerNext.tsx`, `DateRangePickerNext.test.tsx`
- [x] Hidden input form contract (`${name}_from` / `${name}_to`) — Evidence: `DateRangePickerNext.test.tsx`, `DateRangePickerNext.integration.test.tsx`
- [x] Controlled/uncontrolled transition coverage — Evidence: `DateRangePickerNext.integration.test.tsx`
- [x] Keyboard parity baseline (Enter/Escape/Tab/Arrow segment edits, calendar arrow nav via shared `DateNextCalendarPanel`) — Evidence: `DateRangePickerNext.test.tsx`
- [x] Locale matrix coverage for non-Latin numerals (`ar-EG`, `fa-IR-u-ca-gregory`) — Evidence: `DateRangePickerNext.test.tsx`
- [x] Story parity coverage for range scenarios (default, bounds+disabled dates, keyboard, locale) — Evidence: `DateRangePickerNext.stories.tsx`
- [-] Manual screen-reader parity note captured for range start/end announcements — Engineering evidence captured and human-run note packet prepared; AT execution still pending — Evidence: `SCREEN_READER_CHECKLIST.md`, Platforms: VoiceOver/NVDA/JAWS

## MiniCalendarNext Parity Track (Issue #179)

- [x] `MiniCalendarNext` scope and API parity defined against legacy `MiniCalendar` — Evidence: `MiniCalendarNext.tsx` (thin wrapper over legacy surface)
- [x] Core interaction parity (single selection, month navigation, bounds/disabled behavior) — Evidence: delegated behavior via `MiniCalendar`
- [-] Keyboard/a11y parity coverage (tab/arrow/enter/escape, screen-reader announcements) — Arrow key navigation via shared `DateNextCalendarPanel`; human screen-reader execution packet is ready but still pending — Evidence: `DateNextCalendarPanel.tsx` (roving tabIndex, arrow key event delegation), `SCREEN_READER_CHECKLIST.md`
- [x] Story parity coverage for mini calendar scenarios used by consumers — Evidence: `MiniCalendarNext.stories.tsx` (`Default`, `Bounds`, `Playground`)
- [x] Test parity coverage (unit + integration where applicable) — Evidence: `MiniCalendarNext.test.tsx`, plus legacy `MiniCalendar.test.tsx`
- [x] Migration readiness note for mini-calendar consumers — Tracking: #179, Evidence: `MIGRATION_PLAN.md` (controlled rollout guidance applies to mini-calendar consumers using the shared panel contract)

## CalendarWithPricingNext Parity Track (Issue #179)

- [x] Core API parity (`value`, `onChange`, `prices`, `formatPrice`, `currency`, `isDisabled`, `minValue`/`maxValue`, `disabledDates`, `weekStartsOn`, `showOutsideDayPrices`) — Evidence: `CalendarWithPricingNext.tsx`
- [x] Price rendering parity (price labels below day numbers, highlighted/deal prices, unavailable dates) — Evidence: `CalendarWithPricingNext.tsx`
- [x] Date-next styling system (Vanilla Extract CSS, data attributes, size/color/radius props) — Evidence: `CalendarWithPricingNext.css.ts`
- [x] Story parity coverage (Default, FlightPricing, HotelPricing, WithUnavailableDates, EuroCurrency, CustomPriceFormat, WithMinMaxDate, WeekStartsMonday, Disabled, WithPreselectedDate) — Evidence: `CalendarWithPricingNext.stories.tsx`
- [x] Test parity coverage — Evidence: `CalendarWithPricingNext.test.tsx`
- [-] Keyboard/a11y parity (arrow navigation, screen-reader announcements) — Arrow key navigation via shared `DateNextCalendarPanel`; human screen-reader execution packet is ready but still pending — Evidence: `DateNextCalendarPanel.tsx`, `CalendarWithPricingNext.tsx` (uses panel with `renderDay`), `SCREEN_READER_CHECKLIST.md`

## CalendarWithPresetsNext Parity Track (Issue #179)

- [x] Core API parity (`value`, `onChange`, `presets`, `showCalendar`, `visibleMonths`, `layout`, `isDisabled`, `minValue`/`maxValue`, `disabledDates`, `weekStartsOn`) — Evidence: `CalendarWithPresetsNext.tsx`
- [x] Range selection parity (two-click start/end, auto-ordering, preset click with min/max clamping) — Evidence: `CalendarWithPresetsNext.tsx`
- [x] Default presets parity (11 presets matching legacy: Today, Yesterday, Tomorrow, Last/Next 7 days, Last 30 days, Month to date, Last/Next month, Year to date, Last year) — Evidence: `CalendarWithPresetsNext.tsx`
- [x] Dual-month view parity — Evidence: `CalendarWithPresetsNext.tsx`
- [x] Date-next styling system (Vanilla Extract CSS, data attributes, range highlighting via DateRangePickerNext.css) — Evidence: `CalendarWithPresetsNext.tsx`
- [x] Story parity coverage (Default, HorizontalLayout, TwoMonths, PresetsOnly, CustomPresets, WithMinMaxDate, Disabled, WeekStartsMonday) — Evidence: `CalendarWithPresetsNext.stories.tsx`
- [x] Test parity coverage — Evidence: `CalendarWithPresetsNext.test.tsx`
- [-] Keyboard/a11y parity (arrow navigation, screen-reader announcements) — Arrow key navigation via shared `DateNextCalendarPanel` per-panel (single-month: full nav; dual-month: per-panel nav without cross-panel coordination); human screen-reader execution packet is ready but still pending — Evidence: `DateNextCalendarPanel.tsx`, `CalendarWithPresetsNext.tsx` (uses panel with `renderDay`), `SCREEN_READER_CHECKLIST.md`

## Execution Plan (Punchlist)

### Milestone 1: Single-Date Parity Closure

- [x] Natural-language parsing parity (`enableNaturalLanguage` + chrono behavior)
- [x] Natural-language Storybook parity story
- [x] Lock style-prop contract (`size`/`variant`/`color`/`radius`) for input chrome vs calendar selection semantics
- [x] Convert expanded keyboard matrix from `[-]` to `[x]` (or document accepted deltas with rationale)

### Milestone 2: Accessibility Manual Verification

- [ ] Execute `SCREEN_READER_CHECKLIST.md` on VoiceOver + Safari
- [ ] Execute `SCREEN_READER_CHECKLIST.md` on NVDA + Firefox
- [ ] Execute `SCREEN_READER_CHECKLIST.md` on JAWS + Chrome
- [ ] Promote screen-reader rows from `[-]` to `[x]` with evidence notes

### Milestone 3: Migration Readiness

- [x] Single-date product-required parity rows are all `[x]` or accepted `[-]` for the current rollout slice
- [x] Remaining `[-]` rows are either `[x]` or explicitly accepted with issue-linked rationale
- [x] Storybook parity scenarios are defined and the package Storybook build succeeds
- [x] Consumer migration plan documented

### Branch Slices

1. `feat/date-next-natural-language-parity`
2. `feat/date-next-keyboard-matrix-closure`
3. `chore/date-next-screen-reader-evidence`
4. `docs/date-next-migration-plan`

## Accepted/Tracked Deltas

- [-] Calendar-surface style variant parity remains partial by design while input chrome stays neutral for consistency. Tracking: #179 (parity thread); explicitly accepted as interim contract for current rollout slice.
- [-] Human screen-reader execution is not yet logged for VoiceOver/NVDA/JAWS. Tracking: #179. Accepted only for controlled/internal rollout because keyboard behavior, hidden input contracts, locale coverage, and Storybook scenarios are already verified; broad/public rollout should wait for a human-run AT pass recorded in `SCREEN_READER_CHECKLIST.md`.
