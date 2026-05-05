# Declarative UI Roadmap

**Status:** Proposed  
**Updated:** 2026-04-06

## Purpose

This roadmap makes `docs/declarative_ui_spec.md` the umbrella contract for declarative UI in this repo and repositions AutoForm as a specialization of that contract rather than a separate architecture.

This document is intentionally execution-oriented. It covers:

- target architecture
- current-state mapping
- phased migration plan
- proposed PR slices
- concrete file and module targets
- dependency order
- exit criteria per phase
- explicitly deferred follow-up work

## Executive Summary

The long-term shape should be:

- `docs/declarative_ui_spec.md`
  The umbrella contract for declarative UI AST, document structure, composition, `$ref`, metadata, actions, queries, and conditions.
- `docs/autoform.md`
  A specialization note describing how AutoForm derives from and narrows that broader contract.
- `packages/core`
  The semantic runtime center for shared declarative UI meaning.
- `packages/ui`
  The React-facing renderer/composition layer that turns declarative specs into concrete product UI.

The key rule is simple:

- conditional rendering, branch activation, `$ref` semantics, normalization rules, and AJV-backed evaluation should exist once in `packages/core`
- AutoForm should consume those semantics as a specialization
- page/view composition in apps should move into `packages/ui/compose`
- example apps should increasingly provide declarative data and route wiring, not interpretation logic

## Problem Statement

Today the repo already has most of the right building blocks, but they are framed primarily through AutoForm and form-centric normalization.

This creates three risks:

1. AutoForm can drift into looking like a separate runtime model instead of a specialization of declarative UI.
2. Page/view composition logic can remain app-local instead of being shared through `packages/ui/compose`.
3. Conditional runtime semantics can be reimplemented in multiple places if we do not center them in `packages/core`.

The roadmap is meant to prevent those failures while preserving current working code.

## Architectural Principles

### One umbrella contract

`docs/declarative_ui_spec.md` is the top-level contract. It should describe:

- AST/document shape
- root document structure
- composition rules
- `$ref` rules
- metadata channels
- action/query contracts
- conditional semantics
- runtime expectations

No other doc should compete with it at the same level.

### AutoForm is a specialization

AutoForm should not be described as a separate system. It is a specialization that:

- derives fields and layout from JSON Schema and UI Schema
- adds form-specific runtime concepts
- uses shared core semantics for refs, conditions, normalization, and validation

### Shared semantics live in `packages/core`

`packages/core` should own:

- declarative AST contracts
- ref resolution and merge semantics
- normalization primitives
- conditional branch semantics
- AJV-backed evaluation and validation
- shared runtime path/data utilities

### React/runtime interpretation lives in `packages/ui`

`packages/ui` should own:

- renderer registry
- concrete React components
- view dispatchers
- page/layout composition helpers
- product-facing runtime wiring

### Migrate by extraction, not replacement

The repo already contains useful runtime logic. The migration should extract and generalize what exists rather than building a second parallel declarative stack from scratch.

## Current-State Mapping

### Existing strength in `packages/core`

The current core package already has strong seed primitives:

- [`packages/core/src/schema-ast.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/schema-ast.ts)
  JSON Schema AST shaping and `$ref` resolution
- [`packages/core/src/condition-runtime.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/condition-runtime.ts)
  runtime condition evaluation and branch activation
- [`packages/core/src/ajv-validation.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/ajv-validation.ts)
  AJV-backed validator creation and runtime validation
- [`packages/core/src/ui-schema-normalization.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/ui-schema-normalization.ts)
  normalization into renderable form models
