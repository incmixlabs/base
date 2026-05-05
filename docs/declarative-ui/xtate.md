# XState Integration Plan

For the practical split between XState, `@xstate/store`, TinyBase, sync, and OPFS, see [`sync_xstate_store_tinybase_opfs_recipe.md`](./sync_xstate_store_tinybase_opfs_recipe.md).

**Status:** Proposed  
**Updated:** 2026-04-07

## Purpose

This document describes how XState should fit into the declarative UI direction
defined by:

- [`docs/declarative_ui_spec.md`](./declarative_ui_spec.md)
- [`docs/roadmap-declarative_ui_spec.md`](./roadmap-declarative_ui_spec.md)
- [`docs/autoform.md`](./autoform.md)

The short version:

- XState should orchestrate runtime behavior
- `packages/core` should remain the source of declarative semantics
- `packages/ui` should host the XState machine and React wiring
- AutoForm should consume that runtime as a specialization, not invent a second one

## Current State

The repo does not currently appear to have an XState dependency or active XState
runtime implementation.

What does already exist is the more important prerequisite:

- shared condition evaluation in [`packages/core/src/condition-runtime.ts`](../packages/core/src/condition-runtime.ts)
- normalization and schema/runtime shaping in `packages/core`
- React-facing render/compose surfaces in `packages/ui`

That means the right migration is not "replace current logic with XState." It is
"keep semantic evaluation in core, add XState as the orchestration layer in UI."

## Design Rule

XState is not the declarative grammar.

The declarative grammar remains:

- node structure
- `$ref` composition
- actions and queries
- permission metadata
- conditions and bindings

XState is the runtime engine that consumes those contracts and manages:

- lifecycle states
- async effects
- event routing
- retries and failure handling
- transient UI state

This matches the umbrella spec, which says the JSON contract defines hooks for an
XState runtime rather than full machines in JSON.

## Responsibilities

### `packages/core`

`packages/core` should stay XState-agnostic and own:

- declarative node and document types
- `$ref` resolution and merge semantics
- normalization
- condition evaluation
- AJV-backed validation
- path and value helpers
- translation of declarative metadata into runtime-friendly descriptors

`packages/core` should not:

- import XState
- register React components
- decide UI transitions
- own actor lifecycle

### `packages/ui`

`packages/ui` should own:

- the XState machine definition
- actor creation and lifecycle
- React hooks and providers
- mapping machine snapshot/context into props for rendered nodes
- event dispatch from node handlers
- invocation of queries and actions

### AutoForm

AutoForm should:

- derive form nodes and constraints from JSON Schema and UI Schema
- reuse shared core semantics for conditions and normalization
- plug into the shared XState orchestration layer for editing, validation,
  submission, and async status

AutoForm should not own a separate parallel condition or lifecycle system.

## Runtime Shape

The runtime should have three layers.

### 1. Semantic Preparation

Input:

- declarative document
- route params
- initial data
- ability rules

Work:

- resolve `$ref`
- normalize nodes
- compile/evaluate conditions
- prepare action/query descriptors

Output:

- normalized declarative document
- runtime descriptors consumable by UI and machine code

This belongs in `packages/core`.

### 2. XState Orchestration

Input:

- normalized document
- initial model/context
- runtime services for queries, actions, permissions

Work:

- maintain lifecycle state
- receive UI events
- invoke services
- update context
- expose snapshot for rendering

This belongs in `packages/ui`.

### 3. Rendering

Input:

- normalized nodes
- machine snapshot
- renderer registry

Work:

- map nodes to React components
- bind values from machine context
- derive visibility/disabled/readOnly state
- send events back into the actor

This also belongs in `packages/ui`.

## Proposed Machine Model

The first machine does not need to be overly ambitious. It should cover the main
shared lifecycle:

- `boot`
- `loading`
- `ready`
- `submitting`
- `success`
- `failure`

Recommended context shape:

```ts
type DeclarativeRuntimeContext = {
  document: NormalizedDeclarativeDocument
  data: Record<string, unknown>
  values: Record<string, unknown>
  route: Record<string, unknown>
  abilities: unknown
  validation: {
    valid: boolean
    errors: Array<{ path: string; message: string }>
  }
  ui: {
    dirty: boolean
    touched: Record<string, boolean>
    activeModal?: string
  }
  request: {
    lastError?: string
    lastSuccessEvent?: string
  }
}
```

