# Sync Boundary

For the practical wiring across sync, `@xstate/store`, TinyBase, and OPFS, start with [`sync_xstate_store_tinybase_opfs_recipe.md`](./sync_xstate_store_tinybase_opfs_recipe.md).

Phase 10 PR 1 defines the sync-facing contract above the local repository and below any product UI.

The goal is to keep sync adjacent to the repository rather than folding remote behavior into:

- storage adapters
- the worker transport
- raw repository query/mutation shapes
- product-specific editor state

Current types live in [`packages/core/src/declarative-sync-boundary.ts`](../../packages/core/src/declarative-sync-boundary.ts).

## Position In The Stack

The current contract assumes:

- the local repository remains the source of truth on-device
- sync is responsible for exchanging document changes with a remote system
- repository watch/invalidation remains the way product surfaces observe applied changes locally

This means sync sits beside the repository:

- repository
  - query local state
  - mutate local state
  - watch local invalidation
- sync adapter
  - pull remote changes
  - push local changes
  - report conflicts and retry classes

## Initial Scope

PR 1 only defines the contract.

It does not yet implement:

- a real transport
- background sync
- CRDTs
- multi-user merge semantics
- app-wide sync orchestration

The intended first implementation scope for the next PR is narrow:

- `page`, `app`, and `component-registry-entry` documents first
- manual sync trigger first
- revision conflict detection first

## Pull Contract

The pull side is:

- `pullChanges({ documentKind?, sinceCursor?, limit? })`

Response:

- `changes`
- `nextCursor`
- `hasMore`

The key points are:

- `sinceCursor` is the remote progress marker, not a local revision
- pull returns change envelopes, not raw notifications
- applied pull results should later publish through the same local repository invalidation/watch path already used by the workbench
- `hasMore` is explicit on every response so clients do not have to infer terminal pages from cursor shape
- when `hasMore` is `false`, `nextCursor` should remain the stable resume point for the latest known remote state

## Push Contract

The push side is:

- `pushChanges({ changes })`

Response:

- `applied`
- `conflicts`
- optional `acceptedCursor`

The key points are:

- changes carry `baseRevision` when the client is asserting what remote/local revision it edited from
- push conflicts are explicit results, not hidden retries
- conflict handling stays above the sync adapter so product surfaces can choose how to recover

## Change Envelope

The sync contract currently models two operations:

- `upsert`
- `delete`

An `upsert` carries the full repository record.

A `delete` carries:

- document kind
- id
- revision

This keeps the initial sync seam document-oriented and revision-oriented without inventing patch/merge formats too early.

## Conflict Contract

The current conflict reasons are:

- `revision-mismatch`
- `deleted-remotely`
- `incompatible-document`

Conflict payloads may include the current server record so a client can:

- reload it locally
- compare revisions
- decide whether to retry or ask the user to reconcile

PR 1 deliberately does not define automatic merge behavior.

## Error Classes

The current sync error codes are:

- `conflict`
- `invalid-cursor`
- `invalid-request`
- `auth`
- `rate-limited`
- `transient`
- `fatal`

These are intentionally broader than repository mutation errors because sync failures can come from:

- remote auth
- remote quotas
- remote availability
- malformed cursors

The contract carries:

- `message`
- `retryable`
- optional `retryAfterMs`

## Examples

Static contract examples now live in [`packages/core/src/declarative-sync.examples.ts`](../../packages/core/src/declarative-sync.examples.ts).

They currently cover:

- pulling one updated `page` document
- pushing one updated `page` document successfully
- receiving a revision conflict on push

These examples are intentionally static in PR 1.
The first executable sync proof belongs in the next PR.

## First Implementation Note

The first executable sync proof stays deliberately narrow:

- `page` documents only
- manual `Sync now` trigger only
- fixture-backed adapter only
- revision conflict reporting only

It reuses local repository mutation and watch behavior after applying pulled or pushed changes rather than adding a second refresh channel for product UI.

## Hardening Notes

The first hardening pass keeps the implementation narrow but makes repeated manual sync runs more deterministic:

- the docs workbench now persists sync cursor and per-page revision metadata in its local authoring metadata file
- malformed persisted sync metadata is ignored and rewritten on the next successful sync rather than forcing a document reset
- the fixture sync adapter now rejects malformed cursors and malformed pull limits with typed sync adapter errors
- the docs workbench recovers from an invalid persisted cursor by clearing the cursor and retrying the next pull from the remote head
- terminal pull pages keep a stable `nextCursor`, so a resume from the accepted cursor does not replay already accepted changes
