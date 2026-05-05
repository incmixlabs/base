import type { AutoFormDateRules } from './autoform-date-rules.props'
import { getAutoFormDateRulesFromHints } from './autoform-date-rules.props'
import type {
  AutoFormFieldLayout,
  AutoFormLabelPlacement,
  AutoFormNormalizedResponsiveBreakpoint,
  AutoFormNormalizedResponsiveValue,
  AutoFormResponsiveValue,
  AutoFormSectionLayout,
} from './autoform-layout.props'
import type {
  ArrayAstNode,
  ConditionAstNode,
  FieldAstNode,
  FormAstNode,
  JsonSchemaNode,
  JsonValue,
  ObjectGroupAstNode,
  SchemaRefResolutionOptions,
  SectionAstNode,
} from './schema-ast'
import { schemaToAst } from './schema-ast'

export interface AutoFormUiFieldSchema {
  widget?: string
  label?: string
  help?: string
  placeholder?: string
  colSpan?: AutoFormResponsiveValue<number>
  layout?: AutoFormResponsiveValue<AutoFormFieldLayout>
  labelPlacement?: AutoFormResponsiveValue<AutoFormLabelPlacement>
  order?: number
  props?: Record<string, JsonValue>
}

export interface AutoFormUiSectionSchema {
  id: string
  title?: string
  fields: string[]
  columns?: AutoFormResponsiveValue<number>
  layout?: AutoFormResponsiveValue<AutoFormSectionLayout>
  labelPlacement?: AutoFormResponsiveValue<AutoFormLabelPlacement>
}

export interface AutoFormUiStepSchema {
  id: string
  title?: string
  description?: string
  sections: string[]
}

export interface AutoFormUiSchema {
  wrapper?: string
  sections?: AutoFormUiSectionSchema[]
  steps?: AutoFormUiStepSchema[]
  fields?: Record<string, AutoFormUiFieldSchema>
}

export interface AutoFormNormalizedBaseNode {
  kind: 'field' | 'array' | 'object-group'
  key: string
  path: string
  title?: string
  description?: string
  required: boolean
  widget?: string
  label?: string
  help?: string
  placeholder?: string
  colSpan?: AutoFormNormalizedResponsiveValue<number>
  layout?: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout>
  labelPlacement?: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement>
  order?: number
  ui: Record<string, JsonValue>
  hints: Record<string, JsonValue>
  conditions: ConditionAstNode[]
}

export interface AutoFormNormalizedFieldNode extends AutoFormNormalizedBaseNode {
  kind: 'field'
  fieldType: string
  format?: string
  dateRules?: AutoFormDateRules
  enumValues?: JsonValue[]
  defaultValue?: JsonValue
  props?: Record<string, JsonValue>
}

export interface AutoFormNormalizedObjectGroupNode extends AutoFormNormalizedBaseNode {
  kind: 'object-group'
  nodes: AutoFormNormalizedRenderableNode[]
}

export interface AutoFormNormalizedArrayNode extends AutoFormNormalizedBaseNode {
  kind: 'array'
  mode: 'repeater'
  itemNode: AutoFormNormalizedFieldNode | AutoFormNormalizedObjectGroupNode
  defaultValue?: JsonValue
  minItems?: number
  maxItems?: number
  props?: Record<string, JsonValue>
}

export type AutoFormNormalizedRenderableNode =
  | AutoFormNormalizedFieldNode
  | AutoFormNormalizedArrayNode
  | AutoFormNormalizedObjectGroupNode

export interface AutoFormNormalizedSection {
  kind: 'section'
  id: string
  title?: string
  columns?: AutoFormNormalizedResponsiveValue<number>
  layout?: AutoFormNormalizedResponsiveValue<AutoFormSectionLayout>
  labelPlacement?: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement>
  nodes: AutoFormNormalizedRenderableNode[]
}

export interface AutoFormNormalizedStep {
  id: string
  title: string
  description?: string
  sectionIds: string[]
}

