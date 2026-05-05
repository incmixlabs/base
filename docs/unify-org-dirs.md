# Unified Organization Directory Plan

This note captures the intended repo shape for consolidating public npm packages, private product code, dashboard pieces, and paid rowsncolumns integration without contaminating the public package graph.

## Decision

Keep the monorepo organized by runtime boundary:

- `packages/*` for reusable libraries and adapters.
- `apps/*` for user-facing apps, docs, Storybook, verifier, and desktop shells.
- `services/*` for deployable backend services.
- `crates/*` only if Rust work such as piptable is brought into the same source and release system.

Whether this repo can contain private apps/services depends on repository visibility:

- If this repo is public or intended to become public, keep private product services, paid rowsncolumns code, verifier, Tauri interceptor, and auth traffic code outside it.
- If this repo remains private while publishing selected public npm packages, a unified monorepo is acceptable. Publishing must be controlled by package metadata and release filters, not by repository layout alone.

Current direction: the base Autoform repo is a public source repo. That means it should not contain private source at all, even if an npm package would be marked `private: true`.

## Recommended Repos

They do not all need to live in one repo. A single repo is workable only if it stays private and all code shares the same access model. The safer long-term split is by visibility, licensing, and operational ownership.

There are two different meanings of "public" to keep separate:

- Public npm package: the package is published for external consumers.
- Public source repo: the source code is visible to everyone.

If rowsncolumns, Presspoint, or piptable source must be private, they cannot live in the public Autoform source repo.

Recommended split:

```text
incmix-autoform/
  Public source package repo.
  Owns public packages such as ui, core, react/autoform, ajv, public docs,
  public examples, and public Storybook.

incmix-product/
  Private platform/product monorepo.
  Owns verifier, auth dashboard, Tauri desktop interceptor, backend services,
  auth services, workbook services, private Storybook, product-specific examples,
  and private platform packages.

incmix-presspoint/
  Optional private app repo if Presspoint has its own release, deployment,
  permissions, or product ownership.
  Owns the Presspoint app and Presspoint-specific app code.

piptable/
  Private polyglot engine workspace.
  Owns Rust crates, CLI, server, Python bindings, wasm build, private piptable
  app, and rowsncolumns integration unless those surfaces need independent
  repositories.
```

The practical default should be:

- Keep public npm source and publish automation in `incmix-autoform`.
- Keep auth, verifier, desktop interceptor, dashboard traffic, backend services, auth services, and shared private platform packages in `incmix-product`.
- Keep Presspoint as an app, not a package. Use `apps/presspoint` in whichever private repo owns it.
- Keep rowsncolumns out of the public base repo. If it is mainly a piptable grid/editor surface, roll it into the private piptable app instead of creating a separate rowsncolumns app.
- Keep shared table contracts in public `packages/table-core`; piptable and the private rowsncolumns-backed app should depend on that contract instead of depending on all of `@incmix/ui`.
- Keep piptable private and separate until there is a concrete reason to version, test, and release it with another private product workspace.

Use one private monorepo only if cross-package refactors are more valuable than access separation. Use multiple repos if public source, paid dependencies, auth infrastructure, and Rust engine work need different visibility or release controls.

## Public Autoform Repo

The public base repo owns the reusable npm surface, public docs, and public Storybook:

```text
incmix-autoform/
  apps/
    docs/
    storybook/

  packages/
    core/
    react/
    autoform/
    ajv/
    ui/
    theme/
    table-core/
```

Everything in this repo should be public-source safe. It should not contain:

- `packages/rowsncolumns`
- `packages/piptable-client`
- `apps/rowsncolumns`
- `apps/piptable-client`
- `apps/presspoint`
- `apps/api-docs`, if it documents private backend APIs
- backend services
- auth services
- paid dependency integration

The public packages should be publish-safe and should not depend on private product packages, backend services, auth services, piptable private clients, or paid rowsncolumns code.

The private product repo should consume them as dependencies:

```json
{
  "dependencies": {
    "@incmix/ui": "^1.0.0",
    "@incmix/core": "^1.0.0",
    "@incmix/autoform": "^1.0.0",
    "@incmix/ajv": "^1.0.0",
    "@incmix/table-core": "^1.0.0"
  }
}
```

