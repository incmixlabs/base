# Worker / Repository Boundary

Phase 5 PR 5 defines the storage-facing boundary for declarative documents without committing to a browser storage engine yet.

The goal is to make the runtime depend on a stable repository contract, not on OPFS, IndexedDB, SQLite/WASM, or `BroadcastChannel` directly.

## Boundary Split

PR 5 separates four concerns that should not collapse into one abstraction:

- repository interface
  - what the UI/runtime asks for
  - query a document
  - list documents
  - save or delete a document
- query/mutation adapters
  - the execution seam below the repository
  - where worker-backed or direct adapters can later plug in
- worker transport
  - the message envelope between the main thread and a worker-backed repository implementation
- cross-tab notification
  - same-browser refresh signals for other tabs
  - separate from storage so notification does not become the persistence contract

Current types live in [`packages/core/src/worker-repository-boundary.ts`](../../packages/core/src/worker-repository-boundary.ts).

## Repository Contract

The current core interface is intentionally small:

- `query(query)`
- `mutate(mutation)`

The initial query shapes are:

- `get-document`
- `list-documents`

The initial mutation shapes are:

- `put-document`
- `delete-document`

This is deliberately storage-agnostic:

- no SQL contract
- no IndexedDB-specific API surface
- no OPFS file assumptions
- no direct browser API dependency in the runtime

## Document Envelope

The repository contract distinguishes:

- document kind
  - `app`
  - `page`
  - `component-registry-entry`
- document summary
  - `id`
  - `revision`
  - optional discovery-facing metadata such as `title`, `slug`, `scope`, `tags`
- document record
  - summary fields plus the full document payload

`revision` is part of the boundary now because local-first editing needs a stable concept for refresh and optimistic conflict detection even before a storage engine is chosen.

## Query / Mutation Adapters

The repository itself should not force one execution path.

PR 5 therefore defines separate adapter interfaces:

- `DeclarativeRepositoryQueryAdapter`
- `DeclarativeRepositoryMutationAdapter`

That leaves room for multiple implementations later:

- in-memory test adapter
- worker-backed browser-local adapter
- direct same-thread adapter for early integration
- server-backed adapter if the product later needs one

The runtime should only care that the repository can answer queries and mutations consistently.

## Worker Boundary

PR 5 also defines worker request/response envelopes so repository access can move behind a worker without reshaping the runtime contract.

Request kinds are:

- `repository.query`
- `repository.mutation`

Response kinds are:

- `repository.query.result`
- `repository.mutation.result`
- `repository.error`
- `repository.notification`

The important point is that the worker boundary is transport-level.
It is not the repository API itself.

That distinction matters because:

- tests may use a same-thread repository directly
- the runtime should not know whether the repository call crossed a worker boundary
- storage adapter choice should stay below the repository boundary

## Cross-Tab Notifications

Cross-tab refresh should be modeled separately from storage.

The current notification contract is:

- `document.changed`
- `document.deleted`
- `document.invalidated`

## Repository Watch Semantics

Phase 8 adds a consumer-facing watch layer above raw notifications.

The current watch contract is intentionally small:

- `watchDocument(...)`
- `watchListDocuments(...)`

The important behavior is:

- watchers emit an initial result
  - this is a reconciliation event, not just a convenience callback
  - consumers should treat it as the latest repository state returned by the first refresh after watch attachment
- document watchers react to:
  - matching `document.changed`
  - matching `document.deleted`
  - scoped `document.invalidated`
- document watchers do not react to broad invalidation with no document identity
- list watchers react to:
  - matching `document.changed`
  - matching `document.deleted`
  - broad `document.invalidated`
  - kind-scoped `document.invalidated` when the invalidated document kind matches the watched list
- watch delivery is event-driven
  - the core watch layer re-queries on matching events
  - it does not currently dedupe identical result payloads for consumers

That boundary keeps the core contract simple:

- notifications stay low-level
- watchers provide query-shaped refresh semantics
- product surfaces can still layer their own stale, busy, dirty, or self-echo suppression rules above the watch contract

Notification events may include:

- `documentKind`
- `id`
- `revision`
- `source`

Notification invariants are intentionally tighter for the concrete change events:

- `document.changed`
  - requires `documentKind`
  - requires `id`
- `document.deleted`
  - requires `documentKind`
  - requires `id`
- `document.invalidated`
  - may stay broader and can omit document identity when the caller only knows that some cached local state should refresh

That event model is intentionally small.
It only answers:

- what changed
- whether another tab should refresh
- whether a cached local document may be stale

It does not answer:

- how the change was stored
- which sync protocol carried it
- whether the notification came from `BroadcastChannel`, a worker relay, or another implementation

That separation keeps same-browser preview/edit refresh lightweight without forcing CRDTs or a storage-specific event bus into the runtime contract.

## Non-Goals

PR 5 does not implement:

- OPFS
- SQLite/WASM
- IndexedDB
- a real worker
- repository persistence
- sync or merge semantics
- CRDTs

Those remain PR 6 or later concerns.

## What PR 6 Can Add Safely

Because PR 5 defines the seam first, PR 6 can add:

- a browser-local repository implementation
- worker-backed execution
- `BroadcastChannel` or similar cross-tab signaling
- optimistic revision checks

without requiring the declarative runtime or editor surfaces to be reshaped around one storage engine.

The concrete worker transport proof now lives in
[`packages/core/src/declarative-repository-worker.ts`](../../packages/core/src/declarative-repository-worker.ts).
It keeps the repository contract unchanged while proving that query, mutation, and notification flows can cross a worker boundary over `postMessage`.
