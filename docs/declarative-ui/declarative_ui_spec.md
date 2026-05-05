# Declarative UI Grammar Specification (v0.2)

**Generated:** 2026-04-02  
**Status:** Draft

---

## 1. Purpose

Define a unified JSON grammar for **declarative UI rendering** using a renderer
adapter (e.g., Webix adapter).

This spec supports:

- Layouts, forms, templates, reusable components
- `$ref` composition
- Backend-driven UI delivery
- Declarative data queries and mutations
- Data binding, mapping, and reduction
- **XState-driven UI behavior**
- **CASL-driven permission filtering**
- Standardized action and backend interaction contracts

---

## 2. Core Principles

- JSON represents a UI Abstract Syntax Tree (AST)
- Renderer is implementation-specific (e.g., Webix adapter)
- `$ref` enables composition and reuse
- `props` is the primary configuration channel
- `meta` is reserved for cross-cutting concerns (actions, permissions, queries)
- Declarative UI includes both view structure and data interaction semantics
- Query, mutation, binding, and transform contracts are part of the umbrella grammar, not a parallel system
- Grammar is implementation-agnostic
- reusable components should ultimately resolve through a persisted component registry, not only local runtime maps

---

## 3. Node Definition

Every node MUST conform to one of the following shapes:

```json
{
  "type": "string",
  "props": {},
  "children": [],
  "slots": {},
  "meta": {}
}
```

```json
{
  "$ref": "#/components/SomeComponent",
  "props": {},
  "meta": {}
}
```

### Rules

- Authoring intent: Node SHOULD have either `type` OR `$ref`
- Authoring intent: Node SHOULD NOT have both
- Strict XOR validation is a required implementation constraint for conforming runtimes, but may not yet be enforced by every v0.2 parser
- All fields optional except `type`/`$ref`
- Renderer MUST ignore unknown fields

---

## 4. Root Document Structure

```json
{
  "schemaVersion": "0.2",
  "root": { "$ref": "#/components/Page" },
  "components": {}
}
```

### 4.1 Authoring Document Contracts

The declarative system now distinguishes between authoring documents and normalized runtime documents.

Authoring contracts:

- `StandalonePageDocument`
  - represents a standalone persisted page document
  - must include:
    - `kind: "page"`
    - `id: string`
    - `root`
  - may include:
    - `title`
    - `queries`
    - `actions`
    - `runtime`
    - `components`
    - `meta`

- `AppPageDocument`
  - represents a page entry nested inside an `AppDocument`
  - may omit `id` because the enclosing app page key can supply identity
  - may omit `kind` because it is still authoring data, not the normalized runtime form

- `AppDocument`
  - represents an app-level authoring document
  - must include:
    - `kind: "app"`
    - `routes`
    - `pages`
  - app routes must reference pages via `#/pages/...`

This distinction matters because a standalone page document and an app-owned page entry are not the same contract, even if they share most fields.

### 4.2 Normalized Runtime Contracts

Normalization produces explicit runtime shapes rather than reusing authoring documents directly.

Runtime contracts:

- `NormalizedDeclarativeDocument`
  - normalized `root`
  - normalized `components`

- `NormalizedPageDocument`
  - always has:
    - `kind: "page"`
    - `id`
    - normalized `root`
  - runtime metadata such as compiled load query descriptors and node action descriptors is attached here

- `NormalizedAppDocument`
  - always has:
    - `kind: "app"`
    - normalized `pages`
    - normalized `routes`
  - routes expose `pageId`, not the authoring-time `page` ref field

Normalization rules:

- app routes are validated against `#/pages/...` refs
- app page entries are upgraded into standalone normalized pages during normalization
- app-level shared components may be merged into page-level components during normalization
- these are normalization behaviors, not authoring contract requirements

---

## 5. `$ref` Resolution

- Uses JSON Pointer syntax only
- Local references only (`#/components/...`)
- No external refs (v0.2)

### Merge Rule

```js
resolved.props = {
  ...base.props,
  ...instance.props
}

resolved.meta = {
  ...base.meta,
  ...instance.meta
}
```

### Composition

Instance values override base values.

---

## 6. Core Node Types

### layout

Container for ordered children.

Props:
- `direction`: `"vertical" | "horizontal"`
- `gap`: number (optional)

### form

Container for fields.

