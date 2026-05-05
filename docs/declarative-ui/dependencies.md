# Declarative UI Dependencies

This document tracks likely implementation dependencies for declarative-ui work.

These are implementation options, not part of the declarative contract itself.

## Search and Catalog Discovery

### Orama

Orama is a valid option for component catalog and registry search.

Why it fits:

- registry entries are document-like
- local/editor search should be fast and interactive
- tags, keywords, hierarchy, and discovery metadata map well to an index
- scoped visibility filtering can be applied before or during indexing

Intended role:

- index component catalog / registry entries
- power search, filtering, and discovery in editor surfaces
- support local-first lookup for known renderer-backed components

Non-goals:

- Orama should not define the registry contract
- the component/catalog schema should remain search-engine-agnostic
- app/page declarative documents should not depend directly on Orama concepts

## Boundary Rule

Keep this split:

- declarative contract:
  - app/page/component registry documents
  - sharing levels
  - hierarchy/tags/keywords metadata
- search implementation:
  - Orama or another index/query engine over that metadata

That keeps tool choice replaceable while still allowing a strong discovery experience.

## Future Persistence

For the later local-first phase, the current likely browser persistence direction is:

- TinyBase behind the repository boundary on the client
- OPFS as the preferred browser storage backing layer

For the initial persistence adapter slice, TinyBase's native OPFS persister is sufficient.
SQLite/WASM remains optional if later storage requirements justify it.

Important caveats:

- `localStorage` is not the intended persistence layer for serious local-first data
- the declarative runtime and repository boundary should stay storage-engine-agnostic so this choice can evolve independently
- the initial supported runtime matrix assumes OPFS support in the underlying browser/runtime
- some orgs may require memory-only client mode with backend persistence as the durable path
- cross-tab communication should not require handwritten app-level `BroadcastChannel` wiring if TinyBase infrastructure is used
- the client starts with TinyBase `Store`; backend merge semantics can later use `MergeableStore`
- backend durable/shared persistence is expected to be Postgres behind the backend sync layer
