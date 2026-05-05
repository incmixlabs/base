# Permissions Model

## Core Model

Canonical tuple:

```json
{
  "subject": "user:1",
  "relation": "viewer",
  "resource": "product:99"
}
```

Think of this as:

- `subject -> relation -> resource`

Where:

- `subject`: `user:*`, `group:*`, service account, team, etc.
- `relation`: `viewer`, `editor`, `owner`, `reviewer`, `finance`
- `resource`: `product:*`, `eco:*`, `part:*`, `catalog:*`, `project:*`

## Design Rule

Do not put field filters, row filters, or business conditions directly into the base tuple.

Bad:

```json
{
  "subject": "user:1",
  "relation": "viewer",
  "resource": "product:99",
  "fields": ["name", "price"],
  "filter": "price > 100"
}
```

That creates duplication, conflicting rules, and tuple explosion.

Instead, split the model into:

1. relationship tuples
2. resource schema and relation semantics
3. permission definitions
4. scoped filters or overrides when truly needed

## Recommended JSON Structure

```json
{
  "tuples": [
    { "subject": "user:1", "relation": "viewer", "resource": "product:99" },
    { "subject": "group:merch", "relation": "editor", "resource": "catalog:summer-2026" },
    { "subject": "user:9", "relation": "reviewer", "resource": "eco:42" }
  ],
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
    },
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
  "scopes": [
    {
      "subject": "user:1",
      "permission": "read",
      "resourceType": "product",
      "filter": {
        "price": { "gt": 100 }
      }
    }
  ]
}
```

## Field-Level Permissions

The important split is:

- relation tuples answer: who is related to what
- permissions answer: what that relation can do
- field mapping answers: what properties are exposed by a permission

Example:

```json
{
  "permissions": {
    "read": { "from": ["viewer"] },
    "read_cost": { "from": ["finance"] }
  },
  "fields": {
    "name": ["read"],
    "price": ["read"],
    "cog": ["read_cost"]
  }
}
```

So:

- `viewer` sees `name`, `price`
- `finance` sees `name`, `price`, `cog`
- `owner` can inherit both through implied relations

## Filters And Scopes

If we need scoped access like:

- users can only see products above a threshold
- users can only approve ECOs assigned to them
- users can only edit products in their category

put that in a separate scope/condition layer.

Example:

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

This avoids repeating field/filter logic on every tuple.

## Groups And Derived Access

Groups should be treated as subjects.

Example:

```json
{ "subject": "group:merch", "relation": "editor", "resource": "catalog:summer-2026" }
{ "subject": "user:1", "relation": "member", "resource": "group:merch" }
```

Then the evaluator expands:

- user membership
- implied relations
- inherited resource access

This is cleaner than attaching many direct tuples to every user.

## Parent / Inherited Resources

We will likely need parent-child inheritance:

- catalog -> product
- project -> eco
- product family -> part

That should be modeled explicitly in schema/evaluation, not duplicated manually in tuples.

Example direction:

```json
{
  "resourceType": "product",
  "inherits": [
    {
      "fromResourceType": "catalog",
      "via": "catalog_id"
    }
  ]
}
```

Then permission checks may consider:

- direct tuple on `product:99`
- inherited relation from parent `catalog:*`

## Conflict / Duplication Strategy

Main concern: duplication and conflicting rules.

To control that:

- base tuples contain only relationship facts
- permission semantics are defined once per resource type
- fields are mapped from permissions, not duplicated on tuples
- filters live in scoped rules, not tuples
- relation inheritance replaces repeated grants
- explicit deny should be rare

Recommended precedence:

1. explicit deny
2. scoped allow
3. inherited allow
4. direct allow
5. default deny

For v1, a simpler and safer rule is:

- prefer no explicit deny
- use additive relations
- default deny when no relation grants permission

This keeps evaluation easier and avoids surprising conflicts.

## Suggested Evaluator Responsibilities

The evaluator should answer questions like:

- `hasRelation(user, "editor", product:99)`
- `can(user, "update", product:99)`
- `canReadField(user, product:99, "cog")`
- `buildFilter(user, "read", "product")`

Evaluator inputs:

- tuples
- group membership
- schema definitions
- permission mappings
- scoped filters
- resource context
