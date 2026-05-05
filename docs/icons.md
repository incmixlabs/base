# Icons

This repo currently uses a curated string-to-icon registry for dynamic Lucide icons in:

- `packages/ui/src/elements/button/dynamic-icon.tsx`

The goal is to keep string-based icon APIs for UI components such as `Button`, `IconButton`, `Callout`, `Badge`, and tab/segmented-control icon helpers without pulling the full `lucide-react` package into a runtime chunk.

Icons in the curated safelist render synchronously from `lucide-react`. Icons outside that safelist fall back to the unified app API path:

- `GET /api/icons/lucide/{name}`

That endpoint is served by [services/bff](../services/bff) and returns raw SVG with `stroke="currentColor"`. Semantic color and theme application stays in `packages/ui`; `Icon`, `IconButton`, and related components continue to resolve colors through CSS variables and theme context.

## Currently Available Dynamic Icons

These icon exports are currently included in the curated registry:

- `AlertTriangle`
- `CircleAlert`
- `CircleCheckBig`
- `CircleSlash`
- `ChevronDown`
- `ChevronRight`
- `Copy`
- `Download`
- `EllipsisVertical`
- `Info`
- `Mail`
- `Monitor`
- `Palette`
- `Pencil`
- `Phone`
- `RefreshCw`
- `Search`
- `Settings`
- `Smartphone`
- `Sparkles`
- `SquarePen`
- `Tablet`
- `Trash2`
- `TriangleAlert`
- `X`

## Supported String Names

These string names currently resolve through the shared dynamic icon registry:

- `alert-triangle`
- `check-circle`
- `chevron-down`
- `chevron-right`
- `close`
- `copy`
- `circle-alert`
- `circle-check-big`
- `circle-slash`
- `delete`
- `download`
- `edit`
- `ellipsis-vertical`
- `info`
- `mail`
- `monitor`
- `palette`
- `phone`
- `refresh-cw`
- `search`
- `settings`
- `smartphone`
- `sparkle`
- `tablet`
- `trash`
- `warning`

These also resolve when the string naturally normalizes to a curated export name, for example:

- `square-pen`
- `x`
- `triangle-alert`

## Adding a New Safelisted Dynamic Icon

If a component needs a string-driven icon that must render without a network request:

1. Import the icon statically in `packages/ui/src/elements/button/dynamic-icon.tsx`
2. Add it to `SafeListIcons`
3. Add any friendly aliases to `iconAliasMap` if needed

This is intentionally manual so bundle size stays predictable.

If the icon is not performance-critical or is user/configuration driven, leave it outside the safelist and let the BFF resolve it from `/api/icons/lucide/{name}`.
