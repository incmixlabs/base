# Dashboard Resource Persistence

Dashboard templates and composite widget resource records use a local repository boundary before backend sync is added.

The frontend contract is JSON-safe and intended to map directly to future Postgres `jsonb` columns:

- `dashboard-template`: stores layout template identity, visibility, status, mode, columns, breakpoints, layouts, items, metadata, and timestamps.
- `composite-widget`: stores composite identity, visibility, status, definition, props schema, data bindings, dependencies, metadata, and timestamps.

Product UI must use `initializeDashboardResourceRepository` from `@bwalkt/core` instead of importing TinyBase, OPFS, or persisters directly. Presspoint is the first runtime integration target. Storybook examples should remain fixture-only or explicitly `memory-local` so they do not create durable browser persistence.

The repository owns normalization for both record types:

- missing optional fields are normalized to backend-compatible defaults
- malformed required fields are rejected before persistence
- `schemaVersion`, `createdAt`, and `updatedAt` are maintained locally
- local records are stored as JSON-safe documents while queryable identity fields are kept in TinyBase cells

The backend baseline schema persists these resources in Postgres through:

- `dashboard_templates`
- `composite_widgets`

Both tables use text IDs, tenant and owner scoping, lifecycle columns, timestamps, queryable identity fields, and `jsonb` payload columns for versioned UI/runtime definitions.

## API Surface

The Go API exposes tenant-scoped persistence routes for both resource types. All routes require the current development auth headers, `X-Autoform-Tenant-Id` and `X-Autoform-Actor-Id`.

Dashboard templates:

- `GET /api/v1/dashboard-templates`
- `POST /api/v1/dashboard-templates`
- `GET /api/v1/dashboard-templates/{id}`
- `PATCH /api/v1/dashboard-templates/{id}`
- `POST /api/v1/dashboard-templates/{id}/archive`

Composite widgets:

- `GET /api/v1/composite-widgets`
- `POST /api/v1/composite-widgets`
- `GET /api/v1/composite-widgets/{id}`
- `PATCH /api/v1/composite-widgets/{id}`
- `POST /api/v1/composite-widgets/{id}/archive`

Collection routes support optional `ownerId`, `status`, and `visibility` query filters. Archive routes use lifecycle status updates instead of hard deletes.

## Visibility

The frontend repository uses `workspace` as the tenant-scoped visibility value:

- `private`: visible to the owner.
- `workspace`: visible within the tenant/workspace.
- `system`: reserved for shared or seeded system resources.

The database keeps the same values instead of introducing a separate `tenant` enum value. In backend terms, `workspace` means tenant-scoped.

## `dashboard_templates`

Purpose: reusable dashboard layout templates that can be applied to dashboard builders or used as presets.

Queryable columns:

