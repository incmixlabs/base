import type { AutoFormDateRules } from './autoform-date-rules.props'

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export type JsonObject = { [key: string]: JsonValue | undefined }
export type JsonArray = JsonValue[]

export interface JsonSchemaNode extends JsonObject {
  $id?: string
  $ref?: string
  $defs?: Record<string, JsonSchemaNode>
  definitions?: Record<string, JsonSchemaNode>
  title?: string
  description?: string
  type?: string | string[]
  format?: string
  enum?: JsonValue[]
  const?: JsonValue
  default?: JsonValue
  readOnly?: boolean
  required?: string[]
  minItems?: number
  maxItems?: number
  properties?: Record<string, JsonSchemaNode>
  items?: JsonSchemaNode | JsonSchemaNode[]
  anyOf?: JsonSchemaNode[]
  oneOf?: JsonSchemaNode[]
  allOf?: JsonSchemaNode[]
  if?: JsonSchemaNode
  then?: JsonSchemaNode
  else?: JsonSchemaNode
  dependentSchemas?: Record<string, JsonSchemaNode>
  '$autoform:dateRules'?: AutoFormDateRules
}

export interface SchemaRefResolutionOptions {
  externalSchemas?: Record<string, JsonSchemaNode>
}

export type AstNodeKind = 'form' | 'section' | 'field' | 'array' | 'object-group' | 'condition'

export interface AstBaseNode {
  kind: AstNodeKind
  id: string
  key: string
  title?: string
  description?: string
  path: string
  required?: boolean
  ui: Record<string, JsonValue>
  hints: Record<string, JsonValue>
}

export interface ConditionAstNode extends AstBaseNode {
  kind: 'condition'
  when: {
    if?: JsonSchemaNode
    dependentSchemas?: Record<string, JsonSchemaNode>
  }
  thenSchema?: JsonSchemaNode
  elseSchema?: JsonSchemaNode
  branchNodes?: {
    thenNodes?: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode>
    elseNodes?: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode>
    dependentNodes?: Record<string, Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode>>
  }
  combinators: {
    anyOf?: JsonSchemaNode[]
    oneOf?: JsonSchemaNode[]
    allOf?: JsonSchemaNode[]
  }
}

export interface FieldAstNode extends AstBaseNode {
  kind: 'field'
  fieldType: string
  format?: string
  enumValues?: JsonValue[]
  defaultValue?: JsonValue
  conditions: ConditionAstNode[]
}

export interface ObjectGroupAstNode extends AstBaseNode {
  kind: 'object-group'
  nodes: Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode>
  conditions: ConditionAstNode[]
}

export interface SectionAstNode extends AstBaseNode {
  kind: 'section'
  nodes: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode>
}

export interface ArrayAstNode extends AstBaseNode {
  kind: 'array'
  mode: 'repeater'
  itemNode: FieldAstNode | ObjectGroupAstNode
  defaultValue?: JsonValue
  minItems?: number
  maxItems?: number
  conditions: ConditionAstNode[]
}

export interface FormAstNode extends AstBaseNode {
  kind: 'form'
  schemaId?: string
  nodes: Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode>
  conditions: ConditionAstNode[]
}

/**
 * Convert JSON Schema into Autoform AST.
 */
export function schemaToAst(schema: JsonSchemaNode, options: SchemaRefResolutionOptions = {}): FormAstNode {
  if (!isObject(schema)) {
    throw new Error('schemaToAst: schema must be an object')
  }
  const resolvedSchema = resolveJsonSchemaRefs(schema, options)

  const { ui, hints } = extractExtensions(resolvedSchema)
  const conditions = extractConditions(resolvedSchema, 'form', '', ui, hints)
  const rootNodes = parseObjectNodes(resolvedSchema, '', resolvedSchema.required ?? [])

  return {
    kind: 'form',
    id: 'form',
    key: 'form',
    path: '',
    schemaId: typeof resolvedSchema.$id === 'string' ? resolvedSchema.$id : undefined,
    title: typeof resolvedSchema.title === 'string' ? resolvedSchema.title : undefined,
    description: typeof resolvedSchema.description === 'string' ? resolvedSchema.description : undefined,
    ui,
    hints,
    conditions,
    nodes: groupIntoSections(rootNodes),
  }
}