export interface AutoFormNormalizedDynamicBranch {
  id: string
  conditionId: string
  basePath: string
  sectionId?: string
  nodes: AutoFormNormalizedRenderableNode[]
}

export interface AutoFormNormalizedModel {
  kind: 'form-model'
  schemaId?: string
  title?: string
  description?: string
  wrapper?: string
  conditions: ConditionAstNode[]
  dynamicBranches: AutoFormNormalizedDynamicBranch[]
  steps?: AutoFormNormalizedStep[]
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>
}

export function normalizeJsonSchemaWithUiSchema(
  jsonSchema: JsonSchemaNode,
  uiSchema: AutoFormUiSchema = {},
  options: SchemaRefResolutionOptions = {},
): AutoFormNormalizedModel {
  const ast = schemaToAst(jsonSchema, options)
  return normalizeFormAstWithUiSchema(ast, uiSchema)
}

export function normalizeFormAstWithUiSchema(
  ast: FormAstNode,
  uiSchema: AutoFormUiSchema = {},
): AutoFormNormalizedModel {
  const topLevelNodes = flattenTopLevelNodes(ast.nodes)
  const normalizedNodes = sortByUiOrder(topLevelNodes.map(node => normalizeNode(node, uiSchema)))
  const orderedNodes = groupNodesIntoUiSections(normalizedNodes, uiSchema.sections)

  return {
    kind: 'form-model',
    schemaId: ast.schemaId,
    title: ast.title,
    description: ast.description,
    wrapper: uiSchema.wrapper,
    conditions: ast.conditions,
    dynamicBranches: normalizeDynamicBranches(ast, uiSchema),
    steps: normalizeUiSteps(orderedNodes, uiSchema.steps),
    nodes: orderedNodes,
  }
}

function flattenTopLevelNodes(
  nodes: Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode>,
): Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> {
  return flattenSectionNodes(nodes)
}

function flattenSectionNodes(
  nodes: Array<SectionAstNode | FieldAstNode | ArrayAstNode | ObjectGroupAstNode>,
): Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> {
  const flattened: Array<FieldAstNode | ArrayAstNode | ObjectGroupAstNode> = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      flattened.push(...node.nodes)
    } else {
      flattened.push(node)
    }
  }

  return flattened
}

function normalizeNode(
  node: FieldAstNode | ArrayAstNode | ObjectGroupAstNode,
  uiSchema: AutoFormUiSchema,
): AutoFormNormalizedRenderableNode {
  const fieldUi = resolveFieldUiConfig(uiSchema, node.path, node.key)
  const base = {
    key: node.key,
    path: node.path,
    title: node.title,
    description: node.description,
    required: Boolean(node.required),
    widget: fieldUi?.widget,
    label: fieldUi?.label ?? node.title ?? node.key,
    help: fieldUi?.help,
    placeholder: fieldUi?.placeholder,
    colSpan: normalizeResponsiveNumber(fieldUi?.colSpan),
    layout: normalizeResponsiveValue(fieldUi?.layout),
    labelPlacement: normalizeResponsiveValue(fieldUi?.labelPlacement),
    order: fieldUi?.order,
    ui: node.ui,
    hints: node.hints,
    conditions: node.conditions,
  }

  if (node.kind === 'field') {
    return {
      kind: 'field',
      ...base,
      fieldType: node.fieldType,
      format: node.format,
      dateRules: getAutoFormDateRulesFromHints(node.hints),
      enumValues: node.enumValues,
      defaultValue: node.defaultValue,
      props: fieldUi?.props,
    }
  }

  if (node.kind === 'array') {
    return {
      kind: 'array',
      ...base,
      mode: node.mode,
      defaultValue: node.defaultValue,
      minItems: node.minItems,
      maxItems: node.maxItems,
      props: fieldUi?.props,
      itemNode: normalizeArrayItemNode(node.itemNode, uiSchema),
    }
  }

  return {
    kind: 'object-group',
    ...base,
    nodes: flattenSectionNodes(node.nodes).map(child => normalizeNode(child, uiSchema)),
  }
}