During local development, the product repo can link to local Autoform packages with workspace overrides, `pnpm link`, or a private dev workspace. Do not solve local development by copying `ui`, `core`, or `ajv` into the product repo.

## Presspoint Boundary

Presspoint is an app. Start with `apps/presspoint`, not `packages/presspoint`.

Use this shape when Presspoint stays in the base/private repo:

```text
apps/
  presspoint/
    src/
    public/
    package.json
```

Use this shape only if Presspoint becomes its own private repo:

```text
incmix-presspoint/
  apps/
    presspoint/
      src/
      public/
      package.json

  e2e/
  docs/
  infra/
```

Do not add `presspoint-domain` or `presspoint-client` up front. Those names only make sense later if Presspoint grows reusable app-specific domain logic or a reusable API client that multiple apps need. Until then, keep that code inside `apps/presspoint/src`.

Dependencies should point outward:

- Public UI/form packages from `incmix-autoform`: `@incmix/ui`, `@incmix/core`, `@incmix/autoform`, `@incmix/ajv`, and `@incmix/table-core`.
- Private platform packages from `incmix-product`: `@incmix/workbook-client` and `@incmix/auth-client`, if those exist.
- Runtime services over HTTP or RPC: auth service, workbook service, BFF.

Do not copy platform packages into the Presspoint repo. If Presspoint needs shared behavior, promote that behavior into a private platform package and consume it.

## Clone and Local Development

Recommended local checkout layout:

```text
~/projects/incmix/
  autoform/          # incmix-autoform public/publish repo
  product/           # incmix-product private platform/product repo
  presspoint/        # optional incmix-presspoint private app repo
  piptable/          # private engine/app repo, including rowsncolumns integration
```

Normal product development should not require cloning every repo. `incmix-product` should install public Autoform packages from npm or the configured registry:

```json
{
  "dependencies": {
    "@incmix/ui": "^1.0.0",
    "@incmix/core": "^1.0.0",
    "@incmix/autoform": "^1.0.0",
    "@incmix/ajv": "^1.0.0",
    "@incmix/table-core": "^1.0.0"
  }
}
```

Clone multiple repos only when actively changing their boundary:

- Clone `autoform` when changing public UI/core/autoform/AJV packages.
- Clone `product` when changing private platform packages, backend services, auth, or workbook persistence.
- Clone `presspoint` when changing the Presspoint app, if Presspoint has been split into its own repo.
- Clone `piptable` when changing the engine, CLI, server, Python bindings, wasm behavior, private piptable app, or rowsncolumns grid integration.

For active cross-repo development, prefer one of these approaches:

1. Use a temporary `pnpm.overrides` block in `incmix-product/package.json` to point public packages at the local Autoform checkout:

   ```json
   {
     "pnpm": {
       "overrides": {
         "@incmix/ui": "link:../autoform/packages/ui",
         "@incmix/core": "link:../autoform/packages/core",
         "@incmix/autoform": "link:../autoform/packages/autoform",
         "@incmix/ajv": "link:../autoform/packages/ajv",
         "@incmix/table-core": "link:../autoform/packages/table-core"
       }
     }
   }
   ```

2. Use `pnpm link` for a short-lived local change.

3. Use a local parent "dev workspace" only as a personal tool, not as the committed repo structure.

Do not use git submodules for the public package repo by default. They make simple clone/install flows worse and should only be used if a deployment or compliance process requires exact source pinning.

Piptable integration should work the same way:

- Product talks to released piptable artifacts by default.
- During engine development, point private piptable integration code at a local piptable server, local wasm build, or local package artifact.
- Do not make product installation require a piptable source checkout unless the developer is changing piptable itself.

## Piptable Boundary

Piptable should remain its own private repo for now. It is not just another package in the Autoform/npm workspace; it is a polyglot engine with Rust crates, a CLI, a backend server, Python bindings, a wasm target, and a frontend playground.

Recommended internal shape for piptable:

```text
piptable/
  apps/
    piptable/
      Private piptable app, playground/workbench, and rowsncolumns-backed grid
      UI. Start here instead of creating a separate apps/rowsncolumns app.

  crates/
    core/
    parser/
    interpreter/
    server/
    cli/
    wasm/
    python/

  bindings/
    python/          # optional future move from crates/python

  docs/
  examples/
  benches/
```

Keep the core engine, bindings, and playground together while the API is evolving. Splitting those too early makes every parser/runtime change require cross-repo coordination.