export function resolveJsonSchemaRefs(
  schema: JsonSchemaNode,
  options: SchemaRefResolutionOptions = {},
): JsonSchemaNode {
  return resolveSchemaRefs(schema, options)
}

function resolveSchemaRefs(schema: JsonSchemaNode, options: SchemaRefResolutionOptions): JsonSchemaNode {
  return resolveSchemaNode(schema, schema, [], '$', options, typeof schema.$id === 'string' ? schema.$id : '$root')
}

function resolveSchemaNode(
  schema: JsonSchemaNode,
  root: JsonSchemaNode,
  refStack: string[],
  path: string,
  options: SchemaRefResolutionOptions,
  documentKey: string,
): JsonSchemaNode {
  let currentSchema = schema

  if (Object.hasOwn(currentSchema, '$ref')) {
    if (typeof currentSchema.$ref !== 'string') {
      throw new Error(`schemaToAst: $ref must be a string at ${path}`)
    }
    const ref = currentSchema.$ref.trim()
    if (ref.length === 0) {
      throw new Error(`schemaToAst: empty $ref is not supported at ${path}`)
    }
    const refStackKey = `${documentKey}::${ref}`
    if (refStack.includes(refStackKey)) {
      throw new Error(`schemaToAst: cyclic $ref detected (${[...refStack, refStackKey].join(' -> ')})`)
    }

    const target = resolveRef(root, ref, options)
    if (!isObject(target)) {
      if (ref.startsWith('#')) {
        throw new Error(`schemaToAst: unresolved $ref found at ${path} (${ref})`)
      }
      if (options.externalSchemas) {
        const { documentRef } = splitExternalRef(ref)
        throw new Error(
          `schemaToAst: external $ref at ${path} (${ref}) is missing from externalSchemas registry (${documentRef})`,
        )
      }
      throw new Error(`schemaToAst: unresolved external $ref found at ${path} (${ref})`)
    }

    const { $ref: _ignoredRef, ...inlineOverrides } = currentSchema
    const resolvedTarget = resolveSchemaNode(
      target as JsonSchemaNode,
      getRefRoot(root, ref, target as JsonSchemaNode, options),
      [...refStack, refStackKey],
      `${path}#resolved(${ref})`,
      options,
      getRefDocumentKey(documentKey, ref, target as JsonSchemaNode, options),
    )
    currentSchema = mergeRefSchemas(resolvedTarget, inlineOverrides)
  }

  const next: JsonSchemaNode = { ...currentSchema }

  const properties = next.properties ?? {}
  if (Object.keys(properties).length > 0) {
    const resolvedProperties: Record<string, JsonSchemaNode> = {}
    for (const [key, value] of Object.entries(properties)) {
      if (!isObject(value)) continue
      resolvedProperties[key] = resolveSchemaNode(
        value as JsonSchemaNode,
        root,
        refStack,
        `${path}.properties.${key}`,
        options,
        documentKey,
      )
    }
    next.properties = resolvedProperties
  }

  if (isObject(next.items)) {
    next.items = resolveSchemaNode(next.items as JsonSchemaNode, root, refStack, `${path}.items`, options, documentKey)
  } else if (Array.isArray(next.items)) {
    next.items = next.items.map((item, index) => {
      if (!isObject(item)) return item
      return resolveSchemaNode(item as JsonSchemaNode, root, refStack, `${path}.items[${index}]`, options, documentKey)
    }) as JsonSchemaNode[]
  }

  for (const [name, collection] of [
    ['anyOf', next.anyOf],
    ['oneOf', next.oneOf],
    ['allOf', next.allOf],
  ] as const) {
    if (!Array.isArray(collection)) continue
    next[name] = collection.map((entry, index) => {
      if (!isObject(entry)) return entry
      return resolveSchemaNode(
        entry as JsonSchemaNode,
        root,
        refStack,
        `${path}.${name}[${index}]`,
        options,
        documentKey,
      )
    }) as JsonSchemaNode[]
  }

  if (isObject(next.if)) {
    next.if = resolveSchemaNode(next.if as JsonSchemaNode, root, refStack, `${path}.if`, options, documentKey)
  }
  const thenKey = 'then'
  if (isObject(next[thenKey])) {
    next[thenKey] = resolveSchemaNode(
      next[thenKey] as JsonSchemaNode,
      root,
      refStack,
      `${path}.then`,
      options,
      documentKey,
    )
  }
  if (isObject(next.else)) {
    next.else = resolveSchemaNode(next.else as JsonSchemaNode, root, refStack, `${path}.else`, options, documentKey)
  }

  const dependentSchemas = next.dependentSchemas ?? {}
  if (Object.keys(dependentSchemas).length > 0) {
    const resolvedDependentSchemas: Record<string, JsonSchemaNode> = {}
    for (const [key, value] of Object.entries(dependentSchemas)) {
      if (!isObject(value)) continue
      resolvedDependentSchemas[key] = resolveSchemaNode(
        value as JsonSchemaNode,
        root,
        refStack,
        `${path}.dependentSchemas.${key}`,
        options,
        documentKey,
      )
    }
    next.dependentSchemas = resolvedDependentSchemas
  }

  return next
}

