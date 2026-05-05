# Local-First Architecture Notes

For the implementation recipe that connects local-first storage to sync and `@xstate/store`, see [`sync_xstate_store_tinybase_opfs_recipe.md`](./sync_xstate_store_tinybase_opfs_recipe.md).

**Status:** Draft  
**Date:** 2026-04-07

## Goal

Define a local-first data architecture for this repo with TinyBase behind the client repository boundary, while keeping merge semantics and durable shared state as backend concerns.

This document is about **application data**, not theme or UI preference persistence.

---

## Decision

The intended direction is:

- `@xstate/store` for UI/app state on the main thread
- a dedicated data worker for persistence and coordination
- TinyBase behind the repository boundary on the client
- TinyBase `Store` first on the client
- `OPFS` as the initial persistent client backing layer through TinyBase's browser persister
- per-org client storage policy selecting persistent or memory-only mode
- backend `MergeableStore` + Postgres as the later shared merge path

This means:

- `@xstate/store` is **not** the database
- `OPFS` is **not** the sync model
- TinyBase is infrastructure, not the runtime contract
- the worker/repository boundary is the core architectural seam

---

## Why This Direction

### Why not RxDB

RxDB is strong when the priority is shipping a local-first product quickly with an existing sync engine and reactive query layer.

However, the current preference is to own the architecture more directly:

- persistence contract
- worker protocol
- storage model
- sync semantics
- conflict behavior

RxDB remains a useful reference point for replication and client-side query invalidation patterns, but not the intended foundation.

### Why not Electric

Electric is closer to a Postgres sync platform than a browser-local storage primitive. It is valuable when Postgres replication and shape-based sync are the center of the system.

That is not the current target.

The desired system should start from:

- browser-local durability first
- worker-owned persistence first
- custom repository contracts first

Electric remains a useful reference for partial sync and local-first topology, but not the intended base layer.

### Why TinyBase with OPFS

If the goal is a repository-first system, we should still avoid rebuilding client persistence and coordination infrastructure from scratch unless there is a clear reason to do so.

This stack gives us:

- TinyBase as a client-side data base behind the repository seam
- a durable local storage core when org policy allows it
- a direct browser-local persistence path without introducing another storage layer into the first slice
- room to add a more structured storage substrate later if requirements justify it

Using TinyBase with OPFS does **not** prevent a custom architecture. We still own:

- worker API
- repository layer
- data model
- mutation protocol
- org-specific storage policy
- backend sync protocol
- conflict resolution

This is a better tradeoff than inventing a custom persistence and tab-coordination layer too early.

---

## Proposed Runtime Layers

### 1. Main Thread

Responsibilities:

- render UI
- hold ephemeral app/view state
- send commands to the worker
- subscribe to repository/query results

Recommended state shape:

- `@xstate/store` for UI state
- optimistic state only where justified
- no direct TinyBase access
- no direct OPFS access
- no direct database access

### 2. Dedicated Data Worker

Responsibilities:

- own the persistence runtime
- own the TinyBase/repository runtime
- serialize writes
- execute queries
- publish query/subscription updates
- later host backend sync logic

This worker should be the single writer for local data within a tab.

### 3. Storage Layer

Responsibilities:

- initialize the selected client storage mode
- open TinyBase persistence against the selected backing layer
- run migrations
- manage transaction boundaries
- support snapshots/backups if needed

### 4. Repository Layer

Responsibilities:

- expose domain-oriented APIs
- map queries/commands to persistence operations
- hide TinyBase, SQL, and storage details from UI code
- become the seam for future backend sync

Example shape:

```ts
type Repository<TQuery, TResult, TCommand> = {
  query(input: TQuery): Promise<TResult>
  subscribe(input: TQuery, subscriber: (result: TResult) => void): () => void
  commit(command: TCommand): Promise<void>
}
```

---

## Core Principles

### Single Writer

All writes should go through the worker.

This keeps:

- ordering deterministic
- transactions centralized
- OPFS access disciplined
- debugging tractable

### Commands, Not Blind Object Replacement

Prefer explicit mutations over arbitrary object overwrite.

Examples:

- `task.create`
- `task.rename`
- `task.move`
- `task.complete`

This matters for:

- optimistic UI
- auditability
- sync replay
- conflict handling

