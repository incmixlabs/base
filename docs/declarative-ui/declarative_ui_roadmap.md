# Declarative UI Roadmap

**Status:** Draft  
**Date:** 2026-04-07

## Goal

Define the sequencing for declarative UI work in this repo.

The priority is:

1. define the declarative grammar for apps and pages
2. define how that grammar is consumed and normalized
3. define where `XState` fits in runtime orchestration
4. only after that, connect the runtime to local-first persistence

This sequencing treats grammar and grammar consumption as the critical path.

## Status Snapshot

- Phase 1: complete
- Phase 2: complete
- Phase 3: complete for the shared page-runtime contract
- Phase 4: complete for the current AutoForm shared-runtime adaptation scope
- Phase 5+: pending

---

## Core Position

The immediate problem is not storage.

The immediate problem is defining:

- what an app document is
- what a page document is
- what nodes and contracts exist in the declarative grammar
- how those documents are validated and normalized
- how the runtime consumes them consistently

Without that, any worker/OPFS/local-first implementation risks hard-coding assumptions into infrastructure before the app/page model is stable.

---

## Layer Model

The intended architecture should be split into distinct layers.

### 1. Declarative Grammar

This is the author-facing contract.

It defines:

- app documents
- page documents
- route definitions
- layout and composition nodes
- reusable components
- bindings
- query declarations
- action declarations
- conditions
- metadata

This layer should say what can be expressed, not how it is executed internally.

This layer also needs a persisted component-registry model.

That means:

- reusable components should not remain only local React maps
- component definitions/registrations should become declarative documents
- those registrations should be referenceable from app/page documents by stable ids
- the registry should support catalog hierarchy and search metadata
- component entries should carry tags and other discovery fields
- scope/visibility should be explicit, for example:
  - public
  - organization
  - workspace
  - private/user

The initial authoring surface for that registry can be a JSON editor. A richer UI can come later.

There is already a useful seed for this direction in [`packages/ui/src/editor/catalog.ts`](../../packages/ui/src/editor/catalog.ts).
That file should be treated as an existing catalog baseline, not discarded. The registry work should evolve it toward persisted declarative component documents and scoped discoverability.

The concrete PR 4 contract is documented in [`component_registry_contract.md`](./component_registry_contract.md).

That evolution should include:

- hierarchical grouping/navigation
- tags and search keywords
- richer discovery metadata for editor/catalog browsing
- explicit sharing level and ownership metadata

For catalog search specifically, a tool like Orama is a valid implementation option.
That choice should stay below the registry contract:

- the declarative/component registry contract should remain search-engine-agnostic
- catalog entries should define the searchable metadata
- Orama can index those entries for local/editor discovery without becoming the contract itself

The initial registry scope should also be deliberately narrow:

- registry-backed components should resolve through known renderer entries
- the first supported set should be mostly presentational or minimally interactive
- arbitrary React component serialization is not a goal

Good early candidates:

- text
- heading
- badge
- callout
- card shells
- empty states
- stat/value summaries
- icon + label rows

Later phases can expand toward richer widgets once the registry contract and runtime resolution model are stable.

### 2. Grammar Consumption

This is the runtime-facing interpretation layer.

It defines:

- parsing
- validation
- normalization
- `$ref` resolution
- defaults
- structural expansion
- compilation into a normalized runtime document

This layer turns authoring-time documents into something the runtime can actually execute and render.

### 3. XState Runtime

`XState` should fit here.

Its role is:

- orchestration
- lifecycle
- async coordination
- event handling
- action execution
- loading/error/ready/refresh state
- long-running workflow state

`XState` should not be the grammar.

It should consume the normalized declarative runtime model and drive behavior over time.

### 4. Data and Persistence

This is downstream from the grammar/runtime contract.

It includes:

- query execution
- mutation execution
- local-first storage
- worker-backed persistence
- sync

This layer should plug into the declarative runtime after the app/page model is stable.

---

## How XState Fits

### What XState Should Own

`XState` should own runtime orchestration concerns such as:

