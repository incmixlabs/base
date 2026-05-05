# Sync + `@xstate/store` + TinyBase + OPFS Recipe

**Status:** Draft  
**Updated:** 2026-04-12

This is the practical wiring recipe for the current local-first declarative runtime.

It answers one question:

How do sync, `@xstate/store`, TinyBase, and OPFS fit together without overlapping responsibilities?

## Short Version

The intended split is:

- `@xstate/store` owns ephemeral UI state on the main thread
- TinyBase owns local document persistence behind the repository boundary
- OPFS is the durable browser backing store when policy and platform allow it
- sync exchanges document changes between the local repository and the remote system
- repository watch events are the bridge back into UI state

The key rule is:

- do not make `@xstate/store` the database
- do not make OPFS the sync layer
- do not let product UI talk to TinyBase directly

## Mental Model

Think in four layers, in this order:

1. local repository
2. sync service
3. UI store / actor state
4. rendered product UI

That means:

- TinyBase stores the local source of truth
- sync reads from and writes to that local source of truth
- `@xstate/store` tracks selection, status, banners, active route, active document, and in-flight UI state
- UI reacts to repository watchers and store updates

## Responsibilities

### `@xstate/store`

Use it for:

- active app id
- active route path
- sync status
- last sync feedback
- selected panels, filters, dialogs
- optimistic UI flags if needed

Do not use it for:

- authoritative persisted document storage
- revision metadata
- sync cursor persistence
- cross-tab durability

### TinyBase

Use it for:

- persisted local documents
- local document revisions
- repository queries and mutations
- local watch/notification fanout

Do not expose it directly to product UI.

UI should talk to a repository API such as:

- `loadDocument`
- `listDocuments`
- `watchDocument`
- `watchApps`
- `syncApps`

### OPFS

Use it as the persistence backing layer for TinyBase when available.

In the current implementation:

- OPFS is attempted first
- memory mode is the fallback
- sync metadata is only persisted when OPFS is available
- unreadable or incompatible persisted storage is reset and reinitialized

So OPFS answers:

- where does local data live durably?

It does not answer:

- how do remote changes merge?
- how do tabs coordinate product state?
- how does UI know what to render?

### Sync

Use sync for:

- pushing local app/page changes upstream
- pulling remote changes down
- detecting conflicts
- remembering remote cursor/revision metadata

Sync should operate against repository records, not UI component state.

## End-To-End Flow

The runtime flow should be:

1. initialize the repository
2. seed the initial document if needed
3. subscribe to repository watch events
4. mirror repository results into `@xstate/store` selection/status state
5. trigger sync manually or from a background scheduler
6. let sync apply pulled changes back into the repository
7. let repository watch events refresh the UI store and rendered surface

That is the important loop:

- remote sync does not update the UI directly
- sync updates the repository
- repository watchers update UI state

## Concrete Recipe

### 1. Initialize Repository Storage

Start with a repository initializer that decides between OPFS and memory.

Current example:

- [`initializeDeclarativeAppSyncRepository`](../../packages/core/src/declarative-app-sync-repository.ts)

What it does:

- resolves OPFS vs memory storage
- prepares TinyBase persistence
- configures cross-tab notifications when available
- restores persisted sync metadata
- seeds the initial app document
- exposes a repository-shaped API back to the UI

### 2. Keep TinyBase Behind A Repository Boundary

The UI should never read TinyBase tables directly.

Instead:

- TinyBase lives inside `initializeTinyBaseDeclarativeRepository`
- the worker-backed repository exposes query/mutation/watch APIs
- sync consumes that repository API
- UI consumes the same repository API

This keeps storage swappable:

- OPFS-backed TinyBase
- memory-only TinyBase
- future worker-hosted variants

without changing product UI contracts.

### 3. Put Sync Beside The Repository

The sync service should:

- inspect local repository records
- compute push payloads
- send push changes to the adapter
- pull remote changes
- apply pulled changes back into the repository
- persist cursor and revision metadata

Current examples:

- [`createDeclarativeAppSyncService`](../../packages/core/src/declarative-app-sync-service.ts)
- [`createDeclarativeAppSyncService.syncApps()`](../../packages/core/src/declarative-app-sync-service.ts)

Important implication:

- sync metadata belongs with repository persistence
- not in `@xstate/store`

That includes:

- `cursor`
- `remoteRevisions`
- `lastSyncedLocalRevisions`
- `pendingDeleteBaseRevisions`

### 4. Use `@xstate/store` For View State Around The Repository

