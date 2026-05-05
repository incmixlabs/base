# rjsf Parity Read

This is a rough comparison between AutoForm's current JSON Schema runtime and authoring surface and `rjsf` (`react-jsonschema-form`).

## Runtime

- Custom widgets / fields / `uiSchema`-driven rendering: near parity for current product needs.
  `rjsf` supports custom widgets, fields, and templates broadly. AutoForm already has strong widget-driven rendering and richer domain widgets for the current product direction.
- Defaults: near parity.
  `rjsf` auto-fills schema defaults. AutoForm already handles normalized defaults plus preview/runtime defaults.
- `oneOf` / `anyOf` / `allOf`: still behind overall.
  AutoForm now has good visibility plus root/nested `oneOf` picking in the workbench, but it still does not match `rjsf` for broader combinator runtime semantics.

## Editor / Authoring

- Schema editing UX: ahead in an important area.
  `rjsf` is primarily a renderer, not a schema authoring tool. AutoForm's workbench and JSON editor now provide:
- schema / `uiSchema` / normalized-model panes
- search
- local and external `$ref` navigation
- combinator visibility
- root and nested `oneOf` preview picking
- inline validation-path decoration
- schema-aware format editing
- schema-aware enum editing
- schema-aware `required` editing
- schema-aware `items` editing

This is a real differentiator.

## Where We Are Still Behind

- Full combinator semantics.
  The current workbench is strongest on `oneOf` preview selection. `anyOf` / `allOf` coverage and runtime behavior are still narrower than `rjsf`.
- Combinator-aware validation UX.
  We still need clearer branch-level validation feedback and stronger runtime behavior when combinators materially affect visible fields and validity.
- Broader `$ref` authoring workflows.
  Resolution and navigation are in much better shape now, but dedicated authoring flows like extract-to-`$defs`, replace-with-ref, and broader ref-management UX are still a gap.
- Broader schema merge and keyword coverage.
  More complete behavior is still needed for tuple-style `items`, conditional/merge edge cases, and broader keyword support.
- Customization surface.
  `rjsf` still has the wider theme/template/field/widget override ecosystem.
- Validation ergonomics.
  `rjsf` plus AJV path/error ergonomics are still more mature overall.

## Practical Verdict

- For the actual product direction, AutoForm is already close to `rjsf` in day-to-day form-building value.
- For raw JSON Schema engine breadth, `rjsf` is still ahead.
- For schema authoring UX, AutoForm is ahead, because `rjsf` largely does not try to compete there.

## Best Next Parity Moves

1. Combinator-aware validation UX
2. Broader `anyOf` / `allOf` runtime semantics
3. Schema-aware editing for `default`, `title`, and `description`
4. `$ref` authoring flows and broader ref-management UX
5. Tuple `items` and broader schema merge behavior

## Sources

- Widgets: https://rjsf-team.github.io/react-jsonschema-form/docs/usage/widgets
- Custom widgets and fields: https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-widgets-fields
- Custom templates: https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-templates/
- Internals: https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/internals/

## Audit Against #444

Audit against #444, using this parity read as the baseline.

### Done

- Schema-aware `required` editor: checkbox-based sibling toggles, with child rows hidden in schema mode.
- Schema-aware `items` editor: keyword-position detection, type select, tuple/object summaries, and protection against a literal property named `items`.
- Richer schema-aware enum and format editing: primitive-only enum add affordances and format select with custom-value preservation.
- Local and external `$ref` navigation: supported refs resolve and expose jump-to-target behavior.
- `oneOf` editor support in schema mode: branch picker on the `oneOf` row, raw `[0]`/`[1]` children hidden, synthetic selected-branch subtree, and synced preview story.
- Multiple issues per node: rows now render all issue strings for a path.

### Partial

- Workbench combinator support is materially better than the older baseline: nested `oneOf` traversal now covers `items`, `patternProperties`, `dependentSchemas`, `additionalProperties`, `anyOf`, and `allOf`.
- `anyOf` / `allOf` editing UX is still not there in `JsonViewEditor`; they are summarized, not authorable via schema-aware controls.
- Validation surfacing improved, but #444's broader goal to carry validation state consistently across schema, `uiSchema`, and preview is still larger than the current row-issue work.
- Schema metadata editing has started: enum/const-constrained `default` values now get a schema-aware selector, and schema keyword rows (including metadata keywords) no longer expose generic rename/clone actions outside user-defined entry contexts. `title` and `description` still need richer dedicated editing UX.

### Still Open

- Richer schema-aware editors for `title`, `description`, and structured `default` values are still incomplete; parts of that surface still fall back to generic tree editing.
- Dedicated `$ref` authoring flows like extract-to-`$defs` / replace-with-ref are still open.
- Branch-level validation feedback and fuller combinator validation UX are still open.
- Broader keyword/runtime parity audit is still open.

Best next item from here: schema-aware editing for `default`, `title`, and `description`.