function resolveLocalRef(root: JsonSchemaNode, ref: string): JsonValue | undefined {
  if (ref === '#') return root
  if (!ref.startsWith('#/')) return undefined

  let pointer: string
  try {
    pointer = decodeURIComponent(ref.slice(2))
  } catch {
    throw new Error(`schemaToAst: invalid $ref encoding (${ref})`)
  }
  const segments = pointer.split('/').map(segment => segment.replace(/~1/g, '/').replace(/~0/g, '~'))

  let current: JsonValue | undefined = root
  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined
    current = (current as Record<string, JsonValue>)[segment]
  }

  return current
}

function splitExternalRef(ref: string): { documentRef: string; pointerRef: string } {
  const hashIndex = ref.indexOf('#')
  if (hashIndex === -1) {
    return { documentRef: ref, pointerRef: '#' }
  }

  return {
    documentRef: ref.slice(0, hashIndex),
    pointerRef: `#${ref.slice(hashIndex + 1)}`,
  }
}

function getExternalSchemaRoot(ref: string, options: SchemaRefResolutionOptions): JsonSchemaNode | undefined {
  if (!options.externalSchemas) return undefined

  const { documentRef } = splitExternalRef(ref)
  return options.externalSchemas[documentRef] ?? options.externalSchemas[ref]
}

function resolveRef(root: JsonSchemaNode, ref: string, options: SchemaRefResolutionOptions): JsonValue | undefined {
  if (ref.startsWith('#')) {
    return resolveLocalRef(root, ref)
  }

  if (!options.externalSchemas) return undefined

  const { documentRef, pointerRef } = splitExternalRef(ref)
  const documentRoot = options.externalSchemas[documentRef]
  if (documentRoot) {
    return pointerRef === '#' ? documentRoot : resolveLocalRef(documentRoot, pointerRef)
  }

  return options.externalSchemas[ref]
}

function getRefRoot(
  currentRoot: JsonSchemaNode,
  ref: string,
  resolvedTarget: JsonSchemaNode,
  options: SchemaRefResolutionOptions,
): JsonSchemaNode {
  if (ref.startsWith('#')) {
    return currentRoot
  }

  return getExternalSchemaRoot(ref, options) ?? resolvedTarget
}

