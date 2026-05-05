import type { ReactNode } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  COMPOSITE_DEFINITIONS_STORAGE_KEY,
  Composite,
  compositeGlyphs,
  getCompositeDefinition,
  loadCompositeDefinitionsFromLocalStorage,
  registerLocalStorageCompositeDefinitions,
  registerCompositeDefinition,
  resolveCompositeGlyph,
  unregisterCompositeDefinition,
} from './Composite'
import {
  compactHorizontalChartCompositePropsSchema,
  compactHorizontalChartCompositeSampleProps,
} from './compact-horizontal-chart/definition'
import { compactHorizontalChartCompositeSampleData } from './compact-horizontal-chart/sample-data'
import { swotCompositeSampleData } from './swot/sample-data'
import { swotCompositePropsSchema, swotCompositeSampleProps } from './swot/definition'

afterEach(() => {
  cleanup()
  window.localStorage.removeItem(COMPOSITE_DEFINITIONS_STORAGE_KEY)
  unregisterCompositeDefinition('cache-test')
  unregisterCompositeDefinition('__proto__')
  unregisterCompositeDefinition('runtime-scope-test')
  unregisterCompositeDefinition('runtime-scope-render-definition-test')
  unregisterCompositeDefinition('immutable-test')
  unregisterCompositeDefinition('late-test')
  unregisterCompositeDefinition('persisted-json-render-test')
  unregisterCompositeDefinition('persisted-jsx-test')
  unregisterCompositeDefinition('persisted-collision-test')
  unregisterCompositeDefinition('data-reactivity-test')
  unregisterCompositeDefinition('schema-reactivity-test')
  unregisterCompositeDefinition('props-test')
  unregisterCompositeDefinition('props-schema-test')
  unregisterCompositeDefinition('props-schema-reactivity-test')
  delete (globalThis as Record<string, unknown>).__compositeTestCompileCount
})