- `id text primary key`
- `tenant_id text not null`
- `owner_id text not null`
- `name text not null`
- `description text`
- `slug text`
- `visibility text not null default 'workspace'`
- `status text not null default 'active'`
- `schema_version integer not null default 1`
- `mode text not null default 'grid'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

JSONB columns:

- `columns jsonb not null default '{}'::jsonb`
  Dashboard column counts by breakpoint. This mirrors the dashboard layout configuration used by `ThemeProvider`/dashboard tooling.
- `breakpoints jsonb not null default '{}'::jsonb`
  Dashboard breakpoint pixel values by breakpoint key.
- `layouts jsonb not null`
  Responsive layout item arrays keyed by breakpoint, matching `DashboardResponsiveLayoutItems`.
- `items jsonb not null default '[]'::jsonb`
  Template slots and widget references. This stays flexible while widget composition is still evolving.
- `metadata jsonb not null default '{}'::jsonb`
  App-owned metadata such as tags, preview hints, source, migration data, or authoring notes.

Shape constraints:

- `columns`, `breakpoints`, `layouts`, and `metadata` must be JSON objects.
- `items` must be a JSON array.
- `visibility` is one of `private`, `workspace`, or `system`.
- `status` is one of `active` or `archived`.
- `mode` is one of `grid` or `masonry`.

Indexes:

- tenant listing by `(tenant_id, created_at desc, id asc)`
- owner listing by `(tenant_id, owner_id, created_at desc, id asc)`
- optional unique tenant slug by `(tenant_id, slug) where slug is not null`
- tenant-scoped FK support by unique `(id, tenant_id)`

Example `layouts` payload:

```json
{
  "initial": [{ "id": "pipeline", "x": 0, "y": 0, "w": 4, "h": 3 }],
  "md": [{ "id": "pipeline", "x": 0, "y": 0, "w": 6, "h": 3 }],
  "xl": [{ "id": "pipeline", "x": 0, "y": 0, "w": 4, "h": 3 }]
}
```

Example `items` payload:

```json
[
  {
    "id": "pipeline",
    "componentName": "PipelineSummary",
    "title": "Pipeline",
    "widgetId": "composite.pipeline-summary"
  }
]
```

## `composite_widgets`

Purpose: reusable widget definitions that dashboard templates and pages can reference.

Queryable columns:

- `id text primary key`
- `tenant_id text not null`
- `owner_id text not null`
- `name text not null`
- `description text`
- `slug text`
- `kind text not null default 'composite'`
- `visibility text not null default 'private'`
- `status text not null default 'draft'`
- `schema_version integer not null default 1`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

JSONB columns:

- `definition jsonb not null`
  Renderer/runtime contract for the composite widget. This should stay structured JSON, not executable JavaScript.
- `props_schema jsonb not null default '{}'::jsonb`
  JSON Schema for configurable widget props.
- `data_bindings jsonb not null default '[]'::jsonb`
  Declarative bindings for default data paths, queries, or runtime inputs. The frontend contract currently treats this as an array.
- `dependencies jsonb not null default '[]'::jsonb`
  Referenced components, composites, renderer packages, or other resources needed for validation and future migration tooling.
- `metadata jsonb not null default '{}'::jsonb`
  App-owned metadata such as catalog grouping, preview hints, tags, authoring source, or migration state.

Shape constraints:

- `definition`, `props_schema`, and `metadata` must be JSON objects.
- `data_bindings` and `dependencies` must be JSON arrays.
- `visibility` is one of `private`, `workspace`, or `system`.
- `status` is one of `draft`, `published`, or `archived`.

Indexes:

- tenant listing by `(tenant_id, created_at desc, id asc)`
- owner listing by `(tenant_id, owner_id, created_at desc, id asc)`
- optional unique tenant slug by `(tenant_id, slug) where slug is not null`
- tenant-scoped FK support by unique `(id, tenant_id)`

Example `definition` payload:

```json
{
  "name": "PipelineSummary",
  "renderer": "composite",
  "version": 1,
  "component": {
    "type": "Composite",
    "name": "PipelineSummary"
  }
}
```

Example `data_bindings` payload:

```json
[
  {
    "id": "pipeline",
    "query": "sales.pipeline.summary",
    "bindTo": "data.pipeline"
  }
]
```

Presspoint initializes this repository with the same persistence mode policy as declarative app authoring:

- `local-first`: use OPFS through TinyBase when available, falling back to memory when OPFS is unavailable.
- `memory-local`: keep records in memory only.
- `remote-only`: do not initialize TinyBase or OPFS; dashboard resource persistence should use the backend API endpoints.

When `local-first` falls back to memory, the repository returns an initialization notice with `kind: "memory-fallback"`. Presspoint surfaces this as volatile storage so the editor does not imply records will survive reload.

## Composite Convergence

Authored Presspoint composites remain persisted as `component-registry-entry` documents through the existing declarative app sync repository. That record is the current authoring source of truth for the Components page.

The `composite-widget` shape is the dashboard/backend resource projection of that authored composite, not a second Component Catalog store. `@bwalkt/core` exposes projection helpers that map a `component-registry-entry` into a `composite-widget` input or record while preserving:

- the registry entry id as the stable resource id
- private user ownership by default
- `meta.templateKind: "composite"`
- `meta.sourceKind: "local"`
- renderer and composite-reference dependencies

Issue #962 owns the next convergence step: syncing `component-registry-entry` documents through the local-first app sync path and using the projection seam when dashboard resources need backend-compatible `composite-widget` records.
