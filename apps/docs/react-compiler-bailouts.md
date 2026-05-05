# React Compiler Bailouts

Tracking components that the React Compiler (`babel-plugin-react-compiler` v1.0.0) skips during compilation. Bailed-out components fall back to their existing manual memoization and work correctly -- they just don't benefit from automatic optimization.

**Current state:** 420+ functions compiled. All known compiler-incompatible functions now have explicit `'use no memo'` opt-outs; the only remaining dedicated refactor is MediaPlayer ([#520](https://github.com/incmixlabs/base/issues/520)).

---

## Resolved (this PR)

These bailouts were fixed as part of the React Compiler adoption (issue #206).

### forwardRef to ref-as-prop (5 components)

Converted `React.forwardRef` to regular functions with `ref` as a prop (React 19 pattern). The compiler handles regular components with ref props but bails on the `forwardRef` wrapper.

| File | Component | Notes |
|------|-----------|-------|
| `packages/ui/src/elements/button/Button.tsx` | `Button` | Straightforward conversion |
| `packages/ui/src/elements/masonry/Masonry.tsx` | `MasonryRoot` | Straightforward conversion |
| `packages/ui/src/layouts/layout-utils.tsx` | `Slot` | Also fixed child ref composition (composeRefs) |
| `packages/ui/src/form/MentionTextarea.tsx` | `MentionTextarea` | Also moved ref syncs to useLayoutEffect |
| `packages/ui/src/elements/avatar/AvatarGroup.tsx` | `AvatarGroup` | Straightforward conversion |

### compose-refs utility (2 bailouts)

Added `'use no memo'` directive to `useComposedRefs` in `packages/ui/src/lib/compose-refs.ts`. Variadic `...refs` used as deps can't be analyzed statically -- this is a low-level utility best left to manual memoization.

### TodosBlock self-referencing useCallback (1 bailout)

Removed `React.useCallback` wrapper from the recursive `renderItems` function in `packages/ui/src/blocks/crud/todos/TodosBlock.tsx`. The self-referencing `const` pattern caused the compiler's "cannot access variable before declaration" error. The compiler now memoizes it automatically.

### Masonry ESLint suppression (1 bailout)

Removed `biome-ignore lint/correctness/useExhaustiveDependencies` and the `React.useCallback` wrapper from `onScroll` in `useScroller` (`packages/ui/src/elements/masonry/Masonry.tsx`). The suppression comment itself caused the compiler to skip the entire function.

### Ref-during-render fixes (6 files)

Moved `ref.current` assignments out of render and into effects so the compiler can safely analyze them:

| File | Change |
|------|--------|
| `packages/ui/src/hooks/use-lazy-ref.ts` | Replaced render-time ref init with `useState` lazy initializer |
| `packages/ui/src/utils/visually-hidden-input.tsx` | Moved previous-value tracking into `useEffect`; removed redundant `useMemo` wrappers |
| `packages/ui/src/form/SelectionToolbar.tsx` | Converted render-time refs (`pendingRef`, `lastRectRef`) to `useState` |
| `packages/ui/src/form/date/DateNextCalendarPanel.tsx` | Moved `focusedDayKeyRef.current` sync to `useEffect` |
| `packages/ui/src/layouts/command-search/CommandSearch.tsx` | Moved `shortcutOwnerRef.current` assignment to `useEffect` |
| `packages/ui/src/elements/masonry/Masonry.tsx` | Moved `latestSetState.current` sync in `useThrottle` to `useLayoutEffect` |

### Manual memoization removal (2 files)

Removed `useMemo`/`useCallback` wrappers where the compiler handles memoization automatically:

| File | What was removed |
|------|-----------------|
| `packages/ui/src/form/date/MonthYearPicker.tsx` | All `useMemo` and `useCallback` calls |
| `packages/ui/src/form/date/DateRangePickerNext.tsx` | `useMemo` for unavailable dates, `useCallback` for handlers |

---

## Resolved: Explicit Compiler Opt-Outs (14 bailouts)

Known limitations in `babel-plugin-react-compiler` v1.0.0 and a few external/internal patterns are now explicitly opted out with `'use no memo'`. The code is correct; this keeps the rest of each file compilable while avoiding repeated bailout noise.

### Compiler limitations (8 bailouts)

| File | Line | Limitation |
|------|------|-----------|
| `packages/autoform/src/useAutoFormRuntime.ts` | 359 | Value blocks inside try/catch |
| `packages/ui/src/elements/dialog/DialogWrapper.tsx` | 802 | Value blocks inside try/catch |
| `packages/ui/src/elements/button/dynamic-icon.tsx` | 51 | Dynamic `import()` expressions |
| `packages/ui/src/elements/progress/Progress.tsx` | 57 | `as` (TSAsExpression) in object key |
| `packages/ui/src/elements/sheet/Sheet.tsx` | 76 | Conditional expression as object key |
| `packages/ui/src/form/date/Calendar.tsx` | 187 | Tagged template with cooked !== raw |
| `packages/ui/src/form/date/DayPickerCore.tsx` | 43 | `new` expression in reorderable position |
| `packages/ui/src/form/FileUpload.tsx` | 198 | Binary expression in reorderable position |

### External library incompatibility (3 bailouts)

TanStack Table uses patterns the compiler flags as incompatible. Nothing to fix on our side until TanStack ships compiler-compatible internals.

| File | Line | Library |
|------|------|---------|
| `packages/ui/src/table/basic/TableWrapper.tsx` | 81 | `@tanstack/react-table` |
| `packages/ui/src/table/infinite/InfiniteTable.tsx` | 96 | `@tanstack/react-table` |
| `packages/ui/src/table/infinite/InfiniteTable.tsx` | 264 | `@tanstack/react-table` |

### Complex store/internal patterns (3 bailouts)

| File | Line | Issue |
|------|------|-------|
| `packages/ui/src/form/Rating.tsx` | 211 | Custom store with `useSyncExternalStore` + `useLazyRef` |
| `packages/ui/src/elements/masonry/Masonry.tsx` | 938 | Custom `onDeepMemo` pattern |
| `packages/ui/src/elements/masonry/Masonry.tsx` | 1015 | InferMutationAliasingEffects error |

These now use targeted `'use no memo'` opt-outs at the affected function boundaries (`Rating`, `useResizeObserver`, `useThrottle`) so the rest of each file remains compilable.

---

## Resolved: MediaPlayer Refactor (12 → 1 bailout)

### MediaPlayer ([#520](https://github.com/incmixlabs/base/issues/520))

`packages/ui/src/elements/media-player/MediaPlayer.tsx` -- refactored for React Compiler compatibility. 12 bailouts reduced to 1 isolated `'use no memo'` opt-out.

**Changes:**

| Original bailout | Fix applied |
|-----------------|-------------|
| `MediaPlayerRoot` (memoization preservation) | Replaced `useLazyRef` + `useMemo` store with `useState` lazy initializer |
| `MediaPlayerImpl` (render-time ref reads) | Replaced `rootRef.current` / `mediaRef.current` reads with `rootElement` / `isVideo` state; added `setMediaRef` callback ref to context |
| `MediaPlayerVideo` (memoization preservation) | Destructured `onClick`, removed `useCallback`, use `setMediaRef` |
| `MediaPlayerPlay` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerSeekBackward` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerSeekForward` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerSeek` (render-time ref reads) | Replaced `store.getState().menuOpen` with `useStore`; removed `timeCache` ref; extracted tooltip to `MediaPlayerSeekTooltip` sub-component |
| `MediaPlayerLoop` (value modification) | Removed `mediaRef.current` read from `useState` initializer; destructured `onClick`, removed `useCallback` |
| `MediaPlayerFullscreen` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerPiP` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerCaptions` (memoization preservation) | Destructured `onClick`, removed `useCallback` |
| `MediaPlayerDownload` (memoization preservation) | Destructured `onClick`, removed `useCallback` |

**Remaining opt-out (1):**

| Component | Reason |
|-----------|--------|
| `MediaPlayerSeekTooltip` | Intentional `'use no memo'` -- reads `hoverTimeRef.current` during render for tooltip time display. Isolated in a small sub-component so the parent `MediaPlayerSeek` compiles. |

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| forwardRef migration | 5 | **Resolved** |
| compose-refs | 2 | **Resolved** (`'use no memo'`) |
| Variable hoisting (TodosBlock) | 1 | **Resolved** |
| ESLint suppression (Masonry) | 1 | **Resolved** |
| Ref-during-render fixes | 6 | **Resolved** |
| Manual memoization removal | 2 | **Resolved** |
| Explicit compiler opt-outs | 14 | **Resolved** (`'use no memo'`) |
| MediaPlayer refactor | 12 → 1 | **Resolved** ([#520](https://github.com/incmixlabs/base/issues/520)) |
| **Total remaining** | **1** | `MediaPlayerSeekTooltip` (`'use no memo'`) |

## References

- [React Compiler docs](https://react.dev/learn/react-compiler)
- [React 19 ref-as-prop](https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop)
- [`'use no memo'` directive](https://react.dev/learn/react-compiler#opting-out-of-the-compiler)
- [Compiler GitHub issues](https://github.com/facebook/react/labels/Component%3A%20Compiler)
