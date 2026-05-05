# XState Review Response

**Date:** 2026-04-21
**Scope:** Response to `docs/xstate-claude-review.md`

## Summary

The review is useful as an inventory and mostly accurate about where XState is used. The main correction is recommendation priority. The next improvement should not be "move more code into XState" by default. The more important issue is ownership: Presspoint editor persistence, dirty state, save intent, and UI feedback are split across React, AutoForm, repository calls, and the component editor machine.

The right next step is to clarify those ownership boundaries first. After that, we can decide which workflows belong inside machines and which should remain app-level services.

## Findings

### 1. ComponentEditor `invoke` should not be the first move

The recommendation to move save/delete network calls into the ComponentEditor machine is too aggressive as a first step.

The current save path does more than call one persistence service. It:

- checks whether the repository is ready
- validates dirty/active session state
- builds a component registry entry
- checks renamed target collisions
- saves with an expected revision
- deletes the old record when a rename changes the id
- updates local records and summaries
- refreshes the catalog from the repository watcher
- sends success/failure events back into the machine

Moving that whole workflow into the machine would make the machine own repository details and React-local catalog state. That would make the machine less pure, not more.

Better first step: extract the persistence orchestration into a hook such as `useComponentEditorPersistence()` or `useComponentEditorOrchestration()`. Once that code has a clean service boundary, we can decide whether the machine should invoke a narrow service like `saveComponentEntry(input)`.

### 2. AutoForm should not move all values/errors into XState yet

The recommendation to consolidate all AutoForm values and errors into the lifecycle actor is also too broad as a high-priority change.

Form values are hot controlled UI state. Moving every keystroke into actor context may improve conceptual purity, but it can also make field rendering, controlled inputs, and selector performance harder. The current dual-source-of-truth concern is real, but the first fix should be narrower.

Better first step: make submit lifecycle ownership clear. Pending, success, failure, acknowledgement, validation-submit count, and toast/feedback behavior should be actor-owned or at least consistently routed through AutoForm. Values can remain React-owned until we have a concrete reason to move them.

### 3. Error-state critique needs nuance

The review says `SaveFailed` and `DeleteFailed` immediately transition to idle with no error recovery. That is only partly true.

`SaveFailed` already returns to `editing.saveDialog` when the save source is the registration dialog. `DeleteFailed` intentionally returns to `editing.idle` because delete failures are not user-correctable inside the confirmation dialog.

The real issue is different: page/meta save failures and success acknowledgements are represented as a plain `feedback: string`. That makes success, error, instructional text, retryability, and acknowledgement all share one weak channel.

Better recommendation: replace `feedback: string` with typed feedback or a notification event model.

```ts
type EditorFeedback =
  | { kind: 'info'; message: string }
  | { kind: 'success'; message: string; acknowledge?: boolean }
  | { kind: 'error'; message: string; retryable: boolean }
```

### 4. "Machine cannot enforce network call" is not automatically a bug

The review says the ComponentEditor machine cannot enforce that saving actually involves a network call. That is true, but not inherently wrong.

A UI workflow machine should not necessarily know whether persistence is OPFS, TinyBase, HTTP, or a test double. The problem is not that save is external. The problem is that the external orchestration currently lives inside a very large page component.

Better framing: the editor should expose clear save/delete services to the state machine or orchestration hook. The state machine should own workflow state; the service should own persistence details.

## Recommended Priority Order

### H1. Extract Presspoint editor orchestration

Split `apps/presspoint/src/routes/-components-page.tsx` before moving more logic into XState.

Suggested boundaries:

- `useComponentEditorCatalog()` for repository watcher, catalog refresh, records, summaries
- `useComponentEditorPersistence()` for save/delete operations
- `useComponentEditorDrafts()` for draft conversion and derived dirty inputs if needed
- keep the route component focused on layout and rendering

This reduces blast radius and makes later XState changes easier to reason about.

### H2. Define the editor dirty/save contract

The current editor needs explicit workflow semantics:

- `hasDirtyJsx`
- `hasDirtyMeta`
- `hasDirtySampleData`
- top Save is for JSX/sample data authoring
- Meta tab Save is for metadata
- new component Save opens registration
- existing component Save should not reopen registration
- Cancel behavior should be state-driven
- abandon changes should be a reusable guarded transition pattern

This contract should be represented in the machine derived state and tested directly.

### H3. Make AutoForm submit lifecycle first-class

AutoForm should own submit state and acknowledgement patterns consistently:

- pending
- disabled state
- submitting label
- success result
- failure result
- success toast/callout
- acknowledgement when requested

This is more urgent than moving all form values into XState.

### H4. Replace string feedback with typed events

Typed feedback should distinguish:

- success after save
- retryable error
- blocking instruction
- dirty guard explanation
- acknowledgement-required message

This can later feed Toast, Callout, or inline form feedback without changing the machine event model.

### H5. Consider invoked services only after service boundaries exist

Once persistence is extracted, we can evaluate whether ComponentEditor should invoke save/delete services directly.

The machine should only invoke narrow, app-independent services. It should not absorb repository watcher refresh, React `setRecords`, or UI-specific toast behavior.

## What To Keep From The Original Review

The following points are solid:

- the XState inventory is useful
- AppShell is appropriately simple
- Theme state is a good fit for `@xstate/store`
- Declarative runtime is a reasonable abstraction
- ComponentEditor has a good nested state shape
- machine tests are valuable and should add more `snapshot.matches()` assertions
- the state override pattern in declarative runtime should be documented

## Bottom Line

The current issue is not insufficient XState usage. The issue is unclear boundaries between workflow state, persistence orchestration, form runtime behavior, and UI feedback.

Fix the boundaries first. Then move specific workflows into XState where doing so makes the behavior more explicit and easier to test.