function getRefDocumentKey(
  currentDocumentKey: string,
  ref: string,
  resolvedTarget: JsonSchemaNode,
  options: SchemaRefResolutionOptions,
): string {
  if (ref.startsWith('#')) {
    return currentDocumentKey
  }

  const externalRoot = getExternalSchemaRoot(ref, options)
  const { documentRef } = splitExternalRef(ref)
  return (
    (externalRoot && typeof externalRoot.$id === 'string' ? externalRoot.$id : undefined) ??
    documentRef ??
    resolvedTarget.$id ??
    currentDocumentKey
  )
}

function mergeRefSchemas(resolvedTarget: JsonSchemaNode, inlineOverrides: Partial<JsonSchemaNode>): JsonSchemaNode {
  const merged: JsonSchemaNode = {
    ...resolvedTarget,
    ...inlineOverrides,
  }

  if (resolvedTarget.properties || inlineOverrides.properties) {
    merged.properties = mergeSchemaMaps(resolvedTarget.properties, inlineOverrides.properties)
  }

  if (resolvedTarget.required || inlineOverrides.required) {
    merged.required = [...new Set([...(resolvedTarget.required ?? []), ...(inlineOverrides.required ?? [])])]
  }

  if (resolvedTarget.dependentSchemas || inlineOverrides.dependentSchemas) {
    merged.dependentSchemas = mergeSchemaMaps(resolvedTarget.dependentSchemas, inlineOverrides.dependentSchemas)
  }

  if (resolvedTarget.$defs || inlineOverrides.$defs) {
    merged.$defs = mergeSchemaMaps(resolvedTarget.$defs, inlineOverrides.$defs)
  }

  if (resolvedTarget.definitions || inlineOverrides.definitions) {
    merged.definitions = mergeSchemaMaps(resolvedTarget.definitions, inlineOverrides.definitions)
  }

  if (resolvedTarget.items && inlineOverrides.items) {
    if (Array.isArray(resolvedTarget.items) || Array.isArray(inlineOverrides.items)) {
      throw new Error('schemaToAst: overlapping tuple-style items are not supported in $ref merges')
    } else if (isObject(resolvedTarget.items) && isObject(inlineOverrides.items)) {
      merged.items = mergeRefSchemas(resolvedTarget.items as JsonSchemaNode, inlineOverrides.items as JsonSchemaNode)
    }
  }

  const baseHasConditional = resolvedTarget.if || resolvedTarget.then || resolvedTarget.else
  const overrideHasConditional = inlineOverrides.if || inlineOverrides.then || inlineOverrides.else
  if (baseHasConditional && overrideHasConditional) {
    throw new Error('schemaToAst: combining conditional keywords across $ref merges is not supported')
  }

  merged.if = inlineOverrides.if ?? resolvedTarget.if
  const thenKey = 'then'
  merged[thenKey] = inlineOverrides[thenKey] ?? resolvedTarget[thenKey]
  merged.else = inlineOverrides.else ?? resolvedTarget.else

  merged.anyOf = mergeOptionalSchemaArray('anyOf', resolvedTarget.anyOf, inlineOverrides.anyOf)
  merged.oneOf = mergeOptionalSchemaArray('oneOf', resolvedTarget.oneOf, inlineOverrides.oneOf)
  merged.allOf = mergeOptionalSchemaArray('allOf', resolvedTarget.allOf, inlineOverrides.allOf)

  return merged
}

function mergeSchemaMaps(
  base: Record<string, JsonSchemaNode> | undefined,
  overrides: Record<string, JsonSchemaNode> | undefined,
): Record<string, JsonSchemaNode> {
  const merged: Record<string, JsonSchemaNode> = { ...(base ?? {}) }

  for (const [key, value] of Object.entries(overrides ?? {})) {
    const existing = merged[key]
    merged[key] =
      existing && isObject(existing) && isObject(value)
        ? mergeRefSchemas(existing as JsonSchemaNode, value as JsonSchemaNode)
        : value
  }

  return merged
}

