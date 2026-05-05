## Theme Token Flow

Current state:

- `design-tokens.css` is generated and used at runtime

### Runtime Sequence

```mermaid
sequenceDiagram
  participant Radix as @radix-ui/colors
  participant RuntimePalette as runtime-palette-vars.ts
  participant ThemeProvider as ThemeProvider

  Radix->>RuntimePalette: provide hue scales
  RuntimePalette->>RuntimePalette: convert hex to oklch palette vars
  ThemeProvider->>RuntimePalette: buildRuntimePaletteVars(mode)
  RuntimePalette-->>ThemeProvider: raw palette CSS vars
  ThemeProvider->>ThemeProvider: emit runtime CSS variables
```

### Generation Sequence

```mermaid
sequenceDiagram
  participant Radix as @radix-ui/colors
  participant CSSGen as generate-design-tokens-css.ts
  participant CSS as design-tokens.css

  Radix->>CSSGen: provide source color scales
  CSSGen->>CSS: generate semantic/runtime CSS token file
```

### Explanation

`@radix-ui/colors` is the color source.

`generate-design-tokens-css.ts` generates `packages/ui/src/theme/design-tokens.css`.

`design-tokens.css` is allowed on the runtime path because it is a runtime CSS asset. The browser uses the CSS variables defined there.

`runtime-palette-vars.ts` derives runtime palette values directly from `@radix-ui/colors`.

`ThemeProvider` uses `runtime-palette-vars.ts` and emits runtime CSS vars.

### Rule

- If runtime needs token data, derive it from source.
- If a file is just an export artifact, keep it off the runtime path.
