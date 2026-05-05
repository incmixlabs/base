export type PropDef = {
  name: string
  typeSimple: string
  type?: string
  required?: boolean
  default?: string | boolean
  description?: string
}

export type UiPropDef = {
  type: string
  typeFullName?: string
  default?: unknown
  values?: readonly string[]
  required?: boolean
}

export type UiPropDefs = Record<string, UiPropDef>

export type DocsPropOverride = Partial<Omit<PropDef, 'name'>> & { name?: string }

const marginPropOrder = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'] as const
const paddingPropOrder = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'] as const
const gapPropOrder = ['gap', 'gapX', 'gapY'] as const

const marginPropLabels: Record<(typeof marginPropOrder)[number], string> = {
  m: 'Sets margin on all sides.',
  mx: 'Sets horizontal margin.',
  my: 'Sets vertical margin.',
  mt: 'Sets top margin.',
  mr: 'Sets right margin.',
  mb: 'Sets bottom margin.',
  ml: 'Sets left margin.',
}

const paddingPropLabels: Record<(typeof paddingPropOrder)[number], string> = {
  p: 'Sets padding on all sides.',
  px: 'Sets horizontal padding.',
  py: 'Sets vertical padding.',
  pt: 'Sets top padding.',
  pr: 'Sets right padding.',
  pb: 'Sets bottom padding.',
  pl: 'Sets left padding.',
}
const gapPropLabels: Record<(typeof gapPropOrder)[number], string> = {
  gap: 'Sets gap between rows and columns.',
  gapX: 'Sets column gap.',
  gapY: 'Sets row gap.',
}

const spacingPropNote =
  'Supports spacing tokens, CSS strings, and responsive objects. Sparse responsive values inherit the last defined breakpoint.'

export function asTypeUnion(values: readonly string[]): string {
  return values.map(value => `"${value}"`).join(' | ')
}

export function enumType(def: { values: readonly string[] }): string {
  return asTypeUnion(def.values)
}

function defaultValue(value: unknown): string | boolean | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  return String(value)
}

function baseTypeSimple(name: string, def: UiPropDef): string {
  if (name === 'color') return 'Color'
  if (name === 'radius') return 'Radius'
  if (def.type === 'enum' && def.values) return enumType({ values: def.values })
  if (def.type === 'enum | string' && def.values) return `${enumType({ values: def.values })} | string`
  if (def.type === 'boolean') return 'boolean'
  if (def.type === 'number') return 'number'
  if (def.type === 'string') return 'string'
  if (def.type === 'object') return def.typeFullName ?? 'Record<string, unknown>'
  if (def.type === 'ReactNode') return 'ReactNode'
  if (def.type === 'callback') return def.typeFullName ?? '(...args: unknown[]) => void'
  return def.type
}

export function createDocsPropDefs(defs: UiPropDefs, overrides: Record<string, DocsPropOverride> = {}): PropDef[] {
  return Object.entries(defs).map(([name, def]) => {
    const override = overrides[name] ?? {}
    return {
      name: override.name ?? name,
      typeSimple: override.typeSimple ?? baseTypeSimple(name, def),
      required: override.required ?? def.required,
      default: override.default ?? defaultValue(def.default),
      description: override.description,
    }
  })
}

export function withMarginPropDocs(propDefs: PropDef[]): PropDef[] {
  const marginDocs = new Map(
    marginPropOrder.map(name => [
      name,
      {
        name,
        typeSimple: 'Responsive<Spacing | string>',
        description: `${marginPropLabels[name]} ${spacingPropNote}`,
      } satisfies PropDef,
    ]),
  )

  const merged = propDefs.map(prop => {
    const marginDoc = marginDocs.get(prop.name as (typeof marginPropOrder)[number])
    if (!marginDoc) return prop

    return {
      ...prop,
      typeSimple: marginDoc.typeSimple,
      description: (() => {
        const baseDescription = prop.description?.trim()
        if (!baseDescription) return marginDoc.description
        return baseDescription.includes(spacingPropNote) ? baseDescription : `${baseDescription} ${spacingPropNote}`
      })(),
    }
  })

  const existingNames = new Set(merged.map(prop => prop.name))
  const missingMarginProps = marginPropOrder
    .filter(name => !existingNames.has(name))
    .map(name => marginDocs.get(name) as PropDef)

  return [...merged, ...missingMarginProps]
}

export function withPaddingPropDocs(propDefs: PropDef[]): PropDef[] {
  const paddingDocs = new Map(
    paddingPropOrder.map(name => [
      name,
      {
        name,
        typeSimple: 'Responsive<Spacing | string>',
        description: `${paddingPropLabels[name]} ${spacingPropNote}`,
      } satisfies PropDef,
    ]),
  )

  const merged = propDefs.map(prop => {
    const paddingDoc = paddingDocs.get(prop.name as (typeof paddingPropOrder)[number])
    if (!paddingDoc) return prop

    return {
      ...prop,
      typeSimple: paddingDoc.typeSimple,
      description: (() => {
        const baseDescription = prop.description?.trim()
        if (!baseDescription) return paddingDoc.description
        return baseDescription.includes(spacingPropNote) ? baseDescription : `${baseDescription} ${spacingPropNote}`
      })(),
    }
  })

  const existingNames = new Set(merged.map(prop => prop.name))
  const missingPaddingProps = paddingPropOrder
    .filter(name => !existingNames.has(name))
    .map(name => paddingDocs.get(name) as PropDef)

  return [...merged, ...missingPaddingProps]
}

export function withGapPropDocs(propDefs: PropDef[]): PropDef[] {
  const gapDocs = new Map(
    gapPropOrder.map(name => [
      name,
      {
        name,
        typeSimple: 'Responsive<Spacing | string>',
        description: `${gapPropLabels[name]} ${spacingPropNote}`,
      } satisfies PropDef,
    ]),
  )

  const merged = propDefs.map(prop => {
    const gapDoc = gapDocs.get(prop.name as (typeof gapPropOrder)[number])
    if (!gapDoc) return prop

    return {
      ...prop,
      typeSimple: gapDoc.typeSimple,
      description: (() => {
        const baseDescription = prop.description?.trim()
        if (!baseDescription) return gapDoc.description
        return baseDescription.includes(spacingPropNote) ? baseDescription : `${baseDescription} ${spacingPropNote}`
      })(),
    }
  })

  const existingNames = new Set(merged.map(prop => prop.name))
  const missingGapProps = gapPropOrder
    .filter(name => !existingNames.has(name))
    .map(name => gapDocs.get(name) as PropDef)

  return [...merged, ...missingGapProps]
}