describe('Composite', () => {
  it('renders the SWOT template icon from authored data', () => {
    const { container } = render(<Composite name="swot" data={swotCompositeSampleData} />)

    expect(screen.getByText('COMPARISON')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-circle-minus')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-rocket')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-circle-alert')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-sparkles')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-triangle-alert')).toBeInTheDocument()
  })

  it('passes runtime props to JSX composites', () => {
    registerCompositeDefinition({
      name: 'props-test',
      sampleData: { label: 'Runtime' },
      jsx: `
export default function PropsTemplate({ data, props }) {
  return <Text>{data.label}:{props?.tone}</Text>
}
`,
    })

    render(<Composite name="props-test" data={{ label: 'Runtime' }} props={{ tone: 'soft' }} />)

    expect(screen.getByText('Runtime:soft')).toBeInTheDocument()
  })

  it('uses composite glyph props in the SWOT template', () => {
    render(<Composite name="swot" data={swotCompositeSampleData} props={{ bullet: 'star' }} />)

    const expectedBulletCount = swotCompositeSampleData.groups.reduce((count, group) => count + group.items.length, 0)
    expect(screen.getAllByText('★')).toHaveLength(expectedBulletCount)
    expect(screen.queryByText('•')).not.toBeInTheDocument()
  })

  it('exposes and validates the SWOT props schema', () => {
    expect(swotCompositeSampleProps).toEqual({ bullet: 'dot' })
    expect(swotCompositePropsSchema.properties?.bullet).toMatchObject({
      type: 'string',
      enum: Object.keys(compositeGlyphs),
      default: 'dot',
    })

    render(<Composite name="swot" data={swotCompositeSampleData} props={{ bullet: 'invalid-bullet' }} />)

    expect(screen.getByText('Invalid composite props: swot')).toBeInTheDocument()
    expect(screen.getByText(/must be equal to one of the allowed values/)).toBeInTheDocument()
  })

  it('renders the compact horizontal chart composite with data and props', () => {
    render(
      <Composite
        name="compact-horizontal-chart"
        data={compactHorizontalChartCompositeSampleData}
        props={compactHorizontalChartCompositeSampleProps}
      />,
    )

    expect(screen.getByText('Top countries')).toBeInTheDocument()
    expect(screen.getByText('Traffic distribution')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Top countries: United States 34%, Russia 26%/ })).toBeInTheDocument()
  })

  it('exposes and validates the compact horizontal chart props schema', () => {
    expect(compactHorizontalChartCompositePropsSchema.properties?.valueFormat).toMatchObject({
      type: 'string',
      enum: ['number', 'percent', 'currency'],
      default: 'percent',
    })

    render(
      <Composite
        name="compact-horizontal-chart"
        data={compactHorizontalChartCompositeSampleData}
        props={{ ...compactHorizontalChartCompositeSampleProps, valueFormat: 'raw' }}
      />,
    )

    expect(screen.getByText('Invalid composite props: compact-horizontal-chart')).toBeInTheDocument()
    expect(screen.getByText(/valueFormat/)).toHaveTextContent('must be equal to one of the allowed values')
  })

  it('resolves named and custom composite glyphs', () => {
    expect(resolveCompositeGlyph('star')).toBe('★')
    expect(resolveCompositeGlyph(' star ')).toBe('★')
    expect(resolveCompositeGlyph('→')).toBe('→')
    expect(resolveCompositeGlyph('')).toBe('•')
  })

  it('reuses the compiled template across rerenders for the same definition', () => {
    const compileCountKey = '__compositeTestCompileCount'

    registerCompositeDefinition({
      name: 'cache-test',
      sampleData: { title: 'Initial' },
      jsx: `
globalThis.${compileCountKey} = (globalThis.${compileCountKey} ?? 0) + 1

export default function CacheTestTemplate({ data }) {
  return <Text>{data.title}</Text>
}
`,
    })

    const { rerender } = render(<Composite name="cache-test" data={{ title: 'Initial' }} />)

    expect(screen.getByText('Initial')).toBeInTheDocument()
    expect((globalThis as Record<string, unknown>)[compileCountKey]).toBe(1)

    rerender(<Composite name="cache-test" data={{ title: 'Updated' }} />)

    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect((globalThis as Record<string, unknown>)[compileCountKey]).toBe(1)
  })

  it('renders composites with definition-specific runtime scope bindings', () => {
    function RuntimeBadge({ children }: { children: ReactNode }) {
      return <span data-testid="runtime-badge">{children}</span>
    }

    registerCompositeDefinition({
      name: 'runtime-scope-test',
      sampleData: { label: 'Scoped' },
      runtimeScope: { RuntimeBadge },
      jsx: `
export default function RuntimeScopeTemplate({ data }) {
  return <RuntimeBadge>{data.label}</RuntimeBadge>
}
`,
    })

    render(<Composite name="runtime-scope-test" data={{ label: 'Scoped' }} />)

    expect(screen.getByTestId('runtime-badge')).toHaveTextContent('Scoped')
  })

  it('renders declarative composites with definition-specific runtime scope bindings', () => {
    function RuntimeBadge({ children }: { children: ReactNode }) {
      return <span data-testid="runtime-badge">{children}</span>
    }

    registerCompositeDefinition({
      name: 'runtime-scope-render-definition-test',
      sampleData: { label: 'Scoped JSON' },
      runtimeScope: { RuntimeBadge },
      renderDefinition: {
        component: 'RuntimeBadge',
        children: { $data: 'label' },
      },
    })

    render(<Composite name="runtime-scope-render-definition-test" data={{ label: 'Scoped JSON' }} />)

    expect(screen.getByTestId('runtime-badge')).toHaveTextContent('Scoped JSON')
  })

  it('supports arbitrary definition names without prototype-key collisions', () => {
    registerCompositeDefinition({
      name: '__proto__',
      sampleData: { label: 'Prototype-safe' },
      jsx: `
export default function PrototypeNameTemplate({ data }) {
  return <Text>{data.label}</Text>
}
`,
    })

    render(<Composite name="__proto__" data={{ label: 'Prototype-safe' }} />)

    expect(screen.getByText('Prototype-safe')).toBeInTheDocument()
  })

  it('stores registered definitions as immutable snapshots', () => {
    const sampleData = { label: 'Original' }
    const sampleProps = { tone: 'soft' }

    registerCompositeDefinition({
      name: 'immutable-test',
      sampleData,
      sampleProps,
      jsx: `
export default function ImmutableTemplate({ data }) {
  return <Text>{data.label}</Text>
}
`,
    })

    sampleData.label = 'Mutated'
    sampleProps.tone = 'solid'

    expect(getCompositeDefinition('immutable-test')?.sampleData).toEqual({ label: 'Original' })
    expect(getCompositeDefinition('immutable-test')?.sampleProps).toEqual({ tone: 'soft' })
  })

  it('exposes a persisted json schema on registered definitions', () => {
    registerCompositeDefinition({
      name: 'persisted-json-render-test',
      sampleData: { label: 'Persisted' },
      jsx: `
export default function PersistedSchemaTemplate({ data }) {
  return <Text>{data.label}</Text>
}
`,
    })

    expect(getCompositeDefinition('persisted-json-render-test')?.jsonSchema).toMatchObject({
      title: 'persisted-json-render-test composite data',
      type: 'object',
      properties: {
        label: { type: 'string' },
      },
      required: ['label'],
      additionalProperties: false,
    })
  })

  it('loads persisted json render definitions from localStorage on component usage and validates with their schema', async () => {
    window.localStorage.setItem(
      COMPOSITE_DEFINITIONS_STORAGE_KEY,
      JSON.stringify([
        {
          name: 'persisted-json-render-test',
          sampleData: { label: 'Persisted' },
          jsonSchema: {
            type: 'object',
            properties: {
              label: { type: 'string' },
            },
            required: ['label'],
            additionalProperties: false,
          },
          renderDefinition: {
            component: 'Text',
            children: { $data: 'label' },
          },
        },
      ]),
    )

    expect(window.localStorage.getItem(COMPOSITE_DEFINITIONS_STORAGE_KEY)).toContain('persisted-json-render-test')

    render(<Composite name="persisted-json-render-test" data={{ label: 'Persisted from storage' }} />)

    expect(await screen.findByText('Persisted from storage')).toBeInTheDocument()
  })

  it('rejects executable jsx from persisted local definitions', async () => {
    window.localStorage.setItem(
      COMPOSITE_DEFINITIONS_STORAGE_KEY,
      JSON.stringify([
        {
          name: 'persisted-jsx-test',
          sampleData: { label: 'Blocked' },
          jsonSchema: {
            type: 'object',
            properties: {
              label: { type: 'string' },
            },
            required: ['label'],
            additionalProperties: false,
          },
          jsx: `
export default function PersistedJsxTemplate({ data }) {
  return <Text>{data.label}</Text>
}
`,
        },
      ]),
    )

    render(<Composite name="persisted-jsx-test" data={{ label: 'Blocked' }} />)

    expect(await screen.findByText('Unknown composite: persisted-jsx-test')).toBeInTheDocument()
    expect(screen.queryByText('Blocked')).not.toBeInTheDocument()
  })

  it('ignores localStorage read failures when loading persisted definitions', () => {
    const getItem = window.localStorage.getItem
    window.localStorage.getItem = () => {
      throw new Error('blocked storage')
    }

    try {
      expect(loadCompositeDefinitionsFromLocalStorage()).toEqual([])
    } finally {
      window.localStorage.getItem = getItem
    }
  })

  it('does not let persisted definitions overwrite existing registry entries', () => {
    registerCompositeDefinition({
      name: 'persisted-collision-test',
      sampleData: { label: 'Authored' },
      renderDefinition: {
        component: 'Text',
        children: { $data: 'label' },
      },
    })

    window.localStorage.setItem(
      COMPOSITE_DEFINITIONS_STORAGE_KEY,
      JSON.stringify([
        {
          name: 'persisted-collision-test',
          sampleData: { label: 'Persisted' },
          jsonSchema: {
            type: 'object',
            properties: {
              label: { type: 'number' },
            },
            required: ['label'],
            additionalProperties: false,
          },
          renderDefinition: {
            component: 'Text',
            children: { $data: 'label' },
          },
        },
      ]),
    )

    registerLocalStorageCompositeDefinitions()

    expect(getCompositeDefinition('persisted-collision-test')?.sampleData).toEqual({ label: 'Authored' })
  })

  it('revalidates when mounted composite data changes', () => {
    registerCompositeDefinition({
      name: 'data-reactivity-test',
      sampleData: { label: 'Initial' },
      renderDefinition: {
        component: 'Text',
        children: { $data: 'label' },
      },
    })

    const { rerender } = render(<Composite name="data-reactivity-test" data={{ label: 'Initial' }} />)

    expect(screen.getByText('Initial')).toBeInTheDocument()

    rerender(<Composite name="data-reactivity-test" data={{ label: 'Updated' }} />)

    expect(screen.getByText('Updated')).toBeInTheDocument()

    rerender(<Composite name="data-reactivity-test" data={{ label: 123 }} />)

    expect(screen.getByText('Invalid composite data: data-reactivity-test')).toBeInTheDocument()
    expect(screen.queryByText('Updated')).not.toBeInTheDocument()
  })

  it('updates mounted composites when a registered schema changes', () => {
    registerCompositeDefinition({
      name: 'schema-reactivity-test',
      sampleData: { label: 'Initial' },
      renderDefinition: {
        component: 'Text',
        children: { $data: 'label' },
      },
    })

    render(<Composite name="schema-reactivity-test" data={{ label: 123 }} />)

    expect(screen.getByText('Invalid composite data: schema-reactivity-test')).toBeInTheDocument()

    act(() => {
      registerCompositeDefinition({
        name: 'schema-reactivity-test',
        sampleData: { label: 0 },
        jsonSchema: {
          type: 'object',
          properties: {
            label: { type: 'number' },
          },
          required: ['label'],
          additionalProperties: false,
        },
        renderDefinition: {
          component: 'Text',
          children: { $data: 'label' },
        },
      })
    })

    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('validates runtime props against the registered props schema', () => {
    registerCompositeDefinition({
      name: 'props-schema-test',
      sampleData: { label: 'Runtime' },
      sampleProps: { tone: 'soft' },
      propsSchema: {
        type: 'object',
        properties: {
          tone: {
            type: 'string',
            enum: ['soft', 'solid'],
          },
        },
        additionalProperties: false,
      },
      jsx: `
export default function PropsSchemaTemplate({ data, props }) {
  return <Text>{data.label}:{props.tone}</Text>
}
`,
    })

    const { rerender } = render(
      <Composite name="props-schema-test" data={{ label: 'Runtime' }} props={{ tone: 'ghost' }} />,
    )

    expect(screen.getByText('Invalid composite props: props-schema-test')).toBeInTheDocument()
    expect(screen.getByText(/must be equal to one of the allowed values/)).toBeInTheDocument()

    rerender(<Composite name="props-schema-test" data={{ label: 'Runtime' }} props={{ tone: 'solid' }} />)

    expect(screen.getByText('Runtime:solid')).toBeInTheDocument()
  })

  it('updates mounted composites when a registered props schema changes', () => {
    registerCompositeDefinition({
      name: 'props-schema-reactivity-test',
      sampleData: { label: 'Runtime' },
      sampleProps: { tone: 'soft' },
      propsSchema: {
        type: 'object',
        properties: {
          tone: {
            type: 'string',
            enum: ['soft'],
          },
        },
        additionalProperties: false,
      },
      jsx: `
export default function PropsSchemaReactivityTemplate({ data, props }) {
  return <Text>{data.label}:{props.tone}</Text>
}
`,
    })

    render(<Composite name="props-schema-reactivity-test" data={{ label: 'Runtime' }} props={{ tone: 'solid' }} />)

    expect(screen.getByText('Invalid composite props: props-schema-reactivity-test')).toBeInTheDocument()

    act(() => {
      registerCompositeDefinition({
        name: 'props-schema-reactivity-test',
        sampleData: { label: 'Runtime' },
        sampleProps: { tone: 'solid' },
        propsSchema: {
          type: 'object',
          properties: {
            tone: {
              type: 'string',
              enum: ['soft', 'solid'],
            },
          },
          additionalProperties: false,
        },
        jsx: `
export default function PropsSchemaReactivityTemplate({ data, props }) {
  return <Text>{data.label}:{props.tone}</Text>
}
`,
      })
    })

    expect(screen.getByText('Runtime:solid')).toBeInTheDocument()
  })

  it('updates mounted composites when a definition is registered later', () => {
    render(<Composite name="late-test" data={{ label: 'Late' }} />)

    expect(screen.getByText('Unknown composite: late-test')).toBeInTheDocument()

    act(() => {
      registerCompositeDefinition({
        name: 'late-test',
        sampleData: { label: 'Late' },
        jsx: `
export default function LateTemplate({ data }) {
  return <Text>{data.label}</Text>
}
`,
      })
    })

    expect(screen.getByText('Late')).toBeInTheDocument()
  })
})