Props:
- `model`: string (binding root, e.g. `"invoice"`)
- `submitAction`: ActionSpec (optional shortcut)

### field

Input element.

Props:
- `name`: string
- `label`: string
- `bind`: string (optional binding path)
- `required`: boolean (optional)

### template

HTML/template rendering.

Props:
- `template`: string
- `data`: object

### component

Custom/extension node.

Props:
- `component`: string (renderer-specific identifier)
- any other renderer-specific props

### 6.1 Component Registry Direction

The long-term model should not assume that component registration only happens in code.

The declarative system should support a persisted component registry where:

- components have stable ids
- app/page documents reference those ids
- registrations can be created and edited outside the codebase
- the initial editor may be raw JSON rather than a dedicated UI
- entries support hierarchy and search/discovery metadata
- scope/visibility is explicit, for example:
  - `public`
  - `organization`
  - `workspace`
  - `private`

At runtime, local renderer maps may still exist, but they should be treated as one resolution mechanism behind the registry contract rather than the primary architecture.

The initial registry should be constrained to known renderer-backed components that fit the declarative contract cleanly.

That means:

- JSON should describe component contracts and instances
- runtime should map those definitions to known renderers
- the first registry cohort should be mostly non-interactive or minimally interactive
- arbitrary React component serialization is out of scope

Recommended initial registry cohort:

- text
- heading
- badge
- callout
- card/container shells
- empty states
- stat/value summaries
- simple icon + label compositions

Registry entries should also be able to carry catalog/discovery metadata such as:

- hierarchical grouping/category
- tags
- search keywords
- title/summary/description
- ownership and sharing metadata

This keeps the registry usable as both a runtime resolution layer and an editor/discovery catalog.

The concrete PR 4 registry shape and the separation between runtime binding, discovery metadata, ownership scope, and persistence semantics are documented in [`component_registry_contract.md`](./component_registry_contract.md).
The storage-facing worker/repository seam for the next phase is documented in [`worker_repository_boundary.md`](./worker_repository_boundary.md).

Search/indexing implementation is intentionally separate from the contract.
A dependency such as Orama is a valid option for catalog search and local discovery, but the registry schema should not be shaped around any one search library.

---

## 7. Composition

### Children (ordered)

```json
{
  "type": "layout",
  "children": [ ... ]
}
```

### Slots (named)

```json
{
  "type": "Card",
  "slots": {
    "header": { ... },
    "body": { ... }
  }
}
```

Slots are optional. Renderers may ignore unsupported slots.

---

## 8. Templates

Inline:

```json
{
  "type": "template",
  "props": {
    "template": "<h1>#title#</h1>",
    "data": { "title": "Hello" }
  }
}
```

---

## 9. Backend Interaction Contracts (A2UI-Style)

v0.2 introduces **first-class backend interaction metadata**, inspired by A2UI
patterns.

This includes:

- read/query semantics
- write/mutation semantics
- parameter binding
- response mapping
- CRUD operations
- backend capability metadata

### 9.1 QuerySpec

A QuerySpec declares how data is fetched for a UI node or page.

```json
{
  "type": "rest",
  "method": "GET",
  "url": "/api/invoices/:id",
  "params": { "id": "$route.params.id" }
}
```

Required fields:
- `type`: `"rest" | "graphql"`
- `method`: `"GET" | "POST" | "PUT" | "PATCH" | "DELETE"`
- `url`: string

Optional:
- `params`: object
- `headers`: object
- `mapResponse`: string (future extension)

### 9.1.1 Contract Direction

QuerySpec is not limited to raw fetch configuration. It is the beginning of a
declarative data contract. Future iterations should make query identity,
parameter binding, pagination, filtering, sorting, and response mapping
first-class rather than treating them as adapter-specific details.

### 9.2 ActionSpec

An ActionSpec describes an intent-driven operation.

```json
{
  "type": "apiCall",
  "method": "POST",
  "url": "/api/invoices/:id/approve",
  "confirm": {
    "title": "Approve Invoice",
    "message": "Are you sure?"
  }
}
```

Supported action types (v0.2):
- `apiCall`
- `navigate`
- `openModal`
- `closeModal`
- `emitEvent`

Current runtime status:

- `emitEvent` is wired directly to the declarative actor
- non-`emitEvent` actions are routed through the shared page-runtime action service seam
- concrete adapters for navigation, modal control, and remote effects remain implementation work above this grammar

