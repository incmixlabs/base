# Declarative Backend Contract

This document complements [`docs/declarative_ui_spec.md`](./declarative_ui_spec.md).

`docs/declarative_ui_spec.md` remains the umbrella contract for declarative UI documents, AST/runtime semantics, composition, and conditional behavior. This document describes how backend systems should satisfy that contract, with Go as the reference implementation target.

The declarative UI contract should remain language-agnostic. Backend implementation details may vary, but the transport shape and semantics exposed to the frontend should be stable and predictable.

## Purpose

This document prescribes how backend systems should support declarative UI by defining:

- query contracts
- mutation contracts
- data binding expectations
- transformation boundaries
- CRUD resource semantics
- validation and error envelopes
- pagination, filter, and sort conventions
- capability and context propagation

## Relationship To Other Docs

- [`docs/declarative_ui_spec.md`](./declarative_ui_spec.md)
  The umbrella declarative UI contract.
- [`docs/roadmap-declarative_ui_spec.md`](./roadmap-declarative_ui_spec.md)
  Migration roadmap and execution sequencing.
- [`docs/autoform.md`](./autoform.md)
  AutoForm as a specialization of the umbrella declarative system.

This document should be read as the backend-facing companion to the umbrella declarative UI direction.

## Scope

This document covers:

- resource-oriented query and mutation contracts
- server payload shapes consumed by declarative UI
- request parameter binding
- response mapping and transformation boundaries
- CRUD semantics
- validation and error contracts
- pagination, filter, and sort semantics
- auth, user, tenant, and locale context

This document does not cover:

- low-level frontend component rendering
- CSS/layout implementation
- framework-specific React composition details

## Design Principles

### 1. The declarative contract is frontend-owned but backend-supported

The frontend runtime, especially `packages/core`, owns declarative semantics such as conditions, AST/runtime interpretation, refs, and document normalization. The backend should provide data and action contracts that fit that runtime cleanly.

### 2. The backend should return declarative-friendly payloads

Backend payloads should be shaped to minimize frontend-specific glue code. The goal is not to force the browser to reconstruct a domain contract from ad hoc endpoints.

### 3. Data semantics should be explicit

Filtering, sorting, pagination, mutation result handling, and error envelopes should be explicit in the contract, not inferred from incidental endpoint behavior.

### 4. The spec should remain language-agnostic

Go is the implementation target, not the abstract contract. The backend contract should be implementable in Go without making the declarative spec itself Go-specific.

### 5. Transformation boundaries should be clear

Business/data normalization belongs on the backend or in declarative mapping rules. Pure presentation formatting belongs in the UI layer.

## Core Backend Concepts

The backend contract should support these conceptual primitives:

- `resource`
  A stable domain object or collection, such as `requests`, `users`, or `projects`.
- `query`
  A read operation that returns collection, record, aggregate, or status data.
- `mutation`
  A write operation, including create, update, patch, delete, or custom actions.
- `binding`
  A rule that connects route state, form state, session state, or selection state to backend parameters.
- `transform`
  A declarative mapping, projection, or reduction from raw backend payload to a view model.
- `capability`
  Server-declared affordances such as editable, deletable, exportable, or action availability.

## Query Contract

A declarative query should be able to specify:

- query identity
- resource or endpoint target
- parameter inputs
- filter, sort, and pagination semantics
- expected response envelope
- caching identity and invalidation dependencies

Recommended query shape:

```json
{
  "query": {
    "id": "requests.list",
    "resource": "requests",
    "params": {
      "projectId": { "$bind": "route.params.projectId" },
      "filters": { "$bind": "state.filters" },
      "sort": { "$bind": "state.sort" },
      "page": { "$bind": "state.page" }
    }
  }
}
```

### Query Response Envelope

Collection queries should return a predictable envelope such as:

```json
{
  "items": [],
  "pageInfo": {
    "cursor": null,
    "hasNextPage": false,
    "totalCount": 0
  },
  "capabilities": {},
  "meta": {}
}
```

Record queries should return:

```json
{
  "item": {},
  "capabilities": {},
  "meta": {}
}
```

## Mutation Contract

A declarative mutation should be able to specify:

- operation type
- target resource
- payload bindings
- success and error expectations
- invalidation behavior
- post-mutation refresh behavior

Recommended mutation shape:

```json
{
  "mutation": {
    "id": "requests.update",
    "resource": "requests",
    "operation": "update",
    "params": {
      "id": { "$bind": "selection.requestId" }
    },
    "body": { "$bind": "form.values" },
    "onSuccess": {
      "invalidate": ["requests.list", "requests.detail"],
      "refresh": ["requests.detail"]
    }
  }
}
```

