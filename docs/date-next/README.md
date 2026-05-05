# DatePickerNext (Issue #179 Spike)

This folder contains a private React Aria spike for replacing `react-day-picker` in the existing date input stack.

## Current scope

- Basic single-date picker flow (`Date` in/out).
- Basic range-date picker foundation (`from`/`to` in/out).
- Date value boundary helpers extracted in `date-value-boundary.ts` for explicit conversion behavior.
- Date range boundary helpers extracted in `date-range-value-boundary.ts` for explicit conversion behavior.
- Workflow seam contracts added in `date-workflow-contract.ts` (no runtime machine dependency yet).
- Calendar popover rendering via React Aria primitives.
- Surface-wrapped popup styling to align with existing design tokens.
- Storybook parity scenarios for single-date, range, mini-calendar, pricing, and presets flows.
- Parity tracker maintained in `PARITY_CHECKLIST.md`.
- Consumer rollout plan maintained in `MIGRATION_PLAN.md`.
- Manual AT execution packet maintained in `SCREEN_READER_CHECKLIST.md`.

## Known gaps

- No date-time support yet.
- Natural-language parsing is currently implemented for single-date (`DatePickerNext`) only.
- No timezone strategy beyond local timezone conversion.
- Human-run screen-reader evidence is still pending; keyboard, locale, and interaction coverage are already automated.
- Main-form export remains partial; use the `@bwalkt/ui/form/date-next` subpath for the full date-next surface.

## Next steps

1. Run the screen-reader matrix in `SCREEN_READER_CHECKLIST.md` on VoiceOver, NVDA, and JAWS.
2. Migrate a low-risk consumer via the controlled rollout plan in `MIGRATION_PLAN.md`.
3. Reassess accepted deltas before broad/public export from the main `@bwalkt/ui/form` surface.