The product repo should consume piptable through released artifacts or stable integration points:

- CLI binary for local/server workflows.
- HTTP service if piptable is deployed as a backend capability.
- Python package if Python workflows are first-class.
- Wasm package if browser execution is needed.

Do not move piptable source into `incmix-autoform` just because the private piptable app has frontend code. If that app needs shared visual components, it should depend on the published `@incmix/ui` package or a private workspace link during local development.

## Piptable, Rowsncolumns, and Persistence

The integration between piptable, rowsncolumns, and backend persistence belongs in private repos, not in the public Autoform packages.

Recommended ownership:

```text
piptable/
  apps/
    piptable/
      Private piptable workbench/playground app.
      Owns rowsncolumns-backed grid UI, piptable execution UI, import/export UI,
      and conversion between grid state and piptable payloads.

  crates/
    core/
    parser/
    interpreter/
    server/
    cli/
    wasm/
    python/

incmix-product/
  apps/
    verifier/
    auth-dashboard/
    desktop-interceptor/
    api-docs/        # if it renders private backend OpenAPI contracts

  packages/
    # Private product packages. Public packages such as @incmix/ui,
    # @incmix/core, @incmix/autoform, @incmix/ajv, and
    # @incmix/table-core are dependencies from incmix-autoform,
    # not duplicated here.

    workbook-model/
      Canonical TypeScript contracts for workbooks, sheets, cells, ranges,
      formulas, patches, revisions, imports, exports, and permissions.

    workbook-client/
      Browser/client SDK for loading workbooks, applying patches, queuing edits,
      and syncing with workbook-service.

    auth-client/
      Private client contract for product auth and tenancy.

  services/
    workbook-service/
      Durable persistence, auth checks, org/project ownership, revision control,
      snapshots, patch logs, imports, exports, and compute job orchestration.

    auth-service/
    bff/
    email-service/

  db/
    migrations/
    seeds/

  infra/
    docker/
    compose/
```

Responsibilities:

- `workbook-model` is the shared contract and should be the narrow waist between UI, compute, and persistence.
- Public `packages/core` can own local-first repository abstractions, document records, revision-aware mutations, sync metadata, and TinyBase-backed browser persistence helpers.
- `piptable/apps/piptable` is the private editor/workbench app that can use rowsncolumns.
- Rowsncolumns is a grid/editor implementation detail of the private piptable app unless multiple private apps need a reusable adapter.
- `piptable` is the compute/import/export engine. It should not own app auth, org permissions, or product persistence unless it becomes the persistence product itself.
- `workbook-service` owns server-durable state, auth, tenancy, backend revision enforcement, and server-side compute orchestration.

Data flow:

```text
Rowsncolumns editor
  -> workbook-model patch
  -> workbook-service persistence and revision check
  -> optional piptable compute/import/export
  -> workbook-model patch or snapshot
  -> piptable app refresh
```

Use this boundary even if local development links the repos together. Cross-repo integration can use private package artifacts, Docker images, local path links, or a dev compose setup, but the public npm package graph should remain free of paid rowsncolumns dependencies, piptable-private clients, and backend/auth code.

Start simple for persistence:

- Use TinyBase Persisters for browser/client storage mechanics instead of maintaining a custom persistence engine. `packages/core` may wrap those persisters behind domain repositories so the rest of the app talks in document, revision, and sync terms.
- Store workbook snapshots plus append-only patches.
- Put a monotonically increasing `revision` on every workbook.
- Reject or merge stale patches by revision.
- Add operation-level conflict handling later if collaboration becomes a hard requirement.

Suggested package internals:

```text
packages/workbook-model/src/
  workbook.ts
  sheet.ts
  cell.ts
  range.ts
  formula.ts
  patch.ts
  revision.ts
  permissions.ts
  import-export.ts

packages/workbook-client/src/
  client.ts
  cache.ts
  patch-queue.ts
  optimistic-sync.ts
  transport.ts

piptable/apps/piptable/src/
  rowsncolumns/
    PiptableGrid.tsx
    rowsncolumns-to-workbook.ts
    workbook-to-rowsncolumns.ts
    patch-from-grid-event.ts
  piptable/
    http-client.ts
    wasm-client.ts
    workbook-to-piptable.ts
    piptable-to-workbook.ts
    compute-job.ts

services/workbook-service/src/
  routes/
  auth/
  domain/
  persistence/
  compute/
  migrations/
```