- app boot lifecycle
- route enter/leave lifecycle
- page loading states
- error and retry states
- refresh/invalidate states
- user-triggered action flow
- modal/dialog/task workflows
- query and mutation coordination
- cancellation and background work

This is where state machines are strong: explicit behavior over time.

### What XState Should Not Own

`XState` should not define:

- the declarative AST
- the authoring schema for pages
- raw renderer node contracts
- persistent data schemas

Those must remain outside the machine so the declarative model does not collapse into a machine configuration format.

### Initial Contract Between Grammar and XState

The grammar should expose hooks that the runtime can map into `XState`, for example:

- node events
- page lifecycle hooks
- named actions
- query declarations
- mutation declarations
- conditions against runtime state
- references to app/page context

That keeps the grammar expressive without embedding full machine definitions too early.

---

## Recommended Sequencing

### Phase 1: App/Page Grammar

First define the top-level declarative documents.

This phase should answer:

- what is an app document?
- what is a page document?
- how are routes declared?
- where do shared components live?
- how is the component registry represented and referenced?
- what visibility scopes exist for registered components?
- how are layout trees expressed?
- how do actions and queries attach?
- what conditions are allowed?

Outputs:

- app document schema
- page document schema
- route contract
- component registry document contract
- initial known-renderer component registry subset
- catalog hierarchy and search/discovery contract
- node taxonomy
- clear separation between authoring and normalized runtime forms

### Phase 2: Grammar Consumption

Once the grammar exists, define how it is consumed.

This phase should answer:

- how are documents validated?
- how are defaults applied?
- how are refs resolved?
- how are route/page/component boundaries normalized?
- what does the normalized runtime document look like?

Outputs:

- parser/validator contracts
- normalization pipeline
- normalized runtime document shape
- error model for invalid documents

### Phase 3: XState Integration Contract

Once normalized documents exist, define how the runtime behaves.

This phase should answer:

- what lifecycle states are standard?
- how do queries map into runtime events and actors?
- how do actions map into machine transitions/effects?
- how do conditions read runtime state?
- how do pages emit events into the runtime?

Outputs:

- app/page lifecycle machine contracts
- action/query event model
- runtime context contract
- conditions integration contract

Current status:

- complete for the shared page-runtime scope

Delivered in Phase 3:

- shared page machine in `packages/ui`
- lifecycle states:
  - `loading`
  - `ready`
  - `submitting`
  - `error`
- normalized runtime descriptors from `packages/core`
- descriptor-backed page loading
- `emitEvent` wiring from renderer to actor
- non-`emitEvent` `ActionSpec` execution through runtime services
- example vertical slice proving both action paths

Explicitly deferred beyond Phase 3:

- real query adapters
- real navigation/modal side-effect adapters
- provider/hook ergonomics beyond direct actor creation
- AutoForm integration
- broader app/runtime orchestration

### Phase 4: AutoForm Shared Runtime Adaptation

After the shared page runtime is stable, adapt AutoForm onto it incrementally.

This phase should include:

- mapping AutoForm submit lifecycle onto the shared runtime
- reusing shared `submitting`/error orchestration
- progressively mapping field change, touch, and validation flow into shared runtime semantics
- removing duplicated local lifecycle state where the shared runtime can own it

Current status:

- complete for the current AutoForm shared-runtime scope
- delivered so far:
  - `useAutoFormRuntime` submit flow uses shared declarative runtime orchestration
  - `AutoFormModelRenderer` and `DialogWrapper` inherit that shared submit lifecycle
  - AutoForm field change and touch interactions emit explicit shared-runtime events
  - touched/dirty ownership now flows through shared-runtime transitions and is read back from the runtime through a single sync path
  - validation now flows through explicit runtime-aware field/form helpers with runtime-owned status/result metadata
  - failed submit/action flows can recover and re-submit from the shared runtime `error` state
  - the final runtime boundary is now explicit:
    - shared runtime owns submit lifecycle, validation status, touched/dirty metadata, and condition evaluation
    - local AutoForm runtime state owns values plus validation/server/form error bags
    - renderers own active-branch filtering and submit-time value pruning
  - duplicated public bookkeeping was removed from `useAutoFormRuntime` so the hook no longer exposes a mixed-ownership raw state object