Future declarative mutation contracts should treat CRUD semantics explicitly,
rather than modeling all writes as generic `apiCall`.

ActionSpec fields:
- `type`: string (required)
- `method`: HTTP method (for apiCall)
- `url`: string (for apiCall)
- `to`: string (for navigate)
- `event`: string (for emitEvent)
- `confirm`: ConfirmSpec (optional)
- `successEvent`: string (optional)
- `failureEvent`: string (optional)

### 9.3 ConfirmSpec

```json
{
  "title": "Delete Record",
  "message": "This action cannot be undone."
}
```

---

## 10. Permissions Contract (CASL Integration)

v0.2 supports embedding permission metadata per node.

### 10.1 PermissionSpec

```json
{
  "action": "update",
  "subject": "Invoice"
}
```

Optional:
- `field`: string (field-level permissions)
- `conditions`: object (optional mirror of CASL conditions)

### 10.2 Usage

```json
{
  "type": "component",
  "props": { "component": "Button", "label": "Edit" },
  "meta": {
    "permission": { "action": "update", "subject": "Invoice" }
  }
}
```

### 10.3 Evaluation Rules

- UI runtime MUST evaluate permissions before rendering.
- If permission fails:
  - node may be removed OR disabled depending on policy
- Backend MUST still enforce authorization regardless of UI hiding.

---

## 11. XState Integration Contract

This spec does NOT define full state machines in JSON.
Instead, it defines **hooks** and metadata that allow an XState runtime to
interpret and orchestrate UI behavior.

### 11.1 Node Events

Nodes MAY declare events.

```json
{
  "type": "component",
  "props": { "component": "Button", "label": "Save" },
  "meta": {
    "on": {
      "click": { "type": "emitEvent", "event": "FORM.SUBMIT" }
    }
  }
}
```

### 11.2 State Binding (Optional)

Nodes MAY declare conditional behavior driven by state.

```json
{
  "type": "component",
  "props": { "component": "Button", "label": "Save" },
  "meta": {
    "enabledWhen": "state.matches('ready')",
    "visibleWhen": "state.context.dirty === true"
  }
}
```

Current runtime support is intentionally narrow.

Supported expression forms currently include:

- `state.matches('ready')`
- `state.context.someFlag === true`
- `state.context.someFlag !== false`
- `!state.context.readOnly`
- boolean composition with `&&` and `||`

Not currently supported as part of the declarative expression grammar:

- chained comparisons such as `a === b === c`
- arbitrary function calls beyond `state.matches(...)`
- general JavaScript evaluation

Expression evaluation remains a runtime concern, but authoring should stay within the supported grammar above.

### 11.3 Custom Renderer Runtime Props

When a declarative runtime resolves a node through a registered custom renderer,
that renderer should receive the active actor snapshot in addition to the actor
reference itself.

This allows renderer implementations to:

- read derived runtime context without reimplementing event wiring
- render stateful values such as counts, async status, or transient UI state
- stay aligned with the same snapshot used for `visibleWhen` and `enabledWhen`

The snapshot is runtime data, not authoring grammar. It should be treated as a
consumption detail of the declarative renderer contract rather than serialized
into declarative JSON.

---

## 12. Data Binding

### 12.1 Binding Syntax

Fields and templates MAY declare binding paths.

```json
{
  "type": "field",
  "props": {
    "name": "amount",
    "label": "Amount",
    "bind": "invoice.amount"
  }
}
```

Rules:
- `bind` is a dot-path reference into runtime context
- binding resolution is handled by runtime (XState context)

### 12.2 Broader Binding Scope

Binding is not limited to field values. Declarative UI also needs binding for:

- query params
- mutation params and bodies
- route params and search state
- selection state
- session/auth/tenant context
- derived view-model inputs

This broader binding contract should be shared across forms, layouts, pages,
queries, and actions.

### 12.3 Transform and Mapping

Declarative UI also includes a transformation layer between raw backend payloads
and view models.

This may include:

- projection
- renaming
- nested selection
- fallback/defaulting
- lightweight derived fields
- reduction for summaries, counts, and dashboard aggregates

The umbrella contract should support these semantics explicitly. Presentation
formatting remains a renderer concern, but data mapping and reduction belong to
the declarative runtime contract.