### Stable Client IDs

Records should use client-generated stable identifiers from day one.

This avoids later migration pain around offline record creation and sync.

### Versioned Schema and Migrations

The local database schema must be versioned from the beginning.

Every persisted structure should assume:

- it will change
- old data will survive upgrades
- migrations are a product requirement, not cleanup work

### Per-Org Storage Policy

Not every org can allow durable browser-local persistence.

The client architecture should support per-org policy such as:

- persistent local mode
  - TinyBase `Store`
  - TinyBase `OpfsPersister`
- memory-only mode
  - TinyBase `Store` in memory only
  - backend is the durable system of record
- memory-only isolated mode
  - no durable browser storage
  - no same-browser propagation if policy forbids it

The repository contract should not change across these modes.
Only the configured adapter below the repository boundary should change.

### Multi-Tab Awareness

`OPFS` and worker-based persistence must assume contention can happen across tabs.

Design for:

- one active writer
- no handwritten `BroadcastChannel` wiring in app code
- TinyBase-provided coordination when same-browser propagation is enabled
- explicit recovery/reconnect behavior

For the current docs authoring workbench, this means local page lifecycle must tolerate the active page disappearing underneath the UI.

The current product-facing behavior is:

- if the active persisted page is deleted and another page exists, the workbench switches to a deterministic fallback page
- if no persisted page remains, the workbench clears into an explicit empty state instead of leaving stale document state mounted
- creating a new page is the primary recovery path from that empty state

## Current Sync UX Note

The current docs JSX authoring workbench keeps sync deliberately narrow and explicit:

- sync is still manual through `Sync now`
- sync is disabled while unsaved local JSX edits exist
- the workbench shows the last sync outcome, timestamp, and whether more remote changes remain
- conflict messaging names the first affected page id and keeps recovery explicit rather than attempting merge
- retryable and non-retryable sync failures are surfaced differently in the product-facing path

This remains a proof surface, not a final product sync UX.

---

## What `@xstate/store` Should Own

`@xstate/store` is appropriate for:

- selection state
- panel state
- current view state
- filters/sorts
- in-flight optimistic overlays
- app shell/session state

It should not be the source of truth for:

- durable records
- replication metadata
- database snapshots
- migration state

Those belong in the worker-owned data layer.

---

## What the Worker/Data Layer Should Own

The worker/data layer should own:

- durable records
- indexes
- query execution
- mutation commits
- transaction boundaries
- sync metadata
- conflict metadata
- migration metadata

---

## Sync Model

Sync should be designed as a later layer on top of the local repository, not mixed into UI state.

Minimum requirements:

- outbound mutation queue
- remote acknowledgement model
- per-record or per-operation version metadata
- explicit conflict strategy

Conflict policy must be domain-specific.

Possible policies:

- last-write-wins for simple preferences
- field-level merge where safe
- domain-specific merge/rejection for collaborative records

Do not assume one global merge rule will be good enough.

### Recommended Sequencing

Sync should not be part of the first persistence slice.

The preferred order is:

1. local repository only
   - worker-backed repository
   - TinyBase `Store` on the client
   - revisioned local documents
   - persistent or memory-only mode selected by org config
2. explicit sync contract
   - define remote pull/push semantics
   - define conflict envelopes
   - define retry / replay behavior
3. real sync implementation
   - attach the backend merge/reconciliation strategy
   - prove conflict handling on one narrow document type first

This means PR 6 should make sync possible later, but should not implement sync itself.

### Current Sync Strategy Preference

The current likely strategy is:

- local-first repository as the source of truth on-device
- revisioned documents from day one
- same-browser propagation as a separate concern from backend sync
- later client-server sync above the repository layer
- backend `MergeableStore` owns merge semantics when needed
- explicit conflict detection before automatic merge

That points to:

- local writes always succeed against the local repository
- sync compares local revision ancestry against remote state later
- conflicting remote updates should initially reject and surface a resolution flow
- CRDT-style merge should remain optional, not assumed

This is a better first sync direction than jumping directly to:

- peer-to-peer replication
- automatic multi-writer merge
- a generalized CRDT document model

unless concurrent collaborative editing becomes an explicit product requirement.

### Cross-Tab Refresh Is Not Backend Sync

The architecture should keep these separate:

