# XState Usage Review

**Date:** 2026-04-21
**Scope:** `packages/ui`, `packages/core`, `apps/presspoint`
**XState version:** 5.30.0, @xstate/react 6.1.0, @xstate/store 3.14.1

---

## Inventory

| # | Name | Location | Type | States | Events | Complexity |
|---|------|----------|------|--------|--------|------------|
| 1 | AppShell machine | `packages/ui/.../app-shell/app-shell-machine.ts` | `setup().createMachine()` | 0 (context-only) | 14 | Low |
| 2 | Declarative page runtime | `packages/ui/.../declarative/runtime.ts` | `setup()` + `fromPromise` | 4 | 3 standard + custom | Medium |
| 3 | AutoForm lifecycle | `packages/ui/.../autoform/useAutoFormRuntime.ts` | Declarative runtime actor | 3 (inherited) | 8 custom | High |
| 4 | Component editor | `apps/presspoint/.../‑components-page-machine.ts` | `setup().createMachine()` | 5 (nested) | 21 | Medium |
| 5 | Theme store | `packages/ui/.../theme/ThemeProvider.tsx` | `@xstate/store` | N/A | 18 | Low |
| 6 | ThemeVars store | `packages/ui/.../theme/ThemeVarsProvider.tsx` | `@xstate/store` | N/A | 3 | Low |

**packages/core** has zero XState imports — all state management lives in `packages/ui` and `apps/presspoint`.

---

## 1. AppShell Machine

**File:** `packages/ui/src/layouts/app-shell/app-shell-machine.ts`
**Consumed by:** `AppShell.tsx` via `useActorRef` + `useSelector`
**Tests:** `app-shell-machine.test.ts`

Manages responsive sidebar/drawer layout. No explicit state nodes — all logic is context mutations on global `on` handlers.

**Context:** overlay mode, sidebar visibility, drawer state, secondary panel registration/position, a "memory" flag for primary-open-before-secondary.

**Pattern highlights:**
- Clean input-based initialization
- Derived UI helper `getAppShellNavigationState()` lives outside the machine
- 14 events all use `assign()` — pure context mutations

**Assessment:** Well-designed, simple, appropriate use of XState. No issues.

---

## 2. Declarative Page Runtime

**File:** `packages/ui/src/declarative/runtime.ts`
**Consumed by:** `DeclarativeRenderer.tsx`, `useAutoFormRuntime.ts`, `apps/presspoint/-sync-page.tsx`
**Tests:** `runtime.test.ts`

Generic async workflow factory: `loading → ready → submitting → error` with retry.

```
loading ──onDone──→ ready ──declarative.action──→ submitting
   ↑                  ↑                              │
   │                  └────────onDone────────────────┘
   │                                                  │
   └──declarative.retry── error ←──onError────────────┘
```

**Actors (fromPromise):**
- `declarativePageLoader` — runs loadQuery or custom loader
- `declarativePageActionRunner` — runs action service

**Key design:**
- Factory functions: `createDeclarativePageMachine()`, `createDeclarativePageActor()`
- State override system: callers can extend any state's `on` handlers
- Follow-up events: actions can emit configurable `successEvent` / `failureEvent`
- Type-safe generic context with reserved keys (`page`, `lastError`, `pendingAction`)

**Assessment:** Solid abstraction. The `as any` cast on line 282 is an acknowledged TypeScript limitation with conditional spreads — not a real concern. The state-override mechanism is powerful but has no version safety (callers must track machine shape changes manually).

---

## 3. AutoForm Lifecycle

**File:** `packages/ui/src/autoform/useAutoFormRuntime.ts`
**Consumed by:** `AutoFormModelRenderer` and any component using the autoform hook

Built on top of the Declarative Page Runtime — creates a lifecycle actor to track field changes, touch state, validation status, and form submission.

**Custom events:** `autoform.field.change`, `autoform.field.touch`, `autoform.field.validate.request/complete`, `autoform.form.validate.request/complete`, `autoform.runtime.touch-sync`, `autoform.validation.reset`

