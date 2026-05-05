# Composite Component JSX Identity

Composite components should use a single user-facing identity: the PascalCase JSX name.

The persisted registry may still store a `slug` field for compatibility with the component registry schema, repository summaries, and existing local records. Presspoint should not expose that as a separate identity. For newly saved composites, the persisted `title`, `slug`, composite definition `name`, and JSX alias are all derived from the same JSX name.

## Goals

- Show one name in the editor, sidebar tree, save dialog, and validation messages.
- Keep names directly usable in authored JSX, such as `<SwotAnalysis />`.
- Enforce local uniqueness before saving.
- Preserve local-first readable sequencing for generated names.
- Treat renames as metadata-only until other composites reference the component.

## Naming Policy

The JSX name is normalized to a PascalCase component identifier.

Examples:

- `signup form` -> `SignupForm`
- `3d card` -> `Composite3dCard`
- `swot analysis` -> `SwotAnalysis`

If the preferred name already exists locally, use a readable sequence:

- `SignupForm`
- `SignupForm2`
- `SignupForm3`

The sequence is only a local suggestion. Remote sync or backend persistence can still introduce conflicts, so the saved record remains authoritative.

## Creation Modes

### Standalone Composite

When the user creates a new top-level component, suggest a JSX name from reviewed placement and tags.

Examples:

- `SignupForm`
- `SignupForm2`
- `SignupForm3`

### Forked Child Composite

When a parent composite references another composite and the user chooses to customize that child locally, create a fork with a contextual JSX name.

Example:

- Parent composite: `Dashboard`
- Referenced child: `FilterBar`
- Forked child: `DashboardFilterBar`

Forking changes ownership:

- Before fork: `Dashboard` references shared component `FilterBar`.
- After fork: `Dashboard` references `DashboardFilterBar`.
- Future edits to `DashboardFilterBar` do not affect `FilterBar`.
- Future edits to `FilterBar` do not affect `DashboardFilterBar`.

### Inline Extraction

When the user extracts a JSX section from a parent composite into a reusable component, suggest a JSX name from the parent and section name.

Examples:

- Parent: `Dashboard`
- Extracted section: `Filters`
- Suggested JSX name: `DashboardFilters`

If needed, sequence locally:

- `DashboardFilters`
- `DashboardFilters2`

## Local-First Behavior

Local suggestion rules:

- Check current local component JSX names.
- Ignore the current component's own JSX name while editing.
- Suggest the first readable available name.
- Preserve manual user edits.

Persistence rules:

- Never silently overwrite an existing component because a name collided.
- If persistence canonicalizes or changes the saved identity, return the saved record with the final values.
- The UI should refresh from the returned record or the next local repository update.

## Reference-Aware Renames

A JSX name rename is simple metadata only until another composite references it.

Once a JSX name is referenced by another composite, page, bookmark, or catalog entry, rename becomes a reference migration problem. The current rule is:

- Block rename when known references exist.

This keeps existing JSX references from silently breaking. Rename migration, alias/sunset mappings, and fork/customize flows can be added later, but they must be explicit workflows rather than implicit side effects of editing the JSX name.

## Editor Implication

Composite editing should distinguish between owned JSX and referenced components.

A parent composite may contain:

- Shared referenced components, shown as read-only by default.
- Forked child components, editable because the fork is locally owned.
- Inline JSX sections, editable as part of the parent.

For example, `Dashboard` can be made from:

- `Header + FilterBar + custom JSX`
- `Header + DashboardFilterBar + custom JSX`

In the second case, `DashboardFilterBar` is a fork of `FilterBar`, and edits to `DashboardFilterBar` no longer affect `FilterBar`.
