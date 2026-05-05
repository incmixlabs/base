'use client'

import type { CatalogEntry } from '@incmix/ui/editor/catalog'

export type ElementDocsBaseEntry = Pick<
  CatalogEntry,
  'slug' | 'title' | 'description' | 'sourcePath' | 'propDefs' | 'overviewCode' | 'runtimeScope'
> &
  Partial<
    Pick<CatalogEntry, 'schemaVersion' | 'kind' | 'id' | 'runtime' | 'discovery' | 'ownership' | 'persistence' | 'meta'>
  >

export type DocsSection = {
  id: string
  title: string
  description: string
  code: string
  scope?: Record<string, unknown>
}

export type DocsApiSection = {
  id: string
  title: string
  propDefs: CatalogEntry['propDefs']
}

export type ElementDocsEntry = ElementDocsBaseEntry & {
  apiSections?: readonly DocsApiSection[]
  sections: readonly DocsSection[]
}

export type ElementDocsNavItem = {
  slug: string
  title: string
}

type PropDefsRecord = Record<string, unknown>
type AutoPropValue = string | boolean
const autoProps = ['size', 'color', 'variant', 'highContrast'] as const
type AutoProp = (typeof autoProps)[number]

type AutoComponentConfigBase = {
  base: ElementDocsBaseEntry
  propDefsByName: PropDefsRecord
  props: readonly AutoProp[]
  codeByProp?: Partial<Record<AutoProp, (valuesLiteral: string) => string>>
  extraSections?: readonly DocsSection[]
}

type InlineAutoComponentConfig = AutoComponentConfigBase & {
  display: 'inline'
  inlineComponent: 'Badge' | 'Button'
}

type NonInlineAutoComponentConfig = AutoComponentConfigBase & {
  display: 'stacked' | 'callout'
  inlineComponent?: never
}

type AutoComponentConfig = InlineAutoComponentConfig | NonInlineAutoComponentConfig

export function toEnumArrayLiteral(values: readonly AutoPropValue[]): string {
  return `[${values.map(value => (typeof value === 'string' ? `'${value}'` : String(value))).join(', ')}]`
}

function humanizePropName(prop: string): string {
  return prop
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .toLowerCase()
}

export function createEnumShowcaseSection({
  componentLabel,
  prop,
  values,
  code,
}: {
  componentLabel: string
  prop: string
  values: readonly AutoPropValue[]
  code: string
}): DocsSection {
  const readableProp = humanizePropName(prop)
  const title = readableProp.charAt(0).toUpperCase() + readableProp.slice(1)
  return {
    id: prop,
    title,
    description: `Use the ${readableProp} prop to control the ${readableProp} of the ${componentLabel}.`,
    code: code.replace('__VALUES__', toEnumArrayLiteral(values)),
  }
}

function getAutoPropValues(propDefs: PropDefsRecord, prop: AutoProp): readonly AutoPropValue[] {
  const propDef = propDefs[prop] as { type?: string; values?: readonly string[] } | undefined
  if (propDef?.type === 'boolean') {
    return [false, true]
  }

  const values = propDef?.values
  if (!values) {
    throw new Error(`Missing enum values for "${prop}"`)
  }
  return values
}

function createInlineEnumCode(componentName: 'Badge' | 'Button', prop: AutoProp, valuesLiteral: string): string {
  const itemsName = prop === 'size' ? 'sizes' : 'values'
  const itemName = prop === 'size' ? 'size' : 'value'
  const align = prop === 'size' ? ' align="center"' : ''
  const gap = componentName === 'Badge' ? '3' : '4'
  const variant = componentName === 'Badge' ? ' variant="soft"' : ''
  const label = prop === 'size' ? 'Size {size}' : '{value}'

  return `export default function Example() {
  const ${itemsName} = ${valuesLiteral}
  return (
    <Flex wrap="wrap"${align} gap="${gap}">
      {${itemsName}.map(${itemName} => (
        <${componentName} key={String(${itemName})} ${prop}={${itemName}}${variant}>${label}</${componentName}>
      ))}
    </Flex>
  )
}`
}

function createStackedEnumCode(prop: AutoProp, valuesLiteral: string): string {
  return `export default function Example() {
  const values = ${valuesLiteral}
  return (
    <Flex direction="column" gap="${prop === 'color' ? '4' : '6'}" style={{ width: 288 }}>
      {values.map(value => (
        <Flex key={String(value)} direction="column" gap="2">
          <div className="text-sm text-muted-foreground capitalize">{String(value)}</div>
          <Slider ${prop}={value} defaultValue={[${prop === 'color' ? '60' : '50'}]} />
        </Flex>
      ))}
    </Flex>
  )
}`
}

function createAutoSection(slug: string, config: AutoComponentConfig, prop: AutoProp): DocsSection {
  const values = getAutoPropValues(config.propDefsByName, prop)
  const valuesLiteral = toEnumArrayLiteral(values)
  const override = config.codeByProp?.[prop]
  const code = (() => {
    if (override) return override(valuesLiteral)
    if (config.display === 'stacked') return createStackedEnumCode(prop, valuesLiteral)
    if (config.display === 'inline') return createInlineEnumCode(config.inlineComponent, prop, valuesLiteral)
    throw new Error(`Missing codeByProp override for callout prop "${prop}"`)
  })()

  return createEnumShowcaseSection({
    componentLabel: slug,
    prop,
    values,
    code,
  })
}

export function createAutogenEntry(config: AutoComponentConfig): ElementDocsEntry {
  return {
    ...config.base,
    sections: [
      ...config.props.map(prop => createAutoSection(config.base.slug, config, prop)),
      ...(config.extraSections ?? []),
    ],
  }
}

export { autoProps }
