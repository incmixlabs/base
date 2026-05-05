# Permissions

## Direction

We should model permissions as a Zanzibar-like relationship system with a JSON policy format we own.

This means:

- Keep the core relationship graph simple
- Keep policy semantics separate from relationship tuples
- Allow backend and frontend evaluators to share the same source-of-truth policy format
- Avoid coupling the long-term architecture to a JS-only authorization library

This is closer to:

- Zanzibar relationship tuples
- Oso/Casbin-style policy thinking
- A future shared authorization engine alongside `../dashboard`

It is not:

- a pure flat RBAC matrix
- a frontend-only ability layer
- workflow orchestration

`XState` is still useful for workflow state machines, but not as the authorization model itself.

## Near-Term Runtime

Near term, we can map this policy model to CASL in the frontend.

Important constraint:

- CASL is an adapter, not the architecture
- our JSON policy format remains the source of truth
- backend and future dashboard tooling should not depend on CASL internals

So the shape should be:

`JSON policy -> normalized auth graph -> CASL ability`

## Documents

- [Model](./model.md)
- [Examples](./examples.md)

## Recommendation

Use:

- Zanzibar-like tuples for relationship facts
- JSON policy/schema for relation and permission semantics
- a custom evaluator layer we own
- CASL as a temporary frontend execution target

Do not:

- embed fields/filters directly into tuples
- use a pure flat RBAC matrix as the long-term model
- use `XState` as the authorization engine

Use `XState` only for workflow/state transitions, where needed.
