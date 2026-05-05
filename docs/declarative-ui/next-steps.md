# Declarative UI Next Steps

This note starts after [phases.md](./phases.md) ends at Phase 15 PR 2.

At that point, the current roadmap should have proven:

- local-first repository-backed authoring
- real sync transport
- background sync policy and UX
- sync beyond `page`
- a second real consumer surface

That is the right point to stop adding slices mechanically and choose the next lane explicitly.

## Decision Point

After Phase 15 PR 2, decide which of these becomes the primary goal:

1. productize the local-first stack
2. broaden adoption across more document types and surfaces
3. deepen collaboration semantics

Do not mix all three at once. The next plan should choose one primary lane and keep the others as secondary follow-up work.

## Likely Phase 16 Lanes

### Lane A: Rollout and hardening

Goal:
turn the current proof into a stable product capability.

Scope:

- observability around sync success, retry, and conflict paths
- stronger recovery behavior for corrupt or stale local sync state
- migration/versioning cleanup for persisted metadata
- performance review for large local repositories and sync batches
- app-level adoption plan beyond the docs workbench

Output:

- production-readier local-first stack
- fewer sharp edges in recovery and upgrade flows
- clearer operating envelope

### Lane B: Backend convergence

Goal:
replace remaining narrow or proof-oriented backend assumptions.

Scope:

- move beyond in-memory or stubbed sync service assumptions
- tighten auth, tenant, and actor semantics
- align sync state with real persistence guarantees in `services/api`
- define server-side observability and error reporting expectations
- document operational constraints for remote sync

Output:

- backend that matches the client sync contract more fully
- fewer proof-only assumptions in transport behavior

### Lane C: Collaboration semantics

Goal:
go beyond reload-and-retry conflict handling.

Scope:

- decide whether conflict handling stays manual or gains assisted merge flows
- define what concurrent edits mean per document type
- document conflict surfaces in UI and repository terms
- add only the minimum collaboration UX required by the product

Output:

- explicit collaboration model
- conflict behavior that is intentionally designed rather than incidental

## Recommended Order

Default recommendation:

1. Lane A: rollout and hardening
2. Lane B: backend convergence
3. Lane C: collaboration semantics

Reason:
the current architecture is already coherent enough to prove local-first and sync. The next highest-value work is making it dependable before expanding conflict semantics further.

## Suggested Planning Rule

When Phase 16 is written, keep the same discipline used in later phases:

- one narrow PR goal per slice
- one primary concern per PR
- core owns reusable repository/sync logic
- docs stays a consumer, not an owner
