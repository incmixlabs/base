# Composites

Composites are reusable UI components authored as JSX and backed by structured
data. They let Presspoint and future apps compose richer screens without turning
every layout into one-off application code.

## Model

A composite has three durable parts:

- JSX source: the authored component body.
- Sample data: JSON used for preview, testing, and authoring defaults.
- Props schema: JSON Schema for rendering options accepted through `props`.
- Metadata: JSX name, catalog placement, tags, description, and summary.

The user-facing identity is the JSX component name. See
[Composite Component JSX Identity](./composite_component_jsx_identity.md).

## Runtime Shape

Composites should be referenced through the composite runtime, not direct module
imports from authored JSX.

```tsx
<Composite name="Swot" data={data} props={{ bullet: 'star' }} />
```

Named aliases may also be available in the authoring scope:

```tsx
<Swot data={data} props={{ bullet: 'star' }} />
```

Both forms should resolve through the same registry-backed definition.

## Data and Props

Use `data` for content and records:

- title, subtitle, labels, descriptions
- lists, groups, rows, metrics
- chart series and map values
- icon names and semantic color keys

Use `props` for rendering options:

- visual variants
- bullets, markers, density, or layout choices
- authoring-only behavior such as `editable`
- feature flags that do not belong to the content model

Example:

```json
{
  "title": "COMPARISON",
  "groups": [
    {
      "letter": "S",
      "title": "Strengths",
      "items": ["Distinct product craft", "Fast release cadence"]
    }
  ]
}
```

```tsx
<Composite name="Swot" data={data} props={{ bullet: 'star' }} />
```

## Props Contract

Each composite can define its own props contract:

```ts
export const swotCompositeDefinition = {
  name: 'swot',
  sampleData,
  sampleProps: { bullet: 'dot' },
  propsSchema: {
    type: 'object',
    properties: {
      bullet: {
        type: 'string',
        enum: ['dot', 'star', 'dash', 'check', 'diamond', 'triangle', 'circle', 'square', 'arrow', 'sparkle'],
        default: 'dot',
      },
    },
    additionalProperties: false,
  },
  jsx,
}
```

Runtime validation treats `data` and `props` separately:

- `jsonSchema` validates content data.
- `propsSchema` validates rendering options.
- `sampleData` seeds previews and schema generation.
- `sampleProps` documents default rendering options and can seed schema
  generation.

If no props schema is provided, composites accept an open object so existing
authored components can receive runtime props. Once a component publishes
`sampleProps` or `propsSchema`, the props contract should be explicit.

## Authoring Rules

- Persist structured JSON, not executable JavaScript.
- Keep imports, constructors, DOM refs, subscriptions, and cleanup inside trusted
  renderer code.
- Keep composite JSX deterministic for SSR/hydration.
- Do not silently overwrite another composite with the same JSX name.
- Block rename when known references exist until explicit migration exists.
- Prefer AutoForm-driven metadata and data editors so we dogfood the same
  dynamic-form model users will use.

## References

Composites may reference other composites. The registry must make referenced
definitions available in the runtime scope so nested composites render:

```tsx
export default function Swot2({ data }) {
  return <Composite name="Swot" data={data} />
}
```

Reference tracking is required for safe delete and rename behavior:

- Delete should be blocked when another composite references the target.
- Rename should be blocked until reference migration is implemented.
- Future migration can update known references or create explicit aliases.

## Charts and GeoMaps

Chart composites should use our chart wrappers rather than raw chart library
calls in authored JSX. The current chart runtime direction is documented in
[Charts](../chart/charts.md).

For GeoMap composites:

- Start with G2-backed dashboard maps for choropleths, heat maps, and sales by
  location.
- Keep the public data shape semantic: `region`, `value`, `label`, `color`,
  tooltip metadata.
- Escalate to AntV L7 only for full map-scene requirements such as pan/zoom
  tiles, GIS layers, and large spatial overlays.

## Infographics

AntV Infographic can fit composite authoring because its syntax is content-first
and AI-friendly. The composite should still persist structured data first:

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

The trusted renderer can translate that JSON to Infographic syntax:

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

Then the renderer owns the package lifecycle:

```ts
import { Infographic } from '@antv/infographic'

const infographic = new Infographic({
  container,
  height: 240,
  editable,
})

infographic.render(syntax)
```

That keeps generated content editable by AutoForm and AI while keeping
third-party imperative rendering behind a trusted boundary.

## Roadmap

- Add authoring UI for composite prop schemas and sample props.
- Add reference migration for rename.
- Add structured chart, GeoMap, and infographic composite renderers.
- Add dependency discovery so referenced composites and renderer dependencies can
  be surfaced in the catalog.
- Add AI translation from natural-language requirements into composite data and
  AutoForm-compatible schemas.
