# Theme Style Token Guidelines

Theme style tokens make selected component styles tenant-overridable through the JSON theme contract. They are not a replacement for component props, Tailwind utilities, or vanilla-extract state styles.

## When To Create A Style Token

Create a theme style token when all of these are true:

- The style is part of a reusable component contract.
- Tenants, generated themes, or brand themes have a realistic reason to override it.
- The value can be represented as a stable CSS value in the theme JSON.
- The component can keep the current visual behavior as the CSS variable fallback.

Good examples:

- Dialog size-specific `maxWidth`.
- AppShell structural grid templates.
- Sidebar or panel width values when they are part of shell layout policy.
- ScrollArea rail/thumb dimensions.

Avoid style tokens for:

- One-off page composition.
- Local story/demo styling.
- Static layout that should stay in Tailwind or layout primitives.
- Primitive state styling such as `data-state`, hover, focus, disabled, and animation selectors.
- Values already controlled by a public prop.

## Naming

Use component-scoped paths:

```ts
component.<component>.<slot>.<property>
```

Examples:

```ts
component.appShell.layout.bodyGridTemplateColumns
component.dialog.size.md.maxWidth
component.scrollArea.size.sm.thickness
```

Use these slot conventions:

- `size.<size>.<property>` for size variants.
- `variant.<variant>.<property>` for visual variants.
- `shape.<shape>.<property>` for shape/radius variants.
- `layout.<property>` for structural layout policy.
- Direct component slots only when there is no meaningful variant axis.

Prefer semantic property names over raw CSS names when they carry domain meaning. Use raw CSS property names only when the token is intentionally exposing that CSS policy, such as `gridTemplateColumns`.

## Runtime Pattern

Component styles should consume tokens through runtime helpers in `packages/ui/src/theme/runtime/component-vars.ts`.

Keep the existing value as the fallback:

```ts
gridTemplateColumns: appShellLayoutVar('bodyGridTemplateColumns', 'auto minmax(0, 1fr)')
```

This guarantees:

- Existing apps render the same without tenant tokens.
- Theme JSON can override the value when needed.
- The component does not need runtime theme parsing logic.

## Contract Pattern

Add the token shape to `packages/theme/src/contract/theme-contract.ts`.

For the AppShell layout pilot:

```ts
export type AppShellComponentTokens = {
  layout?: Partial<{
    bodyGridTemplateColumns: string
    bodyWithSecondaryGridTemplateColumns: string
    bodyWithSecondaryRightGridTemplateColumns: string
  }>
}
```

The compiler already maps token paths to CSS variables:

```txt
component.appShell.layout.bodyGridTemplateColumns
-> --component-app-shell-layout-body-grid-template-columns
```

## Review Checklist

Before adding a style token:

- Is this style expected to vary by tenant/theme?
- Is there an existing prop that should control it instead?
- Is the fallback exactly the current value?
- Does the token path match the component structure?
- Are compiler and token-map tests updated?
- Is the value safe as a CSS variable string?

If the answer is unclear, keep the style local and add the token later when a real theme override use case appears.