- [`packages/core/src/form-runtime.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/form-runtime.ts)
  runtime state and error-path behavior

These are not throwaway implementations. They are the base from which a broader declarative runtime should be extracted.

### Existing strength in `packages/ui`

The current UI package already owns the right category of work:

- renderers
- concrete widgets
- layout primitives
- table and filter UI
- compose helpers
- AutoForm UI/runtime surfaces

Relevant shared compose entrypoints already exist:

- [`packages/ui/src/compose/sidebar.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/compose/sidebar.ts)
- [`packages/ui/src/compose/view.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/compose/view.tsx)

The direction is to expand these, not bypass them from app code.

### Current gap

The current gap is not absence of runtime code. It is alignment:

- the umbrella contract is not yet the center of gravity
- `compose/view` is not yet a general declarative view dispatcher
- example app specs are not yet truly JSON-data-driven
- example data is still embedded rather than modeled as query-backed page data

## Target Architecture

## Layer 1: Declarative Contract

Primary doc:

- [`docs/declarative_ui_spec.md`](/Users/umam3/projects/boardwalk/p-zero/autoform3/docs/declarative_ui_spec.md)

This should define:

- root document structure
- node variants
- slots and children
- refs and composition
- metadata channels
- action/query behavior
- conditional behavior
- renderer/runtime expectations

## Layer 2: Shared Core Semantics

Primary package:

- [`packages/core`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core)

This should expose:

- generic declarative node/document types
- condition evaluators
- ref resolution
- normalization helpers
- AJV-based evaluation utilities
- runtime path and state helpers

The core package should not register concrete widgets or React components.

## Layer 3: UI Composition and Rendering

Primary package:

- [`packages/ui`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui)

This should expose:

- renderers for concrete view kinds
- compose helpers for pages, sidebars, views, filters, and layout
- registries/mappings from declarative view kinds to React implementations

## Layer 4: Specializations

AutoForm belongs here.

It should:

- reuse core runtime semantics
- specialize schema-driven form generation
- remain compatible with the umbrella declarative model

## Package Boundaries

### `packages/core`

Owns:

- semantic contracts
- AST and normalization
- ref resolution
- condition semantics
- AJV/runtime behavior
- shared runtime helpers

Does not own:

- React components
- widget registries
- product-specific renderer mappings
- Storybook/docs rendering logic

### `packages/ui`

Owns:

- React implementations
- compose helpers
- runtime rendering
- widget registration
- dashboards/tables/pages/forms as UI surfaces

Does not own:

- duplicate condition semantics
- duplicate ref resolution logic
- alternate validation semantics that contradict core

### `packages/react`

Needs deliberate evaluation rather than assumption.

Possible outcomes:

- keep it because it serves a real external boundary
- narrow it to a compatibility package
- remove it if `packages/ui` is already the real React-facing surface

This is cleanup work, not the first step.

## Roadmap Phases

## Phase 0: Stabilize Direction

### Objective

Make the architectural direction explicit before large refactors.

### Deliverables

- this roadmap doc
- clarified ownership language in docs
- agreement on umbrella contract and package boundaries

### Exit Criteria

- team agrees that declarative UI is the umbrella
- team agrees AutoForm is a specialization
- team agrees conditional semantics belong in `packages/core`

## Phase 1: Contract Cleanup

### Objective

Fix the documentation hierarchy so the code migration has a stable target.

### Work

- expand `docs/declarative_ui_spec.md` beyond static grammar language
- add explicit conditional rendering/runtime semantics
- clarify ref and merge behavior as runtime semantics, not just authoring notes
- update `docs/autoform.md` to describe specialization/package-boundary behavior
- ensure AutoForm doc points back to declarative UI instead of reading like a competing spec

### Files

- [`docs/declarative_ui_spec.md`](/Users/umam3/projects/boardwalk/p-zero/autoform3/docs/declarative_ui_spec.md)
- [`docs/autoform.md`](/Users/umam3/projects/boardwalk/p-zero/autoform3/docs/autoform.md)

### Proposed PR Slice

`docs: align declarative ui umbrella contract and autoform specialization`

### Exit Criteria

- umbrella vs specialization distinction is explicit
- docs mention shared conditional semantics in core
- docs no longer imply parallel architectures

## Phase 2: Core Semantic Extraction

### Objective

Extract generic declarative runtime semantics from the existing form-centric core without breaking current behavior.

### Work

- introduce generic declarative AST/document types alongside current AutoForm-specific types
- extract reusable condition semantics into generic core APIs
- extract generic normalization primitives from form-centric normalization where possible
- preserve backward compatibility while migration is in progress

### Likely File Targets

- [`packages/core/src/schema-ast.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/schema-ast.ts)
- [`packages/core/src/condition-runtime.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/condition-runtime.ts)
- [`packages/core/src/ajv-validation.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/ajv-validation.ts)
- [`packages/core/src/ui-schema-normalization.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/ui-schema-normalization.ts)
- [`packages/core/src/index.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/index.ts)

### Recommended New Modules

Potential new modules, introduced incrementally:

- `packages/core/src/declarative-ast.ts`
- `packages/core/src/declarative-refs.ts`
- `packages/core/src/declarative-conditions.ts`
- `packages/core/src/declarative-normalization.ts`

These names are directional, not mandatory. The important part is separation of generic semantics from AutoForm specialization.

### Proposed PR Slices