function normalizeArrayItemNode(
  node: FieldAstNode | ObjectGroupAstNode,
  uiSchema: AutoFormUiSchema,
): AutoFormNormalizedFieldNode | AutoFormNormalizedObjectGroupNode {
  const normalized = normalizeNode(node, uiSchema)
  if (normalized.kind === 'array') {
    throw new Error('normalizeJsonSchemaWithUiSchema: nested array items are not supported')
  }
  return normalized
}

function groupNodesIntoUiSections(
  nodes: AutoFormNormalizedRenderableNode[],
  uiSections: AutoFormUiSectionSchema[] | undefined,
): Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode> {
  if (!uiSections || uiSections.length === 0) {
    return nodes
  }

  const nodeMap = new Map<string, AutoFormNormalizedRenderableNode>()
  for (const node of nodes) {
    nodeMap.set(node.path, node)
    nodeMap.set(node.key, node)
  }

  const consumedPaths = new Set<string>()
  const ordered: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode> = []

  for (const section of uiSections) {
    const sectionNodes: AutoFormNormalizedRenderableNode[] = []

    for (const fieldRef of section.fields) {
      const node = nodeMap.get(fieldRef)
      if (!node || consumedPaths.has(node.path)) continue
      consumedPaths.add(node.path)
      sectionNodes.push(node)
    }

    if (sectionNodes.length === 0) continue

    ordered.push({
      kind: 'section',
      id: section.id,
      title: section.title ?? section.id,
      columns: normalizeResponsiveNumber(section.columns),
      layout: normalizeResponsiveValue(section.layout),
      labelPlacement: normalizeResponsiveValue(section.labelPlacement),
      nodes: sectionNodes,
    })
  }

  for (const node of nodes) {
    if (!consumedPaths.has(node.path)) {
      ordered.push(node)
    }
  }

  return ordered
}

function sortByUiOrder(nodes: AutoFormNormalizedRenderableNode[]): AutoFormNormalizedRenderableNode[] {
  return [...nodes].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.path.localeCompare(b.path)
  })
}

function resolveFieldUiConfig(
  uiSchema: AutoFormUiSchema,
  path: string,
  key: string,
): AutoFormUiFieldSchema | undefined {
  return uiSchema.fields?.[path] ?? uiSchema.fields?.[key]
}

function normalizeResponsiveNumber(
  value: AutoFormResponsiveValue<number> | undefined,
): AutoFormNormalizedResponsiveValue<number> | undefined {
  return normalizeResponsiveValue(value)
}

function normalizeResponsiveValue<T>(
  value: AutoFormResponsiveValue<T> | undefined,
): AutoFormNormalizedResponsiveValue<T> | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return value as T

  const normalized: Partial<Record<AutoFormNormalizedResponsiveBreakpoint, T>> = {}

  if ('base' in value && value.base !== undefined) normalized.initial = value.base
  if ('initial' in value && value.initial !== undefined) normalized.initial = value.initial
  if ('xs' in value && value.xs !== undefined) normalized.xs = value.xs
  if ('sm' in value && value.sm !== undefined) normalized.sm = value.sm
  if ('md' in value && value.md !== undefined) normalized.md = value.md
  if ('lg' in value && value.lg !== undefined) normalized.lg = value.lg
  if ('xl' in value && value.xl !== undefined) normalized.xl = value.xl

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function normalizeUiSteps(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  steps: AutoFormUiStepSchema[] | undefined,
): AutoFormNormalizedStep[] | undefined {
  if (!steps || steps.length === 0) return undefined

  const sectionIds = new Set(
    nodes.filter((node): node is AutoFormNormalizedSection => node.kind === 'section').map(node => node.id),
  )
  const normalized = steps.reduce<AutoFormNormalizedStep[]>((acc, step) => {
    const sectionRefs = step.sections.filter(sectionId => sectionIds.has(sectionId))
    if (sectionRefs.length === 0) return acc

    acc.push({
      id: step.id,
      title: step.title ?? step.id,
      description: step.description,
      sectionIds: sectionRefs,
    })

    return acc
  }, [])

  return normalized.length > 0 ? normalized : undefined
}

