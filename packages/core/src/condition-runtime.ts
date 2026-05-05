import { createAjvValidator } from './ajv-validation'
import { type AutoFormRuntimeValues, getValueAtPath } from './form-runtime'
import type { ConditionAstNode, JsonSchemaNode } from './schema-ast'
import type {
  AutoFormNormalizedDynamicBranch,
  AutoFormNormalizedModel,
  AutoFormNormalizedRenderableNode,
  AutoFormNormalizedSection,
} from './ui-schema-normalization'

export interface AutoFormConditionState {
  hidden: Record<string, boolean>
  disabled: Record<string, boolean>
  readOnly: Record<string, boolean>
  required: Record<string, boolean>
  activeConditionIds: string[]
  activeBranchIds: string[]
  activeBranches: AutoFormNormalizedDynamicBranch[]
}

export function evaluateAutoFormConditionState(
  model: AutoFormNormalizedModel,
  values: AutoFormRuntimeValues,
): AutoFormConditionState {
  const state: AutoFormConditionState = {
    hidden: {},
    disabled: {},
    readOnly: {},
    required: {},
    activeConditionIds: [],
    activeBranchIds: [],
    activeBranches: [],
  }

  applyConditionNodes(model.conditions, '', values, state)

  for (const node of flattenRenderableNodes(model.nodes)) {
    applyConditionNodes(node.conditions, node.path, values, state)
  }

  state.activeBranches = model.dynamicBranches.filter(branch => state.activeBranchIds.includes(branch.id))

  return state
}

function applyConditionNodes(
  conditions: ConditionAstNode[],
  basePath: string,
  values: AutoFormRuntimeValues,
  state: AutoFormConditionState,
) {
  for (const { path, scopeValue } of resolveConditionScopes(values, basePath)) {
    for (const condition of conditions) {
      const matchedIf = evaluateIfCondition(condition, scopeValue)
      const matchedCombinators = evaluateCombinators(condition, scopeValue)

      if (matchedIf || matchedCombinators) {
        state.activeConditionIds.push(condition.id)
      }

      if (condition.thenSchema || condition.elseSchema) {
        const activeBranchId = matchedIf ? `${condition.id}:then` : `${condition.id}:else`
        const activeBranch = matchedIf ? condition.thenSchema : condition.elseSchema
        if (activeBranch) {
          state.activeBranchIds.push(activeBranchId)
          applyBranchSchema(activeBranch, path, state)
        }
      }

      if (condition.when.dependentSchemas) {
        for (const [dependencyPath, branchSchema] of Object.entries(condition.when.dependentSchemas)) {
          if (hasValueAtPath(scopeValue as AutoFormRuntimeValues, dependencyPath)) {
            state.activeConditionIds.push(`${condition.id}:${dependencyPath}`)
            state.activeBranchIds.push(`${condition.id}:dependent:${dependencyPath}`)
            applyBranchSchema(branchSchema, path, state)
          }
        }
      }
    }
  }
}

function evaluateIfCondition(condition: ConditionAstNode, values: unknown) {
  if (!condition.when.if) return false
  return createAjvValidator(condition.when.if).validate(values).valid
}

function evaluateCombinators(condition: ConditionAstNode, values: unknown) {
  const { anyOf, oneOf, allOf } = condition.combinators

  if (anyOf?.length) {
    return anyOf.some(schema => createAjvValidator(schema).validate(values).valid)
  }

  if (oneOf?.length) {
    return oneOf.filter(schema => createAjvValidator(schema).validate(values).valid).length === 1
  }

  if (allOf?.length) {
    return allOf.every(schema => createAjvValidator(schema).validate(values).valid)
  }

  return false
}

function resolveConditionScopes(values: AutoFormRuntimeValues, basePath: string) {
  if (!basePath) {
    return [{ path: '', scopeValue: values }]
  }

  if (!basePath.includes('[*]')) {
    return [{ path: basePath, scopeValue: getValueAtPath(values, basePath) }]
  }

  return expandTemplatePaths(values, basePath).map(path => ({
    path,
    scopeValue: getValueAtPath(values, path),
  }))
}

function expandTemplatePaths(values: AutoFormRuntimeValues, template: string): string[] {
  const segments = template
    .replace(/\[\*\]/g, '.[*]')
    .split('.')
    .filter(Boolean)

  return expandTemplateSegments(values, segments)
}

function expandTemplateSegments(value: unknown, segments: string[], prefix: string[] = []): string[] {
  if (segments.length === 0) {
    return prefix.length > 0 ? [prefix.join('.')] : []
  }

  const [segment, ...rest] = segments
  if (segment === undefined) return []

  if (segment === '[*]') {
    if (!Array.isArray(value)) return []

    return value.flatMap((item, index) => expandTemplateSegments(item, rest, [...prefix, String(index)]))
  }

  if (Array.isArray(value)) {
    const index = Number(segment)
    if (!Number.isInteger(index) || index < 0 || index >= value.length) return []
    return expandTemplateSegments(value[index], rest, [...prefix, segment])
  }

  if (value === null || value === undefined || typeof value !== 'object') {
    return []
  }

  return expandTemplateSegments((value as Record<string, unknown>)[segment], rest, [...prefix, segment])
}

function applyBranchSchema(schema: JsonSchemaNode, basePath: string, state: AutoFormConditionState) {
  const required = schema.required ?? []
  for (const key of required) {
    const path = joinPath(basePath, key)
    state.required[path] = true
  }

  const properties = schema.properties ?? {}
  for (const [key, propertySchema] of Object.entries(properties)) {
    const path = joinPath(basePath, key)
    applyPropertySchema(path, propertySchema, state)
  }
}

function applyPropertySchema(path: string, schema: JsonSchemaNode, state: AutoFormConditionState) {
  const hidden = schema['ui:hidden']
  if (typeof hidden === 'boolean') {
    state.hidden[path] = hidden
  }

  const disabled = schema['ui:disabled']
  if (typeof disabled === 'boolean') {
    state.disabled[path] = disabled
  }

  const readOnly = schema.readOnly
  if (typeof readOnly === 'boolean') {
    state.readOnly[path] = readOnly
  }

  const required = schema.required ?? []
  for (const key of required) {
    state.required[joinPath(path, key)] = true
  }

  const nestedProperties = schema.properties ?? {}
  for (const [key, propertySchema] of Object.entries(nestedProperties)) {
    applyPropertySchema(joinPath(path, key), propertySchema, state)
  }
}

function flattenRenderableNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
): AutoFormNormalizedRenderableNode[] {
  const flattened: AutoFormNormalizedRenderableNode[] = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      flattened.push(...flattenRenderableNodes(node.nodes))
      continue
    }

    flattened.push(node)

    if (node.kind === 'object-group') {
      flattened.push(...flattenRenderableNodes(node.nodes))
      continue
    }

    if (node.kind === 'array') {
      flattened.push(node.itemNode)
      if (node.itemNode.kind === 'object-group') {
        flattened.push(...flattenRenderableNodes(node.itemNode.nodes))
      }
    }
  }

  return flattened
}

function joinPath(basePath: string, key: string) {
  return basePath ? `${basePath}.${key}` : key
}

function hasValueAtPath(values: AutoFormRuntimeValues, path: string) {
  return getValueAtPath(values, path) !== undefined
}