**Lifecycle context tracks:** touched/dirty fields, event counters, validation status/scope/result, last-changed paths.

**How submit works:**
1. `validateSubmit()` validates all fields
2. Increments submitCount
3. Wraps `onSubmit` callback in a `PendingSubmitOperation` promise
4. Sends `declarative.action` with URL `autoform.submit`
5. `waitFor(actor, snapshot => snapshot.matches('submitting'))`
6. Action service resolves the pending promise
7. `waitFor(actor, snapshot => !snapshot.matches('submitting'))`

**Assessment:** This is the most complex usage. The dual-source-of-truth design (React state for values/errors, XState actor for touch/validation metadata) adds coordination overhead. The `PendingSubmitOperation` ref-based promise bridge between React and the actor is clever but fragile — a missed `resolve`/`reject` would leak. The `'use no memo'` directive on line 359 confirms the hook intentionally opts out of compiler memoization due to this tight coupling.

---

## 4. Component Editor Machine

**File:** `apps/presspoint/src/routes/-components-page-machine.ts`
**Consumed by:** `-components-page.tsx` via `useActorRef` + `useSelector` (14 selectors)
**Tests:** `-components-page-machine.test.ts` (11 tests)

Manages the full component editing workflow: selection, creation, modification, saving, deletion, and unsaved-changes protection.

```
componentEditor
├── editing (initial)
│   ├── idle (initial)
│   ├── saveDialog ──SaveRequested──→ saving
│   ├── deleteDialog ──DeleteRequested──→ deleting
│   └── abandonDialog ──ConfirmAbandon──→ idle
├── saving ──SaveSucceeded/Failed──→ editing.idle (or saveDialog on dialog-source failure)
└── deleting ──DeleteSucceeded/Failed──→ editing.idle
```

**Context:** selectedId, isCreatingNew, draftCode, baselineCode, metadataDraft, baselineMetadataDraft, sampleDataDraft, baselineSampleDataDraft, pendingSelectedId, feedback, saveSource.

**Guards:** `hasDirtyDraft`, `isCreatingNew`

**Derived state:** `getComponentEditorDerivedState()` computes `canBeginNew`, `hasDirtyDraft`, `hasDirtyJsx`, `hasDirtyMeta`.

**Pattern:** All async operations (save, delete, catalog sync) are handled externally in the React component and results communicated back via events. No `invoke` or `fromPromise` in this machine.

**Assessment:** Well-structured nested state machine with proper guard conditions. The external-async pattern is a deliberate choice — keeps the machine pure and testable, but means the component file (`-components-page.tsx`, 1099 lines) carries both orchestration and UI weight.

---

## 5–6. Theme Stores

**Files:** `ThemeProvider.tsx`, `ThemeVarsProvider.tsx`
**Pattern:** `@xstate/store` (not state machines)

Simple event→reducer stores for theme configuration. ThemeProvider has 18 handlers and 19 selectors; ThemeVarsProvider has 3 handlers. Used with `useSelector(store, selector)` and `store.trigger.eventName()`.

**Assessment:** Appropriate use of the lighter-weight store API. The controlled/uncontrolled pattern in ThemeProvider (checking prop presence before allowing store mutations) is well-implemented. The boilerplate is high but inherent to the number of theme properties.

---

## Cross-Cutting Observations

### What's working well

1. **Consistent v5 API adoption.** All machines use the `setup().createMachine()` pattern with full type safety.
2. **Good test separation.** Machines are tested as pure units via `createActor()` — no React rendering needed for state logic.
3. **`useActorRef` + `useSelector` everywhere.** No legacy `useMachine()` usage, no `interpret()` calls.
4. **Clean exports.** Machines are pure factory constants; React integration lives in separate consumer files.
5. **No spawned child actors or parallel states.** Keeps the mental model simple for the current scope.

### What could be better