Rule of thumb:

- Types and schemas go in `workbook-model`.
- Local-first repository APIs, TinyBase store shape, persister initialization, worker boundaries, and generic sync protocol types can live in public `packages/core` when they are product-neutral.
- Browser sync behavior that knows private workbook APIs goes in `workbook-client`.
- Paid grid rendering and edit translation start inside `piptable/apps/piptable/src/rowsncolumns`.
- Piptable transport and conversion start inside `piptable/apps/piptable/src/piptable`.
- Database writes, auth enforcement, revision checks, and compute orchestration go in `workbook-service`.

## Schema Editor Boundary

The schema editor should stay in the public UI package for now, but only as a storage-agnostic editor/view component.

Current public UI home:

```text
incmix-autoform/
  packages/ui/src/editor/autoform/
    AutoFormWorkbench.tsx
    JsonViewEditor.tsx
    SchemaPreview.tsx
    JsonDiffView.tsx
```

That public UI layer can own:

- JSON/schema editing UI.
- Schema preview and diff UI.
- Local draft state.
- Validation display.
- `onChange`, `onSave`, `onCancel`, and dirty-state callbacks.
- Public schema/document value types if they are reusable.

It should not own:

- Fetching from product APIs.
- Auth, org, project, workspace, or tenancy logic.
- Backend persistence.
- Schema registry routes.
- Database record shapes that are product-specific.

Do the backend integration in the private app that needs persistence, starting with Presspoint:

```text
incmix-presspoint/ or incmix-product/
  apps/presspoint/src/features/schema-editor/
    SchemaEditorPage.tsx
    schema-editor-client.ts
    schema-editor-store.ts
    schema-editor-mutations.ts
    schema-editor.routes.ts
```

The dependency direction should be:

```text
@incmix/ui/editor/autoform
  -> consumed by apps/presspoint/src/features/schema-editor
  -> talks to private backend persistence
```

Presspoint should adapt backend records into the public editor props, then adapt editor save events back into API requests. That keeps the public package reusable and keeps private persistence/auth outside `@incmix/ui`.

Only extract a private package later, such as `packages/schema-client` or `packages/schema-registry-client`, if multiple private apps need the same persistence client. Until then, keep the integration inside `apps/presspoint/src/features/schema-editor`.

Suggested backend ownership:

```text
incmix-product/
  services/schema-service/       # only if schema persistence grows into its own service
  services/workbook-service/     # acceptable if schemas are part of workbook/project state
  services/bff/                  # acceptable if it only proxies/aggregates schema APIs
```

Start with the simplest service boundary that matches the product:

- If schemas are Presspoint-specific, persist them through Presspoint's backend/BFF.
- If schemas are shared across workbooks, tables, forms, and apps, persist them through a private schema registry API.
- If schemas are tied to workbook/table definitions, persist them with `workbook-service`.

Minimum persisted record shape:

```ts
type SchemaDocumentRecord = {
  id: string
  ownerType: 'presspoint' | 'workbook' | 'project' | 'org'
  ownerId: string
  name: string
  jsonSchema: unknown
  uiSchema?: unknown
  metadata?: Record<string, unknown>
  revision: number
  createdAt: string
  updatedAt: string
}
```

Save requests should include the last seen `revision`. The backend should reject stale saves or return a merge/conflict response instead of silently overwriting the latest schema.

## Declarative UI Boundary

`packages/ui/src/declarative` is currently used and should not be treated as dead code.

Current usage:

- `packages/ui/package.json` exports it as `@incmix/ui/declarative`.
- `apps/docs/src/components/declarative/GrammarPreview.tsx` imports the declarative renderer types and renderer.
- `apps/docs/src/components/declarative/JsxAuthoringWorkbench.tsx` imports the declarative authoring helpers.
- `packages/ui/src/autoform/useAutoFormRuntime.ts` imports the declarative page runtime actor.

Keep this public as long as docs and AutoForm rely on it:

```text
packages/ui/src/declarative/
  DeclarativeRenderer.tsx
  runtime.ts
  jsx-authoring.ts
  index.ts
```

Important dependency note:

- `runtime.ts` depends on `@bwalkt/core`, `xstate`, and UI hooks.
- `DeclarativeRenderer.tsx` depends on React and core declarative types.
- `jsx-authoring.ts` depends on `@bwalkt/react-runner` and UI components.

That means `@incmix/ui/declarative` currently pulls in the live JSX authoring path through the same subpath export. If a leaner public package surface matters, split the subpaths:

```json
{
  "exports": {
    "./declarative": "./dist/declarative/index.js",
    "./declarative/runtime": "./dist/declarative/runtime.js",
    "./declarative/renderer": "./dist/declarative/DeclarativeRenderer.js",
    "./declarative/jsx-authoring": "./dist/declarative/jsx-authoring.js"
  }
}
```

Longer term, prefer:

- Declarative grammar, document types, normalization, repositories, and sync contracts in `@incmix/core`.
- React rendering/runtime adapters in `@incmix/ui/declarative`.
- JSX authoring helpers either in a separate subpath or behind an explicit editor/docs entrypoint because they require `react-runner`.

## Font Assets

Default UI fonts should be self-hosted package assets, not remotely fetched by default.

Recommended public UI shape:

```text
packages/ui/src/fonts/
  geist-latin-wght-normal.woff2
  geist-latin-ext-wght-normal.woff2
  newsreader-latin-wght-normal.woff2
  newsreader-latin-ext-wght-normal.woff2

packages/ui/src/globals.css
```

For publish builds, copy fonts into the emitted package output and export them as stable subpaths:

```json
{
  "exports": {
    "./globals.css": "./dist/globals.css",
    "./fonts/*": "./dist/fonts/*"
  }
}
```

Reasons:

- The design system renders consistently without relying on Google Fonts or another CDN.
- Consumers with strict CSP, air-gapped deployments, or private enterprise networks can use the package.
- Font versions are pinned to the UI package version.
- Apps avoid leaking page visits to third-party font hosts.

Remote fonts are still useful for app-specific branding. Treat them as host-app configuration through the theme system, not as the default behavior of `@incmix/ui`.

Rules:

- Keep only small, licensed `.woff2` subsets in the public package.
- Include/track font licenses for any bundled fonts.
- Use `font-display: swap` or `optional` in generated `@font-face` rules.
- Do not force every consumer to download every font. Fonts should load only when `globals.css` or a font CSS entrypoint is imported.
- If package size grows too much, split optional font CSS into a subpath such as `@incmix/ui/fonts.css`.

## Table Core Contract

`packages/table-core` is the public, framework-light contract shared by:

- `packages/ui`, for the public table/tree-table implementation.
- `piptable/apps/piptable`, for the private piptable workbench.
- `piptable/apps/piptable/src/rowsncolumns`, for rowsncolumns-backed rendering and editing.

It should contain:

- Column definitions and column metadata.
- Row identity, tree row identity, parent/child relationships, expansion state, and ordering contracts.
- Cell value types, cell kind metadata, formatting metadata, validation metadata, and edit patch types.
- Sort, filter, grouping, pagination, selection, and range-selection state shapes.
- Serialization helpers and pure normalization/validation utilities.

It should not contain:

- React components.
- CSS or visual theme tokens.
- Rowsncolumns imports.
- Piptable engine imports.
- Backend persistence, auth, org, or tenancy code.

The dependency direction should be:

```text
@incmix/table-core
  -> consumed by @incmix/ui
  -> consumed by private piptable app
  -> consumed by private rowsncolumns adapter code
```

No dependency should point from `@incmix/table-core` back into `@incmix/ui`, piptable, or rowsncolumns.

## Base Repo Shape

```text
apps/
  docs/
  storybook/

packages/
  core/
  react/
  autoform/
  ajv/
  ui/
  theme/
  table-core/
  react-runner/      # if public ui keeps live editor/declarative features
  config/            # internal build tooling, not published
```

## Current Contents Disposition

Recommended placement for the current repo contents:

```text
incmix-autoform/                # public source
  apps/
    docs/
    storybook/                  # new host for public package stories

  packages/
    ui/
    core/
    react/
    autoform/                   # optional umbrella package
    ajv/
    theme/
    table-core/                 # shared public table contracts for ui, piptable, and rowsncolumns
    react-runner/               # required if public ui keeps live editor/docs
    config/                     # internal tooling only, not a published package

incmix-product/                 # private
  apps/
    api-docs/                   # current app renders services/api/openapi.yaml
    presspoint/                 # if not split into incmix-presspoint
    verifier/
    auth-dashboard/
    desktop-interceptor/

  services/
    api/
    bff/
    email-service/
    email-worker/
    auth-service/
    workbook-service/

piptable/                       # private
  apps/
    piptable/                   # includes rowsncolumns-backed UI
  crates/
```

