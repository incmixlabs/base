# AutoForm Architecture Notes

This note captures the current package split and a few cleanup directions after the recent JSON Schema editor work.

## Current Practical Package Roles

- `packages/core`
  Owns schema/runtime semantics: normalization, schema AST behavior, `$ref` resolution rules, combinator handling, and the data/model layer the UI builds on.

- `packages/ui`
  Owns the actual product surface: JSON Schema editor, workbench, preview, widgets, stories, and the React UI/runtime path currently being iterated on.

- `packages/react`
  Exists as a workspace package, but appears to be much less central to the current product path. The active schema-editor/workbench flow is not primarily built through this package.

## Current Assessment

The real center of gravity today is:

1. `packages/core`
2. `packages/ui`

That is where the current AutoForm editor/runtime work is happening.

`packages/react` looks increasingly like legacy or at least secondary packaging unless there is an external consumer depending on it. In this repo, the practical usage appears very light.

## Package Boundary Recommendation

If `packages/react` is not serving a real external-consumer boundary, it is reasonable to simplify and prefer module exports from `packages/ui` instead of maintaining a separate monorepo package surface just because it exists historically.

That is a good cleanup direction if:

- there are no meaningful external consumers depending on `@bwalkt/react`
- `packages/ui` is already the canonical React-facing API
- the separate package is creating more maintenance cost than value

That should be validated in a follow-up cleanup PR, not assumed blindly.

## Registry / Catalog Guidance

Concrete UI components or editor widgets should not be registered in `packages/core`.

Recommended split:

- `packages/core`: semantic contracts, field kinds, model/runtime interfaces, extension points
- `packages/ui`: concrete React components, widget registry/catalog, product-specific renderer mappings

So component registration for things like `MentionArea` belongs in `packages/ui` or a UI-adjacent registry layer, not `packages/core`.

## Follow-up Cleanup PR

A dedicated cleanup PR should verify and decide:

1. whether `packages/react` has any real active consumers
2. whether `packages/ui/src/stories` is still an active Storybook source or just legacy baggage
3. whether `@bwalkt/react` can be removed from `packages/ui/package.json`
4. whether the intended long-term package story is simply `core` + `ui`

## Why This Is Separate From `rjsf.md`

`docs/rjsf.md` should stay focused on parity/runtime/editor capability relative to `rjsf`.

These notes are about internal package boundaries and cleanup direction, which is a different concern.