Recommended event shape:

```ts
type DeclarativeRuntimeEvent =
  | { type: 'BOOT' }
  | { type: 'QUERY.LOAD' }
  | { type: 'QUERY.SUCCESS'; data: unknown }
  | { type: 'QUERY.FAILURE'; error: unknown }
  | { type: 'FIELD.CHANGE'; path: string; value: unknown }
  | { type: 'FIELD.BLUR'; path: string }
  | { type: 'ACTION.RUN'; actionId: string; payload?: unknown }
  | { type: 'ACTION.SUCCESS'; actionId: string; result: unknown }
  | { type: 'ACTION.FAILURE'; actionId: string; error: unknown }
  | { type: 'MODAL.OPEN'; modalId: string }
  | { type: 'MODAL.CLOSE'; modalId: string }
  | { type: 'FORM.SUBMIT' }
  | { type: 'RETRY' }
```

## How Declarative Spec Maps Into XState

### `meta.on`

Spec:

```json
{
  "meta": {
    "on": {
      "click": { "type": "emitEvent", "event": "FORM.SUBMIT" }
    }
  }
}
```

Runtime behavior:

- renderer binds `click`
- binding sends `{ type: 'FORM.SUBMIT' }` to the actor

### `ActionSpec`

Spec actions such as `apiCall`, `navigate`, `openModal`, `closeModal`, and
`emitEvent` should compile into machine-dispatchable action descriptors.

Suggested mapping:

- `apiCall` -> invoked service from the machine
- `navigate` -> side effect adapter owned by `packages/ui`
- `openModal` -> machine event updating `context.ui.activeModal`
- `closeModal` -> machine event clearing `context.ui.activeModal`
- `emitEvent` -> direct actor send

`successEvent` and `failureEvent` should become follow-up machine events after an
invoked service completes.

### `enabledWhen` / `visibleWhen`

The current spec treats these as opaque runtime expressions. They should be
evaluated in `packages/ui` against:

- the machine snapshot
- the machine context
- optionally a narrow helper API such as `state.matches(...)`

These expressions should not bypass core semantics. If a condition can be
represented through shared declarative condition APIs, prefer that. XState
expressions are for runtime state checks, not for replacing schema/condition
evaluation.

### `bind`

`bind` paths should resolve against machine context data, typically:

- `values.*` for editable form state
- `data.*` for loaded query data
- `route.*` for route inputs

Example:

- `invoice.amount` may resolve into `context.values.invoice.amount`
- template data can read from `context.data` or `context.values` depending on the node contract

## Concrete Module Plan

The first pass should introduce a small set of modules rather than spreading
XState concerns across the codebase.

### `packages/core`

Recommended additions:

- `packages/core/src/declarative-ast.ts`
  Generic declarative node/document types
- `packages/core/src/declarative-refs.ts`
  Shared `$ref` resolution and merge helpers
- `packages/core/src/declarative-conditions.ts`
  Generic condition evaluation APIs extracted from AutoForm-centric runtime
- `packages/core/src/declarative-normalization.ts`
  Normalization entrypoint for non-form and form-specialized consumers
- `packages/core/src/declarative-actions.ts`
  Normalize/compile action and event metadata into runtime descriptors

Recommended exports:

- normalized document types
- condition state helpers
- action/query descriptor types
- bind/path utilities

### `packages/ui`

Recommended additions:

- `packages/ui/src/runtime/createDeclarativeMachine.ts`
  XState machine factory
- `packages/ui/src/runtime/declarative-runtime.types.ts`
  machine context/event types
- `packages/ui/src/runtime/declarative-runtime.services.ts`
  query/action service adapters
- `packages/ui/src/runtime/DeclarativeRuntimeProvider.tsx`
  actor provider for React
- `packages/ui/src/runtime/useDeclarativeRuntime.ts`
  hook to access snapshot, send, and selectors
- `packages/ui/src/runtime/evaluate-runtime-expression.ts`
  runtime evaluation for `enabledWhen` / `visibleWhen`