- cross-tab notification
  - tells another tab that a local document changed
  - can use TinyBase infrastructure under the hood
- local persistence
  - stores and reads the document locally
- sync
  - reconciles local state with the backend authority

Refreshing another browser tab from the same local repository is not the same problem as multi-device synchronization.

### Initial Conflict Policy

The first serious sync policy should probably be:

- document revision check
- reject on stale base revision
- explicit resolution UX when needed

This is more conservative than last-write-wins, but much safer for authored page/component documents.

It also keeps the boundary simple:

- repository owns revisions
- sync layer owns remote reconciliation
- UI decides how to surface conflicts

### TinyBase Position

TinyBase is now the chosen client-side data base for the first persistence slice.

Constraints:

- the app/runtime reads and writes through the repository boundary, not TinyBase directly
- the client starts with `Store`, not `MergeableStore`
- persisted units remain full revisioned documents, not ad hoc UI state
- browser multi-tab support should use TinyBase infrastructure when enabled, not custom app-level `BroadcastChannel` code
- backend merge semantics live in a backend `MergeableStore`, not in the initial client runtime

This keeps the runtime document-oriented while still using TinyBase to reduce persistence and coordination boilerplate.

### RxDB Discussion

RxDB is the stronger option if the goal shifts from "own the local-first architecture directly" to "avoid building the repository and sync stack ourselves."

Reasons it is attractive:

- it already provides a local database abstraction
- it already has replication concepts
- it already has reactivity and invalidation patterns
- it can reduce the amount of custom sync and subscription infrastructure we would need to write

Reasons to be careful:

- it becomes more of the architecture, not just a small helper
- it can pull query, document, and sync behavior toward RxDB’s model
- it weakens the value of the worker/repository boundary if the runtime starts depending on RxDB-specific assumptions
- it is a larger commitment than using SQLite as a lower-level storage engine

So the tradeoff is:

- TinyBase behind the repository
  - more control over the app/runtime contract
  - less infrastructure than building persistence and coordination from scratch
- RxDB
  - less custom infrastructure
  - faster path to replication/reactivity
  - bigger architectural dependency

If the priority is to avoid implementing sync and invalidation ourselves, RxDB is probably the more serious alternative than TinyBase.

If the priority is to preserve the current repository/worker contract and keep storage behind our own abstractions, the TinyBase-behind-repository direction still fits better than making RxDB the app model.

### Open Questions Before Sync Work

These should be answered before implementing sync beyond local persistence:

- is sync required across devices, or only across tabs on one device?
- is there a single backend authority, or should sync be peer-like?
- are page documents and registry entries synced the same way?
- is manual conflict resolution acceptable initially?
- do we expect simultaneous editing of the same document to be common?
- should sync operate on full documents, patches, or operation logs?

Until those answers are explicit, the safest approach is:

- local-first persistence first
- cross-tab refresh second
- sync as a dedicated later phase

---

## Suggested First Milestone

Build the smallest useful local-first kernel:

1. `data-worker`
   owns the repository runtime and all writes
2. `storage/client`
   initializes TinyBase in either persistent or memory-only mode
3. `repository/*`
   exposes typed query/commit APIs for one domain
4. `bridge/*`
   typed request/response + subscription protocol over `postMessage`
5. `stores/*`
   main-thread `@xstate/store` consuming repository results

The first implementation should target one narrow domain, not the whole app.

Good candidates:

- documents
- tasks
- drafts
- form sessions

---

## Anti-Goals

Avoid these early:

- building a custom database engine
- inventing a query language before needed
- letting components talk directly to persistence
- coupling React components to raw SQL
- mixing sync protocol decisions into UI state shape
- using `localStorage`/cookies/session storage as the primary data layer

Those browser storage APIs remain useful for:

- preferences
- small bootstrap hints
- auth/session information

They are not the primary local-first data substrate.

---

## Summary

The working architecture is:

- main-thread app state with `@xstate/store`
- dedicated worker as the persistence boundary
- TinyBase on the client behind the repository seam
- TinyBase `OpfsPersister` as the initial persistent client mode
- memory-only client mode for orgs that disallow local persistence
- backend `MergeableStore` + Postgres as the later shared merge path

This keeps the system repository-first where it matters without forcing one storage policy on every org.
