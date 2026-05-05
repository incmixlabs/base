# Charts

## Decision

Use `@antv/g2` as the default chart runtime for product charts.

The repo already uses G2 for canvas chart rendering in
`packages/ui/src/charts/bar-chart/BarChartCanvas.tsx`, and the chart roadmap now
favors a canvas-capable grammar behind stable repo-level chart components.

## Why G2

- G2 gives us a canvas-first path for dense dashboards without changing chart
  vocabulary later.
- The grammar is low-level enough for our composite and dynamic-UI direction:
  we can define our own stable props and renderers instead of leaking a
  third-party component model.
- G2 keeps us inside the AntV ecosystem for future AVA, infographic, graph, and
  geo work.

## Library Policy

- Default chart engine: `@antv/g2`
- Optional AI/chart recommendation layer: `@antv/g2-extension-ava`
- Optional infographic renderer: `@antv/infographic`
- Optional advanced map scene engine: AntV L7
- Not the default: ECharts, Highcharts

Do not expose raw G2 everywhere. Build repo-level chart components with stable
props, then keep G2 as the implementation detail.

## Shared Model Layer

Chart renderers should share renderer-independent model/spec builders before
they render anything. The shared layer owns normalization, total/domain
calculation, formatted value labels, chart role assignment, and concrete color
resolution for non-browser output. React, canvas, SVG, G2, image, and email
renderers should only own output mechanics.

Small chart models that backend/email also need can live in `@bwalkt/theme`
because that package is already renderer-agnostic and owns concrete token
resolution. For example, compact part-to-whole charts use
`createPartToWholeChartModel()` so the browser component and backend/email
renderers can consume the same normalized data, labels, and color decisions.

Chart color output follows the same rule. `createChartThemeTokenOutput()`
returns a serializable token payload for backend/email/image renderers from the
same semantic and chart role tokens used by browser canvas renderers. Browser
canvas components build that payload with `createChartStyleThemeTokenOutput()`,
which resolves active CSS variables before creating G2 specs. Backend and email
jobs should use `createChartThemeTokenOutput()` with server-provided theme
tokens or the default concrete fallback map.

Map charts follow the same split:

- `createMapChartModel()` enriches GeoJSON-like features for G2 rendering.
- `createMapChartSpec()` emits the G2 `geoPath` spec from enriched features.
- `createMapChartSummaryModel()` emits a renderer-independent summary list for
  sidebars, backend jobs, and email-safe fallbacks. By default it resolves
  chart and semantic color keys to concrete token values, while browser
  renderers can inject a CSS-variable resolver.

Email and backend output should use these shared model helpers instead of
reading CSS variables or hardcoding palette fallbacks. A later image-rendering
path can add a server-side PNG/SVG map renderer without changing the persisted
chart data contract.

## Renderer Contract

Chart authoring should use `AutoformChartDef` as the renderer-neutral contract.
The public chart definition describes chart type, data source, encodings,
aggregation, titles, interaction hints, and theme intent. It should not expose
raw G2 specs, ECharts options, Plotly traces, or one-off component props as the
persisted schema.

Use `AutoformChart` when a shell needs the default renderer registry and use
`getChartComponent` when a dashboard, table, spreadsheet overlay, or product
surface needs to supply a custom renderer:

```tsx
<AutoformChart
  chart={chart}
  getChartComponent={({ chart, data, width, height, theme, readonly }) => (
    <CustomChart chart={chart} data={data} width={width} height={height} theme={theme} readonly={readonly} />
  )}
/>
```

Renderer resolution is intentionally explicit:

1. `getChartComponent`
2. `renderers[chart.type]`
3. built-in default renderers
4. unsupported-renderer fallback

Use `loadingFallback` for lazy renderer loading and `unsupportedFallback` for
missing chart types. These states are intentionally separate so a loading
skeleton cannot mask an unregistered renderer as a permanently pending chart.

Default renderers should remain lazy-loaded by chart type or renderer family.
G2 is the default runtime for common analytical charts, while custom React
charts can implement the same renderer props for specialized visuals such as
compact horizontal charts.

For screens that should not depend on built-in renderers at all, use
`AutoformChartHost` from the lightweight chart core import and provide
`getChartComponent` or `renderers`:

```tsx
import { AutoformChartHost } from '@bwalkt/ui/charts/core'

<AutoformChartHost chart={chart} renderers={{ [chart.type]: CustomChart }} />
```

Use `@bwalkt/ui/charts/core` for the renderer-neutral contract, data helpers,
renderer resolver, and host component. Use `@bwalkt/ui/charts/renderers` when a
surface explicitly wants the built-in renderer maps:

```tsx
import { g2AutoformChartRenderers } from '@bwalkt/ui/charts/renderers'
```

This keeps G2 as the default chart runtime without making G2 the chart contract.
The G2-backed bar/column renderer is still lazy-loaded behind the built-in
renderer map, and custom-only chart surfaces can stay on the core import path.

## Renderer Audit

Current shared-model status:

- `CompactHorizontalChart` uses `createPartToWholeChartModel()` for
  normalization, labels, and color resolution.
- `BarChartCanvas` uses `createBarChartSpec()` for domain calculation,
  non-finite value sanitization, and G2 spec generation.
- `MapChart` uses `createMapChartSummaryModel()` for totals, top-N summary
  rows, "other" rows, and accessible summary text.
- `MapChartCanvas` uses `createMapChartModel()` and `createMapChartSpec()` for
  feature enrichment and G2 spec generation.
- `SummaryBarChart` uses `createSummaryBarChartModel()` and
  `createSummaryBarChartSpec()` for G2-backed stacked table-summary histograms.

Remaining follow-up work:

- `packages/ui/src/charts/sparklines/Sparkline.tsx` still computes min/max and
  points locally. Extract a tiny sparkline model if backend/email need the same
  output.
- Browser canvas renderers use `createChartStyleThemeTokenOutput()` as the DOM
  adapter, then pass the same chart token output shape into shared spec/model
  helpers that backend/email use with concrete theme tokens.
- Full map images for email are not implemented yet. The current email-safe map
  output is the summary model; an SSR/PNG helper can consume the same map model
  later.

## GeoMap Direction

Start with G2-backed GeoMap components for dashboard maps:

- choropleth maps
- country/region heat maps
- simple sales-by-location maps
- static or lightly interactive maps inside cards and reports

Use GeoJSON or TopoJSON as data inputs and keep our public API data-driven. The
component should accept semantic fields such as `region`, `value`, `label`,
`color`, and optional tooltip metadata. It should not require consumers to know
G2 internals.

Escalate to AntV L7 only when the use case needs a real map scene:

- pan/zoom base maps
- tiles or map providers
- large spatial layers
- points, routes, and polygons over geographic projections
- GIS-style interactions

In other words: G2 GeoMap for dashboard cards first, L7 for map applications.

## Infographics and Composites

AntV Infographic is interesting for AI-generated visual summaries because its
syntax is Mermaid-like and data-oriented. The current AntV docs describe syntax
like this:

```text
infographic list-row-horizontal-icon-arrow
data
  title Internet Technology Evolution
  desc Key milestones from Web 1.0 to AI era
  lists
    - time 1991
      label World Wide Web
      desc Tim Berners-Lee launches first website, opening the Internet era
      icon mdi/web
```

For our composites, the persisted value should be structured data, not
executable JavaScript:

```json
{
  "template": "list-row-horizontal-icon-arrow",
  "title": "Internet Technology Evolution",
  "desc": "Key milestones from Web 1.0 to AI era",
  "lists": [
    {
      "time": "1991",
      "label": "World Wide Web",
      "desc": "Tim Berners-Lee launches first website, opening the Internet era",
      "icon": "mdi/web"
    }
  ]
}
```

Then the trusted renderer can translate that data into Infographic syntax and
run the package code:

```tsx
<Composite name="TechnologyTimeline" data={data} props={{ editable: true }} />
```

Inside the renderer, not inside persisted data:

```ts
import { Infographic } from '@antv/infographic'

const infographic = new Infographic({
  container,
  height: 240,
  editable,
})

infographic.render(syntax)
```

Rules for composites:

- Persisted composite data should be structured infographic JSON.
- Syntax strings are renderer-generated/runtime artifacts, not persisted
  source-of-truth content.
- Imports, constructors, DOM containers, and lifecycle cleanup belong in the
  renderer implementation.
- `editable: true` is an authoring/runtime prop, not part of the content data.
- Prefer structured JSON as the source of truth so AutoForm and AI can edit it.
  Generate syntax from JSON when the Infographic runtime requires syntax.

## Other Options

- `visx`: good for custom SVG/chart primitives, but more manual work.
- `uPlot`: strong for dense time-series, but too narrow as the default.
- `ECharts`: capable and canvas-capable, but heavier than we need as the default
  AntV-aligned runtime.
- `Highcharts`: useful in enterprise contexts, but not our default open chart
  foundation.

## Decision Summary

Use G2 as the default chart engine for new work. Wrap it behind our own chart
components. Use G2-backed GeoMap for dashboard maps, escalate to L7 only for
full map-scene needs, and treat AntV Infographic as a renderer for structured
composite data rather than a reason to persist executable code.