---

## 13. Normalization

All `$ref` MUST be resolved before rendering.

Pseudo:

```js
function normalize(node, root, seen = new Set()) {
  let current = node;

  if (current.$ref) {
    if (seen.has(current.$ref)) throw new Error("Cyclic $ref detected");
    seen.add(current.$ref);

    const base = normalize(resolveRef(current.$ref, root), root, new Set(seen));
    const { $ref: _ignored, ...inline } = current;

    current = {
      ...base,
      ...inline,
      props: { ...base.props, ...inline.props },
      meta: { ...base.meta, ...inline.meta }
    };
  }

  if (Array.isArray(current.children)) {
    current.children = current.children.map((child) => normalize(child, root, new Set(seen)));
  }

  if (current.slots && typeof current.slots === "object") {
    current.slots = Object.fromEntries(
      Object.entries(current.slots).map(([key, value]) => [key, normalize(value, root, new Set(seen))])
    );
  }

  return current;
}
```

---

## 14. Renderer Contract

Renderer maps normalized nodes to UI config.

Example:

```js
switch(node.type) {
  case "layout": return renderLayout(node);
  case "form": return renderForm(node);
  case "field": return renderField(node);
  case "template": return renderTemplate(node);
  default: return renderCustom(node);
}
```

Renderer MUST ignore unknown meta keys.

---

## 15. Backend Delivery Model

A recommended backend delivery model includes:

### 15.1 UI Schema Endpoint

`GET /ui/pages/:pageKey`

Returns:
- schema document
- components
- optional query definitions

### 15.2 Abilities Endpoint

`GET /auth/abilities`

Returns CASL rules:

```json
{
  "rules": [
    { "action": "read", "subject": "Invoice" },
    { "action": "update", "subject": "Invoice", "conditions": { "status": "draft" } }
  ]
}
```

### 15.3 Domain APIs

Normal REST/GraphQL endpoints for data mutation and retrieval.

### 15.4 Backend Contract Companion

This document defines the umbrella declarative UI contract. The companion
backend-oriented implementation guidance lives in:

- [`docs/declarative_backend_contract.md`](./declarative_backend_contract.md)

That companion document describes how backend systems, with Go as the reference
implementation target, should satisfy the declarative query, mutation, binding,
transform, and CRUD requirements described here.

---

## 16. Example (A2UI-Style Page)

```json
{
  "schemaVersion": "0.2",
  "root": { "$ref": "#/components/Page" },
  "components": {
    "Page": {
      "type": "layout",
      "props": { "direction": "vertical" },
      "children": [
        { "$ref": "#/components/Header" },
        { "$ref": "#/components/InvoiceForm" },
        { "$ref": "#/components/Actions" }
      ]
    },
    "Header": {
      "type": "template",
      "props": {
        "template": "<h1>Invoice #id#</h1>",
        "data": { "id": "123" }
      }
    },
    "InvoiceForm": {
      "type": "form",
      "props": { "model": "invoice" },
      "children": [
        {
          "type": "field",
          "props": { "name": "amount", "label": "Amount", "bind": "invoice.amount" }
        },
        {
          "type": "field",
          "props": { "name": "status", "label": "Status", "bind": "invoice.status" }
        }
      ]
    },
    "Actions": {
      "type": "layout",
      "props": { "direction": "horizontal" },
      "children": [
        {
          "type": "component",
          "props": { "component": "Button", "label": "Approve" },
          "meta": {
            "permission": { "action": "approve", "subject": "Invoice" },
            "action": {
              "type": "apiCall",
              "method": "POST",
              "url": "/api/invoices/:id/approve",
              "confirm": { "title": "Approve", "message": "Approve invoice?" }
            }
          }
        }
      ]
    }
  }
}
```

---

## 17. Future Extensions (Out of Scope v0.2)

- Expression language standardization
- Async `$ref` loading
- ValidationSpec schema
- Component registry introspection
- GraphQL query mapping support
- Remote machine definitions (explicitly discouraged by default)

---

## 18. Summary

This grammar defines an extensible declarative UI system:

- AST-based
- Renderer-agnostic
- Composable via `$ref`
- **Backend-driven UI delivery**
- **A2UI-inspired action and permission metadata**
- **XState-friendly orchestration model**
- **CASL-compatible permission enforcement**
