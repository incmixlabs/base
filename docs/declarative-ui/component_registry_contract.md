# Component Registry Contract

Phase 5 PR 4 defines the registry contract and discovery metadata without implementing persistence.

The goal is to make the registry shape explicit now, while keeping runtime resolution, discovery/search, and future persistence concerns clearly separated.

## Entry Shape

Each registry entry should be modeled as a document-like record with these sections:

- identity
  - `kind`
  - `schemaVersion`
  - `id`
  - `slug`
  - `title`
  - `description`
- runtime
  - how the declarative runtime resolves the entry into a known renderer-backed component
- discovery
  - search and catalog metadata for editor browsing
- ownership
  - explicit scope/visibility and owner metadata
- persistence
  - semantics for how the entry is expected to behave once repository-backed storage exists

Current types live in [`packages/core/src/component-registry.ts`](../../packages/core/src/component-registry.ts).

## Runtime Versus Discovery

The important split in this phase is:

- `runtime`
  - runtime-facing binding only
  - example: `kind`, `rendererId`, `componentName`
  - this is what the declarative runtime needs in order to resolve a registry entry into a known component implementation
- `discovery`
  - editor/search-facing metadata only
  - example: `summary`, `group`, `hierarchy`, `tags`, `keywords`
  - this is what catalog UIs and search indexes need in order to organize and find entries

Search metadata should not leak into runtime resolution, and runtime bindings should not be shaped around search tooling.

## Discovery/Search Metadata

Discovery metadata should be search-engine-agnostic.

The contract should support:

- `group`
  - a primary catalog grouping for UI browsing
- `hierarchy`
  - a simple path-like grouping model such as `elements -> button`
- `tags`
  - compact topic labels for filtering
- `keywords`
  - extra search terms that do not need to appear in the title
- `summary`
  - short catalog-facing explanatory copy

An index/query engine such as Orama may index those fields later, but the registry schema should remain independent from any one search implementation.

## Ownership and Scope

Scope/visibility should be explicit on each entry.

Current contract values are:

- `public`
- `organization`
- `workspace`
- `private`

Ownership metadata is intentionally lightweight in this phase. It needs to express the intended visibility boundary without forcing a storage model yet.

## Persistence Semantics

This phase documents persistence semantics without implementing persistence.

The current contract distinguishes:

- `source`
  - `code` for entries seeded from source-controlled catalog data
  - `registry` for future repository-backed registry documents
- `mutable`
  - whether the entry is expected to be edited through future registry workflows
- `scope`
  - currently repository-level semantics, without committing to a storage engine

That means:

- PR 4 defines how entries will behave once persistence exists
- PR 4 does not introduce a repository, worker, OPFS adapter, or sync engine
- PR 5 and PR 6 remain the persistence-boundary and first-persistence phases

The concrete PR 5 worker/repository seam is documented in [`worker_repository_boundary.md`](./worker_repository_boundary.md).

## Current Seed Catalog

The current seed catalog remains [`packages/ui/src/editor/catalog.ts`](../../packages/ui/src/editor/catalog.ts).

That file now serves two purposes:

- it provides code-authored seed entries that already match the registry contract
- it carries UI-only `runtimeScope` data for local docs/examples and JSX authoring

`runtimeScope` is intentionally separate from registry `ownership.scope`:

- `runtimeScope`
  - local React execution scope for examples/authoring
- `ownership.scope`
  - visibility boundary for the registry entry itself

This separation keeps the local authoring/demo implementation useful without confusing it with the long-term registry/discovery contract.
