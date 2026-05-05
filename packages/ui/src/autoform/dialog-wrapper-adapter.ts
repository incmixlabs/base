import type {
  AutoFormNormalizedFieldNode,
  AutoFormNormalizedModel,
  AutoFormNormalizedRenderableNode,
  AutoFormNormalizedSection,
  JsonValue,
} from '@incmix/core'
import type { DialogWrapperSchema, DialogWrapperSchemaProperty } from '@/elements/dialog/dialog-wrapper.props'
import {
  type DialogWrapperAdapterWidget,
  dialogWrapperAdapterFormats,
  dialogWrapperAdapterWidgets,
} from './dialog-wrapper-adapter.props'

export type DialogWrapperAdapterIssueCode =
  | 'sections_flattened'
  | 'steps_ignored'
  | 'conditions_ignored'
  | 'dynamic_branches_ignored'
  | 'arrays_unsupported'
  | 'object_groups_unsupported'
  | 'layout_ignored'
  | 'enum_type_unsupported'
  | 'widget_downgraded'

export type DialogWrapperAdapterIssue = {
  code: DialogWrapperAdapterIssueCode
  path?: string
  message: string
}

export type DialogWrapperAdapterResult = {
  schema: DialogWrapperSchema
  issues: DialogWrapperAdapterIssue[]
}

export function adaptAutoFormModelToDialogWrapper(model: AutoFormNormalizedModel): DialogWrapperAdapterResult {
  const issues: DialogWrapperAdapterIssue[] = []
  const properties: DialogWrapperSchema['properties'] = {}
  const required: string[] = []

  if (model.steps?.length) {
    issues.push({
      code: 'steps_ignored',
      message:
        'DialogWrapper does not preserve AutoForm stepper flows; all adapted fields render in a single dialog body.',
    })
  }

  if (model.conditions.length > 0) {
    issues.push({
      code: 'conditions_ignored',
      message: 'DialogWrapper does not consume the native AutoForm condition runtime directly.',
    })
  }

  if (model.dynamicBranches.length > 0) {
    issues.push({
      code: 'dynamic_branches_ignored',
      message: 'DialogWrapper does not materialize AutoForm dynamic branches from the normalized model.',
    })
  }

  const topLevelNodes = flattenModelNodes(model.nodes, issues)

  for (const node of topLevelNodes) {
    if (node.kind === 'field') {
      properties[node.key] = adaptFieldNode(node, issues)
      if (node.required) {
        required.push(node.key)
      }
      continue
    }

    if (node.kind === 'array') {
      issues.push({
        code: 'arrays_unsupported',
        path: node.path,
        message: `DialogWrapper does not support AutoForm array node "${node.path}" yet.`,
      })
      continue
    }

    issues.push({
      code: 'object_groups_unsupported',
      path: node.path,
      message: `DialogWrapper does not support AutoForm object-group node "${node.path}" yet.`,
    })
  }

  return {
    schema: {
      type: 'object',
      title: model.title,
      description: model.description,
      required: required.length > 0 ? required : undefined,
      properties,
    },
    issues,
  }
}

function flattenModelNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  issues: DialogWrapperAdapterIssue[],
): AutoFormNormalizedRenderableNode[] {
  const flattened: AutoFormNormalizedRenderableNode[] = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      issues.push({
        code: 'sections_flattened',
        message: `DialogWrapper flattens AutoForm section "${node.id}" into a single linear field list.`,
      })

      if (node.columns || node.layout || node.labelPlacement) {
        issues.push({
          code: 'layout_ignored',
          message: `DialogWrapper ignores section layout metadata for "${node.id}".`,
        })
      }

      flattened.push(...node.nodes)
      continue
    }

    flattened.push(node)
  }

  return flattened
}

function adaptFieldNode(
  node: AutoFormNormalizedFieldNode,
  issues: DialogWrapperAdapterIssue[],
): DialogWrapperSchemaProperty {
  if (node.colSpan || node.layout || node.labelPlacement) {
    issues.push({
      code: 'layout_ignored',
      path: node.path,
      message: `DialogWrapper ignores layout metadata for field "${node.path}".`,
    })
  }

  const isNativeWidget = isDialogWrapperNativeWidget(node)
  const property: DialogWrapperSchemaProperty = {
    type: getDialogFieldType(node),
    title: node.label ?? node.title ?? node.key,
    description: buildFieldDescription(node, issues),
    default: getPrimitiveDefaultValue(node.defaultValue),
    enum: getDialogFieldEnum(node, issues),
    format: getDialogFieldFormat(node, issues),
    placeholder: node.placeholder,
    widget: isNativeWidget ? node.widget : undefined,
    widgetProps: isNativeWidget ? node.props : undefined,
  }

  return property
}

