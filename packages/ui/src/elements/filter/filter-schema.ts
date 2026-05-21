import type {
  FilterField,
  FilterFieldType,
  FilterJsonSchema,
  FilterJsonSchemaEnumOption,
  FilterJsonSchemaEnumValue,
  FilterJsonSchemaProperty,
  FilterOperator,
  FilterOption,
  FilterSchemaFieldOverride,
  FilterSchemaOptions,
} from './filter.props'

function humanizeFieldName(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, char => char.toUpperCase())
}

function getPrimaryType(property: FilterJsonSchemaProperty): string | undefined {
  const type = Array.isArray(property.type) ? property.type.find(value => value !== 'null') : property.type
  if (type) return type
  if (property.enum?.every(value => typeof value === 'boolean')) return 'boolean'
  if (property.enum) return 'string'
  return undefined
}

function stringifyEnumValue(value: FilterJsonSchemaEnumValue) {
  return value == null ? '' : String(value)
}

function getEnumOptionValue(option: FilterJsonSchemaEnumOption) {
  if ('const' in option) return option.const
  return option.enum?.[0]
}

function optionsFromSchema(property: FilterJsonSchemaProperty): FilterOption[] | undefined {
  if (property.enum) {
    return property.enum.map((value, index) => ({
      value: stringifyEnumValue(value),
      label: property.enumNames?.[index] ?? stringifyEnumValue(value),
    }))
  }

  const compositeOptions = property.oneOf ?? property.anyOf
  if (!compositeOptions) return undefined

  return compositeOptions.flatMap(option => {
    const value = getEnumOptionValue(option)
    if (value === undefined) return []
    return [{ value: stringifyEnumValue(value), label: option.title ?? stringifyEnumValue(value) }]
  })
}

function resolveSchemaOverride<TData>(property: FilterJsonSchemaProperty, override?: FilterSchemaFieldOverride<TData>) {
  const inline = property['x-filter']
  if (inline && typeof inline === 'object') {
    return { ...inline, ...override } as FilterSchemaFieldOverride<TData>
  }
  return override
}

function isFieldHidden<TData>(
  key: string,
  property: FilterJsonSchemaProperty,
  schemaOptions: FilterSchemaOptions<TData> | undefined,
  override: FilterSchemaFieldOverride<TData> | undefined,
) {
  if (property.writeOnly) return true
  if (property['x-filter'] === false || property['x-filter-hidden']) return true
  if (override?.hidden) return true
  if (schemaOptions?.include && !schemaOptions.include.includes(key)) return true
  return Boolean(schemaOptions?.exclude?.includes(key))
}

function getNumberBoundary(value: number | boolean | undefined, fallback: number | undefined) {
  return typeof value === 'number' ? value : fallback
}

function defaultOperatorsFor(type: FilterFieldType): FilterOperator[] {
  switch (type) {
    case 'input':
      return ['contains', 'equals', 'startsWith']
    case 'checkbox':
      return ['includesAny', 'includesAll']
    case 'select':
      return ['equals']
    case 'number':
      return ['between', 'greaterThan', 'lessThan', 'equals']
    case 'slider':
      return ['between']
    case 'calendar':
      return ['between', 'before', 'after', 'equals']
    default:
      return ['equals']
  }
}

function defaultOperatorFor(type: FilterFieldType): FilterOperator {
  return defaultOperatorsFor(type)[0] ?? 'equals'
}

function inferFieldType(property: FilterJsonSchemaProperty, overrideType?: FilterFieldType): FilterFieldType {
  if (overrideType) return overrideType

  const type = getPrimaryType(property)
  const enumOptions = optionsFromSchema(property)

  if (type === 'array' && optionsFromSchema(property.items ?? {})) return 'checkbox'
  if (enumOptions) return 'select'
  if (type === 'boolean') return 'select'
  if (type === 'number' || type === 'integer') return 'number'
  if (type === 'string' && (property.format === 'date' || property.format === 'date-time')) return 'calendar'
  return 'input'
}

function getOptions(
  property: FilterJsonSchemaProperty,
  type: FilterFieldType,
  override?: FilterSchemaFieldOverride<unknown>,
) {
  if (override?.options) return override.options
  if (type === 'checkbox') return optionsFromSchema(property.items ?? {}) ?? []
  if (type === 'select' && getPrimaryType(property) === 'boolean') {
    return [
      { value: 'true', label: 'True' },
      { value: 'false', label: 'False' },
    ]
  }
  return optionsFromSchema(property) ?? []
}

export function getFilterFieldsFromSchema<TData = Record<string, unknown>>(
  schema: FilterJsonSchema,
  schemaOptions?: FilterSchemaOptions<TData>,
): FilterField<TData>[] {
  const entries = Object.entries(schema.properties ?? {})
  const fields: Array<{ field: FilterField<TData>; index: number; order: number }> = []

  for (const [index, [key, property]] of entries.entries()) {
    const override = resolveSchemaOverride(property, schemaOptions?.fields?.[key])
    if (isFieldHidden(key, property, schemaOptions, override)) continue

    const type = inferFieldType(property, override?.type)
    const label = override?.label ?? property.title ?? humanizeFieldName(key)
    const description = override?.description ?? property.description
    const operators = override?.operators ?? defaultOperatorsFor(type)
    const defaultOperator = override?.defaultOperator ?? defaultOperatorFor(type)
    const base = {
      id: key,
      label,
      description,
      defaultOpen: override?.defaultOpen,
      operators,
      defaultOperator,
      ...(override?.field ?? {}),
    }
    const order = override?.order ?? property['x-filter-order'] ?? 0

    if (type === 'checkbox') {
      fields.push({
        field: {
          ...base,
          type,
          options: getOptions(property, type, override as FilterSchemaFieldOverride<unknown>),
        } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    if (type === 'select') {
      fields.push({
        field: {
          ...base,
          type,
          options: getOptions(property, type, override as FilterSchemaFieldOverride<unknown>),
          placeholder: override?.placeholder ?? `Any ${label}`,
        } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    if (type === 'number') {
      fields.push({
        field: {
          ...base,
          type,
          min: override?.min ?? getNumberBoundary(property.exclusiveMinimum, property.minimum),
          max: override?.max ?? getNumberBoundary(property.exclusiveMaximum, property.maximum),
          step: override?.step ?? property.multipleOf,
          allowDecimal: override?.allowDecimal ?? getPrimaryType(property) !== 'integer',
          placeholder: override?.placeholder,
        } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    if (type === 'slider') {
      fields.push({
        field: {
          ...base,
          type,
          min: override?.min ?? getNumberBoundary(property.exclusiveMinimum, property.minimum) ?? 0,
          max: override?.max ?? getNumberBoundary(property.exclusiveMaximum, property.maximum) ?? 100,
          step: override?.step ?? property.multipleOf,
        } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    if (type === 'calendar') {
      fields.push({
        field: {
          ...base,
          type,
          display: override?.calendarDisplay ?? 'full',
          mode: override?.calendarMode ?? 'range',
        } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    if (type === 'avatar-list') {
      fields.push({
        field: { ...base, type } as FilterField<TData>,
        index,
        order,
      })
      continue
    }

    fields.push({
      field: { ...base, type, placeholder: override?.placeholder } as FilterField<TData>,
      index,
      order,
    })
  }

  return fields
    .sort((left, right) => (left.order === right.order ? left.index - right.index : left.order - right.order))
    .map(entry => entry.field)
}
