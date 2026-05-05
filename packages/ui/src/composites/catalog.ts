import { compactHorizontalChartCompositeSampleProps } from './compact-horizontal-chart/definition'
import { compactHorizontalChartCompositeSampleData } from './compact-horizontal-chart/sample-data'
import { swotCompositeSampleData } from './swot/sample-data'

const compositePropDefs = [
  {
    name: 'name',
    typeSimple: 'string',
    required: true,
    description: 'Registered composite definition name to resolve from the local composite catalog.',
  },
  {
    name: 'data',
    typeSimple: 'JsonValue',
    required: true,
    description: 'Runtime data object validated against the composite JSON Schema before rendering.',
  },
  {
    name: 'props',
    typeSimple: 'Record<string, unknown>',
    description: 'Runtime rendering options validated against the composite props schema before rendering.',
  },
] as const

const swotCompositeOverviewCode = `export default function Example() {
  const data = ${JSON.stringify(swotCompositeSampleData, null, 2)}
  const props = { bullet: 'star' }

  return (
    <Composite name="swot" data={data} props={props} />
  )
}`

const compactHorizontalChartCompositeOverviewCode = `export default function Example() {
  const data = ${JSON.stringify(compactHorizontalChartCompositeSampleData, null, 2)}
  const props = ${JSON.stringify(compactHorizontalChartCompositeSampleProps, null, 2)}

  return (
    <Composite name="compact-horizontal-chart" data={data} props={props} />
  )
}`

const createCompositeRuntimeLoader = () => async () => {
  const compositeRuntime = await import('@/composites/Composite')
  return compositeRuntime
}

export const compositeRuntimeScopeLoaders = {
  'swot-comparison-matrix': createCompositeRuntimeLoader(),
  'compact-horizontal-chart-composite': createCompositeRuntimeLoader(),
} satisfies Record<string, () => Promise<Record<string, unknown>>>

export const compositeCatalogEntryConfigs = [
  {
    slug: 'swot-comparison-matrix',
    title: 'SWOT Comparison Matrix',
    description: 'Four-quadrant strategy composite for strengths, weaknesses, opportunities, and threats.',
    family: 'composites',
    category: 'strategy',
    sourcePath: 'catalog://seed/composites/swot-comparison-matrix',
    componentName: 'Composite',
    propDefs: compositePropDefs,
    discovery: {
      summary:
        'Seeded SWOT composite that renders a strategy comparison matrix from local catalog JSON and validated runtime data.',
      group: 'Strategy',
      hierarchy: ['composites', 'strategy', 'matrix'],
      tags: ['swot', 'comparison', 'matrix', 'strategy', 'business', 'analysis', 'infographic'],
      keywords: [
        'SWOT Comparison Matrix',
        'swot-comparison-matrix',
        'strengths weaknesses opportunities threats',
        'strategy matrix',
        'business analysis',
        'comparison infographic',
      ],
    },
    meta: {
      templateKind: 'composite',
      sourceKind: 'seed',
      previewImage: '/docs/catalog/swot-comparison-matrix.svg?v=2',
      dependencies: ['Composite'],
      persistenceShape: 'composite-name-data',
      backendReady: true,
    },
    overviewCode: swotCompositeOverviewCode,
  },
  {
    slug: 'compact-horizontal-chart-composite',
    title: 'Compact Horizontal Chart Composite',
    description: 'Data-driven composite wrapper for compact part-to-whole bar rows with validated chart props.',
    family: 'composites',
    category: 'charts',
    sourcePath: 'catalog://seed/composites/compact-horizontal-chart',
    componentName: 'Composite',
    propDefs: compositePropDefs,
    discovery: {
      summary:
        'Seeded chart composite that renders compact horizontal distribution bars from validated JSON data and props.',
      group: 'Charts',
      hierarchy: ['composites', 'charts', 'part-to-whole'],
      tags: ['chart', 'horizontal chart', 'compact', 'part to whole', 'distribution', 'dashboard', 'composite'],
      keywords: [
        'Compact Horizontal Chart Composite',
        'compact-horizontal-chart-composite',
        'part to whole chart',
        'distribution bars',
        'traffic distribution',
        'dashboard composite',
      ],
    },
    meta: {
      templateKind: 'composite',
      sourceKind: 'seed',
      previewImage: '/docs/catalog/compact-horizontal-chart-composite.svg?v=1',
      dependencies: ['Composite', 'CompactHorizontalChart'],
      persistenceShape: 'composite-name-data-props',
      backendReady: true,
    },
    overviewCode: compactHorizontalChartCompositeOverviewCode,
  },
] as const