Supported operations should include:

- `create`
- `update`
- `patch`
- `delete`
- `action`

`action` is for explicit non-CRUD operations such as `approve`, `retry`, `archive`, or `publish`.

## CRUD Resource Semantics

The backend contract should support stable resource patterns:

- `list`
- `get`
- `create`
- `update`
- `patch`
- `delete`
- `actions`

The declarative layer should not need to guess whether a write is partial or full. The mutation contract should say so explicitly.

## Binding Semantics

Backend parameters may be bound from:

- route params
- route search/query state
- form state
- selection state
- previously fetched query data
- session/auth context
- environment or feature flags

Examples:

- `route.params.projectId`
- `route.search.status`
- `form.values`
- `selection.row.id`
- `query.requests.item.ownerId`
- `session.user.id`

Bindings should be declarative and resolve through shared runtime semantics in `packages/core`.

## Transform, Mapping, and Reduction

Declarative UI also needs a way to describe how raw backend data becomes view data.

This includes:

- projection
- renaming
- nested selection
- fallback/defaulting
- simple derivation
- reduction or aggregation for summaries

Examples:

- map `item.assignee.name` to `assigneeLabel`
- reduce `items` into status counts
- select `items` from a larger response envelope
- flatten nested backend structures into table rows

### Boundary Rule

Prefer this split:

- backend:
  domain normalization, validation, permission filtering, resource semantics
- declarative transform layer:
  view-model selection, lightweight mapping, reductions needed by the page spec
- UI layer:
  presentation-only formatting such as labels, colors, and display widgets

## Validation and Error Envelope

Mutation and action responses should return structured errors.

Recommended envelope:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "One or more fields are invalid.",
    "fieldErrors": {
      "title": ["Title is required."]
    },
    "retryable": false
  }
}
```

The contract should distinguish:

- field-level validation errors
- form/global errors
- authorization failures
- not-found failures
- retryable/transient failures

This is required for declarative forms and action states to work consistently across pages.

## Pagination, Filtering, and Sorting

The backend contract should define stable conventions for:

- offset or cursor pagination
- total count semantics
- filter descriptors
- sort descriptors
- optional faceting/aggregation support

Suggested sort shape:

```json
[
  { "id": "createdAt", "direction": "desc" }
]
```

Suggested filter shape:

```json
[
  { "id": "status", "operator": "in", "value": ["draft", "review"] },
  { "id": "createdAt", "operator": "on", "value": "2026-04-07" }
]
```

These should be explicit backend-supported contracts, not frontend-only conventions.

## Capability and Context Propagation

The backend should be able to return capability metadata such as:

- `canEdit`
- `canDelete`
- `canApprove`
- `canRetry`
- `availableActions`

The backend contract should also support contextual inputs such as:

- authenticated user
- tenant / organization
- locale
- timezone
- feature flags

This is important for declarative visibility, action enablement, and conditional behavior.

## Go Reference Implementation Notes

Go is the reference implementation target for the backend, but not the abstract contract.

A Go implementation should typically provide:

- explicit DTOs for query and mutation envelopes
- request/response validation at handler boundaries
- middleware for auth, tenant, locale, and error shaping
- stable JSON encoding conventions
- explicit pagination/filter/sort structs
- action handlers that return capability-aware responses

Recommended Go concerns:

- keep transport DTOs separate from persistence models
- centralize error envelope generation
- centralize filter/sort parsing
- prefer explicit resource handlers over loosely typed generic endpoints
- ensure JSON payloads stay stable for declarative consumers

## Relationship To `packages/core`

`packages/core` should own:

- declarative AST/runtime contracts
- shared condition semantics
- refs and normalization
- binding and transform semantics
- AJV-backed evaluation/validation semantics where relevant

The backend should not reintroduce incompatible condition or binding semantics. It should provide data and action contracts that fit the runtime owned by `packages/core`.

## Examples To Add

This document should eventually include worked examples for:

- query-backed table page
- declarative dashboard with aggregate reductions
- CRUD form submission and validation handling
- action-driven status page
- detail page with capability-gated actions

## Open Questions

- how much transform/reduction should be allowed in declarative specs versus backend-owned view models
- whether action capabilities should be attached per-record, per-collection, or both
- how realtime/streaming updates fit the query contract
- how file upload/download flows should be represented declaratively
- whether mutation success handlers should allow declarative optimistic updates

## Immediate Next Step

Update [`docs/declarative_ui_spec.md`](./declarative_ui_spec.md) so the umbrella contract explicitly includes:

- queries
- mutations
- bindings
- transforms
- CRUD semantics

This backend contract should then stay aligned with that umbrella spec rather than becoming a parallel design document.
