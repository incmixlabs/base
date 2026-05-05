# Theme Token Taxonomy v1 (Issue #234)

This document defines the exact v1 token taxonomy and component scope used by ThemeProvider, ThemeEditor, and Figma MCP sync.

## Canonical root shape

```json
{
  "metadata": {
    "themeId": "string",
    "tenantId": "string",
    "version": "string",
    "extends": "string | null"
  },
  "global": {},
  "semantic": {},
  "component": {}
}
```

## Global domains (v1)

1. `global.color.hue`
- Palette hues and steps used to derive semantic lanes.

2. `global.size`
- Control sizing scale (`xs`..`5x`) with size properties.

3. `global.fontWeight`
- `light`, `regular`, `medium`, `bold`.

4. `global.borderRadius`
- `none`, `sm`, `md`, `lg`, `full`.

5. `global.spacing`
- Space scale (`0`..`9`).

6. `global.breakpoint`
- `xs`, `sm`, `md`, `lg`, `xl`.

7. `global.typography`
- `fontSans`, `fontSerif`, `fontMono`.

## Semantic domains (v1)

Namespace: `semantic.color.{lane}.{token}`

Lanes:
1. `default`
2. `primary`
3. `secondary`
4. `accent`
5. `neutral`
6. `info`
7. `success`
8. `warning`
9. `error`
10. `inverse`
11. `light`
12. `dark`

Token keys per lane:
1. `border`
2. `borderSubtle`
3. `surface`
4. `soft`
5. `softHover`
6. `primary`
7. `primaryAlpha`
8. `text`
9. `contrast`
10. `background`

## Component domains (v1)

Only these component namespaces are in scope:

1. `component.button.*`
2. `component.textField.*`
3. `component.badge.*`

### Component token fallback order

For every resolved component token:

1. `component.<name>.<token>`
2. `semantic.color.<lane>.<token>`
3. `global.<domain>.<token>`

## Lifecycle + governance (v1)

1. `draft`: editable
2. `review`: frozen candidate, validation required
3. `published`: immutable

Conflict policy: **Repo-first**.

## Out-of-scope in v1

1. Additional component namespaces beyond button/textField/badge.
2. Automatic Figma-to-runtime overwrite without review.
3. Tenant-specific custom execution logic in token payload.

## Notes

PR #287 output is treated as foundational input and should be mapped into this taxonomy. A canonical theme schema must enforce this structure in Phase 1.
