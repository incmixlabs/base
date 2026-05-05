# Tailwind Background Utility Audit

Date: 2026-04-17

This audit looks for Tailwind-style background utilities applied through class names, with emphasis on `bg-*` classes that can bypass the theme runtime, `ThemeProvider`, and component surface variables.

## Scope

Searched:

- `apps`
- `packages`
- `docs`

File types:

- `ts`
- `tsx`
- `js`
- `jsx`
- `md`
- `mdx`

Primary search pattern:

```sh
rg -n "\bbg-[A-Za-z0-9_\[\]().:/%-]+" apps packages docs -g '*.{tsx,ts,jsx,js,mdx,md}'
```

The broad count below excludes this audit file itself so the report does not count its own examples.

Follow-up searches separated:

- semantic/token utilities such as `bg-background`, `bg-muted`, `bg-primary`, `bg-card`, `bg-popover`, `bg-sidebar`
- hard-coded Tailwind palettes such as `bg-blue-50`, `bg-slate-950`, `bg-zinc-900`
- arbitrary backgrounds such as `bg-[var(--...)]` and gradients
- production-like files, excluding `*.stories.*` and `*.test.*`

## Summary

| Bucket | Count | Notes |
| --- | ---: | --- |
| All `bg-*` matches in `apps`, `packages`, `docs` | 682 | Includes stories, tests, docs snippets, and markdown; excludes `docs/tw-audit.md`. |
| Runtime/docs app matches excluding stories/tests | 307 | Includes `packages/ui/src`, `apps/docs/src`, and `apps/presspoint/src`. |
| Hard-coded Tailwind palette matches excluding stories/tests | 0 | Runtime and docs-app source is clear for this audit pattern. |
| Arbitrary `bg-[...]` matches excluding stories/tests | 31 | Mixed: most are CSS vars and acceptable; gradients should be reviewed case by case. |

Most background classes are semantic token utilities and are probably acceptable. The higher-risk set is concentrated in a small number of files.

## Safe Or Expected Patterns

These generally map through the design system or component-level theme vars:

- `bg-background`
- `bg-card`
- `bg-popover`
- `bg-muted`
- `bg-muted/20`, `bg-muted/30`, `bg-muted/40`, `bg-muted/50`, `bg-muted/60`
- `bg-primary`, `bg-primary/5`, `bg-primary/10`, `bg-primary/40`, `bg-primary/70`
- `bg-secondary`, `bg-secondary/50`, `bg-secondary/70`, `bg-secondary/80`
- `bg-accent`, `bg-accent/50`
- `bg-destructive/5`, `bg-destructive/10`
- `bg-sidebar`, `bg-sidebar-border`, `bg-sidebar-primary`, `bg-sidebar-accent`
- `bg-transparent`, `bg-current`, `bg-input`

These still deserve local review when they are used on major layout surfaces. For app shell/content surfaces, prefer component vars over generic `bg-background`.

## Hard-Coded Palette Usage

These are the main cases that do not respect theme palette changes.

### Runtime Component Files

No non-story runtime component files currently remain in this bucket.

Resolved:

- `packages/ui/src/elements/wheel-picker/wheel-picker.tsx` previously used `bg-white` and `dark:bg-zinc-900`; it now uses `bg-popover text-popover-foreground border-border`.
- `packages/ui/src/form/PasswordInput.tsx` previously used fixed strength colors (`bg-red-500`, `bg-orange-500`, `bg-yellow-500`, `bg-lime-500`, `bg-green-500`); it now uses semantic error/warning/success CSS vars.
- `packages/ui/src/media/media-player/MediaPlayer.tsx` previously used fixed zinc backgrounds for UI chrome; chapter separators, thumbnail tooltip, volume track, and tooltip surface now use semantic background utilities.
- `packages/ui/src/editor/live/LiveCodeBlockImpl.tsx` and `apps/docs/src/components/declarative/JsxAuthoringWorkbench.tsx` previously used fixed slate code-pane surfaces; they now use inverse theme vars for code-pane shell, frame, border, and text.
- `apps/docs/src/lib/layout-docs-entries.tsx` previously used Tailwind palette backgrounds for layout demo swatches; those examples now use `Box` `bg` and `borderColor` props.

### Docs App Files

No docs app files currently remain in the hard-coded palette bucket after excluding stories and tests.

### Story-Only / Example Files

Hard-coded palette usage is common in story files:

- `packages/ui/src/stories/*`
- `packages/ui/src/*/*.stories.tsx`
- `packages/ajv/stories/*`

These are lower priority, but they can still weaken visual QA because stories may look correct while theme-token surfaces regress.

## Arbitrary Backgrounds

Most arbitrary background utilities are CSS-var based and likely acceptable:

- `bg-[var(--color-surface)]`
- `bg-[var(--color-surface-subtle)]`
- `bg-[color:var(--fc-soft-bg)]`
- `bg-[color:var(--fc-soft-bg-hover)]`
- `bg-[var(--fc-primary)]`
- `bg-[var(--fc-soft-bg-hover)]`
- `bg-[var(--color-neutral-soft)]`
- `bg-[var(--rdp-accent-background-color)]`
- `hover:bg-[var(--sidebar-hover)]`

Review case by case:

- `packages/ui/src/elements/hover-card/HoverCard.stories.tsx`
  - `bg-[radial-gradient(...),linear-gradient(...)]`
- `packages/ui/src/elements/spinner/Spinner.stories.tsx`
  - `bg-[radial-gradient(...)]`

These are story visuals and are lower priority.

## Files With The Most Runtime `bg-*` Usage

Excluding stories and tests, the largest concentrations are:

| File | Count | Notes |
| --- | ---: | --- |
| `packages/ui/src/form/textFieldStyles.ts` | 27 | Mostly semantic or form-color vars. Seems intentional. |
| `packages/ui/src/media/media-player/MediaPlayer.tsx` | 21 | Mostly semantic after cleanup; fixed black/white overlay treatment should remain intentional. |
| `apps/docs/src/lib/layout-docs-entries.tsx` | 14 | Docs examples now use layout color props instead of Tailwind palette backgrounds. |
| `apps/docs/src/components/declarative/JsxAuthoringWorkbench.tsx` | 10 | Mostly semantic after cleanup; code-pane surfaces now use inverse vars. |
| `packages/ui/src/form/FileUpload.tsx` | 15 | Mostly semantic state backgrounds. Looks acceptable. |
| `packages/ui/src/form/LocationInput.tsx` | 14 | Mostly semantic variants. Looks acceptable. |
| `packages/ui/src/layouts/sidebar/Sidebar.tsx` | 11 | Sidebar-specific vars and semantic utilities. Acceptable. |

## Recommended Migration Plan

1. Leave story-only cleanup for a later pass.
   - Story files have many hard-coded colors, but they do not affect shipped app behavior. Migrate them after runtime components are clean.

## Suggested Guardrail

Add a lightweight lint or CI audit that flags hard-coded palette background classes outside stories/tests. A starting deny pattern:

```sh
rg -n "\bbg-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-" \
  packages/ui/src apps/docs/src apps/presspoint/src \
  -g '*.{tsx,ts,jsx,js,mdx,md}' \
  -g '!*.stories.*' \
  -g '!*.test.*'
```

Allowlist likely exceptions if the deny pattern is broadened:

- fixed media overlays: `bg-black/*`, `bg-white/*` inside media player overlays
