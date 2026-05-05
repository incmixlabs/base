## Summary
React Compiler rollout is effectively complete for the current batch. Known incompatible functions now use targeted `'use no memo'` opt-outs so the rest of their files still compile cleanly.

## Current status
- Resolved: forwardRef-to-ref-as-prop migrations
- Resolved: `compose-refs` compiler bailout via `'use no memo'`
- Resolved: TodosBlock self-referencing callback bailout
- Resolved: Masonry ESLint-suppression bailout
- Resolved: ref-during-render fixes across the remaining affected files
- Resolved: manual `useMemo` / `useCallback` removal where the compiler can handle memoization directly
- Resolved: explicit `'use no memo'` opt-outs for compiler-limitation sites, TanStack Table sites, and complex store/internal patterns

## Done
- Compiler-limitation opt-outs:
  - `packages/ui/src/autoform/useAutoFormRuntime.ts`
  - `packages/ui/src/elements/dialog/DialogWrapper.tsx`
  - `packages/ui/src/elements/button/dynamic-icon.tsx`
  - `packages/ui/src/elements/progress/Progress.tsx`
  - `packages/ui/src/elements/sheet/Sheet.tsx`
  - `packages/ui/src/form/date/Calendar.tsx`
  - `packages/ui/src/form/date/DayPickerCore.tsx`
  - `packages/ui/src/form/FileUpload.tsx`
- TanStack Table opt-outs:
  - `packages/ui/src/table/basic/TableWrapper.tsx`
  - `packages/ui/src/table/infinite/InfiniteTable.tsx`
- Complex store/internal opt-outs:
  - `packages/ui/src/form/Rating.tsx`
  - `packages/ui/src/elements/masonry/Masonry.tsx` (`useResizeObserver`)
  - `packages/ui/src/elements/masonry/Masonry.tsx` (`useThrottle`)

## Remaining
- MediaPlayer is the only remaining dedicated React Compiler refactor.
- Tracking issue: `#520` https://github.com/bwalkt/autoform/issues/520

## Recommended next step
- Keep the current opt-outs in place.
- Treat MediaPlayer as a standalone refactor:
  - split the file into smaller sub-components
  - remove render-time ref reads
  - simplify manual memoization patterns
