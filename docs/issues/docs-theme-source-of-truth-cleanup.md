## Summary
Align docs theming architecture so `packages/ui` is the single source of truth. Docs should keep only layout/structure styling and consume UI tokens/components for theme-critical appearance.

## Problem
`packages/docs/src/styles/globals.css` and docs components currently include ad-hoc theme styling that can drift from UI tokens and produce inconsistent dark/light behavior.

## Target model
1. `packages/docs/src/styles/globals.css`
- Keep spacing/layout helpers only.
- Remove color-mode logic and hard-coded `.dark` color overrides.

2. Docs components
- Prefer `@bwalkt/ui` components + token-based props (`Text color=...`, `Heading`, `Card`/surface tokens).
- Avoid Tailwind semantic color utilities for theme-critical text/background.

3. Follow-up cleanup
- Sidebar/QuickNav/Header should consume UI tokens directly.
- No parallel docs-only palette.

## Checklist
- [ ] Audit `globals.css` and remove remaining color-mode-specific overrides not backed by UI tokens.
- [ ] Convert docs shell surfaces (`main`, sidebar, quick nav, header) to UI-token-driven styling.
- [ ] Replace theme-critical `text-muted-foreground` / `bg-*` utility usage in docs components with UI token usage.
- [ ] Remove docs-local `ThemeProvider` and consume a shared UI-provided app/theme provider (`packages/ui`) instead.
- [ ] Eliminate local appearance persistence/bootstrapping logic from docs once shared provider is wired.
- [ ] Run dark/light visual QA across docs pages.

## Acceptance criteria
- [ ] Dark/light behavior is consistent across docs shell and examples.
- [ ] No parallel docs-only palette for theme colors.
- [ ] Theme-critical styling comes from UI tokens/components.