function mergeOptionalSchemaArray(
  key: 'anyOf' | 'oneOf' | 'allOf',
  base: JsonSchemaNode[] | undefined,
  overrides: JsonSchemaNode[] | undefined,
): JsonSchemaNode[] | undefined {
  if (base && overrides) {
    throw new Error(`schemaToAst: overlapping ${key} arrays are not supported in $ref merges`)
  }
  return overrides ?? base
}

function parseObjectNodes(
  schema: JsonSchemaNode,
  pathPrefix: string,
  requiredKeys: string[],
): Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> {
  const properties = schema.properties ?? {}
  const nodes: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> = []

  for (const [key, propertySchema] of Object.entries(properties)) {
    if (!isObject(propertySchema)) continue
    const path = pathPrefix ? `${pathPrefix}.${key}` : key
    const required = requiredKeys.includes(key)
    nodes.push(parseNode(key, propertySchema, path, required))
  }

  return nodes
}

function parseNode(
  key: string,
  schema: JsonSchemaNode,
  path: string,
  required: boolean,
): FieldAstNode | ArrayAstNode | ObjectGroupAstNode {
  const jsonType = normalizeType(schema)
  const { ui, hints } = extractExtensions(schema)
  const conditions = extractConditions(schema, key, path, ui, hints)
  const title = typeof schema.title === 'string' ? schema.title : undefined
  const description = typeof schema.description === 'string' ? schema.description : undefined

  if (jsonType === 'object' || (schema.properties && jsonType === undefined)) {
    return {
      kind: 'object-group',
      id: path || key,
      key,
      path,
      required,
      title,
      description,
      ui,
      hints,
      conditions,
      nodes: parseObjectNodes(schema, path, schema.required ?? []),
    }
  }

  if (jsonType === 'array') {
    const itemSchema = resolveArrayItemSchema(schema.items)
    const itemNode = parseArrayItemNode(key, itemSchema, `${path}[*]`)
    return {
      kind: 'array',
      id: path || key,
      key,
      path,
      required,
      title,
      description,
      ui,
      hints,
      conditions,
      mode: 'repeater',
      defaultValue: schema.default,
      minItems: typeof schema.minItems === 'number' ? schema.minItems : undefined,
      maxItems: typeof schema.maxItems === 'number' ? schema.maxItems : undefined,
      itemNode,
    }
  }

  return {
    kind: 'field',
    id: path || key,
    key,
    path,
    required,
    title,
    description,
    ui,
    hints,
    conditions,
    fieldType: resolveFieldType(schema),
    format: typeof schema.format === 'string' ? schema.format : undefined,
    enumValues: Array.isArray(schema.enum) ? schema.enum : undefined,
    defaultValue: schema.default,
  }
}

function parseArrayItemNode(key: string, schema: JsonSchemaNode, path: string): FieldAstNode | ObjectGroupAstNode {
  const type = normalizeType(schema)
  const { ui, hints } = extractExtensions(schema)
  const conditions = extractConditions(schema, `${key}Item`, path, ui, hints)
  const title = typeof schema.title === 'string' ? schema.title : undefined
  const description = typeof schema.description === 'string' ? schema.description : undefined

  if (type === 'object' || (schema.properties && type === undefined)) {
    return {
      kind: 'object-group',
      id: path,
      key: `${key}Item`,
      path,
      required: false,
      title,
      description,
      ui,
      hints,
      conditions,
      nodes: parseObjectNodes(schema, path, schema.required ?? []),
    }
  }

  return {
    kind: 'field',
    id: path,
    key: `${key}Item`,
    path,
    required: false,
    title,
    description,
    ui,
    hints,
    conditions,
    fieldType: resolveFieldType(schema),
    format: typeof schema.format === 'string' ? schema.format : undefined,
    enumValues: Array.isArray(schema.enum) ? schema.enum : undefined,
    defaultValue: schema.default,
  }
}