function buildFieldDescription(
  node: AutoFormNormalizedFieldNode,
  issues: DialogWrapperAdapterIssue[],
): string | undefined {
  const fragments: string[] = []

  if (typeof node.help === 'string' && node.help.length > 0) {
    fragments.push(node.help)
  } else if (typeof node.description === 'string' && node.description.length > 0) {
    fragments.push(node.description)
  }

  if (node.widget && !isDialogWrapperNativeWidget(node)) {
    issues.push({
      code: 'widget_downgraded',
      path: node.path,
      message: `DialogWrapper downgrades widget "${node.widget}" on field "${node.path}" to its nearest primitive field surface.`,
    })

    fragments.push(`Preferred widget: ${node.widget}`)
  }

  return fragments.length > 0 ? fragments.join(' ') : undefined
}

function getDialogFieldType(node: AutoFormNormalizedFieldNode): DialogWrapperSchemaProperty['type'] {
  if (node.fieldType === 'boolean') return 'boolean'
  if (node.fieldType === 'integer') return 'integer'
  if (node.fieldType === 'number') return 'number'
  return 'string'
}

function getDialogFieldFormat(
  node: AutoFormNormalizedFieldNode,
  issues: DialogWrapperAdapterIssue[],
): DialogWrapperSchemaProperty['format'] {
  if (node.widget === dialogWrapperAdapterWidgets.textarea) return dialogWrapperAdapterFormats.textarea
  if (node.widget === dialogWrapperAdapterWidgets.email) return dialogWrapperAdapterFormats.email
  if (node.widget === dialogWrapperAdapterWidgets.password) return dialogWrapperAdapterFormats.password
  if (node.widget === dialogWrapperAdapterWidgets.url) return dialogWrapperAdapterFormats.url

  if (node.fieldType === 'email') return dialogWrapperAdapterFormats.email
  if (node.fieldType === 'url') return dialogWrapperAdapterFormats.url
  if (node.format === dialogWrapperAdapterFormats.email) return dialogWrapperAdapterFormats.email
  if (node.format === dialogWrapperAdapterFormats.password) return dialogWrapperAdapterFormats.password
  if (node.format === dialogWrapperAdapterFormats.url || node.format === 'uri' || node.format === 'uri-reference') {
    return dialogWrapperAdapterFormats.url
  }

  if (node.format === 'date' || node.format === 'date-time') {
    issues.push({
      code: 'widget_downgraded',
      path: node.path,
      message: `DialogWrapper does not preserve date-specific widget behavior for field "${node.path}".`,
    })
  }

  return undefined
}

function getDialogFieldEnum(
  node: AutoFormNormalizedFieldNode,
  issues: DialogWrapperAdapterIssue[],
): DialogWrapperSchemaProperty['enum'] {
  if (!Array.isArray(node.enumValues) || node.enumValues.length === 0) return undefined
  if (node.enumValues.every(value => typeof value === 'string')) return node.enumValues

  issues.push({
    code: 'enum_type_unsupported',
    path: node.path,
    message: `DialogWrapper only supports string enums; non-string enum values on field "${node.path}" are ignored.`,
  })

  return undefined
}

function isDialogWrapperNativeWidget(node: AutoFormNormalizedFieldNode) {
  const widget = node.widget as DialogWrapperAdapterWidget | undefined

  return (
    widget === undefined ||
    widget === dialogWrapperAdapterWidgets.text ||
    widget === dialogWrapperAdapterWidgets.textarea ||
    widget === dialogWrapperAdapterWidgets.email ||
    widget === dialogWrapperAdapterWidgets.password ||
    widget === dialogWrapperAdapterWidgets.url ||
    widget === dialogWrapperAdapterWidgets.numberInput
  )
}

function getPrimitiveDefaultValue(value: JsonValue | undefined): string | number | boolean | undefined {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : undefined
}