1. `core: introduce generic declarative node and document types`
2. `core: extract shared condition evaluation primitives`
3. `core: extract shared ref resolution and normalization helpers`

### Exit Criteria

- generic core APIs exist for refs and conditions
- AutoForm-specific code can call shared semantics instead of owning them inline
- no second runtime model has been introduced

## Phase 3: AutoForm Specialization Refit

### Objective

Make AutoForm explicitly consume shared declarative semantics rather than implicitly bundling them.

### Work

- map JSON Schema-derived form AST to generic declarative/core constructs where appropriate
- keep form-specific behaviors in AutoForm-specific modules
- ensure AutoForm condition behavior is backed by shared core condition semantics
- ensure AJV validation paths align with shared runtime semantics

### Likely File Targets

- [`packages/core/src/ui-schema-normalization.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/ui-schema-normalization.ts)
- [`packages/core/src/form-runtime.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/form-runtime.ts)
- AutoForm-facing modules under [`packages/ui/src/autoform`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/autoform)

### Proposed PR Slice

`core/ui: refit autoform runtime onto shared declarative semantics`

### Exit Criteria

- AutoForm still works
- AutoForm docs correctly describe it as a specialization
- shared condition behavior is not duplicated in AutoForm-specific code

## Phase 4: Compose Layer Generalization

### Objective

Turn `packages/ui/compose` into the shared interpreter for page and view specs.

### Work

- generalize `packages/ui/src/compose/view.tsx` from narrow helper set to a view dispatcher
- move from a single built-in view assumption to a spec-driven view kind model
- support view kinds such as:
  - `infinite-table`
  - `basic-table`
  - `dashboard`
  - later additional view kinds
- keep app code focused on declarative data and route wiring

### Current Starting Point

The recent cleanup moved shared filter/column/application helpers into:

- [`packages/ui/src/compose/view.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/compose/view.tsx)

That is a valid starting point, but not the final architecture.

### Proposed PR Slice

`ui: generalize compose view into spec-driven view dispatcher`

### Exit Criteria

- a page spec can select a view kind
- `packages/ui/compose` resolves that kind to the correct runtime
- app code no longer manually decides how to render supported view kinds

## Phase 5: Presspoint Declarative Migration

### Objective

Turn Presspoint into a consumer of declarative specs instead of an owner of interpretation logic.

### Current Status

Presspoint now leans more on shared compose helpers and a layout spec, but it is still TypeScript-heavy and not yet truly JSON-data-driven.

### Work

- simplify Presspoint route files so they mostly wire spec + data into shared compose/runtime
- move remaining interpretation logic into `packages/ui/compose`
- converge the example spec format toward JSON-data-driven authoring

### Explicit Follow-up A

`apps/presspoint/src/lib/presspoint-view-spec.tsx` should become JSON-data-driven.

This is deferred. It should be done in a separate follow-up PR after the compose layer is generalized enough to consume it cleanly.

### Files

- [`apps/presspoint/src/lib/presspoint-view-spec.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/apps/presspoint/src/lib/presspoint-view-spec.tsx)
- [`apps/presspoint/src/routes/index.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/apps/presspoint/src/routes/index.tsx)
- [`packages/ui/src/compose/view.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/compose/view.tsx)

### Proposed PR Slice

`presspoint: move page spec toward json-driven declarative view data`

### Exit Criteria

- the Presspoint view spec is mostly data, not imperative composition code
- route code mostly selects and passes data
- shared compose/runtime interprets the page spec

## Phase 6: Query-Backed Presspoint Data

### Objective

Move Presspoint data from embedded arrays to query-modeled data flow.

### Rationale

If declarative UI is going to model real page behavior, the example should exercise:

- loading states
- query metadata
- async data flow
- state invalidation and refresh

Static arrays do not test that shape well enough.

### Explicit Follow-up B

Use TanStack Query to mock data in Presspoint rather than embedding static arrays in the spec module.

This is deferred and should not be folded into the current cleanup PR.

### Likely File Targets

- [`apps/presspoint/src/lib/presspoint-view-spec.tsx`](/Users/umam3/projects/boardwalk/p-zero/autoform3/apps/presspoint/src/lib/presspoint-view-spec.tsx)
- Presspoint route modules
- possible Presspoint query helpers under `apps/presspoint/src/lib`

### Proposed PR Slice

`presspoint: replace inline mock rows with tanstack-query backed mock data`

### Exit Criteria

- Presspoint routes use TanStack Query for data access
- declarative page specs can attach to query-backed data
- loading and empty/error states are exercised through the runtime