### Phase 5: Vertical Slice Consolidation And Local-First Data Layer

Only then should storage move to the foreground.

At that point the data layer can be designed to serve the declarative runtime instead of forcing the runtime shape.

Before taking up the local-first/storage phase, the grammar should be pressure-tested more broadly.

That pre-persistence work should include:

- more sample declarative pages
- in-page view variants
- tabs
- explicit read-only / view-only grammar cases
- mixed page compositions beyond the current narrow examples

There should also be an intermediate JSON-specified component step before discovery/persistence work:

- allow a small set of JSON-defined widgets/components in-repo first
- a local path such as `packages/ui/src/widgets` is acceptable for this stage
- those widgets should resolve through known renderer-backed component mappings
- discovery, sharing, and persisted registry management can come later
- the purpose of this step is to prove that the grammar and runtime hold up for JSON-defined components before introducing local-first/backend storage

So the intended order is:

1. broaden grammar/runtime pressure with more pages and page variants
2. prove JSON-specified component contracts locally in-repo
3. only then move into local-first persistence, backend-backed storage, and discovery/registry maturity

Browser persistence direction:

- do not treat `localStorage` as the serious persistence target
- prefer browser-side SQLite/WASM with OPFS-backed storage when the persistence phase begins
- treat IndexedDB as a compatibility or fallback backing layer if needed, not the ideal end state
- keep the worker/repository boundary independent from the exact browser storage adapter so persistence can evolve without reshaping the runtime contract
- for same-device cross-tab editing/preview, start with shared local persistence plus cross-tab signaling such as `BroadcastChannel`; do not assume CRDTs are required for the first slice
- only introduce CRDT-style document replication if the requirements expand to concurrent multi-tab or multi-device editing with automatic merge semantics

The concrete Phase 5 PR 5 boundary contract is documented in [`worker_repository_boundary.md`](./worker_repository_boundary.md).

Outputs:

- worker boundary
- query/mutation adapter contracts
- local-first repository integration
- eventually OPFS/SQLite and sync

---

## Near-Term Work

The next work should focus on grammar and consumption, not persistence infrastructure.

### Immediate Next Steps

1. expand the current declarative spec from node grammar into app/page grammar
2. define separate `AppDocument`, `PageDocument`, and normalized runtime shapes
3. specify route, query, action, and condition contracts
4. define the component registry contract, including scope and persistence semantics
5. define normalization rules and invalid-state rules
6. document the `XState` integration contract without embedding full machines into authoring JSON

Current PR 2 contract direction:

- authoring `AppDocument` routes should reference pages only via `#/pages/...`
- normalized app routes should expose `pageId`, not reuse the authoring `page` field
- normalized page/app documents should be explicit runtime shapes, not `Omit<...>` aliases over authoring types
- shared app components may be merged into normalized page components during normalization, but that is a normalization rule, not an authoring contract
- bare page ids in routes should be treated as invalid authoring state

### First Implementation Target

Implement the minimum useful path:

- typed document contracts in core
- normalization and `$ref` resolution
- normalized runtime model
- one `XState` page runtime consuming that model
- one React renderer path

---

## Suggested Document Split

To keep concerns clear, the docs should likely separate into:

- `docs/declarative_ui_spec.md`
  grammar and authoring model
- `docs/declarative_ui_roadmap.md`
  sequencing and implementation plan
- future runtime doc
  normalized runtime model and machine/runtime contract
- future local-first doc
  worker, storage, and repository integration

---

## Anti-Goals

Avoid these too early:

- building worker/local-first infrastructure before app/page grammar is stable
- embedding full `XState` machine definitions directly into the grammar
- conflating authoring docs with normalized runtime data
- letting persistence concerns determine the page/app contract

---

## Summary

The correct sequencing is:

1. define declarative grammar for apps and pages
2. define grammar consumption and normalization
3. define `XState` as the orchestration/runtime layer
4. validate with a vertical slice
5. connect the validated runtime to local-first persistence afterward

In this model, `XState` is critical, but it is critical as the behavior runtime around the declarative system, not as the schema definition language itself.
