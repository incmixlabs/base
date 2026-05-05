# Permissions Examples

## How To Read The Policy

Given:

```json
{
  "tuples": [
    { "subject": "user:1", "relation": "viewer", "resource": "product:99" },
    { "subject": "group:merch", "relation": "editor", "resource": "catalog:summer-2026" },
    { "subject": "user:9", "relation": "reviewer", "resource": "eco:42" }
  ]
}
```

Read this as:

- `user:1` can view `product:99`
- `group:merch` can edit `catalog:summer-2026`
- `user:9` can review `eco:42`

If `editor` implies `viewer`, then an editor can also read.

If `owner` implies `editor` and `finance`, then an owner can inherit both edit and cost visibility.

## Product Example

```json
{
  "schemas": {
    "product": {
      "relations": {
        "viewer": {},
        "editor": { "implies": ["viewer"] },
        "finance": { "implies": ["viewer"] },
        "owner": { "implies": ["editor", "finance"] }
      },
      "permissions": {
        "read": { "from": ["viewer"] },
        "update": { "from": ["editor"] },
        "delete": { "from": ["owner"] },
        "read_cost": { "from": ["finance"] }
      },
      "fields": {
        "name": ["read"],
        "price": ["read"],
        "description": ["read", "update"],
        "cog": ["read_cost"]
      }
    }
  }
}
```

Implications:

- `viewer` can see `name`, `price`
- `editor` can see `name`, `price`, `description` and update `description`
- `finance` can see `cog`
- `owner` inherits editor + finance access

## Scoped Filter Example

```json
{
  "subject": "user:7",
  "permission": "update",
  "resourceType": "product",
  "filter": {
    "category_id": { "in": ["cat-a", "cat-b"] }
  }
}
```

This means:

- `user:7` can update products only in categories `cat-a` and `cat-b`

This filter is attached to a scoped permission rule, not to every tuple.

## ECO Example

```json
{
  "schemas": {
    "eco": {
      "relations": {
        "viewer": {},
        "reviewer": { "implies": ["viewer"] },
        "owner": { "implies": ["viewer"] }
      },
      "permissions": {
        "read": { "from": ["viewer"] },
        "approve": { "from": ["reviewer"] },
        "submit": { "from": ["owner"] }
      }
    }
  },
  "tuples": [
    { "subject": "user:9", "relation": "reviewer", "resource": "eco:42" }
  ]
}
```

Implications:

- `user:9` can read `eco:42`
- `user:9` can approve `eco:42`
- `user:9` cannot submit `eco:42` unless they also have `owner`

## Group Expansion Example

```json
{
  "tuples": [
    { "subject": "group:merch", "relation": "editor", "resource": "catalog:summer-2026" },
    { "subject": "user:1", "relation": "member", "resource": "group:merch" }
  ]
}
```

Evaluator expansion:

- `user:1` is a member of `group:merch`
- `group:merch` is `editor` on the catalog
- therefore `user:1` gets editor-derived access to resources inherited from that catalog

## CASL Mapping

Near term, we can map normalized permissions to CASL.

Example outcome:

```ts
can("read", "Product")
can("update", "Product", { categoryId: { $in: ["cat-a", "cat-b"] } })
can("read", "Product", ["cog"])
cannot("delete", "Product", { status: "published" })
```

Important:

- CASL is the execution target
- the JSON policy remains the source of truth
- the JSON should not collapse into serialized CASL internals

## Why This Shape

This gives us:

- a declarative JSON source of truth
- Zanzibar-like relationship modeling
- room for field-level and filtered access
- backend portability
- future compatibility with a shared policy editor/admin surface in `../dashboard`

It also avoids prematurely coupling the architecture to:

- CASL as the source of truth
- stale pure-RBAC libraries
- workflow state machines as authorization logic