function normalizeDynamicBranches(ast: FormAstNode, uiSchema: AutoFormUiSchema): AutoFormNormalizedDynamicBranch[] {
  const dynamicBranches: AutoFormNormalizedDynamicBranch[] = []

  for (const condition of collectConditionNodes(ast)) {
    if (condition.branchNodes?.thenNodes?.length) {
      const normalizedNodes = sortByUiOrder(condition.branchNodes.thenNodes.map(node => normalizeNode(node, uiSchema)))
      dynamicBranches.push({
        id: `${condition.id}:then`,
        conditionId: condition.id,
        basePath: condition.path,
        sectionId: resolveDynamicBranchSectionId(normalizedNodes, uiSchema.sections),
        nodes: normalizedNodes,
      })
    }

    if (condition.branchNodes?.elseNodes?.length) {
      const normalizedNodes = sortByUiOrder(condition.branchNodes.elseNodes.map(node => normalizeNode(node, uiSchema)))
      dynamicBranches.push({
        id: `${condition.id}:else`,
        conditionId: condition.id,
        basePath: condition.path,
        sectionId: resolveDynamicBranchSectionId(normalizedNodes, uiSchema.sections),
        nodes: normalizedNodes,
      })
    }

    for (const [dependencyPath, nodes] of Object.entries(condition.branchNodes?.dependentNodes ?? {})) {
      if (nodes.length === 0) continue
      const normalizedNodes = sortByUiOrder(nodes.map(node => normalizeNode(node, uiSchema)))
      dynamicBranches.push({
        id: `${condition.id}:dependent:${dependencyPath}`,
        conditionId: condition.id,
        basePath: condition.path,
        sectionId: resolveDynamicBranchSectionId(normalizedNodes, uiSchema.sections),
        nodes: normalizedNodes,
      })
    }
  }

  return dynamicBranches
}

function collectConditionNodes(ast: FormAstNode): ConditionAstNode[] {
  const collected = [...ast.conditions]

  for (const condition of ast.conditions) {
    collected.push(...collectBranchNodeConditions(condition))
  }

  for (const node of flattenSectionNodes(ast.nodes)) {
    collected.push(...collectNodeConditions(node))
  }

  return collected
}

function collectNodeConditions(node: FieldAstNode | ArrayAstNode | ObjectGroupAstNode): ConditionAstNode[] {
  const collected = [...node.conditions]

  for (const condition of node.conditions) {
    collected.push(...collectBranchNodeConditions(condition))
  }

  if (node.kind === 'object-group') {
    for (const child of flattenSectionNodes(node.nodes)) {
      collected.push(...collectNodeConditions(child))
    }
  }

  if (node.kind === 'array') {
    collected.push(...collectNodeConditions(node.itemNode))
  }

  return collected
}

function collectBranchNodeConditions(condition: ConditionAstNode): ConditionAstNode[] {
  const collected: ConditionAstNode[] = []

  for (const node of condition.branchNodes?.thenNodes ?? []) {
    collected.push(...collectNodeConditions(node))
  }

  for (const node of condition.branchNodes?.elseNodes ?? []) {
    collected.push(...collectNodeConditions(node))
  }

  for (const nodes of Object.values(condition.branchNodes?.dependentNodes ?? {})) {
    for (const node of nodes) {
      collected.push(...collectNodeConditions(node))
    }
  }

  return collected
}

function resolveDynamicBranchSectionId(
  nodes: AutoFormNormalizedRenderableNode[],
  sections: AutoFormUiSectionSchema[] | undefined,
): string | undefined {
  if (!sections?.length || nodes.length === 0) return undefined

  const sectionIds = new Set<string>()

  for (const node of nodes) {
    const matchingSection = sections.find(
      section => section.fields.includes(node.path) || section.fields.includes(node.key),
    )
    if (!matchingSection) return undefined
    sectionIds.add(matchingSection.id)
  }

  return sectionIds.size === 1 ? [...sectionIds][0] : undefined
}