## Phase 7: Shared Conditional Runtime Completion

### Objective

Ensure conditional semantics are fully shared across form and non-form declarative surfaces.

### Work

- support conditional visibility/required/readOnly/disabled behavior through shared APIs
- ensure branch activation is not form-only
- make sure views, sections, panels, dashboards, and future nodes can reuse the same condition semantics

### Proposed PR Slice

`core: complete shared conditional runtime for declarative ui`

### Exit Criteria

- conditions are reusable across multiple declarative surface types
- AutoForm does not own a parallel condition system
- UI layers call the core condition engine rather than re-deriving branch logic

## Phase 8: Cleanup and Convergence

### Objective

Remove transitional duplication and finalize the long-term package story.

### Work

- remove deprecated or duplicate runtime pathways
- simplify `packages/react` if it no longer serves a meaningful purpose
- tighten exports so shared surfaces are explicit and maintainable
- confirm `packages/ui` is the canonical React-facing API where appropriate

### Likely File Targets

- [`packages/core/src/index.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/index.ts)
- [`packages/ui/src/index.ts`](/Users/umam3/projects/boardwalk/p-zero/autoform3/packages/ui/src/index.ts)
- package manifests across `packages/react`, `packages/ui`, and consumers

### Proposed PR Slice

`cleanup: converge declarative ui package surfaces`

### Exit Criteria

- duplicated semantics are removed
- export surfaces are coherent
- package boundaries match actual usage

## Dependency Order

The phases should not be done in random order.

Recommended dependency chain:

1. roadmap + contract alignment
2. generic core extraction
3. AutoForm refit onto shared core semantics
4. compose/view generalization
5. example spec migration to declarative JSON-driven data
6. TanStack Query-backed example data
7. cleanup and package-surface convergence

Important constraints:

- do not attempt full JSON-driven example specs before `compose/view` can interpret them cleanly
- do not move query-backed page behavior into the example before the spec/compose boundary is stable
- do not remove old runtime paths until the shared core semantics are proven by active consumers

## Concrete Follow-up PRs

These are the clearest near-term follow-up PRs after current code cleanup:

1. `ui: generalize compose view into spec-driven dispatcher`
2. `docs: align declarative ui umbrella contract and autoform specialization`
3. `core: extract shared declarative condition and ref semantics`
4. `example: convert example view spec to json-driven declarative data`
5. `example: move mock data to tanstack-query`
6. `cleanup: converge package surfaces after migration`

## Acceptance Criteria For The Full Roadmap

The roadmap is complete when all of the following are true:

- `docs/declarative_ui_spec.md` is the umbrella contract
- `docs/autoform.md` describes specialization rather than parallel architecture
- `packages/core` owns shared ref, condition, normalization, and AJV semantics
- AutoForm consumes those semantics as a specialization
- `packages/ui/compose` interprets page/view specs instead of app-local logic doing so
- the example app mostly provides declarative config and data sources
- example data flow exercises async/query-backed behavior rather than only inline arrays

## Explicitly Deferred From The Current PR

The following are not part of the current cleanup and should remain follow-up work:

1. Generalizing `packages/ui/src/compose/view.tsx` into a full dynamic view dispatcher
2. Converting `apps/presspoint/src/lib/presspoint-view-spec.tsx` into JSON-data-driven page data
3. Replacing inline example mock rows with TanStack Query-backed mock data
4. Full rewrite of `docs/declarative_ui_spec.md` and `docs/autoform.md`
5. Package-surface cleanup for `packages/react`

## Main Failure Modes To Avoid

### Failure Mode 1: Building a second runtime

Do not create a fresh generic declarative runtime beside the current AutoForm/runtime code and leave both active.

Correct approach:

- extract
- generalize
- migrate consumers
- delete duplication last

### Failure Mode 2: App-owned interpretation logic

Do not let app routes become the permanent owners of:

- view dispatch
- filter interpretation
- layout interpretation
- query semantics

That work belongs in `packages/ui/compose`.

### Failure Mode 3: AutoForm as a sibling architecture

Do not let docs or code imply:

- declarative UI for pages
- AutoForm for forms

as two unrelated models. AutoForm should be a specialization within declarative UI.

## Decision Log Summary

This roadmap assumes:

- declarative UI is the umbrella contract
- AutoForm is a specialization
- conditional semantics belong in `packages/core`
- `packages/ui/compose` should own page/view interpretation
- example routes should become thinner over time
- JSON-driven example specs and TanStack Query-backed mock data are follow-up work, not part of the current refactor