1. **No `invoke` in ComponentEditor.** Save/delete are async but handled entirely in React. The machine can't enforce that "saving" actually involves a network call — it trusts the component to send SaveSucceeded/Failed.
2. **Dual source of truth in AutoForm.** Form values in React state, validation metadata in XState actor. Every mutation must update both and keep them in sync.
3. **Large consumer components.** `-components-page.tsx` (1099 lines) and `useAutoFormRuntime.ts` (844 lines) mix orchestration with UI/hook logic.
4. **No error recovery states.** SaveFailed/DeleteFailed immediately transition back to idle — no explicit error state where the user can see what went wrong before deciding what to do next.
5. **Feedback as a string.** The ComponentEditor machine uses a `feedback` context string for user messages. This conflates success feedback, error messages, and instructional text in one field.

---

## Recommended Follow-Ups

### Priority: High

**H1. Extract async operations into ComponentEditor machine using `invoke`.**
Move save/delete network calls into the machine as `fromPromise` actors. This would:
- Eliminate manual SaveSucceeded/SaveFailed event wiring in the component
- Let the machine enforce that async operations are actually running in "saving"/"deleting" states
- Reduce `-components-page.tsx` by ~100–150 lines of orchestration code

**H2. Consolidate AutoForm state into the lifecycle actor.**
Move form `values` and `errors` into the XState actor context instead of keeping them in parallel React state. This removes the dual-source-of-truth problem and the `syncRuntimeTouchMetadata` reconciliation dance. The `'use no memo'` directive would likely become unnecessary.

**H3. Break up `-components-page.tsx`.**
Extract into smaller units:
- `useComponentEditorOrchestration()` — actor creation, event handlers, effects
- `useComponentCatalog()` — catalog sync, record loading
- Keep the JSX-only render in the page component

### Priority: Medium

**M1. Add explicit error sub-states to ComponentEditor.**
Replace immediate `SaveFailed → idle` with `SaveFailed → editing.saveError` (or similar) that shows error details and offers retry. Currently the only feedback is a context string.

**M2. Type-safe feedback in ComponentEditor.**
Replace `feedback: string` with a discriminated union:
```ts
type EditorFeedback =
  | { kind: 'info'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string; retryable: boolean }
```

**M3. Memoize AutoForm lifecycle event handlers.**
`createAutoFormLifecycleEventHandlers()` is called 3 times (once per state override) and creates new `assign()` action objects each time. These could be created once at module level since they don't close over any instance state.

**M4. Guard conditions for AppShell.**
Add guards to prevent nonsensical transitions (e.g., opening drawer when not in overlay mode, toggling secondary when not registered). Currently these transitions silently mutate context without effect.

### Priority: Low

**L1. Reduce ThemeProvider selector boilerplate.**
Create a `createThemeSelectors()` factory that generates all 19 selectors from a schema, reducing duplication.

**L2. Add snapshot.matches() checks in ComponentEditor tests.**
Some tests only assert on `snapshot.context` — adding `snapshot.matches()` assertions would catch state-tree regressions even when context values happen to be correct.

**L3. Document the Declarative Page Runtime state-override pattern.**
The `states` parameter in `createDeclarativePageMachine()` is the primary extension point but has no inline documentation explaining how overrides merge with built-in handlers.

---

## XState APIs Used vs. Available

| API | Used? | Where |
|-----|-------|-------|
| `setup().createMachine()` | Yes | All machines |
| `assign()` | Yes | All machines |
| `fromPromise()` | Yes | Declarative runtime only |
| `createActor()` | Yes | Tests, runtime factory |
| `useActorRef()` | Yes | All React consumers |
| `useSelector()` | Yes | All React consumers |
| `waitFor()` | Yes | AutoForm submit flow |
| `createStore()` | Yes | Theme stores |
| Guards | Partial | ComponentEditor only |
| `fromCallback()` | No | — |
| `fromObservable()` | No | — |
| `spawn()` | No | — |
| Parallel states | No | — |
| History states | No | — |
| Delayed transitions | No | — |
| `useMachine()` | No | Using `useActorRef` instead |
| `invoke` in machines | Partial | Declarative runtime only |
