## Summary

Last audited: 2026-05-07.

React Compiler rollout is complete for the Vite-built surfaces that intentionally
exercise `@incmix/ui` source. Production package output still uses
`tsup`/esbuild and is intentionally outside the compiler path until the package
build moves to a compiler-capable pipeline or a separate library healthcheck is
added.

## Compiler-enabled coverage

- Shared compiler config: `packages/config/react-compiler.js`.
- Base Storybook: `apps/storybook/.storybook/main.ts`.
- UI source analysis build: `packages/ui/vite.analyze.config.ts`, run with
  `pnpm --filter @incmix/ui build:analyze:lib`.
- Pro docs and pro Storybook also compile base UI source through their Vite
  configs in the sibling `pro-ui` repository.

## Package build decision

`packages/ui` production builds remain on `tsup`/esbuild:

- `pnpm --filter @incmix/ui build`
- `packages/ui/tsup.config.ts`

This means published package artifacts are not currently transformed by React
Compiler. The compiler validation path is the Vite analysis build plus the
consumer app and Storybook builds that alias package source.

## Automation decision

No separate React Compiler healthcheck workflow is added for this batch. The
current validation commands are:

- `pnpm --filter @incmix/ui build:analyze:lib`
- pro docs build in the sibling `pro-ui` repository
- Storybook build when touching Storybook/compiler integration

No `eslint-plugin-react-compiler` coverage is added for this batch. This
workspace uses Biome as its primary lint tool, and the current compiler signal is
provided by the compiler-enabled Vite builds plus explicit, documented
`'use no memo'` opt-outs.

## Current base opt-outs

These are intentional opt-outs that keep the rest of each file compiler-enabled.

| File | Function/component | Scope |
| --- | --- | --- |
| `packages/ui/src/lib/compose-refs.ts` | `useComposedRefs` | Variadic refs are used as the dependency list for a manually memoized callback. |
| `packages/ui/src/elements/progress/Progress.tsx` | `Progress` | Compiler limitation around the typed variant lookup. |
| `packages/ui/src/elements/sheet/Sheet.tsx` | `SheetContent` | Compiler limitation around conditional variant lookup. |
| `packages/ui/src/form/FileUpload.tsx` | `FileUpload` | Compiler limitation in the file/dropzone handling block. |
| `packages/ui/src/form/Rating.tsx` | `Rating` | Complex focus store and ref-backed item ordering. |
| `packages/ui/src/layouts/masonry/Masonry.tsx` | `useResizeObserver` | ResizeObserver bookkeeping with item maps and callback indirection. |
| `packages/ui/src/layouts/masonry/Masonry.tsx` | `useThrottle` | Throttled state bridge with timer/ref coordination. |
| `packages/ui/src/media/media-player/MediaPlayer.tsx` | `MediaPlayerSeekTooltip` | Reads `hoverTimeRef.current` during render for tooltip display. |

## MediaPlayer and #520

The broad MediaPlayer compiler refactor is complete. The previous bailout
cluster was reduced to one isolated and intentional opt-out:
`MediaPlayerSeekTooltip`.

Tracking issue [#520](https://github.com/bwalkt/autoform/issues/520) is stale
if it still describes MediaPlayer as the remaining large bailout cluster. After
these docs land, #520 should be closed or updated to track only the isolated
tooltip opt-out.

## Validation

Validated on 2026-05-07:

- `pnpm --filter @incmix/ui build:analyze:lib`
