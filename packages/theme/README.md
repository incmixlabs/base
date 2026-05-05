# @bwalkt/theme

Shared theme/token utilities for browser and non-browser renderers.

This package owns the small, renderer-agnostic part of the theme system that can be used by browser UI, backend services, and email rendering. It does not render React components and does not import `packages/ui`.

## Package Boundary

`@bwalkt/theme` owns the shared theme contract, token constants, token compiler, semantic token resolver, and constrained inline-style transposer. UI packages should import those primitives from `@bwalkt/theme` and keep React rendering, CSS variable application, and component-specific behavior in `packages/ui`.

Backend and email services can use this package to compile theme editor output into a token map, resolve semantic token paths, and transpose supported token-backed text/box styles to inline-safe values. They should not import UI components or rely on browser CSS variables at render time.

## Concrete Theme Values

Canvas, image, and email renderers need concrete color values instead of CSS variables. Use `createConcreteThemeResolver` for general token lookup and `resolveConcreteChartRoleColor` for chart-role colors:

```ts
import { createConcreteThemeResolver, resolveConcreteChartRoleColor } from '@bwalkt/theme'

const resolver = createConcreteThemeResolver({
  'semantic.color.primary.text': '#0055aa',
})

const labelColor = resolver('semantic.color.primary.text')
const chartFill = resolveConcreteChartRoleColor({ color: 'chart1', role: 'fill', resolver })
```

The bundled JSON fallback map is only the boot/default non-browser baseline. Theme editor or server output should be passed as resolver tokens when product-specific colors need to override those defaults. In the server-sync path, persisted JSON tokens are the source of truth and should be refreshed on theme changes before rendering canvas, image, or email output.

For example, a Material-like palette should be represented in the theme contract and compiled first:

```ts
import { compileThemeTokens, createConcreteThemeResolver } from '@bwalkt/theme'

const { tokenMap } = compileThemeTokens(themeContract)
const resolver = createConcreteThemeResolver(tokenMap)

resolver('semantic.color.primary.primary') // Material primary if the contract defines it
```

## Email Inline Styles

Email clients cannot reliably consume the browser app's runtime CSS variables or theme context. Use `transposeTokenStyle` to resolve a constrained token-backed style definition to inline-safe values:

```ts
import { transposeTokenStyle } from '@bwalkt/theme'

const heading = transposeTokenStyle({
  color: { token: 'semantic.color.neutral.contrast' },
  fontFamily: { token: 'global.typography.fontSerif' },
  fontWeight: { token: 'global.fontWeight.bold' },
  padding: { tokens: ['global.spacing.8', 'global.spacing.0'] },
})
```

Supported email style categories are intentionally small:

- semantic text/background/border colors
- font family, size, weight, line height, letter spacing
- margin and padding values
- border, border color, and border radius
- text alignment and text transform
- max width

Theme editor output can override any token path in the resolver, including spacing, radius, typography, and semantic colors:

```ts
import { createEmailThemeResolver, transposeTokenStyle } from '@bwalkt/theme'

const resolver = createEmailThemeResolver({
  'semantic.color.primary.text': '#0055aa',
  'global.spacing.8': '40px',
  'global.borderRadius.lg': '16px',
})

const panel = transposeTokenStyle(
  {
    padding: { token: 'global.spacing.8' },
    borderRadius: { token: 'global.borderRadius.lg' },
  },
  { resolver },
)
```

Unsupported categories remain browser-only:

- layout engines such as grid/flex positioning
- pseudo states
- media queries
- arbitrary Vanilla Extract classes
- CSS variable references that have not been resolved to concrete values