- `packages/ui/src/runtime/render-node.tsx`
  renderer bridge from normalized node -> React element with machine bindings

### AutoForm-specific UI modules

Recommended additions:

- `packages/ui/src/autoform/runtime/createAutoFormMachineInput.ts`
  maps normalized AutoForm model into shared runtime input
- `packages/ui/src/autoform/runtime/useAutoFormRuntime.ts`
  AutoForm wrapper hook over shared declarative runtime

AutoForm should adapt into the shared runtime, not fork it.

## Expression Strategy

The current spec allows string expressions like:

```json
{
  "meta": {
    "enabledWhen": "state.matches('ready')",
    "visibleWhen": "state.context.dirty === true"
  }
}
```

That is acceptable as a transitional contract, but it should be treated as a
constrained interface.

Recommended guardrails:

- do not expose general `eval`
- support a narrow expression runtime or precompiled predicate format
- allow access only to explicit runtime symbols such as `state`, `context`, and
  maybe helper functions
- prefer declarative condition descriptors in core when possible

Longer-term, these strings may want to become structured predicates instead of
free-form expressions.

## Query and Action Integration

The roadmap already points toward query-backed examples and shared compose
runtime. XState should coordinate that work, not replace it.

Recommended model:

- query definitions remain declarative metadata
- query execution is provided by a service adapter layer in `packages/ui`
- machine states handle loading/error/success transitions
- renderers read those states from the actor snapshot

This also gives a clean place to integrate TanStack Query later if desired:

- machine emits query intents
- service adapter calls query client or fetch layer
- success/failure returns to the actor

## Suggested Delivery Sequence

### Phase 1

Document and type the boundary.

- add generic declarative runtime types in `packages/core`
- define machine context/event contracts in `packages/ui`
- do not wire React yet

### Phase 2

Extract shared runtime descriptors from core.

- factor out generic action/query/condition descriptors
- keep existing AutoForm behavior working

### Phase 3

Add the shared XState machine in `packages/ui`.

Status: complete for the current shared page-runtime scope.

Delivered:

- shared page lifecycle in `packages/ui`
  - `loading`
  - `ready`
  - `submitting`
  - `error`
- descriptor-backed page loading from normalized page runtime metadata
- `emitEvent` wiring from renderer -> actor
- non-`emitEvent` `ActionSpec` wiring through runtime action services
- success/failure follow-up events from runtime action execution
- example vertical slice proving both `emitEvent` and non-`emitEvent` action paths

Not part of Phase 3 completion:

- real query/navigation/modal adapters
- broader provider/hook ergonomics
- AutoForm integration
- richer app-level runtime orchestration

### Phase 4

Adapt AutoForm to the shared runtime.

Status: in progress.

Delivered so far:

- `useAutoFormRuntime` submit lifecycle now uses the shared declarative runtime
- AutoForm and DialogWrapper submit flows reuse shared `submitting` orchestration
- AutoForm field change and touch interactions now emit explicit shared-runtime events
- touched/dirty runtime metadata now updates through shared-runtime transitions with a single sync path for reinit/bulk/reset flows
- validation now flows through explicit runtime-aware field/form helpers with runtime-owned status/result metadata
- action-failure recovery now allows re-submission from error state

Still pending in Phase 4:

- move field/value state ownership onto explicit machine transitions
- move more validation semantics onto explicit machine transitions instead of local hook bookkeeping
- reuse the shared runtime without retaining duplicated local field lifecycle where unnecessary

### Phase 5

Generalize compose/runtime for non-form declarative pages.

- use same actor model for views, pages, and actions
- keep renderer-specific code in `packages/ui`

## Non-Goals

This plan does not require:

- encoding full XState machines in JSON
- moving React concerns into `packages/core`
- replacing AJV-backed condition semantics with machine guards
- making AutoForm a separate runtime stack

## Recommendation

The right incorporation model is:

- `packages/core` defines what the declarative UI means
- `packages/ui` uses XState to manage how that declarative UI behaves over time
- AutoForm becomes one consumer of that shared runtime shape

That keeps the architecture aligned with the current roadmap and avoids the main
failure mode: duplicating semantic logic in both core and UI runtimes.