Notes:

- `apps/api-docs` follows `services/api`, because it currently renders `services/api/openapi.yaml`.
- `apps/presspoint` is an app, not `packages/presspoint`. Move it to its own repo only if it gets independent deployment and ownership.
- `apps/email-worker` should move with private services once it has a package/app manifest. It does not belong in the public base repo.
- `packages/config` can stay in the public source repo as internal build tooling if it has no secrets. It should not be part of the public npm package set unless consumers need it.
- `packages/react-runner` is currently used by `packages/ui` live editing/declarative features. Either keep it in the public base repo and publish it, or remove/bundle that dependency before publishing `@incmix/ui`.
- `packages/table-core` is required if piptable and the private rowsncolumns-backed app share table contracts with `packages/ui`.
- Schema editor UI can remain in `packages/ui/src/editor/autoform`; Presspoint should own backend persistence wiring under `apps/presspoint/src/features/schema-editor`.

## Package Boundaries

Public npm packages should be publish-safe:

- `packages/core`
- `packages/react`
- `packages/ajv`
- `packages/ui`
- `packages/autoform`, if kept as an umbrella package
- `packages/theme`, if consumers need it directly
- `packages/table-core`, because piptable and rowsncolumns need the shared table contract
- `packages/react-runner`, if `packages/ui` keeps live editor/declarative features that import it

Private packages should stay private:

- Rowsncolumns integration, because it depends on a paid product.
- Backend service packages, including auth.
- Product/platform packages such as `auth-client`, `workbook-client`, and `dashboard-shared`, unless they become stable public APIs.
- Piptable clients, adapters, and wasm wrappers, unless they are intentionally shipped to external consumers.
- Internal config packages unless consumers genuinely need them.

The npm publish work should require clean public package manifests, `dist/*` exports, real semver dependency ranges in packed manifests, and `publishConfig.access = "public"` on public scoped packages.

For `packages/ui`, keep the root `@incmix/ui` export free of `@incmix/core`-backed modules. Components that depend on core document/schema/runtime contracts should live behind explicit subpaths such as `@incmix/ui/autoform`, `@incmix/ui/composites`, `@incmix/ui/declarative`, `@incmix/ui/editor/autoform`, or `@incmix/ui/widgets`.

## Rowsncolumns Rule

`packages/ui` should not depend on rowsncolumns for its library source, public build, or public Storybook.

Allowed:

- Shared table contracts, layout, table shell, styling, and column definitions in `packages/ui`.
- A default public table/tree-table implementation in `packages/ui`.
- Paid adapter code in the private piptable app.
- Private rowsncolumns demos in the private piptable app.

Avoid:

- Imports from rowsncolumns inside `packages/ui/src/**`.
- Publishing `@incmix/ui` with a dependency on `@incmix/rowsncolumns`.
- Loading private rowsncolumns stories from the public `apps/storybook`.

Preferred public Storybook layout:

```text
apps/storybook/
  package.json
  .storybook/main.ts

packages/ui/
  src/**/*.stories.tsx
```

Preferred private piptable layout:

```text
piptable/apps/piptable/
  src/rowsncolumns/
  src/**/*.stories.tsx
```

## Dashboard Migration Order

Do not merge `../dashboard` wholesale first. Migrate it in layers:

1. Extract reusable visual components and layout primitives into `packages/ui`.
2. Extract shared auth and domain contracts into `packages/auth-client` or `packages/dashboard-shared`.
3. Move app surfaces into `apps/*`, such as verifier, auth dashboard, and Tauri desktop interceptor.
4. Move backend runtime code into `services/*`.
5. Consolidate pnpm catalogs, React versions, Vite versions, and build scripts after the boundaries are stable.

## Presspoint

`apps/presspoint` remains an app in the unified layout. It should consume public packages like `packages/ui`, `packages/core`, and `packages/react` the same way external consumers would, which makes it useful as an internal integration check for the npm publish goal.