On the main thread, the store should derive product state from repository reads and watch events.

Good store state:

- current app id
- current route path
- sync banner message
- repository ready/loading/error state
- active filter state

Bad store state:

- full copy of every persisted document
- sync cursor
- remote base revision maps

If a document changes remotely, prefer:

1. sync applies change to repository
2. repository watcher fires
3. store updates selection or status if needed
4. UI re-renders from the new repository-backed result

### 5. Let XState Actors Own Runtime Behavior For A Selected Document

Once the UI has chosen the active app/page from repository state, XState should own runtime behavior for that selected document:

- loading query lifecycle
- action invocation
- retries
- transient runtime context
- view-local event handling

This is the split:

- TinyBase/repository owns persisted document state
- XState owns runtime execution of that document

For example:

- repository chooses which page document is active
- XState actor runs that page's `loadQuery`, `navigate`, and emitted events

### 6. Feed Repository Changes Into Store Selection, Not Directly Into The Actor

When repository state changes:

- update the selected app/page ids in the store if needed
- recreate or retarget the XState runtime for the newly active normalized page

Do not try to make sync call actor events directly for persistence changes.

That couples remote transport to view runtime too tightly.

The safer flow is:

- sync -> repository
- repository -> store
- store -> selected normalized page
- selected page -> XState actor

### 7. Schedule Background Sync Outside The UI Store

Background sync scheduling is orchestration, not persisted data.

It can consult UI/runtime state such as:

- online/offline
- document visibility
- whether a sync is already running

But its job is still just:

- decide when to call `syncApps()` or `syncPages()`

Current example:

- [`createDeclarativeBackgroundSyncScheduler`](../../packages/core/src/declarative-sync-scheduler.ts)

## What Lives Where

### Persisted In OPFS Metadata

- schema version
- sync cursor
- remote revision map
- last synced local revision map
- pending delete base revisions

### Persisted In TinyBase

- app/page documents
- local document revision
- summaries used by list/watch APIs

### Held In `@xstate/store`

- active selection
- sync banner text
- repository status
- current route
- UI panels and filters

### Held In XState Actor Context

- runtime query results
- transient action results
- local interaction state for the active page/runtime

## Decision Rules

When deciding where a piece of state belongs, use these checks:

- If it must survive reload and is part of local content, it belongs in TinyBase.
- If it must survive reload and is part of sync bookkeeping, persist it beside repository storage.
- If it only affects current UI/session behavior, it belongs in `@xstate/store`.
- If it is runtime execution state for one selected declarative surface, it belongs in XState actor context.

## Anti-Patterns

Avoid these:

- storing whole app/page documents in `@xstate/store`
- letting React components query TinyBase directly
- making OPFS-specific code leak into product UI
- letting sync mutate UI state directly
- mixing sync cursor/revision metadata into view stores
- using XState actor context as the durable offline cache

## Recommended Product Wiring

For a product surface, the recommended order is:

1. initialize repository
2. expose repository API to the feature shell
3. create an `@xstate/store` for selection and sync status
4. subscribe store updates from `watchApps` / `watchDocument`
5. choose the active normalized document
6. create the XState actor for that active document
7. wire manual and background sync to repository `sync*()` calls

If we keep that split, each tool stays narrow:

- TinyBase is local persistence
- OPFS is durable backing storage
- sync is remote exchange
- `@xstate/store` is app/view state
- XState actor is runtime orchestration

## Current Code References

- repository + OPFS bootstrap:
  [`packages/core/src/declarative-app-sync-repository.ts`](../../packages/core/src/declarative-app-sync-repository.ts)
- TinyBase repository:
  [`packages/core/src/declarative-repository.ts`](../../packages/core/src/declarative-repository.ts)
- worker-backed repository seam:
  [`packages/core/src/declarative-repository-worker.ts`](../../packages/core/src/declarative-repository-worker.ts)
- sync service:
  [`packages/core/src/declarative-app-sync-service.ts`](../../packages/core/src/declarative-app-sync-service.ts)
- sync contract:
  [`docs/declarative-ui/sync_boundary.md`](./sync_boundary.md)
- local-first notes:
  [`docs/declarative-ui/local-first.md`](./local-first.md)
- XState notes:
  [`docs/declarative-ui/xtate.md`](./xtate.md)

## Proposed Follow-Up

The next docs cleanup should probably turn this recipe into the canonical overview and reduce the surrounding docs to:

- contract doc
- architecture rationale doc
- implementation recipe doc

Right now the concepts are correct, but they are spread across too many notes.