function groupIntoSections(
  nodes: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode>,
): Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode> {
  const sectionsByName = new Map<string, SectionAstNode>()
  const ordered: Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode> = []

  for (const node of nodes) {
    const sectionName = resolveSectionName(node.ui)
    if (!sectionName) {
      ordered.push(node)
      continue
    }

    let section = sectionsByName.get(sectionName)
    if (!section) {
      section = {
        kind: 'section',
        id: `section:${sectionName}`,
        key: sectionName,
        path: '',
        title: sectionName,
        ui: {},
        hints: {},
        nodes: [],
      }
      sectionsByName.set(sectionName, section)
      ordered.push(section)
    }

    section.nodes.push(node)
  }

  return ordered
}

function resolveSectionName(ui: Record<string, JsonValue>): string | undefined {
  const value = ui['ui:section']
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

function extractExtensions(schema: JsonSchemaNode): {
  ui: Record<string, JsonValue>
  hints: Record<string, JsonValue>
} {
  const ui: Record<string, JsonValue> = {}
  const hints: Record<string, JsonValue> = {}

  for (const [key, value] of Object.entries(schema)) {
    if (value === undefined) continue
    if (key.startsWith('ui:')) {
      ui[key] = value
      continue
    }
    if (key.startsWith('x-') || key.startsWith('$autoform:')) {
      hints[key] = value
    }
  }

  return { ui, hints }
}

function extractConditions(
  schema: JsonSchemaNode,
  key: string,
  path: string,
  ui: Record<string, JsonValue>,
  hints: Record<string, JsonValue>,
): ConditionAstNode[] {
  const hasIf = isObject(schema.if)
  const hasThen = isObject(schema.then)
  const hasElse = isObject(schema.else)
  const hasDependentSchemas = isObject(schema.dependentSchemas)
  const hasCombinators = Array.isArray(schema.anyOf) || Array.isArray(schema.oneOf) || Array.isArray(schema.allOf)

  if (!hasIf && !hasThen && !hasElse && !hasDependentSchemas && !hasCombinators) {
    return []
  }

  return [
    {
      kind: 'condition',
      id: `${path || key}:condition`,
      key: `${key}Condition`,
      path,
      ui,
      hints,
      when: {
        if: hasIf ? (schema.if as JsonSchemaNode) : undefined,
        dependentSchemas: hasDependentSchemas ? (schema.dependentSchemas as Record<string, JsonSchemaNode>) : undefined,
      },
      thenSchema: hasThen ? (schema.then as JsonSchemaNode) : undefined,
      elseSchema: hasElse ? (schema.else as JsonSchemaNode) : undefined,
      branchNodes: {
        thenNodes: hasThen ? extractDynamicBranchNodes(schema, schema.then as JsonSchemaNode, path) : undefined,
        elseNodes: hasElse ? extractDynamicBranchNodes(schema, schema.else as JsonSchemaNode, path) : undefined,
        dependentNodes: hasDependentSchemas
          ? Object.fromEntries(
              Object.entries(schema.dependentSchemas as Record<string, JsonSchemaNode>).map(
                ([dependencyPath, branchSchema]) => [
                  dependencyPath,
                  extractDynamicBranchNodes(schema, branchSchema, path),
                ],
              ),
            )
          : undefined,
      },
      combinators: {
        anyOf: Array.isArray(schema.anyOf) ? (schema.anyOf as JsonSchemaNode[]) : undefined,
        oneOf: Array.isArray(schema.oneOf) ? (schema.oneOf as JsonSchemaNode[]) : undefined,
        allOf: Array.isArray(schema.allOf) ? (schema.allOf as JsonSchemaNode[]) : undefined,
      },
    },
  ]
}

function extractDynamicBranchNodes(
  baseSchema: JsonSchemaNode,
  branchSchema: JsonSchemaNode,
  pathPrefix: string,
): Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> {
  const filteredSchema = extractDynamicBranchSchema(baseSchema, branchSchema)
  if (!filteredSchema) return []

  return parseObjectNodes(filteredSchema, pathPrefix, filteredSchema.required ?? [])
}

function extractDynamicBranchSchema(
  baseSchema: JsonSchemaNode,
  branchSchema: JsonSchemaNode,
): JsonSchemaNode | undefined {
  const branchProperties = branchSchema.properties ?? {}
  const baseProperties = baseSchema.properties ?? {}
  const filteredProperties: Record<string, JsonSchemaNode> = {}

  for (const [key, branchPropertySchema] of Object.entries(branchProperties)) {
    const basePropertySchema = baseProperties[key]

    if (!isObject(branchPropertySchema)) continue

    if (!isObject(basePropertySchema) || !Object.hasOwn(baseProperties, key)) {
      filteredProperties[key] = branchPropertySchema
      continue
    }

    const nestedSchema = extractDynamicBranchSchema(basePropertySchema, branchPropertySchema)
    if (nestedSchema) {
      filteredProperties[key] = nestedSchema
    }
  }

  const hasFilteredProperties = Object.keys(filteredProperties).length > 0
  const hasNestedConditions = hasConditionKeywords(branchSchema)

  if (!hasFilteredProperties && !hasNestedConditions) return undefined

  return {
    ...branchSchema,
    type: normalizeType(branchSchema) ?? 'object',
    properties: hasFilteredProperties ? filteredProperties : undefined,
    required: (branchSchema.required ?? []).filter(key => Object.hasOwn(filteredProperties, key)),
  }
}

function hasConditionKeywords(schema: JsonSchemaNode) {
  return (
    isObject(schema.if) ||
    isObject(schema.then) ||
    isObject(schema.else) ||
    isObject(schema.dependentSchemas) ||
    Array.isArray(schema.anyOf) ||
    Array.isArray(schema.oneOf) ||
    Array.isArray(schema.allOf)
  )
}

function normalizeType(schema: JsonSchemaNode): string | undefined {
  if (Array.isArray(schema.type)) {
    // Current behavior targets the common nullable union pattern (e.g. ["string", "null"]).
    // For broader unions (e.g. ["string", "number"]), we intentionally choose the first
    // non-null type as a form-rendering fallback.
    return schema.type.find(type => type !== 'null')
  }
  return schema.type
}

function resolveArrayItemSchema(items: JsonSchemaNode | JsonSchemaNode[] | undefined): JsonSchemaNode {
  if (Array.isArray(items)) {
    // Tuple schemas are currently normalized to the first item schema.
    // Future enhancement: preserve tuple shape as distinct item-node definitions.
    return (items[0] ?? { type: 'string' }) as JsonSchemaNode
  }
  return (items ?? { type: 'string' }) as JsonSchemaNode
}

function resolveFieldType(schema: JsonSchemaNode): string {
  if (Array.isArray(schema.enum) || schema.const !== undefined) {
    return 'select'
  }

  const type = normalizeType(schema)
  if (type === 'string') {
    if (schema.format === 'date') return 'date'
    if (schema.format === 'date-time') return 'datetime'
    if (schema.format === 'time') return 'time'
    if (schema.format === 'email') return 'email'
    if (schema.format === 'uri' || schema.format === 'uri-reference') return 'url'
    if (schema.format === 'uuid') return 'uuid'
    return 'string'
  }
  if (type === 'integer') return 'integer'
  if (type === 'number') return 'number'
  if (type === 'boolean') return 'boolean'
  if (type === 'array') return 'array'
  if (type === 'object') return 'object'
  return 'string'
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
